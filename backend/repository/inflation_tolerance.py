from __future__ import annotations

from collections.abc import Sequence

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from backend.core.models.models import InflationTolerance
from backend.domain.inflation_target import Tolerance


def read_tolerances(session: Session) -> list[Tolerance]:
    """Todos os pontos de tolerância, do mais antigo ao mais novo."""
    return [
        Tolerance(year=row.year, width=row.width)
        for row in session.scalars(
            select(InflationTolerance).order_by(InflationTolerance.year)
        )
    ]


def replace_tolerances(session: Session, items: Sequence[Tolerance]) -> None:
    """Os anos que a fonte devolveu passam a ser o que ela publica agora."""
    session.execute(
        delete(InflationTolerance).where(
            InflationTolerance.year.in_([item.year for item in items])
        )
    )
    session.add_all(
        InflationTolerance(year=item.year, width=item.width) for item in items
    )
