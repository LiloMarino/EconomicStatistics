from __future__ import annotations

from datetime import date, datetime

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import BaseDTO
from backend.core.enum import SeriesId
from backend.features.providers import ProvidersDep
from backend.features.series.refresh import refresh_series
from backend.repository.series import fetch_logs, last_cached

router = APIRouter(prefix="/api/series", tags=["series"])


class RefreshReportDTO(BaseDTO):
    updated: list[SeriesId]
    failed: list[SeriesId]


class SeriesStatusDTO(BaseDTO):
    """Até que mês o cache tem dado real, e quando a fonte respondeu pela última vez."""

    series_id: SeriesId
    last_ref_date: date | None
    succeeded_at: datetime | None


@router.post("/refresh")
def refresh(session: SessionDep, providers: ProvidersDep) -> RefreshReportDTO:
    """Com o cache em dia, responde sem sair da máquina. Sem rede não é erro: o cache
    fica como estava, e a série vai para `failed` quando a falta é problema novo."""
    report = refresh_series(session, providers, datetime.now())
    return RefreshReportDTO.model_validate(report)


@router.get("/status")
def status(session: SessionDep) -> list[SeriesStatusDTO]:
    cached = last_cached(session)
    logs = fetch_logs(session)
    return [
        SeriesStatusDTO(
            series_id=series_id,
            last_ref_date=cached.get(series_id),
            succeeded_at=log.succeeded_at if (log := logs.get(series_id)) else None,
        )
        for series_id in SeriesId
    ]
