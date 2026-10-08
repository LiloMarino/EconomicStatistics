from __future__ import annotations

from collections.abc import Collection, Iterable
from datetime import date

from sqlalchemy import func, select
from sqlalchemy.dialects.sqlite import insert
from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator, FocusTargetKind
from backend.core.models.models import FocusExpectation
from backend.domain.focus import Expectation

# O SQLite aceita até 32.766 parâmetros por comando, e cada linha usa 7
UPSERT_CHUNK = 4_000


def last_survey_date(session: Session) -> date | None:
    return session.scalar(select(func.max(FocusExpectation.survey_date)))


def survey_on_or_before(session: Session, day: date) -> date | None:
    return session.scalar(
        select(func.max(FocusExpectation.survey_date)).where(
            FocusExpectation.survey_date <= day
        )
    )


def _to_expectation(row: FocusExpectation) -> Expectation:
    return Expectation(
        indicator=row.indicator,
        target_kind=row.target_kind,
        target_year=row.target_year,
        target_period=row.target_period,
        survey_date=row.survey_date,
        median=row.median,
        respondents=row.respondents,
    )


def read_survey(
    session: Session, survey_date: date, indicators: Collection[FocusIndicator]
) -> list[Expectation]:
    """As previsões da pesquisa de `survey_date` para os indicadores pedidos, em ordem
    de período previsto."""
    return [
        _to_expectation(row)
        for row in session.scalars(
            select(FocusExpectation)
            .where(
                FocusExpectation.survey_date == survey_date,
                FocusExpectation.indicator.in_(indicators),
            )
            .order_by(FocusExpectation.target_year, FocusExpectation.target_period)
        )
    ]


def read_history(
    session: Session,
    indicator: FocusIndicator,
    kind: FocusTargetKind,
    year: int,
    period: int,
) -> list[Expectation]:
    """A previsão de um período em cada pesquisa em cache, da mais antiga à mais
    recente."""
    return [
        _to_expectation(row)
        for row in session.scalars(
            select(FocusExpectation)
            .where(
                FocusExpectation.indicator == indicator,
                FocusExpectation.target_kind == kind,
                FocusExpectation.target_year == year,
                FocusExpectation.target_period == period,
            )
            .order_by(FocusExpectation.survey_date)
        )
    ]


def upsert_expectations(session: Session, expectations: Iterable[Expectation]) -> None:
    rows = [
        {
            "indicator": item.indicator,
            "target_kind": item.target_kind,
            "target_year": item.target_year,
            "target_period": item.target_period,
            "survey_date": item.survey_date,
            "median": item.median,
            "respondents": item.respondents,
        }
        for item in expectations
    ]
    for start in range(0, len(rows), UPSERT_CHUNK):
        upsert = insert(FocusExpectation)
        upsert = upsert.on_conflict_do_update(
            index_elements=[
                FocusExpectation.indicator,
                FocusExpectation.target_kind,
                FocusExpectation.target_year,
                FocusExpectation.target_period,
                FocusExpectation.survey_date,
            ],
            set_={
                "median": upsert.excluded.median,
                "respondents": upsert.excluded.respondents,
            },
        )
        session.execute(upsert, rows[start : start + UPSERT_CHUNK])
