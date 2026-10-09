"""IPCA por forma de formação do preço como o SGS publicou, conferido em 2026-10-08:
livres (11428), administrados (4449) e serviços (10844), em % no mês, de set/2023 a
ago/2026, e a pesquisa Focus de 2/out/2026 para cada um."""

from __future__ import annotations

from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator, FocusTargetKind, SeriesId
from backend.domain.focus import Expectation
from backend.repository.focus import upsert_expectations
from backend.repository.series import upsert_observations
from tests.data_external import months_from

FREE = [-0.04, 0.34, 0.31, 0.65, 0.5, 0.81, 0.14, 0.26, 0.42, 0.16, 0.14, 0.02, 0.24, 0.5, 0.83, 0.77, 0.74, 0.68, 0.7, 0.46, 0.11, 0.11, 0.12, 0.07, 0.0, 0.17, 0.16, 0.52, 0.25, 0.89, 0.75, 0.55, 0.64, 0.11, -0.01, 0.01]  # fmt: skip
ADMINISTERED = [1.11, -0.03, 0.16, 0.31, 0.19, 0.88, 0.25, 0.74, 0.55, 0.33, 1.08, -0.12, 1.01, 0.71, -0.87, -0.17, -1.52, 3.16, 0.18, 0.35, 0.7, 0.6, 0.67, -0.61, 1.87, -0.16, 0.21, -0.22, 0.53, 0.17, 1.22, 1.0, 0.44, 0.29, 0.27, -1.25]  # fmt: skip
SERVICES = [0.5, 0.59, 0.7, 0.6, 0.02, 1.06, 0.1, 0.05, 0.4, 0.04, 0.75, 0.24, 0.15, 0.35, 0.83, 0.66, 0.78, 0.82, 0.62, 0.2, 0.18, 0.4, 0.59, 0.39, 0.13, 0.41, 0.6, 0.72, 0.1, 1.51, 0.53, 0.04, 0.4, 0.33, 0.54, 0.03]  # fmt: skip

SURVEY = date(2026, 10, 2)
# Set/2026 a set/2027: 13 meses, um além do horizonte da tela
EXPECTED_FREE = [0.3195, 0.4407, 0.3571, 0.68, 0.51, 0.75, 0.44, 0.44, 0.2405, 0.2102, 0.1923, 0.11, 0.24]  # fmt: skip
EXPECTED_ADMINISTERED = [1.31, 0.057, 0.3, 0.23, 0.32, 0.3726, 0.3, 0.46, 0.43, 0.27, 0.3651, 0.21, 0.335]  # fmt: skip
EXPECTED_SERVICES = [0.3106, 0.43, 0.41, 0.69, 0.333, 1.03, 0.3, 0.33, 0.16, 0.35, 0.45, 0.2002, 0.35]  # fmt: skip


def seed_price_cuts(session: Session) -> None:
    seeds = {
        SeriesId.FREE_PRICES: FREE,
        SeriesId.ADMINISTERED_PRICES: ADMINISTERED,
        SeriesId.SERVICES_PRICES: SERVICES,
    }
    for series_id, values in seeds.items():
        upsert_observations(session, series_id, months_from(date(2023, 9, 1), values))
    session.commit()


def seed_price_cuts_survey(session: Session) -> None:
    expected = {
        FocusIndicator.IPCA_FREE: EXPECTED_FREE,
        FocusIndicator.IPCA_ADMINISTERED: EXPECTED_ADMINISTERED,
        FocusIndicator.IPCA_SERVICES: EXPECTED_SERVICES,
    }
    upsert_expectations(
        session,
        [
            Expectation(
                indicator=indicator,
                target_kind=FocusTargetKind.MONTH,
                target_year=item.ref_date.year,
                target_period=item.ref_date.month,
                survey_date=SURVEY,
                median=item.value,
                respondents=100,
            )
            for indicator, values in expected.items()
            for item in months_from(date(2026, 9, 1), values)
        ],
    )
    session.commit()
