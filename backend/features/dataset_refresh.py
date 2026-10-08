"""O registro de busca das fontes que não são série, com a mesma regra da
`RefreshReport` das séries: `failed` traz só o problema novo."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

from sqlalchemy.orm import Session

from backend.core.enum import Dataset
from backend.core.models.models import DatasetFetchLog


@dataclass(frozen=True, slots=True, kw_only=True)
class DatasetRefresh:
    updated: bool
    failed: bool


def record_attempt(
    session: Session,
    dataset: Dataset,
    log: DatasetFetchLog | None,
    now: datetime,
    *,
    succeeded: bool,
    gap: bool,
) -> DatasetRefresh:
    """Grava a tentativa e fecha a transação. `gap` diz se, depois dela, ainda falta o
    que já devia estar publicado; a falta só é problema novo quando a tentativa
    anterior não a tinha avisado."""
    failed = gap and not (log is not None and log.gap)
    if log is None:
        session.add(
            DatasetFetchLog(
                dataset=dataset,
                attempted_at=now,
                succeeded_at=now if succeeded else None,
                gap=gap,
            )
        )
    else:
        log.attempted_at = now
        log.succeeded_at = now if succeeded else log.succeeded_at
        log.gap = gap
    session.commit()
    return DatasetRefresh(updated=succeeded, failed=failed)
