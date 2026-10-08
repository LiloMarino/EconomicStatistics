"""Atividade como as fontes publicaram, conferida em 2026-10-08: PIB em 4 trimestres (%,
IBGE), índice do IBC-Br (SGS 24363) e taxa de desocupação (SGS 24369, %)."""

from __future__ import annotations

from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator, FocusTargetKind, SeriesId
from backend.domain.focus import Expectation
from backend.repository.focus import upsert_expectations
from backend.repository.series import upsert_observations
from tests.data_external import months_from

# 1º tri/2025 ao 2º tri/2026 (6 trimestres, datados no 1º dia de cada um)
GDP_GROWTH_4Q = [3.6, 3.3, 2.7, 2.3, 2.0, 1.9]
# Ago/2024 a jul/2026
IBC_BR = [
    110.06254,
    107.07852,
    109.18379,
    105.49006,
    104.15552,
    102.62949,
    106.82599,
    114.02067,
    112.59512,
    108.55704,
    107.36219,
    113.10928,
    110.38054,
    109.48375,
    110.07682,
    106.59892,
    107.18417,
    103.77761,
    106.76075,
    118.01719,
    113.99295,
    109.65479,
    109.94156,
    114.40189,
]
# Ago/2025 a ago/2026
UNEMPLOYMENT = [5.6, 5.6, 5.4, 5.2, 5.1, 5.4, 5.8, 6.1, 5.8, 5.6, 5.4, 5.3, 5.3]

SURVEY = date(2026, 10, 2)


def seed_activity(session: Session) -> None:
    seeds = {
        SeriesId.GDP_GROWTH_4Q: months_from(date(2025, 1, 1), GDP_GROWTH_4Q, step=3),
        SeriesId.IBC_BR: months_from(date(2024, 8, 1), IBC_BR),
        SeriesId.UNEMPLOYMENT_RATE: months_from(date(2025, 8, 1), UNEMPLOYMENT),
    }
    for series_id, observations in seeds.items():
        upsert_observations(session, series_id, observations)
    session.commit()


def _expectation(
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
        respondents=100,
    )


def seed_activity_survey(session: Session) -> None:
    """A pesquisa Focus de 2/out/2026: PIB de 2026 e 2027, e a desocupação de set/2026
    a jan/2027 e de jan/2028, que fica depois do horizonte da tela."""
    gdp = FocusIndicator.GDP
    unemployment = FocusIndicator.UNEMPLOYMENT
    year, month = FocusTargetKind.YEAR, FocusTargetKind.MONTH
    upsert_expectations(
        session,
        [
            _expectation(gdp, year, 2026, 0, 1.8549),
            _expectation(gdp, year, 2027, 0, 1.4),
            _expectation(unemployment, month, 2026, 9, 5.305),
            _expectation(unemployment, month, 2026, 10, 5.3),
            _expectation(unemployment, month, 2026, 12, 5.3),
            _expectation(unemployment, month, 2027, 1, 5.6),
            _expectation(unemployment, month, 2028, 1, 6.0),
        ],
    )
    session.commit()
