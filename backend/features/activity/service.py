from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator, SeriesId
from backend.core.errors import MissingDataError
from backend.domain.coverage import month_start, quarter_end
from backend.domain.focus import (
    Expectation,
    annual_expectations,
    forecast_years,
    monthly_expectations,
)
from backend.domain.rates import PERCENT, index_change_12m
from backend.domain.series import Observation
from backend.features.monthly_forecast import MonthlyForecast, MonthValue
from backend.repository.focus import latest_survey
from backend.repository.series import last_cached, read_observations

ACTIVITY_SERIES = (
    SeriesId.GDP_GROWTH_4Q,
    SeriesId.IBC_BR,
    SeriesId.UNEMPLOYMENT_RATE,
)

# Cada gráfico mostra os últimos 4 anos de dado, terminando no último de cada série
WINDOW_MONTHS = 4 * 12
# O 12 meses do IBC-Br pede o índice de 23 meses antes do primeiro mês da janela
INDEX_HISTORY_MONTHS = 23
QUARTER_MONTHS = 3


@dataclass(frozen=True, slots=True, kw_only=True)
class Gdp:
    """O PIB acumulado em 4 trimestres, em fração, datado no mês em que cada trimestre
    termina. `forecast` traz o PIB do ano que o Focus espera, em dezembro, que é onde o
    acumulado de 4 trimestres coincide com o ano."""

    quarters: list[MonthValue]
    forecast: MonthlyForecast | None


@dataclass(frozen=True, slots=True, kw_only=True)
class Ibc:
    """A variação da média dos 12 meses do índice sobre a dos 12 meses anteriores, em
    fração, datada no último mês da janela."""

    months: list[MonthValue]


@dataclass(frozen=True, slots=True, kw_only=True)
class Unemployment:
    """A taxa de desocupação do trimestre móvel que termina em cada mês, em fração.
    `change_12m` é a diferença contra o mesmo mês do ano anterior, em fração (-0.008 é
    -0,8 ponto percentual)."""

    months: list[MonthValue]
    change_12m: float | None
    forecast: MonthlyForecast | None


@dataclass(frozen=True, slots=True, kw_only=True)
class Activity:
    gdp: Gdp
    ibc: Ibc
    unemployment: Unemployment


def activity(session: Session) -> Activity:
    cached = last_cached(session)
    if any(series_id not in cached for series_id in ACTIVITY_SERIES):
        raise MissingDataError(
            "Ainda não há atividade no cache: a primeira atualização não terminou."
        )
    end = max(cached[series_id] for series_id in ACTIVITY_SERIES)
    observations = read_observations(
        session,
        ACTIVITY_SERIES,
        month_start(end, WINDOW_MONTHS + INDEX_HISTORY_MONTHS),
        end,
    )
    survey = latest_survey(session, (FocusIndicator.GDP, FocusIndicator.UNEMPLOYMENT))
    return Activity(
        gdp=_gdp(observations[SeriesId.GDP_GROWTH_4Q], survey),
        ibc=_ibc(observations[SeriesId.IBC_BR]),
        unemployment=_unemployment(observations[SeriesId.UNEMPLOYMENT_RATE], survey),
    )


def _gdp(
    observations: list[Observation], survey: tuple[date, list[Expectation]] | None
) -> Gdp:
    quarters = [
        MonthValue(ref_date=quarter_end(item.ref_date), value=item.value / PERCENT)
        for item in observations
    ][-WINDOW_MONTHS // QUARTER_MONTHS :]
    return Gdp(quarters=quarters, forecast=_gdp_forecast(quarters, survey))


def _gdp_forecast(
    quarters: list[MonthValue], survey: tuple[date, list[Expectation]] | None
) -> MonthlyForecast | None:
    """O PIB esperado para o ano corrente e o seguinte, cada um em dezembro."""
    if survey is None or not quarters:
        return None
    survey_date, expectations = survey
    expected = annual_expectations(expectations, FocusIndicator.GDP)
    years = [
        MonthValue(ref_date=date(year, 12, 1), value=expected[year] / PERCENT)
        for year in forecast_years(quarters[-1].ref_date)
        if year in expected
    ]
    return MonthlyForecast(survey_date=survey_date, months=years) if years else None


def _ibc(observations: list[Observation]) -> Ibc:
    return Ibc(
        months=[
            MonthValue(ref_date=item.ref_date, value=item.rate)
            for item in index_change_12m(observations)
        ][-WINDOW_MONTHS:]
    )


def _unemployment(
    observations: list[Observation], survey: tuple[date, list[Expectation]] | None
) -> Unemployment:
    last = observations[-1]
    by_month = {item.ref_date: item.value for item in observations}
    year_before = by_month.get(month_start(last.ref_date, 12))
    return Unemployment(
        months=[
            MonthValue(ref_date=item.ref_date, value=item.value / PERCENT)
            for item in observations[-WINDOW_MONTHS:]
        ],
        change_12m=(
            None if year_before is None else (last.value - year_before) / PERCENT
        ),
        forecast=_unemployment_forecast(last.ref_date, survey),
    )


def _unemployment_forecast(
    last: date, survey: tuple[date, list[Expectation]] | None
) -> MonthlyForecast | None:
    """A taxa esperada em cada mês depois do último dado, até dezembro do ano seguinte
    ao do último dado."""
    if survey is None:
        return None
    survey_date, expectations = survey
    horizon = date(forecast_years(last)[-1], 12, 1)
    months = [
        MonthValue(ref_date=ref_date, value=value / PERCENT)
        for ref_date, value in sorted(
            monthly_expectations(expectations, FocusIndicator.UNEMPLOYMENT).items()
        )
        if last < ref_date <= horizon
    ]
    return MonthlyForecast(survey_date=survey_date, months=months) if months else None
