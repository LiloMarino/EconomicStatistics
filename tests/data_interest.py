"""A meta Selic como o SGS publicou, conferida em 2026-10-08, e a pesquisa Focus de
2/out/2026 para a Selic."""

from __future__ import annotations

from datetime import date, timedelta

from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator, FocusTargetKind, SeriesId
from backend.domain.copom import Meeting
from backend.domain.focus import Expectation
from backend.domain.series import Observation
from backend.repository.copom import replace_meetings
from backend.repository.focus import upsert_expectations
from backend.repository.series import upsert_observations

FIRST_DAY = date(2024, 9, 1)
LAST_DAY = date(2026, 10, 8)
SURVEY = date(2026, 10, 2)

# O dia em que cada meta passou a valer, em % ao ano
SELIC_CHANGES = (
    (date(2024, 9, 1), 10.5),
    (date(2024, 9, 19), 10.75),
    (date(2024, 11, 7), 11.25),
    (date(2024, 12, 12), 12.25),
    (date(2025, 1, 30), 13.25),
    (date(2025, 3, 20), 14.25),
    (date(2025, 5, 8), 14.75),
    (date(2025, 6, 19), 15.0),
    (date(2026, 3, 19), 14.75),
    (date(2026, 4, 30), 14.5),
    (date(2026, 6, 18), 14.25),
    (date(2026, 8, 6), 14.0),
    (date(2026, 9, 17), 13.75),
)

# O calendário que o Banco Central divulgou: a 7ª e a 8ª reunião de 2026 e a 1ª de 2027
MEETINGS = (
    Meeting(
        year=2026,
        number=7,
        first_day=date(2026, 11, 3),
        second_day=date(2026, 11, 4),
    ),
    Meeting(
        year=2026,
        number=8,
        first_day=date(2026, 12, 8),
        second_day=date(2026, 12, 9),
    ),
    Meeting(
        year=2027,
        number=1,
        first_day=date(2027, 1, 26),
        second_day=date(2027, 1, 27),
    ),
)


def selic_days() -> list[Observation]:
    """Um valor por dia, com a meta em vigor naquele dia."""
    days: list[Observation] = []
    day, value = FIRST_DAY, SELIC_CHANGES[0][1]
    while day <= LAST_DAY:
        value = next(v for start, v in reversed(SELIC_CHANGES) if start <= day)
        days.append(Observation(ref_date=day, value=value))
        day += timedelta(days=1)
    return days


def expectation(
    indicator: FocusIndicator,
    kind: FocusTargetKind,
    year: int,
    period: int,
    median: float,
) -> Expectation:
    return Expectation(
        indicator=indicator,
        target_kind=kind,
        target_year=year,
        target_period=period,
        survey_date=SURVEY,
        median=median,
        respondents=137,
    )


def seed_interest(session: Session) -> None:
    """A Selic diária, o calendário do Copom e a pesquisa Focus com a Selic das três
    reuniões, o IPCA de setembro e o IPCA esperado para os 12 meses seguintes."""
    upsert_observations(session, SeriesId.SELIC_TARGET, selic_days())
    replace_meetings(session, MEETINGS, 2026, 2027)
    meeting = FocusTargetKind.MEETING
    upsert_expectations(
        session,
        [
            expectation(FocusIndicator.SELIC, meeting, 2026, 7, 13.5),
            expectation(FocusIndicator.SELIC, meeting, 2026, 8, 13.25),
            expectation(FocusIndicator.SELIC, meeting, 2027, 1, 13.0),
            expectation(FocusIndicator.IPCA, FocusTargetKind.MONTH, 2026, 9, 0.4),
            expectation(FocusIndicator.IPCA, FocusTargetKind.NEXT_12M, 0, 0, 4.59),
        ],
    )
    session.commit()
