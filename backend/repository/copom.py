from __future__ import annotations

from collections.abc import Sequence

from sqlalchemy import delete, func, select
from sqlalchemy.orm import Session

from backend.core.models.models import CopomMeeting
from backend.domain.copom import Meeting


def last_meeting_year(session: Session) -> int | None:
    return session.scalar(select(func.max(CopomMeeting.year)))


def read_meetings(session: Session, first_year: int, last_year: int) -> list[Meeting]:
    """As reuniões de `first_year` a `last_year`, em ordem de data."""
    return [
        Meeting(
            year=row.year,
            number=row.number,
            first_day=row.first_day,
            second_day=row.second_day,
        )
        for row in session.scalars(
            select(CopomMeeting)
            .where(CopomMeeting.year.between(first_year, last_year))
            .order_by(CopomMeeting.year, CopomMeeting.number)
        )
    ]


def replace_meetings(
    session: Session, meetings: Sequence[Meeting], first_year: int, last_year: int
) -> None:
    """Os anos pedidos passam a ser o que a fonte devolveu, que corrige os ajustes que o
    Banco Central faz no calendário."""
    session.execute(
        delete(CopomMeeting).where(CopomMeeting.year.between(first_year, last_year))
    )
    session.add_all(
        CopomMeeting(
            year=item.year,
            number=item.number,
            first_day=item.first_day,
            second_day=item.second_day,
        )
        for item in meetings
    )
