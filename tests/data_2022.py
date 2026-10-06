"""IPCA, INPC e salário mínimo de 2022 como o IBGE e o BCB publicaram (% no mês, R$)."""

from __future__ import annotations

from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import SeriesId
from backend.domain.series import IPCA_GROUPS, Observation
from backend.repository.series import upsert_observations

IPCA_GENERAL_2022 = [
    0.54,
    1.01,
    1.62,
    1.06,
    0.47,
    0.67,
    -0.68,
    -0.36,
    -0.29,
    0.59,
    0.41,
    0.62,
]
IPCA_FOOD_2022 = [
    1.11,
    1.28,
    2.42,
    2.06,
    0.48,
    0.80,
    1.30,
    0.24,
    -0.51,
    0.72,
    0.53,
    0.66,
]
INPC_2022 = [0.67, 1.00, 1.71, 1.04, 0.45, 0.62, -0.60, -0.31, -0.32, 0.47, 0.38, 0.69]
MINIMUM_WAGE_DEC_2021 = 1100.0
MINIMUM_WAGE_2022 = 1212.0


def months_2022(values: list[float]) -> list[Observation]:
    return [
        Observation(ref_date=date(2022, month, 1), value=value)
        for month, value in enumerate(values, start=1)
    ]


def seed_2022(session: Session) -> None:
    """Os grupos que não são Alimentação repetem o índice geral."""
    upsert_observations(session, SeriesId.IPCA_GENERAL, months_2022(IPCA_GENERAL_2022))
    for group in IPCA_GROUPS:
        values = IPCA_FOOD_2022 if group is SeriesId.IPCA_FOOD else IPCA_GENERAL_2022
        upsert_observations(session, group, months_2022(values))
    upsert_observations(session, SeriesId.INPC, months_2022(INPC_2022))
    upsert_observations(
        session,
        SeriesId.MINIMUM_WAGE,
        [
            Observation(ref_date=date(2021, 12, 1), value=MINIMUM_WAGE_DEC_2021),
            *months_2022([MINIMUM_WAGE_2022] * 12),
        ],
    )
    session.commit()
