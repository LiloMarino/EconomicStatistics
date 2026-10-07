from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import PaceVerdict, RaiseReference, SeriesId
from backend.core.errors import EconomicError
from backend.domain.coverage import month_start
from backend.domain.pace import STEADY_BAND, verdict
from backend.domain.rates import (
    PERCENT,
    MonthlyRate,
    accumulate,
    monthly_rates,
    real_change,
    rolling_12m,
)
from backend.domain.seasonality import (
    COMPARED_YEARS,
    MonthBand,
    compared_years,
    month_bands,
)
from backend.domain.series import IPCA_GROUPS, TARGET_TOLERANCE, Observation
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
    """`simple_sum` soma as variações do mês: a conta errada, mostrada para contraste."""

    series_id: SeriesId
    rate: float
    simple_sum: float


@dataclass(frozen=True, slots=True, kw_only=True)
class InflationGroups:
    period: Period
    monthly: list[GroupRate]
    accumulated: list[GroupAccumulated]
    rolling_12m: list[GroupRate]


@dataclass(frozen=True, slots=True, kw_only=True)
class GroupPurchasingPower:
    """`naive_change` subtrai a inflação do reajuste: a conta errada, mostrada para
    contraste."""

    series_id: SeriesId
    inflation: float
    change: float
    naive_change: float


@dataclass(frozen=True, slots=True, kw_only=True)
class ReferenceRaise:
    """O reajuste de uma referência no período; `None` quando o cache não o cobre."""

    reference: RaiseReference
    rate: float | None


@dataclass(frozen=True, slots=True, kw_only=True)
class PurchasingPower:
    period: Period
    reference: RaiseReference
    reference_raise: float
    references: list[ReferenceRaise]
    groups: list[GroupPurchasingPower]


@dataclass(frozen=True, slots=True, kw_only=True)
class RollingPoint:
    """O 12 meses que termina em `ref_date` e o teto da meta daquele ano."""

    ref_date: date
    rate: float
    ceiling: float | None


@dataclass(frozen=True, slots=True, kw_only=True)
class MonthVsYearBefore:
    """Um mês contra o mesmo mês do ano anterior; `difference` em pontos percentuais."""

    ref_date: date
    rate: float
    year_before: float
    difference: float


@dataclass(frozen=True, slots=True, kw_only=True)
class PaceWindow:
    """O 12 meses `months` meses antes do fim e a inclinação até o fim: `change` em
    pontos percentuais, `relative_change` como fração do valor de antes."""

    months: int
    rolling_12m_before: float
    change: float
    relative_change: float


@dataclass(frozen=True, slots=True, kw_only=True)
class GroupPace:
    """O 12 meses do grupo no fim e as janelas que têm dado."""

    series_id: SeriesId
    rolling_12m: float
    windows: list[PaceWindow]


@dataclass(frozen=True, slots=True, kw_only=True)
class InflationPace:
    end: date
    general_12m: list[RollingPoint]
    target: float | None
    ceiling: float | None
    last_months: list[MonthVsYearBefore]
    last_months_difference: float
    change_1m: float
    change_3m: float
    verdict: PaceVerdict
    steady_band: float
    groups: list[GroupPace]


@dataclass(frozen=True, slots=True, kw_only=True)
class Deviation:
    """O mês do ano mais longe da média dos anos comparados, em pontos percentuais."""

    ref_date: date
    rate: float
    typical: float
    difference: float


@dataclass(frozen=True, slots=True, kw_only=True)
class GroupSeasonality:
    series_id: SeriesId
    months: list[MonthlyRate]
    bands: list[MonthBand]
    largest_deviation: Deviation | None


@dataclass(frozen=True, slots=True, kw_only=True)
class Seasonality:
    year: int
    years_compared: list[int]
    groups: list[GroupSeasonality]


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
                series_id=series_id,
                rate=accumulate(item.rate for item in in_period),
                simple_sum=sum(item.rate for item in in_period),
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

    def raise_of(candidate: RaiseReference) -> float:
        match candidate:
            case RaiseReference.IPCA:
                return inflation[SeriesId.IPCA_GENERAL]
            case RaiseReference.INPC:
                return _inpc_raise(observations[SeriesId.INPC], period)
            case RaiseReference.MINIMUM_WAGE:
                return _minimum_wage_raise(observations[SeriesId.MINIMUM_WAGE], period)
            case RaiseReference.CUSTOM:
                return custom_raise or 0.0

    reference_raise = raise_of(reference)
    groups = sorted(
        (
            GroupPurchasingPower(
                series_id=series_id,
                inflation=inflation[series_id],
                change=real_change(reference_raise, inflation[series_id]),
                naive_change=reference_raise - inflation[series_id],
            )
            for series_id in IPCA_GROUPS
        ),
        key=lambda group: group.change,
    )
    return PurchasingPower(
        period=period,
        reference=reference,
        reference_raise=reference_raise,
        references=[
            ReferenceRaise(reference=candidate, rate=_or_none(raise_of, candidate))
            for candidate in PUBLISHED_REFERENCES
        ],
        groups=groups,
    )


# As referências publicadas por uma fonte, na ordem dos cartões da tela
PUBLISHED_REFERENCES = (
    RaiseReference.IPCA,
    RaiseReference.MINIMUM_WAGE,
    RaiseReference.INPC,
)


def _or_none(
    compute: Callable[[RaiseReference], float], reference: RaiseReference
) -> float | None:
    try:
        return compute(reference)
    except MissingDataError:
        return None


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


# O gráfico mostra 24 meses de 12 meses, e cada 12 meses lê os 11 meses anteriores
PACE_CHART_MONTHS = 24


def inflation_pace(session: Session, end: date | None) -> InflationPace:
    """O ritmo no fim do período: o 12 meses dos 24 meses até `end`, a inclinação de 1
    e de 3 meses, e o 12 meses de cada grupo no fim e antes dele."""
    last = resolve_period(session, None, end).end
    observations = read_observations(
        session, IPCA_SERIES, month_start(last, PACE_CHART_MONTHS + 10), last
    )
    rolling = {
        series_id: {
            item.ref_date: item.rate
            for item in rolling_12m(monthly_rates(observations[series_id]))
        }
        for series_id in IPCA_SERIES
    }
    general = rolling[SeriesId.IPCA_GENERAL]
    if month_start(last, 3) not in general:
        raise MissingDataError(
            "O ritmo precisa de 15 meses de IPCA no cache até o fim do período."
        )
    chart_start = month_start(last, PACE_CHART_MONTHS - 1)
    ceilings = _ceilings(session, chart_start, last)
    monthly = {
        item.ref_date: item.rate
        for item in monthly_rates(observations[SeriesId.IPCA_GENERAL])
    }
    change_3m = general[last] - general[month_start(last, 3)]
    last_months = [
        _vs_year_before(monthly, month_start(last, back)) for back in (2, 1, 0)
    ]
    return InflationPace(
        end=last,
        general_12m=[
            RollingPoint(
                ref_date=ref_date, rate=rate, ceiling=ceilings.get(ref_date.year)
            )
            for ref_date, rate in general.items()
            if ref_date >= chart_start
        ],
        target=_target(ceilings.get(last.year)),
        ceiling=ceilings.get(last.year),
        last_months=last_months,
        last_months_difference=sum(item.difference for item in last_months),
        change_1m=general[last] - general[month_start(last, 1)],
        change_3m=change_3m,
        verdict=verdict(change_3m),
        steady_band=STEADY_BAND,
        groups=[
            GroupPace(
                series_id=series_id,
                rolling_12m=rolling[series_id][last],
                windows=_windows(rolling[series_id], last),
            )
            for series_id in IPCA_SERIES
            if last in rolling[series_id]
        ],
    )


# As janelas que a tela compara: 1, 3 e 6 meses antes do fim
PACE_WINDOWS = (1, 3, 6)


def _windows(rolling: dict[date, float], last: date) -> list[PaceWindow]:
    windows: list[PaceWindow] = []
    for months in PACE_WINDOWS:
        before = rolling.get(month_start(last, months))
        if before is None:
            continue
        windows.append(
            PaceWindow(
                months=months,
                rolling_12m_before=before,
                change=rolling[last] - before,
                relative_change=(rolling[last] - before) / before if before else 0.0,
            )
        )
    return windows


def _vs_year_before(monthly: dict[date, float], ref_date: date) -> MonthVsYearBefore:
    year_before = monthly[month_start(ref_date, 12)]
    return MonthVsYearBefore(
        ref_date=ref_date,
        rate=monthly[ref_date],
        year_before=year_before,
        difference=monthly[ref_date] - year_before,
    )


def _ceilings(session: Session, start: date, end: date) -> dict[int, float]:
    """O teto da meta de cada ano entre `start` e `end`, em fração."""
    targets = read_observations(
        session,
        (SeriesId.INFLATION_TARGET,),
        date(start.year, 1, 1),
        date(end.year, 1, 1),
    )[SeriesId.INFLATION_TARGET]
    return {
        item.ref_date.year: item.value / PERCENT + TARGET_TOLERANCE for item in targets
    }


def _target(ceiling: float | None) -> float | None:
    return None if ceiling is None else ceiling - TARGET_TOLERANCE


def seasonality(session: Session, year: int | None) -> Seasonality:
    """Os meses de `year` (sem pedido, o ano do último dado) de cada grupo contra a
    faixa do mesmo mês nos até 5 anos completos anteriores."""
    chosen = year or resolve_period(session, None, None).last_available.year
    observations = read_observations(
        session, IPCA_SERIES, date(chosen - COMPARED_YEARS, 1, 1), date(chosen, 12, 1)
    )
    by_year: dict[SeriesId, dict[int, list[MonthlyRate]]] = {}
    for series_id in IPCA_SERIES:
        grouped: dict[int, list[MonthlyRate]] = {}
        for item in monthly_rates(observations[series_id]):
            grouped.setdefault(item.ref_date.year, []).append(item)
        by_year[series_id] = grouped
    general = by_year[SeriesId.IPCA_GENERAL]
    years = compared_years({key: len(rates) for key, rates in general.items()}, chosen)
    if not years or chosen not in general:
        raise MissingDataError(
            f"Não há {chosen} nem anos completos antes dele no cache para comparar."
        )
    groups: list[GroupSeasonality] = []
    for series_id in IPCA_SERIES:
        bands = month_bands(by_year[series_id], years)
        months = by_year[series_id].get(chosen, [])
        groups.append(
            GroupSeasonality(
                series_id=series_id,
                months=months,
                bands=bands,
                largest_deviation=_largest_deviation(months, bands),
            )
        )
    return Seasonality(year=chosen, years_compared=years, groups=groups)


def _largest_deviation(
    months: list[MonthlyRate], bands: list[MonthBand]
) -> Deviation | None:
    deviations = [
        Deviation(
            ref_date=item.ref_date,
            rate=item.rate,
            typical=bands[item.ref_date.month - 1].mean,
            difference=item.rate - bands[item.ref_date.month - 1].mean,
        )
        for item in months
    ]
    return max(deviations, key=lambda item: abs(item.difference), default=None)
