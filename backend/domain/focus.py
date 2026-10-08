"""A pesquisa Focus do Banco Central: a mediana do que o mercado espera para cada
indicador, pesquisa a pesquisa."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from typing import Protocol

from backend.core.enum import FocusIndicator, FocusTargetKind

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
