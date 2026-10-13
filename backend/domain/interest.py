"""A Selic meta e o que o mercado espera para ela. A taxa é sempre fração ao ano
(0.1375 é 13,75% ao ano)."""

from __future__ import annotations

from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from datetime import date, timedelta

from backend.domain.coverage import month_start
from backend.domain.focus import Expectation
from backend.domain.rates import PERCENT, MonthlyRate, real_change
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


def ex_ante_real_rates(
    selic: Sequence[MonthlyRate], expected_12m: Sequence[Expectation]
) -> list[MonthlyRate]:
    """O juro real ex-ante de cada mês: a Selic do fim do mês contra o IPCA que o
    mercado esperava para os 12 meses seguintes na última pesquisa Focus feita até o
    fim dele. Selic de 13,75% contra 4,59% esperados dão 8,76%. Mês sem pesquisa até
    ali fica de fora."""
    surveys = sorted(expected_12m, key=lambda item: item.survey_date)
    rates: list[MonthlyRate] = []
    index = 0
    latest: Expectation | None = None
    for month in selic:
        next_month = month_start(month.ref_date, -1)
        while index < len(surveys) and surveys[index].survey_date < next_month:
            latest = surveys[index]
            index += 1
        if latest is not None:
            rates.append(
                MonthlyRate(
                    ref_date=month.ref_date,
                    rate=real_change(month.rate, latest.median / PERCENT),
                )
            )
    return rates


def ex_post_real_rates(
    selic: Sequence[MonthlyRate], inflation_12m: Sequence[MonthlyRate]
) -> list[MonthlyRate]:
    """O juro real de cada mês contra a inflação que já passou: a Selic do fim do mês
    dividida pelo IPCA dos 12 meses que terminam nele. Selic de 15% contra 4,5% dão
    1,15 / 1,045 - 1 = 10,05%. Mês sem as duas fica de fora."""
    inflation = {item.ref_date: item.rate for item in inflation_12m}
    return [
        MonthlyRate(
            ref_date=month.ref_date,
            rate=real_change(month.rate, inflation[month.ref_date]),
        )
        for month in selic
        if month.ref_date in inflation
    ]


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
