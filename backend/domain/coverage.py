"""Quando a fonte externa é consultada: só quando falta uma referência que já devia
estar publicada, e no máximo uma vez por intervalo."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta

from backend.domain.series import SeriesSpec

FETCH_INTERVAL = timedelta(hours=6)
# A fonte ainda corrige o que publicou: toda busca regrava os últimos 12 meses
REVISION_MONTHS = 12


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


def expected_ref_date(spec: SeriesSpec, today: date) -> date:
    """O mês de referência que já devia estar publicado hoje."""
    months_back = spec.lag_months + (0 if today.day >= spec.release_day else 1)
    return month_start(today, months_back)


def fetch_request(
    spec: SeriesSpec,
    last_cached: date | None,
    last: LastFetch | None,
    now: datetime,
) -> DateRange | None:
    """A série inteira na primeira carga; depois, a janela de revisão a partir do
    último mês em cache."""
    if last is not None and now - last.attempted_at < FETCH_INTERVAL:
        return None
    today = now.date()
    if last_cached is None:
        return DateRange(start=spec.first_date, end=today)
    if last_cached < expected_ref_date(spec, today):
        start = max(spec.first_date, month_start(last_cached, REVISION_MONTHS))
        return DateRange(start=start, end=today)
    return None


def overdue(spec: SeriesSpec, last_cached: date | None, today: date) -> bool:
    return last_cached is None or last_cached < expected_ref_date(spec, today)
