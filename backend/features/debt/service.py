from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator, SeriesId
from backend.core.errors import MissingDataError
from backend.domain.debt import DebtRates, debt_rates, stabilizing_primary
from backend.domain.federal_debt import (
    IndexerShare,
    MaturityBucket,
    central_bank_share,
    composition,
    maturing_within_12m,
    maturity_profile,
)
from backend.domain.focus import annual_expectations, forecast_years
from backend.domain.rates import PERCENT
from backend.domain.series import SERIES
from backend.repository.federal_debt import read_stock, stock_months
from backend.repository.focus import latest_survey
from backend.repository.series import last_cached, read_observations

DEBT_SERIES = (
    SeriesId.NET_DEBT,
    SeriesId.NET_DEBT_BRL,
    SeriesId.GROSS_DEBT,
    SeriesId.GDP_12M,
    SeriesId.NOMINAL_INTEREST,
    SeriesId.PRIMARY_DEFICIT,
)
MONTHS_PER_YEAR = 12


@dataclass(frozen=True, slots=True, kw_only=True)
class DebtLevel:
    """Dívida líquida do setor público e bruta do governo geral, em fração do PIB."""

    ref_date: date
    net: float
    gross: float


@dataclass(frozen=True, slots=True, kw_only=True)
class Stabilization:
    """A conta do primário que estabiliza no último mês com todos os números: a
    dívida líquida `debt`, r e g, o p*, o superávit feito (o primário da NFSP com o
    sinal trocado) e o quanto falta para chegar ao p*. Tudo em fração."""

    ref_date: date
    debt: float
    implicit_rate: float
    nominal_growth: float
    stabilizing_primary: float
    primary_surplus: float
    primary_gap: float


@dataclass(frozen=True, slots=True, kw_only=True)
class LevelsForecast:
    """A dívida líquida e a bruta que o Focus espera para dezembro de cada ano."""

    survey_date: date
    years: list[DebtLevel]


@dataclass(frozen=True, slots=True, kw_only=True)
class DebtOverview:
    levels: list[DebtLevel]
    levels_forecast: LevelsForecast | None
    rates: list[DebtRates]
    stabilization: Stabilization


@dataclass(frozen=True, slots=True, kw_only=True)
class AverageMaturity:
    ref_date: date
    years: float


@dataclass(frozen=True, slots=True, kw_only=True)
class YearComposition:
    ref_date: date
    shares: list[IndexerShare]


@dataclass(frozen=True, slots=True, kw_only=True)
class FederalDebt:
    """O estoque do último mês publicado (`stock_month`) e a composição em dezembro de
    cada ano mais o último mês. O prazo médio vem da série do Tesouro no SGS, que pode
    estar num mês diferente do estoque."""

    stock_month: date
    maturing_12m: float
    central_bank_share: float
    average_maturity: AverageMaturity | None
    composition: list[YearComposition]
    maturities: list[MaturityBucket]


def debt_overview(session: Session) -> DebtOverview:
    cached = last_cached(session)
    if any(series_id not in cached for series_id in DEBT_SERIES):
        raise MissingDataError(
            "Ainda não há dívida pública no cache: a primeira atualização não terminou."
        )
    end = max(cached[series_id] for series_id in DEBT_SERIES)
    observations = read_observations(
        session, DEBT_SERIES, SERIES[SeriesId.GDP_12M].first_date, end
    )
    by_series = {
        series_id: {item.ref_date: item.value for item in items}
        for series_id, items in observations.items()
    }
    net = by_series[SeriesId.NET_DEBT]
    gross = by_series[SeriesId.GROSS_DEBT]
    primary = by_series[SeriesId.PRIMARY_DEFICIT]
    rates = debt_rates(
        {
            ref_date: value / PERCENT
            for ref_date, value in by_series[SeriesId.NOMINAL_INTEREST].items()
        },
        by_series[SeriesId.GDP_12M],
        by_series[SeriesId.NET_DEBT_BRL],
    )
    usable = [
        point for point in rates if point.ref_date in net and point.ref_date in primary
    ]
    if not usable:
        raise MissingDataError(
            "O cache ainda não tem um mês com juros, PIB e dívida juntos."
        )
    last = usable[-1]
    debt = net[last.ref_date] / PERCENT
    surplus = -primary[last.ref_date] / PERCENT
    needed = stabilizing_primary(debt, last.implicit_rate, last.nominal_growth)
    levels = [
        DebtLevel(ref_date=ref_date, net=net[ref_date] / PERCENT, gross=value / PERCENT)
        for ref_date, value in sorted(gross.items())
        if ref_date in net
    ]
    return DebtOverview(
        levels=levels,
        levels_forecast=_levels_forecast(session, levels[-1].ref_date)
        if levels
        else None,
        rates=rates,
        stabilization=Stabilization(
            ref_date=last.ref_date,
            debt=debt,
            implicit_rate=last.implicit_rate,
            nominal_growth=last.nominal_growth,
            stabilizing_primary=needed,
            primary_surplus=surplus,
            primary_gap=needed - surplus,
        ),
    )


def _levels_forecast(session: Session, last: date) -> LevelsForecast | None:
    survey = latest_survey(
        session, (FocusIndicator.NET_DEBT, FocusIndicator.GROSS_DEBT)
    )
    if survey is None:
        return None
    survey_date, expectations = survey
    net = annual_expectations(expectations, FocusIndicator.NET_DEBT)
    gross = annual_expectations(expectations, FocusIndicator.GROSS_DEBT)
    years = [
        DebtLevel(
            ref_date=date(year, 12, 1),
            net=net[year] / PERCENT,
            gross=gross[year] / PERCENT,
        )
        for year in forecast_years(last)
        if year in net and year in gross
    ]
    return LevelsForecast(survey_date=survey_date, years=years) if years else None


def federal_debt(session: Session) -> FederalDebt:
    months = stock_months(session)
    if not months:
        raise MissingDataError(
            "Ainda não há dívida federal no cache: a primeira atualização não terminou."
        )
    last = months[-1]
    chosen = [month for month in months if month.month == 12]
    if last.month != 12:
        chosen.append(last)
    stock = read_stock(session, chosen)
    current = stock[last]
    maturity = read_observations(
        session,
        [SeriesId.FEDERAL_DEBT_MATURITY],
        SERIES[SeriesId.FEDERAL_DEBT_MATURITY].first_date,
        date.max,
    )[SeriesId.FEDERAL_DEBT_MATURITY]
    return FederalDebt(
        stock_month=last,
        maturing_12m=maturing_within_12m(current, last),
        central_bank_share=central_bank_share(current),
        average_maturity=(
            AverageMaturity(
                ref_date=maturity[-1].ref_date,
                years=maturity[-1].value / MONTHS_PER_YEAR,
            )
            if maturity
            else None
        ),
        composition=[
            YearComposition(ref_date=month, shares=composition(stock[month]))
            for month in chosen
        ],
        maturities=maturity_profile(current, last),
    )
