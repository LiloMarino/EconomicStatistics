from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator, SeriesId, Sphere
from backend.core.errors import MissingDataError
from backend.domain.federal_debt import central_bank_share
from backend.domain.focus import annual_expectations, forecast_years, nfsp_from_balance
from backend.domain.gdp import share_of_gdp
from backend.domain.rates import PERCENT
from backend.domain.series import NFSP_START
from backend.repository.federal_debt import read_stock, stock_months
from backend.repository.focus import latest_survey
from backend.repository.series import last_cached, read_observations

# O primário e os juros de cada esfera
SPHERE_SERIES: dict[Sphere, tuple[SeriesId, SeriesId]] = {
    Sphere.CENTRAL: (
        SeriesId.PRIMARY_DEFICIT_CENTRAL,
        SeriesId.NOMINAL_INTEREST_CENTRAL,
    ),
    Sphere.REGIONAL: (
        SeriesId.PRIMARY_DEFICIT_REGIONAL,
        SeriesId.NOMINAL_INTEREST_REGIONAL,
    ),
    Sphere.STATE_OWNED: (
        SeriesId.PRIMARY_DEFICIT_STATE_OWNED,
        SeriesId.NOMINAL_INTEREST_STATE_OWNED,
    ),
}

DEFICIT_SERIES = (
    SeriesId.NOMINAL_DEFICIT,
    SeriesId.PRIMARY_DEFICIT,
    SeriesId.NOMINAL_INTEREST,
    *(series_id for pair in SPHERE_SERIES.values() for series_id in pair),
)

FINANCING_SERIES = (
    SeriesId.CENTRAL_BANK_PORTFOLIO,
    SeriesId.REPO_OPERATIONS,
    SeriesId.MONETARY_BASE,
    SeriesId.GDP_12M,
)
# As compromissadas e a base vêm em R$ mil; a carteira e o PIB, em R$ milhões
THOUSANDS_PER_MILLION = 1000


@dataclass(frozen=True, slots=True, kw_only=True)
class DeficitPoint:
    """Os 12 meses que terminam em `ref_date`, em fração do PIB, na convenção da NFSP:
    positivo é déficit. O nominal é o primário mais os juros."""

    ref_date: date
    nominal: float
    primary: float
    interest: float


@dataclass(frozen=True, slots=True, kw_only=True)
class SphereDeficit:
    """A parte de uma esfera no déficit, nos mesmos 12 meses e na mesma convenção do
    consolidado. O BCB não publica o nominal por esfera: ele é o primário mais os
    juros."""

    sphere: Sphere
    nominal: float
    primary: float
    interest: float


@dataclass(frozen=True, slots=True, kw_only=True)
class DeficitForecast:
    """O resultado que o Focus espera para dezembro de cada ano, já na convenção da
    NFSP. Os juros são o nominal menos o primário: as três partes estão em % do PIB do
    mesmo ano."""

    survey_date: date
    years: list[DeficitPoint]


@dataclass(frozen=True, slots=True, kw_only=True)
class Deficit:
    """`interest_share` é a fração do déficit nominal que é juro; sem déficit nominal,
    ela não existe. `years` traz dezembro de cada ano e o último mês; `months`, todos os
    meses desde o começo da série. `spheres` divide o último mês entre as esferas."""

    last: DeficitPoint
    interest_share: float | None
    years: list[DeficitPoint]
    months: list[DeficitPoint]
    spheres: list[SphereDeficit]
    forecast: DeficitForecast | None


def deficit(session: Session) -> Deficit:
    cached = last_cached(session)
    if any(series_id not in cached for series_id in DEFICIT_SERIES):
        raise MissingDataError(
            "Ainda não há resultado fiscal no cache: a primeira atualização não terminou."
        )
    end = min(cached[series_id] for series_id in DEFICIT_SERIES)
    observations = read_observations(session, DEFICIT_SERIES, NFSP_START, end)
    by_series = {
        series_id: {item.ref_date: item.value / PERCENT for item in items}
        for series_id, items in observations.items()
    }
    nominal = by_series[SeriesId.NOMINAL_DEFICIT]
    primary = by_series[SeriesId.PRIMARY_DEFICIT]
    interest = by_series[SeriesId.NOMINAL_INTEREST]
    points = [
        DeficitPoint(
            ref_date=ref_date,
            nominal=nominal[ref_date],
            primary=primary[ref_date],
            interest=interest[ref_date],
        )
        for ref_date in sorted(nominal)
        if ref_date in primary and ref_date in interest
    ]
    last = points[-1]
    years = [point for point in points if point.ref_date.month == 12]
    if last.ref_date.month != 12:
        years.append(last)
    return Deficit(
        last=last,
        interest_share=last.interest / last.nominal if last.nominal > 0 else None,
        years=years,
        months=points,
        spheres=[
            SphereDeficit(
                sphere=sphere,
                nominal=by_series[primary][last.ref_date]
                + by_series[interest][last.ref_date],
                primary=by_series[primary][last.ref_date],
                interest=by_series[interest][last.ref_date],
            )
            for sphere, (primary, interest) in SPHERE_SERIES.items()
            if last.ref_date in by_series[primary]
            and last.ref_date in by_series[interest]
        ],
        forecast=_forecast(session, last.ref_date),
    )


def _forecast(session: Session, last: date) -> DeficitForecast | None:
    survey = latest_survey(
        session, (FocusIndicator.PRIMARY_BALANCE, FocusIndicator.NOMINAL_BALANCE)
    )
    if survey is None:
        return None
    survey_date, expectations = survey
    primary = annual_expectations(expectations, FocusIndicator.PRIMARY_BALANCE)
    nominal = annual_expectations(expectations, FocusIndicator.NOMINAL_BALANCE)
    years = [
        DeficitPoint(
            ref_date=date(year, 12, 1),
            nominal=nfsp_from_balance(nominal[year]),
            primary=nfsp_from_balance(primary[year]),
            interest=nfsp_from_balance(nominal[year])
            - nfsp_from_balance(primary[year]),
        )
        for year in forecast_years(last)
        if year in primary and year in nominal
    ]
    return DeficitForecast(survey_date=survey_date, years=years) if years else None


@dataclass(frozen=True, slots=True, kw_only=True)
class FinancingPoint:
    """O fim de `ref_date`, em fração do PIB de 12 meses: os títulos do Tesouro na
    carteira do Banco Central, a parte deles que está com o mercado nas compromissadas
    e a base monetária."""

    ref_date: date
    central_bank_portfolio: float
    repo_operations: float
    monetary_base: float


@dataclass(frozen=True, slots=True, kw_only=True)
class FinancingAmounts:
    """Os mesmos três estoques do último mês, em R$ milhões."""

    central_bank_portfolio: float
    repo_operations: float
    monetary_base: float


@dataclass(frozen=True, slots=True, kw_only=True)
class DebtHolders:
    """Quem tem os títulos federais emitidos no mês do estoque do Tesouro: a fração na
    carteira do Banco Central e a que está no mercado, que somam 1."""

    stock_month: date
    central_bank_share: float
    market_share: float


@dataclass(frozen=True, slots=True, kw_only=True)
class DeficitFinancing:
    """`years` traz dezembro de cada ano e o último mês. `repo_share` é a fração da
    carteira do Banco Central que está nas compromissadas, no último mês. `holders` vem
    do estoque do Tesouro, que fecha em outro mês, e não existe antes de ele chegar ao
    cache."""

    last: FinancingPoint
    amounts: FinancingAmounts
    repo_share: float
    years: list[FinancingPoint]
    holders: DebtHolders | None


def deficit_financing(session: Session) -> DeficitFinancing:
    cached = last_cached(session)
    if any(series_id not in cached for series_id in FINANCING_SERIES):
        raise MissingDataError(
            "Ainda não há base monetária nem carteira do Banco Central no cache: a "
            "primeira atualização não terminou."
        )
    end = min(cached[series_id] for series_id in FINANCING_SERIES)
    observations = read_observations(session, FINANCING_SERIES, NFSP_START, end)
    by_series = {
        series_id: {item.ref_date: item.value for item in items}
        for series_id, items in observations.items()
    }
    portfolio = by_series[SeriesId.CENTRAL_BANK_PORTFOLIO]
    repo = {
        ref_date: value / THOUSANDS_PER_MILLION
        for ref_date, value in by_series[SeriesId.REPO_OPERATIONS].items()
    }
    base = {
        ref_date: value / THOUSANDS_PER_MILLION
        for ref_date, value in by_series[SeriesId.MONETARY_BASE].items()
    }
    gdp = by_series[SeriesId.GDP_12M]
    points = [
        FinancingPoint(
            ref_date=ref_date,
            central_bank_portfolio=share_of_gdp(portfolio[ref_date], gdp[ref_date]),
            repo_operations=share_of_gdp(repo[ref_date], gdp[ref_date]),
            monetary_base=share_of_gdp(base[ref_date], gdp[ref_date]),
        )
        for ref_date in sorted(gdp)
        if ref_date in portfolio and ref_date in repo and ref_date in base
    ]
    last = points[-1]
    years = [point for point in points if point.ref_date.month == 12]
    if last.ref_date.month != 12:
        years.append(last)
    return DeficitFinancing(
        last=last,
        amounts=FinancingAmounts(
            central_bank_portfolio=portfolio[last.ref_date],
            repo_operations=repo[last.ref_date],
            monetary_base=base[last.ref_date],
        ),
        repo_share=repo[last.ref_date] / portfolio[last.ref_date],
        years=years,
        holders=_holders(session),
    )


def _holders(session: Session) -> DebtHolders | None:
    months = stock_months(session)
    if not months:
        return None
    share = central_bank_share(read_stock(session, [months[-1]])[months[-1]])
    return DebtHolders(
        stock_month=months[-1], central_bank_share=share, market_share=1 - share
    )
