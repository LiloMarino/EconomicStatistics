"""A Selic meta e o que o mercado espera para ela. A taxa é sempre fração ao ano
(0.1375 é 13,75% ao ano)."""

from __future__ import annotations

from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from datetime import date, timedelta

from backend.domain.coverage import month_start
from backend.domain.rates import PERCENT, MonthlyRate
from backend.domain.series import Observation


@dataclass(frozen=True, slots=True, kw_only=True)
class SelicChange:
    """O dia em que a meta passou de `before` para `after`."""

    effective_date: date
    before: float
    after: float


@dataclass(frozen=True, slots=True, kw_only=True)
class SelicStep:
    """A meta que o mercado espera a partir de `effective_date`."""

    effective_date: date
    rate: float


def month_end_rates(observations: Iterable[Observation]) -> list[MonthlyRate]:
    """A meta em vigor no último dia com dado de cada mês, a partir de uma série diária
    em ordem de data. No mês corrente é a de hoje."""
    by_month: dict[date, float] = {}
    for item in observations:
        by_month[month_start(item.ref_date)] = item.value / PERCENT
    return [MonthlyRate(ref_date=month, rate=rate) for month, rate in by_month.items()]


def last_change(observations: Sequence[Observation]) -> SelicChange | None:
    """A última vez que a meta mudou, numa série diária em ordem de data."""
    for index in range(len(observations) - 1, 0, -1):
        before, after = observations[index - 1], observations[index]
        if before.value != after.value:
            return SelicChange(
                effective_date=after.ref_date,
                before=before.value / PERCENT,
                after=after.value / PERCENT,
            )
    return None


def forecast_by_month(
    current: float, steps: Sequence[SelicStep], first_month: date, last_month: date
) -> list[MonthlyRate]:
    """A meta no fim de cada mês de `first_month` a `last_month`: a de hoje até a
    primeira reunião esperada, e daí a de cada reunião até a seguinte."""
    ordered = sorted(steps, key=lambda step: step.effective_date)
    rates: list[MonthlyRate] = []
    month = first_month
    while month <= last_month:
        month_end = month_start(month, -1) - timedelta(days=1)
        rate = current
        for step in ordered:
            if step.effective_date <= month_end:
                rate = step.rate
        rates.append(MonthlyRate(ref_date=month, rate=rate))
        month = month_start(month, -1)
    return rates
