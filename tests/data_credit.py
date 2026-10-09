"""Crédito como o SGS publicou, conferido em 2026-10-08: custo do crédito (ICC, SGS
25351, % ao ano) e concessões de recursos livres em R$ milhões, de pessoas jurídicas
(SGS 20635) e de pessoas físicas sem o rotativo (SGS 20663). Todas de ago/2024 a
ago/2026."""

from __future__ import annotations

from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import SeriesId
from backend.repository.series import upsert_observations
from tests.data_external import months_from
from tests.data_interest import selic_days

CREDIT_COST = [
    21.67,
    21.73,
    21.65,
    21.66,
    21.48,
    21.99,
    22.28,
    22.55,
    22.87,
    22.98,
    23.18,
    23.21,
    23.39,
    23.51,
    23.67,
    23.78,
    23.48,
    23.91,
    24.22,
    24.10,
    24.28,
    24.24,
    24.17,
    24.06,
    24.19,
]
CONCESSIONS_BUSINESS = [
    251326.0,
    268535.0,
    257931.0,
    253835.0,
    311236.0,
    238026.0,
    237622.0,
    259942.0,
    263693.0,
    271733.0,
    265060.0,
    255204.0,
    243240.0,
    282906.0,
    265797.0,
    246563.0,
    353509.0,
    261866.0,
    251477.0,
    314922.0,
    289643.0,
    292813.0,
    329978.0,
    296326.0,
    301349.0,
]
CONCESSIONS_HOUSEHOLDS = [
    64241.0,
    62346.0,
    66717.0,
    58566.0,
    57946.0,
    63163.0,
    58002.0,
    58445.0,
    63030.0,
    58612.0,
    58169.0,
    64440.0,
    63006.0,
    71037.0,
    73321.0,
    62533.0,
    68178.0,
    68289.0,
    62973.0,
    75850.0,
    69388.0,
    64825.0,
    67393.0,
    71551.0,
    71311.0,
]


def seed_credit(session: Session) -> None:
    """As três séries de crédito e a Selic diária que o spread desconta do custo."""
    start = date(2024, 8, 1)
    seeds = {
        SeriesId.CREDIT_COST: months_from(start, CREDIT_COST),
        SeriesId.CONCESSIONS_BUSINESS: months_from(start, CONCESSIONS_BUSINESS),
        SeriesId.CONCESSIONS_HOUSEHOLDS: months_from(start, CONCESSIONS_HOUSEHOLDS),
        SeriesId.SELIC_TARGET: selic_days(),
    }
    for series_id, observations in seeds.items():
        upsert_observations(session, series_id, observations)
    session.commit()
