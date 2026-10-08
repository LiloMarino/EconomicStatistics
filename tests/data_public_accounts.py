"""Contas públicas como o BCB publicou no SGS, conferidas em 2026-10-08: resultado
fiscal e dívida em % do PIB, dívida líquida e PIB de 12 meses em R$ milhões, prazo
médio em meses."""

from __future__ import annotations

from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import SeriesId
from backend.domain.coverage import month_start
from backend.domain.series import Observation
from backend.repository.series import upsert_observations

# Dez/2025 e jun a ago/2026
FISCAL_MONTHS = [
    date(2025, 12, 1),
    date(2026, 6, 1),
    date(2026, 7, 1),
    date(2026, 8, 1),
]
NOMINAL = [8.34, 9.99, 9.35, 9.48]
PRIMARY = [0.43, 1.19, 0.67, 0.62]
INTEREST = [7.91, 8.80, 8.68, 8.86]
# Ago/2026, por esfera: governo central, estados e municípios, estatais
SPHERE_PRIMARY = [0.53, 0.04, 0.04]
SPHERE_INTEREST = [8.06, 0.75, 0.05]
# Ago/2026
NET_DEBT = 69.26
GROSS_DEBT = 82.86
FEDERAL_DEBT_MATURITY = 47.99
# Set/2025 a ago/2026
NET_DEBT_BRL = [
    8086898.56,
    8143222.99,
    8247893.98,
    8311085.76,
    8317673.26,
    8420420.92,
    8643008.17,
    8752452.15,
    8897707.45,
    9034467.55,
    9165162.67,
    9240949.79,
]
# Ago/2025 e ago/2026
GDP_12M = [12442688.7, 13342452.6]

AUGUST = date(2026, 8, 1)


def _months(start: date, values: list[float]) -> list[Observation]:
    return [
        Observation(ref_date=month_start(start, -n), value=value)
        for n, value in enumerate(values)
    ]


def seed_public_accounts(session: Session) -> None:
    fiscal = {
        SeriesId.NOMINAL_DEFICIT: NOMINAL,
        SeriesId.PRIMARY_DEFICIT: PRIMARY,
        SeriesId.NOMINAL_INTEREST: INTEREST,
    }
    for series_id, values in fiscal.items():
        upsert_observations(
            session,
            series_id,
            [
                Observation(ref_date=ref_date, value=value)
                for ref_date, value in zip(FISCAL_MONTHS, values, strict=True)
            ],
        )
    spheres = zip(
        (
            SeriesId.PRIMARY_DEFICIT_CENTRAL,
            SeriesId.PRIMARY_DEFICIT_REGIONAL,
            SeriesId.PRIMARY_DEFICIT_STATE_OWNED,
            SeriesId.NOMINAL_INTEREST_CENTRAL,
            SeriesId.NOMINAL_INTEREST_REGIONAL,
            SeriesId.NOMINAL_INTEREST_STATE_OWNED,
        ),
        [*SPHERE_PRIMARY, *SPHERE_INTEREST],
        strict=True,
    )
    for series_id, value in spheres:
        upsert_observations(
            session, series_id, [Observation(ref_date=AUGUST, value=value)]
        )
    upsert_observations(
        session, SeriesId.NET_DEBT, [Observation(ref_date=AUGUST, value=NET_DEBT)]
    )
    upsert_observations(
        session, SeriesId.GROSS_DEBT, [Observation(ref_date=AUGUST, value=GROSS_DEBT)]
    )
    upsert_observations(
        session, SeriesId.NET_DEBT_BRL, _months(date(2025, 9, 1), NET_DEBT_BRL)
    )
    upsert_observations(
        session,
        SeriesId.GDP_12M,
        [
            Observation(ref_date=date(2025, 8, 1), value=GDP_12M[0]),
            Observation(ref_date=AUGUST, value=GDP_12M[1]),
        ],
    )
    upsert_observations(
        session,
        SeriesId.FEDERAL_DEBT_MATURITY,
        [Observation(ref_date=AUGUST, value=FEDERAL_DEBT_MATURITY)],
    )
    session.commit()
