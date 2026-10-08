"""Setor externo como o BCB publicou no SGS, conferido em 2026-10-08: dólar em R$,
fluxos em % do PIB, estoques em US$ milhões."""

from __future__ import annotations

from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import SeriesId
from backend.domain.series import Observation
from backend.repository.series import upsert_observations

# PTAX do fim do mês de set/2025 a set/2026
DOLLAR = [
    5.3186,
    5.3843,
    5.3338,
    5.5024,
    5.2301,
    5.1495,
    5.2194,
    4.9886,
    5.0569,
    5.1766,
    5.0773,
    5.1816,
    5.1809,
]
# Jun a ago/2026
CURRENT_ACCOUNT = [-2.37, -2.44, -2.47]
FDI = [3.53, 3.44, 3.39]
# Mar a ago/2026
GDP_USD_12M = [2382050.0, 2424828.0, 2464614.0, 2496575.0, 2526193.0, 2553857.0]
# Jul a set/2026
RESERVES = [369742.0, 372616.0, 362821.0]
# 1º e 2º trimestres de 2026
IIP_ASSETS = [1131060.0, 1148721.0]
IIP_LIABILITIES = [2460430.0, 2461469.0]


def months_from(start: date, values: list[float], step: int = 1) -> list[Observation]:
    observations: list[Observation] = []
    for index, value in enumerate(values):
        month = start.month - 1 + index * step
        ref_date = date(start.year + month // 12, month % 12 + 1, 1)
        observations.append(Observation(ref_date=ref_date, value=value))
    return observations


def seed_external(session: Session) -> None:
    seeds = {
        SeriesId.DOLLAR_MONTH_END: months_from(date(2025, 9, 1), DOLLAR),
        SeriesId.CURRENT_ACCOUNT_GDP: months_from(date(2026, 6, 1), CURRENT_ACCOUNT),
        SeriesId.FDI_GDP: months_from(date(2026, 6, 1), FDI),
        SeriesId.GDP_USD_12M: months_from(date(2026, 3, 1), GDP_USD_12M),
        SeriesId.RESERVES: months_from(date(2026, 7, 1), RESERVES),
        SeriesId.IIP_ASSETS: months_from(date(2026, 1, 1), IIP_ASSETS, step=3),
        SeriesId.IIP_LIABILITIES: months_from(
            date(2026, 1, 1), IIP_LIABILITIES, step=3
        ),
    }
    for series_id, observations in seeds.items():
        upsert_observations(session, series_id, observations)
    session.commit()
