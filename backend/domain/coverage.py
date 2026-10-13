"""Quando a fonte externa é consultada: só quando falta uma referência que já devia
estar publicada, e no máximo uma vez por intervalo."""

from __future__ import annotations

from calendar import monthrange
from dataclasses import dataclass
from datetime import date, datetime, timedelta

from backend.core.enum import Periodicity
from backend.domain.series import SeriesSpec

FETCH_INTERVAL = timedelta(hours=6)
# A fonte ainda corrige o que publicou: toda busca regrava os últimos 12 meses
REVISION_MONTHS = 12
# Numa série de dia útil, a falta só vira aviso depois de 3 dias úteis sem dado: o
# feriado, que não está no calendário de dias úteis, passa sem alarme
BUSINESS_DAYS_TOLERANCE = 3
SATURDAY = 5


@dataclass(frozen=True, slots=True, kw_only=True)
class DateRange:
    start: date
    end: date


@dataclass(frozen=True, slots=True, kw_only=True)
class LastFetch:
    attempted_at: datetime
    succeeded_at: datetime | None
    gap: bool


def month_start(day: date, months_back: int = 0) -> date:
    index = day.year * 12 + day.month - 1 - months_back
    return date(index // 12, index % 12 + 1, 1)


def expected_ref_date(spec: SeriesSpec, today: date, grace_days: int = 0) -> date:
    """A referência que já devia estar publicada hoje: o próprio dia numa série
    diária, o mês, o 1º dia do trimestre numa série trimestral, ou o 1º de janeiro do
    ano numa anual. A janela de revisão de 12 meses cobre um ano nas quatro."""
    # O dia de publicação vale no máximo até o fim do mês: o "dia 30" de fevereiro é o 28
    release_day = min(
        spec.release_day + grace_days, monthrange(today.year, today.month)[1]
    )
    months_back = spec.lag_months + (0 if today.day >= release_day else 1)
    expected = month_start(today, months_back)
    match spec.periodicity:
        case Periodicity.DAILY:
            return today
        case Periodicity.BUSINESS_DAILY:
            return business_day_before(today)
        case Periodicity.ANNUAL:
            return date(expected.year, 1, 1)
        case Periodicity.QUARTERLY:
            return quarter_start(expected)
        case Periodicity.MONTHLY:
            return expected


def quarter_start(day: date) -> date:
    return date(day.year, (day.month - 1) // 3 * 3 + 1, 1)


def quarter_end(day: date) -> date:
    """O 1º dia do último mês do trimestre que contém `day`."""
    return month_start(quarter_start(day), -2)


def fetch_request(
    spec: SeriesSpec,
    cached: DateRange | None,
    last: LastFetch | None,
    now: datetime,
) -> DateRange | None:
    """A série inteira na primeira carga. Depois, as pontas que faltam no cache: o
    começo, quando o registro passa a cobrir meses mais antigos, e o fim, com a janela
    de revisão a partir do último mês em cache. Numa série com ajuste sazonal, a janela
    de revisão é a série inteira."""
    if last is not None and now - last.attempted_at < FETCH_INTERVAL:
        return None
    today = now.date()
    if cached is None:
        return DateRange(start=spec.first_date, end=today)
    missing_start = cached.start > spec.first_date
    missing_end = cached.end < expected_ref_date(spec, today)
    if not missing_start and not missing_end:
        return None
    start = (
        spec.first_date
        if missing_start or spec.seasonally_adjusted
        else max(spec.first_date, month_start(cached.end, REVISION_MONTHS))
    )
    end = today if missing_end else month_start(cached.start, 1)
    return DateRange(start=start, end=end)


def business_day_before(day: date, count: int = 1) -> date:
    """O `count`-ésimo dia de segunda a sexta antes de `day`."""
    while count > 0:
        day -= timedelta(days=1)
        if day.weekday() < SATURDAY:
            count -= 1
    return day


def overdue(spec: SeriesSpec, last_cached: date | None, today: date) -> bool:
    """A busca vai atrás da referência esperada, mas a falta só conta depois da
    tolerância: 3 dias úteis numa série de dia útil, e o fim da janela de publicação
    nas outras."""
    if last_cached is None:
        return True
    if spec.periodicity is Periodicity.BUSINESS_DAILY:
        return last_cached < business_day_before(today, BUSINESS_DAYS_TOLERANCE)
    return last_cached < expected_ref_date(spec, today, spec.warn_after_days)
