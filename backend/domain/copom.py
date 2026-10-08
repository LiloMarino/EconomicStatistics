"""O calendário das reuniões do Copom, que o Banco Central divulga até o fim de junho
para o ano seguinte."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from typing import Protocol

# A partir de julho o calendário do ano seguinte já devia estar publicado
NEXT_CALENDAR_MONTH = 7


@dataclass(frozen=True, slots=True, kw_only=True)
class Meeting:
    """A reunião de ordem `number` no ano (a `R<number>/<year>` do Focus), com o 1º e o
    2º dia. A decisão sai no fim do 2º dia e vale na Selic a partir do dia seguinte."""

    year: int
    number: int
    first_day: date
    second_day: date

    @property
    def effective_from(self) -> date:
        return self.second_day + timedelta(days=1)


class CopomProvider(Protocol):
    name: str

    def get_meetings(self, first_year: int, last_year: int) -> list[Meeting]:
        """As reuniões de `first_year` a `last_year`, inclusive; ano sem calendário
        publicado não traz reunião."""
        ...


def expected_calendar_year(today: date) -> int:
    """O último ano cujo calendário já devia estar em cache hoje."""
    return today.year + (1 if today.month >= NEXT_CALENDAR_MONTH else 0)


def calendar_overdue(last_year: int | None, today: date) -> bool:
    return last_year is None or last_year < expected_calendar_year(today)
