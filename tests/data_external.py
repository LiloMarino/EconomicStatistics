"""Setor externo como o BCB publicou no SGS, conferido em 2026-10-08: dólar em R$,
fluxos em % do PIB, estoques em US$ milhões. A renda primária (SGS 22801 e 22802, US$
milhões no mês) e a PTAX diária (SGS 1) foram conferidas em 2026-10-11."""

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
# A PTAX de cada dia útil de 22/set a 9/out/2026
DOLLAR_DAILY = [
    Observation(ref_date=date(2026, 9, 22), value=5.1161),
    Observation(ref_date=date(2026, 9, 23), value=5.1414),
    Observation(ref_date=date(2026, 9, 24), value=5.1795),
    Observation(ref_date=date(2026, 9, 25), value=5.1991),
    Observation(ref_date=date(2026, 9, 28), value=5.2132),
    Observation(ref_date=date(2026, 9, 29), value=5.2204),
    Observation(ref_date=date(2026, 9, 30), value=5.1809),
    Observation(ref_date=date(2026, 10, 1), value=5.2079),
    Observation(ref_date=date(2026, 10, 2), value=5.2238),
    Observation(ref_date=date(2026, 10, 5), value=4.9859),
    Observation(ref_date=date(2026, 10, 6), value=4.9698),
    Observation(ref_date=date(2026, 10, 7), value=4.9935),
    Observation(ref_date=date(2026, 10, 8), value=5.0119),
    Observation(ref_date=date(2026, 10, 9), value=4.9892),
]
# Set/2025 a ago/2026
PRIMARY_INCOME_RECEIVED = [
    3463.7,
    2998.8,
    3033.3,
    3203.6,
    3183.1,
    3572.3,
    3968.7,
    4088.5,
    3945.7,
    3785.3,
    3983.8,
    3633.6,
]
PRIMARY_INCOME_PAID = [
    10358.6,
    9201.4,
    7796.3,
    12439.5,
    11743.0,
    9111.1,
    10563.3,
    10519.0,
    9914.8,
    10656.7,
    13893.1,
    10587.1,
]
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
        SeriesId.PRIMARY_INCOME_RECEIVED: months_from(
            date(2025, 9, 1), PRIMARY_INCOME_RECEIVED
        ),
        SeriesId.PRIMARY_INCOME_PAID: months_from(
            date(2025, 9, 1), PRIMARY_INCOME_PAID
        ),
        SeriesId.DOLLAR_DAILY: DOLLAR_DAILY,
    }
    for series_id, observations in seeds.items():
        upsert_observations(session, series_id, observations)
    session.commit()
