from __future__ import annotations

from collections.abc import Collection, Iterable
from datetime import date

from sqlalchemy import func, select
from sqlalchemy.dialects.sqlite import insert
from sqlalchemy.orm import Session

from backend.core.enum import SeriesId
from backend.core.models.models import FetchLog, SeriesObservation
from backend.domain.coverage import LastFetch
from backend.domain.series import Observation


def last_cached(session: Session) -> dict[SeriesId, date]:
    return {
        series_id: last_date
        for series_id, last_date in session.execute(
            select(
                SeriesObservation.series_id, func.max(SeriesObservation.ref_date)
            ).group_by(SeriesObservation.series_id)
        )
    }


def first_cached(session: Session, series_id: SeriesId) -> date | None:
    return session.scalar(
        select(func.min(SeriesObservation.ref_date)).where(
            SeriesObservation.series_id == series_id
        )
    )


def fetch_logs(session: Session) -> dict[SeriesId, FetchLog]:
    return {log.series_id: log for log in session.scalars(select(FetchLog))}


def last_fetch(log: FetchLog | None) -> LastFetch | None:
    if log is None:
        return None
    return LastFetch(
        attempted_at=log.attempted_at, succeeded_at=log.succeeded_at, gap=log.gap
    )


def read_observations(
    session: Session, series_ids: Collection[SeriesId], start: date, end: date
) -> dict[SeriesId, list[Observation]]:
    """Cada série pedida, em ordem de data, de `start` a `end` inclusive. Série sem
    nada em cache vem como lista vazia."""
    result: dict[SeriesId, list[Observation]] = {
        series_id: [] for series_id in series_ids
    }
    rows = session.execute(
        select(
            SeriesObservation.series_id,
            SeriesObservation.ref_date,
            SeriesObservation.value,
        )
        .where(
            SeriesObservation.series_id.in_(series_ids),
            SeriesObservation.ref_date >= start,
            SeriesObservation.ref_date <= end,
        )
        .order_by(SeriesObservation.ref_date)
    )
    for series_id, ref_date, value in rows:
        result[series_id].append(Observation(ref_date=ref_date, value=value))
    return result


def upsert_observations(
    session: Session, series_id: SeriesId, observations: Iterable[Observation]
) -> None:
    rows = [
        {"series_id": series_id, "ref_date": item.ref_date, "value": item.value}
        for item in observations
    ]
    if not rows:
        return
    upsert = insert(SeriesObservation)
    upsert = upsert.on_conflict_do_update(
        index_elements=[SeriesObservation.series_id, SeriesObservation.ref_date],
        set_={"value": upsert.excluded.value},
    )
    session.execute(upsert, rows)
