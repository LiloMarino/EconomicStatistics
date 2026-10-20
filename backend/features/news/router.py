from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.core.enum import Dataset, Periodicity, SeriesId
from backend.domain.news import arrivals
from backend.domain.series import SERIES
from backend.repository.seen import (
    last_news_datasets,
    last_news_series,
    mark_seen,
    seen_datasets,
    seen_series,
)

router = APIRouter(prefix="/api/news", tags=["news"])


class SeriesNewsDTO(BaseDTO):
    """A série ia até `seen_until` na última visita e hoje vai até `last_ref_date`."""

    series_id: SeriesId
    periodicity: Periodicity
    seen_until: date
    last_ref_date: date


class DatasetNewsDTO(BaseDTO):
    dataset: Dataset
    seen_until: date
    last_date: date


class NewsDTO(BaseDTO):
    series: list[SeriesNewsDTO]
    datasets: list[DatasetNewsDTO]


class SeenDTO(BaseDTO):
    series: list[SeriesId]
    datasets: list[Dataset]


@router.get("", responses=ERROR_RESPONSES)
def news(session: SessionDep) -> NewsDTO:
    return NewsDTO(
        series=[
            SeriesNewsDTO(
                series_id=item.key,
                periodicity=SERIES[item.key].periodicity,
                seen_until=item.seen_until,
                last_ref_date=item.last,
            )
            for item in arrivals(last_news_series(session), seen_series(session))
        ],
        datasets=[
            DatasetNewsDTO(
                dataset=item.key, seen_until=item.seen_until, last_date=item.last
            )
            for item in arrivals(last_news_datasets(session), seen_datasets(session))
        ],
    )


@router.post("/seen", status_code=204, responses=ERROR_RESPONSES)
def seen(session: SessionDep, body: SeenDTO) -> None:
    """Marca as fontes pedidas como vistas até o período mais recente em cache."""
    mark_seen(session, body.series, body.datasets)
