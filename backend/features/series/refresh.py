from __future__ import annotations

import logging
from collections.abc import Mapping
from dataclasses import dataclass
from datetime import datetime
from threading import Lock

from sqlalchemy.orm import Session

from backend.core.enum import SeriesId, Source
from backend.core.models.models import FetchLog
from backend.domain.coverage import DateRange, fetch_request, overdue
from backend.domain.series import SERIES, Observation, SeriesProvider, SeriesSpec
from backend.repository.series import (
    cached_ranges,
    fetch_logs,
    last_cached,
    last_fetch,
    upsert_observations,
)

logger = logging.getLogger(__name__)

_refresh_lock = Lock()


@dataclass(frozen=True, slots=True, kw_only=True)
class RefreshReport:
    """`failed` traz só o problema novo: a referência que já devia estar publicada,
    ainda faltando nesta tentativa e não avisada na anterior."""

    updated: tuple[SeriesId, ...]
    failed: tuple[SeriesId, ...]


def refresh_series(
    session: Session, providers: Mapping[Source, SeriesProvider], now: datetime
) -> RefreshReport:
    """Consulta a fonte só pelas séries a que falta a última referência esperada.
    Um refresh por vez: o concorrente espera e refaz o plano sobre o cache novo."""
    with _refresh_lock:
        return _refresh(session, providers, now)


def _fetch(
    provider: SeriesProvider,
    series_id: SeriesId,
    spec: SeriesSpec,
    request: DateRange,
) -> list[Observation]:
    """Falha da fonte vira lista vazia: o cache fica como estava."""
    logger.info(
        "%s: consultando %s de %s a %s",
        provider.name,
        series_id,
        request.start,
        request.end,
    )
    try:
        return provider.get_series(spec, request.start, request.end)
    except Exception:
        logger.warning("%s falhou para %s", provider.name, series_id, exc_info=True)
        return []


def _refresh(
    session: Session, providers: Mapping[Source, SeriesProvider], now: datetime
) -> RefreshReport:
    ranges = cached_ranges(session)
    logs = fetch_logs(session)
    plan = [
        (series_id, request)
        for series_id, spec in SERIES.items()
        if (
            request := fetch_request(
                spec, ranges.get(series_id), last_fetch(logs.get(series_id)), now
            )
        )
        is not None
    ]
    # A rede é consultada fora de transação
    session.commit()
    fetched = [
        (
            series_id,
            _fetch(
                providers[SERIES[series_id].source],
                series_id,
                SERIES[series_id],
                request,
            ),
        )
        for series_id, request in plan
    ]

    for series_id, observations in fetched:
        upsert_observations(session, series_id, observations)
    session.flush()

    cached = last_cached(session)
    updated: list[SeriesId] = []
    failed: list[SeriesId] = []
    for series_id, observations in fetched:
        gap = overdue(SERIES[series_id], cached.get(series_id), now.date())
        log = logs.get(series_id)
        if gap and not (log and log.gap):
            failed.append(series_id)
        if observations:
            updated.append(series_id)
        if log is None:
            session.add(
                FetchLog(
                    series_id=series_id,
                    attempted_at=now,
                    succeeded_at=now if observations else None,
                    gap=gap,
                )
            )
        else:
            log.attempted_at = now
            log.succeeded_at = now if observations else log.succeeded_at
            log.gap = gap

    session.commit()
    return RefreshReport(updated=tuple(updated), failed=tuple(failed))
