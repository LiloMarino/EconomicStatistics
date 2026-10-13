from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator, PaceVerdict, SeriesId
from backend.core.errors import MissingDataError
from backend.domain.coverage import month_start, quarter_end
from backend.domain.focus import (
    Expectation,
    annual_expectations,
    forecast_years,
    monthly_expectations,
)
from backend.domain.pace import STEADY_BAND, verdict
from backend.domain.rates import PERCENT, index_change_1m, index_change_12m
from backend.domain.series import Observation
from backend.features.monthly_forecast import MonthlyForecast, MonthValue
from backend.repository.focus import latest_survey
from backend.repository.series import last_cached, read_observations

ACTIVITY_SERIES = (
    SeriesId.GDP_GROWTH_4Q,
    SeriesId.GDP_GROWTH_QOQ,
    SeriesId.IBC_BR,
    SeriesId.IBC_BR_SEASONALLY_ADJUSTED,
    SeriesId.UNEMPLOYMENT_RATE,
    SeriesId.UNDERUTILIZATION_RATE,
)

# Cada gráfico mostra os últimos 4 anos de dado, terminando no último de cada série
WINDOW_MONTHS = 4 * 12
# O 12 meses do IBC-Br pede o índice de 23 meses antes do primeiro mês da janela
INDEX_HISTORY_MONTHS = 23
QUARTER_MONTHS = 3


@dataclass(frozen=True, slots=True, kw_only=True)
class Gdp:
    """O PIB acumulado em 4 trimestres, em fração, datado no mês em que cada trimestre
    termina. `quarter_on_quarter` é a variação de cada trimestre sobre o anterior, com
    ajuste sazonal, em fração e com a mesma data. `forecast` traz o PIB do ano que o
    Focus espera, em dezembro, que é onde o acumulado de 4 trimestres coincide com o
    ano."""

    quarters: list[MonthValue]
    quarter_on_quarter: list[MonthValue]
    forecast: MonthlyForecast | None


@dataclass(frozen=True, slots=True, kw_only=True)
class Ibc:
    """`months` é a variação da média dos 12 meses do índice sobre a dos 12 meses
    anteriores, em fração, datada no último mês da janela. `month_on_month` é a
    variação de cada mês sobre o anterior no índice com ajuste sazonal, em fração.

    `change_1m` e `change_3m` são a inclinação do 12 meses no último mês e nos últimos
    3, em fração de ponto (-0.0016 é -0,16 p.p.), e o veredito usa a de 3 meses."""

    months: list[MonthValue]
    month_on_month: list[MonthValue]
    change_1m: float
    change_3m: float
    verdict: PaceVerdict
    steady_band: float


@dataclass(frozen=True, slots=True, kw_only=True)
class Unemployment:
    """A taxa de desocupação do trimestre móvel que termina em cada mês, em fração.
    `change_12m` é a diferença contra o mesmo mês do ano anterior, em fração (-0.008 é
    -0,8 ponto percentual). `employed` é a parte da força de trabalho que tem trabalho
    no último mês."""

    months: list[MonthValue]
    change_12m: float | None
    employed: float
    forecast: MonthlyForecast | None


@dataclass(frozen=True, slots=True, kw_only=True)
class RatePair:
    ref_date: date
    unemployment: float
    underutilization: float


@dataclass(frozen=True, slots=True, kw_only=True)
class Underutilization:
    """A desocupação e a subutilização do mesmo trimestre móvel, em fração, nos meses
    que trazem as duas. `gap` é a subutilização menos a desocupação no último deles: a
    gente que quer trabalhar mais e a taxa de desemprego não conta."""

    months: list[RatePair]
    gap: float


@dataclass(frozen=True, slots=True, kw_only=True)
class Activity:
    gdp: Gdp
    ibc: Ibc
    unemployment: Unemployment
    underutilization: Underutilization


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
        gdp=_gdp(
            observations[SeriesId.GDP_GROWTH_4Q],
            observations[SeriesId.GDP_GROWTH_QOQ],
            survey,
        ),
        ibc=_ibc(
            observations[SeriesId.IBC_BR],
            observations[SeriesId.IBC_BR_SEASONALLY_ADJUSTED],
        ),
        unemployment=_unemployment(observations[SeriesId.UNEMPLOYMENT_RATE], survey),
        underutilization=_underutilization(
            observations[SeriesId.UNEMPLOYMENT_RATE],
            observations[SeriesId.UNDERUTILIZATION_RATE],
        ),
    )


def _gdp(
    growth_4q: list[Observation],
    growth_qoq: list[Observation],
    survey: tuple[date, list[Expectation]] | None,
) -> Gdp:
    quarters = _by_quarter_end(growth_4q)
    return Gdp(
        quarters=quarters,
        quarter_on_quarter=_by_quarter_end(growth_qoq),
        forecast=_gdp_forecast(quarters, survey),
    )


def _by_quarter_end(observations: list[Observation]) -> list[MonthValue]:
    """Os trimestres da janela, em fração, datados no mês em que cada um termina."""
    return [
        MonthValue(ref_date=quarter_end(item.ref_date), value=item.value / PERCENT)
        for item in observations
    ][-WINDOW_MONTHS // QUARTER_MONTHS :]


def _gdp_forecast(
    quarters: list[MonthValue], survey: tuple[date, list[Expectation]] | None
) -> MonthlyForecast | None:
    """O PIB esperado para cada ano do relatório Focus, em dezembro."""
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


def _ibc(index: list[Observation], adjusted: list[Observation]) -> Ibc:
    rolling = {item.ref_date: item.rate for item in index_change_12m(index)}
    last = max(rolling, default=None)
    one_before = None if last is None else rolling.get(month_start(last, 1))
    three_before = None if last is None else rolling.get(month_start(last, 3))
    if last is None or one_before is None or three_before is None:
        raise MissingDataError(
            "O ritmo do IBC-Br precisa de 27 meses seguidos do índice no cache."
        )
    change_3m = rolling[last] - three_before
    return Ibc(
        months=[
            MonthValue(ref_date=ref_date, value=rate)
            for ref_date, rate in rolling.items()
        ][-WINDOW_MONTHS:],
        month_on_month=[
            MonthValue(ref_date=item.ref_date, value=item.rate)
            for item in index_change_1m(adjusted)
        ][-WINDOW_MONTHS:],
        change_1m=rolling[last] - one_before,
        change_3m=change_3m,
        verdict=verdict(change_3m),
        steady_band=STEADY_BAND,
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
        employed=1 - last.value / PERCENT,
        forecast=_unemployment_forecast(last.ref_date, survey),
    )


def _underutilization(
    unemployment: list[Observation], underutilization: list[Observation]
) -> Underutilization:
    rates = {item.ref_date: item.value for item in unemployment}
    months = [
        RatePair(
            ref_date=item.ref_date,
            unemployment=rates[item.ref_date] / PERCENT,
            underutilization=item.value / PERCENT,
        )
        for item in underutilization
        if item.ref_date in rates
    ][-WINDOW_MONTHS:]
    if not months:
        raise MissingDataError(
            "Ainda não há mês com a desocupação e a subutilização no cache."
        )
    return Underutilization(
        months=months, gap=months[-1].underutilization - months[-1].unemployment
    )


def _unemployment_forecast(
    last: date, survey: tuple[date, list[Expectation]] | None
) -> MonthlyForecast | None:
    """A taxa esperada em cada mês depois do último dado, até dezembro do último ano do
    relatório Focus."""
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
