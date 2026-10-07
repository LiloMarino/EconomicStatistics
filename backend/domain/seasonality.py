"""Sazonalidade: o mês de um ano contra o mesmo mês dos anos anteriores."""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from statistics import fmean

from backend.domain.rates import MonthlyRate

MONTHS_IN_YEAR = 12
# Quantos anos completos anteriores formam a faixa típica de cada mês
COMPARED_YEARS = 5


@dataclass(frozen=True, slots=True, kw_only=True)
class MonthBand:
    """A faixa de um mês do calendário (1 a 12) nos anos comparados."""

    month: int
    low: float
    high: float
    mean: float


def compared_years(years_with_data: Mapping[int, int], year: int) -> list[int]:
    """Os até 5 anos anteriores a `year` com os 12 meses no cache, em ordem."""
    complete = [
        candidate
        for candidate, months in years_with_data.items()
        if candidate < year and months == MONTHS_IN_YEAR
    ]
    return sorted(complete)[-COMPARED_YEARS:]


def month_bands(
    rates_by_year: Mapping[int, Sequence[MonthlyRate]], years: Sequence[int]
) -> list[MonthBand]:
    """Mínimo, máximo e média de cada mês do calendário nos `years`, que têm os 12
    meses."""
    bands: list[MonthBand] = []
    for month in range(1, MONTHS_IN_YEAR + 1):
        values = [
            item.rate
            for year in years
            for item in rates_by_year[year]
            if item.ref_date.month == month
        ]
        bands.append(
            MonthBand(
                month=month, low=min(values), high=max(values), mean=fmean(values)
            )
        )
    return bands
