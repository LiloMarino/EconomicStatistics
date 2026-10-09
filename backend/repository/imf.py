from __future__ import annotations

from collections.abc import Iterable

from sqlalchemy import func, select
from sqlalchemy.dialects.sqlite import insert
from sqlalchemy.orm import Session

from backend.core.enum import ImfIndicator
from backend.core.models.models import ImfObservation
from backend.domain.imf import CountryObservation

# O SQLite aceita até 32.766 parâmetros por comando, e cada linha usa 4
UPSERT_CHUNK = 4_000


def last_year(session: Session, indicator: ImfIndicator) -> int | None:
    return session.scalar(
        select(func.max(ImfObservation.year)).where(
            ImfObservation.indicator == indicator
        )
    )


def read_observations(
    session: Session, indicator: ImfIndicator
) -> list[CountryObservation]:
    """Os anos em cache do indicador, de cada país, em ordem de ano."""
    return [
        CountryObservation(
            country=row.country, indicator=row.indicator, year=row.year, value=row.value
        )
        for row in session.scalars(
            select(ImfObservation)
            .where(ImfObservation.indicator == indicator)
            .order_by(ImfObservation.country, ImfObservation.year)
        )
    ]


def upsert_observations(
    session: Session, observations: Iterable[CountryObservation]
) -> None:
    """O FMI revisa os anos passados a cada edição, então o que já está em cache é
    reescrito."""
    rows = [
        {
            "country": item.country,
            "indicator": item.indicator,
            "year": item.year,
            "value": item.value,
        }
        for item in observations
    ]
    for start in range(0, len(rows), UPSERT_CHUNK):
        upsert = insert(ImfObservation)
        upsert = upsert.on_conflict_do_update(
            index_elements=[
                ImfObservation.country,
                ImfObservation.indicator,
                ImfObservation.year,
            ],
            set_={"value": upsert.excluded.value},
        )
        session.execute(upsert, rows[start : start + UPSERT_CHUNK])
