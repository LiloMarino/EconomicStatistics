from __future__ import annotations

from collections.abc import Callable, Collection
from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.core.enum import Dataset, SeriesId
from backend.core.models.models import SeenDataset, SeenSeries
from backend.domain.news import NEWS_SERIES
from backend.repository.federal_debt import last_stock_month
from backend.repository.focus import last_survey_date
from backend.repository.series import last_cached

# As fontes que não são série e entram nas novidades, as que o usuário lê como dado,
# com o período mais recente de cada uma
_DATASET_LAST: dict[Dataset, Callable[[Session], date | None]] = {
    Dataset.FOCUS_EXPECTATIONS: last_survey_date,
    Dataset.FEDERAL_DEBT_STOCK: last_stock_month,
}


def last_news_series(session: Session) -> dict[SeriesId, date]:
    return {
        series_id: last_date
        for series_id, last_date in last_cached(session).items()
        if series_id in NEWS_SERIES
    }


def last_news_datasets(session: Session) -> dict[Dataset, date]:
    return {
        dataset: last_date
        for dataset, read_last in _DATASET_LAST.items()
        if (last_date := read_last(session)) is not None
    }


def seen_series(session: Session) -> dict[SeriesId, date]:
    return {
        row.series_id: row.seen_until for row in session.scalars(select(SeenSeries))
    }


def seen_datasets(session: Session) -> dict[Dataset, date]:
    return {row.dataset: row.seen_until for row in session.scalars(select(SeenDataset))}


def record_baseline(session: Session) -> None:
    """A fonte com dado e sem marca ganha a marca no período mais recente: o que já
    estava em cache não é novidade. Grava e fecha a transação."""
    seen = seen_series(session)
    for series_id, last_date in last_news_series(session).items():
        if series_id not in seen:
            session.add(SeenSeries(series_id=series_id, seen_until=last_date))
    seen_sets = seen_datasets(session)
    for dataset, last_date in last_news_datasets(session).items():
        if dataset not in seen_sets:
            session.add(SeenDataset(dataset=dataset, seen_until=last_date))
    session.commit()


def mark_seen(
    session: Session, series_ids: Collection[SeriesId], datasets: Collection[Dataset]
) -> None:
    """Leva a marca das fontes pedidas ao período mais recente em cache."""
    last_series = last_news_series(session)
    for series_id in series_ids:
        if (last_date := last_series.get(series_id)) is not None:
            session.merge(SeenSeries(series_id=series_id, seen_until=last_date))
    last_sets = last_news_datasets(session)
    for dataset in datasets:
        if (last_date := last_sets.get(dataset)) is not None:
            session.merge(SeenDataset(dataset=dataset, seen_until=last_date))
    session.commit()
