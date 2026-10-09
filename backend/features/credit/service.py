from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta

from sqlalchemy.orm import Session

from backend.core.enum import SeriesId
from backend.core.errors import MissingDataError
from backend.domain.coverage import month_start
from backend.domain.interest import month_end_rates
from backend.domain.rates import PERCENT, index_change_12m
from backend.domain.series import Observation
from backend.features.monthly_forecast import MonthValue
from backend.repository.series import last_cached, read_observations

CREDIT_SERIES = (
    SeriesId.CREDIT_COST,
    SeriesId.CONCESSIONS_BUSINESS,
    SeriesId.CONCESSIONS_HOUSEHOLDS,
    SeriesId.SELIC_TARGET,
)

# Cada gráfico mostra os últimos 24 meses, terminando no último dado de cada série
WINDOW_MONTHS = 24
# A variação em 12 meses de um mês lê os 23 meses anteriores a ele
CHANGE_HISTORY_MONTHS = 23


@dataclass(frozen=True, slots=True, kw_only=True)
class CostMonth:
    """O ICC e a Selic meta de fim do mês, ao ano e em fração."""

    ref_date: date
    cost: float
    selic: float


@dataclass(frozen=True, slots=True, kw_only=True)
class Cost:
    """`months` traz só os meses com o ICC e a Selic. `spread` é o ICC menos a Selic do
    último deles, em fração (0.09 é 9 pontos percentuais)."""

    months: list[CostMonth]
    spread: float


@dataclass(frozen=True, slots=True, kw_only=True)
class Concessions:
    """A variação em 12 meses das concessões de recursos livres, em fração: a soma dos
    12 meses que terminam em cada mês sobre a dos 12 anteriores."""

    business: list[MonthValue]
    households: list[MonthValue]


@dataclass(frozen=True, slots=True, kw_only=True)
class Credit:
    cost: Cost
    concessions: Concessions


def credit(session: Session) -> Credit:
    cached = last_cached(session)
    if any(series_id not in cached for series_id in CREDIT_SERIES):
        raise MissingDataError(
            "Ainda não há crédito no cache: a primeira atualização não terminou."
        )
    cost_end = cached[SeriesId.CREDIT_COST]
    concessions_end = max(
        cached[SeriesId.CONCESSIONS_BUSINESS], cached[SeriesId.CONCESSIONS_HOUSEHOLDS]
    )
    cost_start = month_start(cost_end, WINDOW_MONTHS - 1)
    observations = read_observations(
        session,
        (
            SeriesId.CREDIT_COST,
            SeriesId.CONCESSIONS_BUSINESS,
            SeriesId.CONCESSIONS_HOUSEHOLDS,
        ),
        month_start(
            min(cost_end, concessions_end), WINDOW_MONTHS + CHANGE_HISTORY_MONTHS - 1
        ),
        max(cost_end, concessions_end),
    )
    selic_days = read_observations(
        session,
        (SeriesId.SELIC_TARGET,),
        cost_start,
        month_start(cost_end, -1) - timedelta(days=1),
    )[SeriesId.SELIC_TARGET]
    return Credit(
        cost=_cost(observations[SeriesId.CREDIT_COST], selic_days, cost_start),
        concessions=Concessions(
            business=_change_12m(observations[SeriesId.CONCESSIONS_BUSINESS]),
            households=_change_12m(observations[SeriesId.CONCESSIONS_HOUSEHOLDS]),
        ),
    )


def _cost(cost: list[Observation], selic_days: list[Observation], start: date) -> Cost:
    selic = {item.ref_date: item.rate for item in month_end_rates(selic_days)}
    months = [
        CostMonth(
            ref_date=item.ref_date,
            cost=item.value / PERCENT,
            selic=selic[item.ref_date],
        )
        for item in cost
        if item.ref_date >= start and item.ref_date in selic
    ]
    if not months:
        raise MissingDataError("Ainda não há Selic para os meses do custo do crédito.")
    return Cost(months=months, spread=months[-1].cost - months[-1].selic)


def _change_12m(observations: list[Observation]) -> list[MonthValue]:
    return [
        MonthValue(ref_date=item.ref_date, value=item.rate)
        for item in index_change_12m(observations)
    ][-WINDOW_MONTHS:]
