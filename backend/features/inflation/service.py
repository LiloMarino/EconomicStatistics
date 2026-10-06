from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import RaiseReference, SeriesId
from backend.core.errors import EconomicError
from backend.domain.coverage import month_start
from backend.domain.rates import (
    MonthlyRate,
    accumulate,
    monthly_rates,
    real_change,
    rolling_12m,
)
from backend.domain.series import IPCA_GROUPS, Observation
from backend.repository.series import first_cached, last_cached, read_observations

IPCA_SERIES = (SeriesId.IPCA_GENERAL, *IPCA_GROUPS)


class InvalidRequestError(EconomicError):
    status = 422


class MissingDataError(EconomicError):
    """O cache não cobre o que o pedido precisa."""

    status = 409


@dataclass(frozen=True, slots=True, kw_only=True)
class Period:
    """Meses de referência, datados no dia 1: o período efetivo e o que o cache tem."""

    start: date
    end: date
    first_available: date
    last_available: date


@dataclass(frozen=True, slots=True, kw_only=True)
class GroupRate:
    series_id: SeriesId
    ref_date: date
    rate: float


@dataclass(frozen=True, slots=True, kw_only=True)
class GroupAccumulated:
    series_id: SeriesId
    rate: float


@dataclass(frozen=True, slots=True, kw_only=True)
class InflationGroups:
    period: Period
    monthly: list[GroupRate]
    accumulated: list[GroupAccumulated]
    rolling_12m: list[GroupRate]


@dataclass(frozen=True, slots=True, kw_only=True)
class GroupPurchasingPower:
    series_id: SeriesId
    inflation: float
    change: float


@dataclass(frozen=True, slots=True, kw_only=True)
class PurchasingPower:
    period: Period
    reference: RaiseReference
    reference_raise: float
    groups: list[GroupPurchasingPower]


def months_in(start: date, end: date) -> int:
    return (end.year - start.year) * 12 + end.month - start.month + 1


def resolve_period(session: Session, start: date | None, end: date | None) -> Period:
    """Sem período pedido, vale o ano do último dado. O pedido é cortado nos meses que
    o cache tem."""
    first = first_cached(session, SeriesId.IPCA_GENERAL)
    last = last_cached(session).get(SeriesId.IPCA_GENERAL)
    if first is None or last is None:
        raise MissingDataError(
            "Ainda não há IPCA no cache: a primeira atualização não terminou."
        )
    effective_end = min(month_start(end), last) if end else last
    effective_start = (
        max(month_start(start), first)
        if start
        else max(date(effective_end.year, 1, 1), first)
    )
    if effective_start > effective_end:
        raise InvalidRequestError(
            "Período vazio: o início fica depois do fim, ou fora dos meses com dado."
        )
    return Period(
        start=effective_start,
        end=effective_end,
        first_available=first,
        last_available=last,
    )


def _in_period(rates: list[MonthlyRate], period: Period) -> list[MonthlyRate]:
    return [item for item in rates if period.start <= item.ref_date <= period.end]


def inflation_groups(
    session: Session, start: date | None, end: date | None
) -> InflationGroups:
    """O 12 meses de cada mês lê os 11 meses anteriores ao período no cache."""
    period = resolve_period(session, start, end)
    observations = read_observations(
        session, IPCA_SERIES, month_start(period.start, 11), period.end
    )
    monthly: list[GroupRate] = []
    accumulated: list[GroupAccumulated] = []
    rolling: list[GroupRate] = []
    for series_id in IPCA_SERIES:
        rates = monthly_rates(observations[series_id])
        in_period = _in_period(rates, period)
        monthly.extend(
            GroupRate(series_id=series_id, ref_date=item.ref_date, rate=item.rate)
            for item in in_period
        )
        accumulated.append(
            GroupAccumulated(
                series_id=series_id, rate=accumulate(item.rate for item in in_period)
            )
        )
        rolling.extend(
            GroupRate(series_id=series_id, ref_date=item.ref_date, rate=item.rate)
            for item in rolling_12m(rates)
            if item.ref_date >= period.start
        )
    return InflationGroups(
        period=period, monthly=monthly, accumulated=accumulated, rolling_12m=rolling
    )


def purchasing_power(
    session: Session,
    start: date | None,
    end: date | None,
    reference: RaiseReference,
    custom_raise: float | None,
) -> PurchasingPower:
    """Para cada grupo, quanto o dinheiro reajustado pela referência compra a mais
    ou a menos do que comprava no início do período."""
    if reference is RaiseReference.CUSTOM and custom_raise is None:
        raise InvalidRequestError("Informe o reajuste para comparar.")
    period = resolve_period(session, start, end)
    observations = read_observations(
        session,
        (*IPCA_SERIES, SeriesId.INPC, SeriesId.MINIMUM_WAGE),
        month_start(period.start, 1),
        period.end,
    )
    inflation = {
        series_id: accumulate(
            item.rate
            for item in _in_period(monthly_rates(observations[series_id]), period)
        )
        for series_id in IPCA_SERIES
    }
    match reference:
        case RaiseReference.IPCA:
            reference_raise = inflation[SeriesId.IPCA_GENERAL]
        case RaiseReference.INPC:
            reference_raise = _inpc_raise(observations[SeriesId.INPC], period)
        case RaiseReference.MINIMUM_WAGE:
            reference_raise = _minimum_wage_raise(
                observations[SeriesId.MINIMUM_WAGE], period
            )
        case RaiseReference.CUSTOM:
            reference_raise = custom_raise or 0.0
    groups = sorted(
        (
            GroupPurchasingPower(
                series_id=series_id,
                inflation=inflation[series_id],
                change=real_change(reference_raise, inflation[series_id]),
            )
            for series_id in IPCA_GROUPS
        ),
        key=lambda group: group.change,
    )
    return PurchasingPower(
        period=period,
        reference=reference,
        reference_raise=reference_raise,
        groups=groups,
    )


def _inpc_raise(observations: list[Observation], period: Period) -> float:
    rates = _in_period(monthly_rates(observations), period)
    if len(rates) < months_in(period.start, period.end):
        raise MissingDataError("O INPC do período ainda não está todo no cache.")
    return accumulate(item.rate for item in rates)


def _minimum_wage_raise(observations: list[Observation], period: Period) -> float:
    """Comparação ponto a ponto: o mínimo em vigor no fim do período sobre o do mês
    anterior ao início, que é o salário com que o período começou."""
    by_month = {item.ref_date: item.value for item in observations}
    before = by_month.get(month_start(period.start, 1))
    after = by_month.get(period.end)
    if before is None or after is None:
        raise MissingDataError("O salário mínimo do período não está no cache.")
    return after / before - 1
