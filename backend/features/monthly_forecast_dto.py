from __future__ import annotations

from datetime import date

from backend.core.dto import BaseDTO


class MonthValueDTO(BaseDTO):
    ref_date: date
    value: float


class MonthlyForecastDTO(BaseDTO):
    """O valor esperado em cada mês depois do último dado, pela pesquisa Focus de
    `survey_date`."""

    survey_date: date
    months: list[MonthValueDTO]
