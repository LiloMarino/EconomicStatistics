from __future__ import annotations

from datetime import date, datetime

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import BaseDTO
from backend.core.enum import Dataset, SeriesId
from backend.features.dataset_refresh import DatasetRefresh
from backend.features.debt.refresh import refresh_federal_debt
from backend.features.focus.refresh import refresh_focus
from backend.features.providers import (
    DebtProviderDep,
    FocusProviderDep,
    ProvidersDep,
)
from backend.features.series.refresh import refresh_series
from backend.repository.series import fetch_logs, last_cached

router = APIRouter(prefix="/api/series", tags=["series"])


class RefreshReportDTO(BaseDTO):
    """As séries e as fontes que não são série (`datasets_*`) atualizadas ou com
    falta nova."""

    updated: list[SeriesId]
    failed: list[SeriesId]
    datasets_updated: list[Dataset]
    datasets_failed: list[Dataset]


class SeriesStatusDTO(BaseDTO):
    """Até que mês o cache tem dado real, e quando a fonte respondeu pela última vez."""

    series_id: SeriesId
    last_ref_date: date | None
    succeeded_at: datetime | None


@router.post("/refresh")
def refresh(
    session: SessionDep,
    providers: ProvidersDep,
    debt_provider: DebtProviderDep,
    focus_provider: FocusProviderDep,
) -> RefreshReportDTO:
    """Com o cache em dia, responde sem sair da máquina. Sem rede não é erro: o cache
    fica como estava, e a série vai para `failed` quando a falta é problema novo."""
    now = datetime.now()
    report = refresh_series(session, providers, now)
    datasets: dict[Dataset, DatasetRefresh] = {
        Dataset.FEDERAL_DEBT_STOCK: refresh_federal_debt(session, debt_provider, now),
        Dataset.FOCUS_EXPECTATIONS: refresh_focus(session, focus_provider, now),
    }
    return RefreshReportDTO(
        updated=list(report.updated),
        failed=list(report.failed),
        datasets_updated=[key for key, item in datasets.items() if item.updated],
        datasets_failed=[key for key, item in datasets.items() if item.failed],
    )


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
