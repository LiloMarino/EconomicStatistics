from __future__ import annotations

from dataclasses import dataclass
from datetime import date


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
