from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator, SeriesId
from backend.core.errors import MissingDataError
from backend.domain.coverage import month_start
from backend.domain.external import PositionPoint, international_position, share_of_gdp
from backend.domain.focus import (
    Expectation,
    annual_expectations,
    forecast_years,
    monthly_expectations,
)
from backend.domain.rates import PERCENT, relative_change
from backend.domain.series import Observation
from backend.repository.focus import latest_survey
from backend.repository.series import last_cached, read_observations

EXTERNAL_SERIES = (
    SeriesId.DOLLAR_MONTH_END,
    SeriesId.CURRENT_ACCOUNT_GDP,
    SeriesId.FDI_GDP,
    SeriesId.RESERVES,
    SeriesId.GDP_USD_12M,
    SeriesId.IIP_ASSETS,
    SeriesId.IIP_LIABILITIES,
)

# Cada gráfico tem a sua janela, terminando no último dado da série
DOLLAR_MONTHS = 24
HISTORY_MONTHS = 10 * 12
POSITION_YEARS = 6


@dataclass(frozen=True, slots=True, kw_only=True)
class MonthValue:
    ref_date: date
    value: float


@dataclass(frozen=True, slots=True, kw_only=True)
class MonthlyForecast:
    """O valor esperado em cada mês depois do último dado, pela pesquisa Focus de
    `survey_date`."""

    survey_date: date
    months: list[MonthValue]


@dataclass(frozen=True, slots=True, kw_only=True)
class Dollar:
    """A PTAX do fim de cada mês em reais; `change_12m` contra o mesmo mês do ano
    anterior. `forecast` é o câmbio de fim de mês que o Focus espera."""

    months: list[MonthValue]
    change_12m: float | None
    forecast: MonthlyForecast | None


@dataclass(frozen=True, slots=True, kw_only=True)
class FlowPoint:
    """Os dois acumulados de 12 meses que terminam em `ref_date`, em fração do PIB."""

    ref_date: date
    current_account: float
    fdi: float


@dataclass(frozen=True, slots=True, kw_only=True)
class GdpShare:
    ref_date: date
    share: float


@dataclass(frozen=True, slots=True, kw_only=True)
class Reserves:
    """O estoque do fim de cada mês em US$ milhões. A fração do PIB é a do último mês
    que já tem o PIB de 12 meses publicado."""

    months: list[MonthValue]
    gdp_share: GdpShare | None


@dataclass(frozen=True, slots=True, kw_only=True)
class FlowsForecast:
    """O que o Focus espera para o ano, em US$ bilhões. O gráfico está em % do PIB, e
    o Focus não prevê o PIB em dólar: a previsão fica escrita ao lado."""

    survey_date: date
    year: int
    current_account: float
    fdi: float


@dataclass(frozen=True, slots=True, kw_only=True)
class ExternalSector:
    dollar: Dollar
    flows: list[FlowPoint]
    flows_forecast: FlowsForecast | None
    reserves: Reserves
    position: list[PositionPoint]


def external_sector(session: Session) -> ExternalSector:
    cached = last_cached(session)
    if any(series_id not in cached for series_id in EXTERNAL_SERIES):
        raise MissingDataError(
            "Ainda não há setor externo no cache: a primeira atualização não terminou."
        )
    end = max(cached[series_id] for series_id in EXTERNAL_SERIES)
    observations = read_observations(
        session, EXTERNAL_SERIES, month_start(end, HISTORY_MONTHS + 12), end
    )
    gdp = {item.ref_date: item.value for item in observations[SeriesId.GDP_USD_12M]}
    survey = latest_survey(
        session,
        (
            FocusIndicator.EXCHANGE_RATE,
            FocusIndicator.CURRENT_ACCOUNT,
            FocusIndicator.FDI,
        ),
    )
    flows = _flows(
        observations[SeriesId.CURRENT_ACCOUNT_GDP], observations[SeriesId.FDI_GDP]
    )
    return ExternalSector(
        dollar=_dollar(observations[SeriesId.DOLLAR_MONTH_END], survey),
        flows=flows,
        flows_forecast=_flows_forecast(flows, survey),
        reserves=_reserves(observations[SeriesId.RESERVES], gdp),
        position=_yearly(
            international_position(
                observations[SeriesId.IIP_ASSETS],
                observations[SeriesId.IIP_LIABILITIES],
                gdp,
            )
        ),
    )


def _months(observations: list[Observation], count: int) -> list[MonthValue]:
    return [
        MonthValue(ref_date=item.ref_date, value=item.value)
        for item in observations[-count:]
    ]


def _dollar(
    observations: list[Observation], survey: tuple[date, list[Expectation]] | None
) -> Dollar:
    by_month = {item.ref_date: item.value for item in observations}
    last = observations[-1]
    year_before = by_month.get(month_start(last.ref_date, 12))
    expected = (
        []
        if survey is None
        else [
            MonthValue(ref_date=ref_date, value=value)
            for ref_date, value in sorted(
                monthly_expectations(survey[1], FocusIndicator.EXCHANGE_RATE).items()
            )
            if ref_date > last.ref_date
        ]
    )
    return Dollar(
        months=_months(observations, DOLLAR_MONTHS),
        change_12m=(
            None if year_before is None else relative_change(last.value, year_before)
        ),
        forecast=(
            MonthlyForecast(survey_date=survey[0], months=expected)
            if survey is not None and expected
            else None
        ),
    )


def _flows_forecast(
    flows: list[FlowPoint], survey: tuple[date, list[Expectation]] | None
) -> FlowsForecast | None:
    """A previsão do ano que o último mês publicado ainda não fechou."""
    if survey is None or not flows:
        return None
    survey_date, expectations = survey
    year = forecast_years(flows[-1].ref_date)[0]
    current_account = annual_expectations(expectations, FocusIndicator.CURRENT_ACCOUNT)
    fdi = annual_expectations(expectations, FocusIndicator.FDI)
    if year not in current_account or year not in fdi:
        return None
    return FlowsForecast(
        survey_date=survey_date,
        year=year,
        current_account=current_account[year],
        fdi=fdi[year],
    )


def _flows(
    current_account: list[Observation], fdi: list[Observation]
) -> list[FlowPoint]:
    """Os meses com as duas séries publicadas, que a fonte dá em % do PIB."""
    fdi_by_month = {item.ref_date: item.value for item in fdi}
    points = [
        FlowPoint(
            ref_date=item.ref_date,
            current_account=item.value / PERCENT,
            fdi=fdi_by_month[item.ref_date] / PERCENT,
        )
        for item in current_account
        if item.ref_date in fdi_by_month
    ]
    return points[-HISTORY_MONTHS:]


def _reserves(observations: list[Observation], gdp: dict[date, float]) -> Reserves:
    with_gdp = [item for item in observations if item.ref_date in gdp]
    latest = with_gdp[-1] if with_gdp else None
    return Reserves(
        months=_months(observations, HISTORY_MONTHS),
        gdp_share=(
            None
            if latest is None
            else GdpShare(
                ref_date=latest.ref_date,
                share=share_of_gdp(latest.value, gdp[latest.ref_date]),
            )
        ),
    )


def _yearly(points: list[PositionPoint]) -> list[PositionPoint]:
    """Um ponto por ano: o último trimestre dele, que é o 4º nos anos fechados e o
    mais recente no ano corrente."""
    by_year: dict[int, PositionPoint] = {}
    for point in points:
        by_year[point.ref_date.year] = point
    return list(by_year.values())[-POSITION_YEARS:]
