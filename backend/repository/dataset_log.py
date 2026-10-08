from __future__ import annotations

from sqlalchemy.orm import Session

from backend.core.enum import Dataset
from backend.core.models.models import DatasetFetchLog


def dataset_log(session: Session, dataset: Dataset) -> DatasetFetchLog | None:
    return session.get(DatasetFetchLog, dataset)
