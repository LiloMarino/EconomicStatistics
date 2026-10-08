"""A pesquisa Focus do Banco Central: a mediana do que o mercado espera para cada
indicador, pesquisa a pesquisa."""

from __future__ import annotations

from collections.abc import Iterable, Mapping, Sequence
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Protocol

from backend.core.enum import FocusDirection, FocusIndicator, FocusTargetKind, Unit
from backend.domain.coverage import month_start
from backend.domain.rates import PERCENT, MonthlyRate, rolling_12m

# Os dados de uma semana de pesquisa saem juntos na segunda-feira seguinte, com o
# relatório; a terça dá a folga
RELEASE_WEEKDAY = 1


@dataclass(frozen=True, slots=True, kw_only=True)
class Expectation:
    """A mediana da pesquisa de `survey_date` para um indicador e um período previsto,
    na unidade em que o Focus publica. O período segue a `FocusExpectation`: mês,
    trimestre ou reunião em `target_period`, 0 no ano, e ano e período 0 nos 12 meses
    à frente."""

    indicator: FocusIndicator
    target_kind: FocusTargetKind
    target_year: int
    target_period: int
    survey_date: date
    median: float
    respondents: int


class FocusProvider(Protocol):
    name: str

    def get_expectations(self, since: date | None) -> list[Expectation]:
        """Uma pesquisa por semana desde a semana de `since`, inclusive; sem `since`,
        o histórico inteiro."""
        ...


def week_start(day: date) -> date:
    return day - timedelta(days=day.weekday())


def expected_survey_week(today: date) -> date:
    """A segunda-feira da semana cuja pesquisa já devia estar publicada hoje: a semana
    anterior, a partir da terça."""
    weeks_back = 1 if today.weekday() >= RELEASE_WEEKDAY else 2
    return week_start(today) - timedelta(weeks=weeks_back)


def survey_overdue(last_survey: date | None, today: date) -> bool:
    """A pesquisa da semana esperada pode ser de qualquer dia útil dela: a de sexta,
    ou a de antes quando a sexta é feriado."""
    return last_survey is None or last_survey < expected_survey_week(today)


# Os indicadores do relatório Focus, na ordem da tabela dele, e a unidade em que o
# Focus publica cada um
REPORT_UNITS: dict[FocusIndicator, Unit] = {
    FocusIndicator.IPCA: Unit.PERCENT_YEAR,
    FocusIndicator.GDP: Unit.PERCENT_YEAR,
    FocusIndicator.EXCHANGE_RATE: Unit.BRL_PER_USD,
    FocusIndicator.SELIC: Unit.PERCENT_YEAR,
    FocusIndicator.IGPM: Unit.PERCENT_YEAR,
    FocusIndicator.IPCA_ADMINISTERED: Unit.PERCENT_YEAR,
    FocusIndicator.CURRENT_ACCOUNT: Unit.USD_BILLION,
    FocusIndicator.TRADE_BALANCE: Unit.USD_BILLION,
    FocusIndicator.FDI: Unit.USD_BILLION,
    FocusIndicator.NET_DEBT: Unit.PERCENT_GDP,
    FocusIndicator.PRIMARY_BALANCE: Unit.PERCENT_GDP,
    FocusIndicator.NOMINAL_BALANCE: Unit.PERCENT_GDP,
}
# A tabela mostra o ano da pesquisa e os 3 seguintes, como o relatório
REPORT_YEARS = 4
# O relatório compara com a pesquisa de 4 semanas antes
WEEKS_BEFORE = 4
# O relatório compara as medianas com 2 casas, como as publica
REPORT_DECIMALS = 2

_PERCENT_UNITS = {
    Unit.PERCENT_YEAR,
    Unit.PERCENT_MONTH,
    Unit.PERCENT_GDP,
    Unit.PERCENT,
}


def to_fraction(median: float, unit: Unit) -> float:
    """O valor na convenção da API: o que o Focus publica em % vira fração."""
    return median / PERCENT if unit in _PERCENT_UNITS else median


@dataclass(frozen=True, slots=True, kw_only=True)
class Streak:
    """Há quantas semanas seguidas a previsão anda na mesma direção, e o valor de
    onde ela saiu, na unidade do Focus."""

    direction: FocusDirection
    weeks: int
    start: float


def _direction(before: float, after: float) -> FocusDirection:
    change = round(after, REPORT_DECIMALS) - round(before, REPORT_DECIMALS)
    if round(change, REPORT_DECIMALS) > 0:
        return FocusDirection.UP
    if round(change, REPORT_DECIMALS) < 0:
        return FocusDirection.DOWN
    return FocusDirection.STABLE


def weekly_streak(medians: Sequence[float]) -> Streak | None:
    """A direção da última semana e há quantas semanas ela se repete, como os
    parênteses do relatório Focus: subir 3 semanas seguidas é "▲ (3)". Precisa de duas
    pesquisas."""
    if len(medians) < 2:
        return None
    direction = _direction(medians[-2], medians[-1])
    weeks = 1
    while (
        weeks < len(medians) - 1
        and _direction(medians[-weeks - 2], medians[-weeks - 1]) is direction
    ):
        weeks += 1
    return Streak(direction=direction, weeks=weeks, start=medians[-weeks - 1])


# A continuação dos gráficos anuais vai até dezembro do ano seguinte ao do último dado
FORECAST_YEARS = 2


def monthly_expectations(
    expectations: Iterable[Expectation], indicator: FocusIndicator
) -> dict[date, float]:
    """A previsão de cada mês, datada no dia 1, na unidade do Focus."""
    return {
        date(item.target_year, item.target_period, 1): item.median
        for item in expectations
        if item.indicator is indicator and item.target_kind is FocusTargetKind.MONTH
    }


def annual_expectations(
    expectations: Iterable[Expectation], indicator: FocusIndicator
) -> dict[int, float]:
    return {
        item.target_year: item.median
        for item in expectations
        if item.indicator is indicator and item.target_kind is FocusTargetKind.YEAR
    }


def meeting_expectations(
    expectations: Iterable[Expectation], indicator: FocusIndicator
) -> dict[tuple[int, int], float]:
    """A previsão de cada reunião do Copom, pelo ano e pela ordem dela no ano."""
    return {
        (item.target_year, item.target_period): item.median
        for item in expectations
        if item.indicator is indicator and item.target_kind is FocusTargetKind.MEETING
    }


def next_12m_expectation(
    expectations: Iterable[Expectation], indicator: FocusIndicator
) -> float | None:
    """A previsão para os 12 meses à frente da pesquisa, que anda com ela."""
    return next(
        (
            item.median
            for item in expectations
            if item.indicator is indicator
            and item.target_kind is FocusTargetKind.NEXT_12M
        ),
        None,
    )


def forecast_years(last_real: date) -> list[int]:
    """O ano que o último dado ainda não fechou e o seguinte; com dezembro já
    publicado, os dois anos depois dele."""
    first = last_real.year + (1 if last_real.month == 12 else 0)
    return list(range(first, first + FORECAST_YEARS))


def rolling_12m_forecast(
    real: Sequence[MonthlyRate], expected: Mapping[date, float]
) -> list[MonthlyRate]:
    """O acumulado de 12 meses dos meses depois do último real, compondo os meses
    reais com os esperados em % no mês (a composição multiplica, como no real). Os
    meses esperados seguem em sequência a partir do mês seguinte ao último real."""
    if not real:
        return []
    last = real[-1].ref_date
    combined = list(real)
    month = month_start(last, -1)
    while month in expected:
        combined.append(MonthlyRate(ref_date=month, rate=expected[month] / PERCENT))
        month = month_start(month, -1)
    return [item for item in rolling_12m(combined) if item.ref_date > last]


def nfsp_from_balance(balance: float) -> float:
    """O resultado do Focus, em % do PIB e com negativo para déficit, na convenção da
    NFSP: fração do PIB e positivo para déficit."""
    return -balance / PERCENT
