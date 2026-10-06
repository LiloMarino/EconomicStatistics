from __future__ import annotations

from datetime import date
from typing import Any

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete
from sqlalchemy.orm import Session

from backend.core.enum import SeriesId
from backend.core.models.models import SeriesObservation
from tests.data_2022 import MINIMUM_WAGE_2022, MINIMUM_WAGE_DEC_2021, seed_2022

YEAR_2022 = {"start": "2022-01-01", "end": "2022-12-01"}


@pytest.fixture
def seeded(session: Session) -> None:
    seed_2022(session)


def _food(groups: list[dict[str, Any]]) -> dict[str, Any]:
    return next(group for group in groups if group["series_id"] == "ipca_food")


@pytest.mark.usefixtures("seeded")
def test_groups_accumulate_the_period(api: TestClient) -> None:
    """O acumulado de 2022 compõe os 12 meses de cada grupo, e o 12 meses só aparece
    em dezembro, o único mês com os 11 anteriores no cache."""
    body = api.get("/api/inflation/groups", params=YEAR_2022).json()

    general = next(a for a in body["accumulated"] if a["series_id"] == "ipca_general")
    assert round(general["rate"] * 100, 2) == 5.78
    assert len(body["monthly"]) == 10 * 12
    assert {item["ref_date"] for item in body["rolling_12m"]} == {"2022-12-01"}


@pytest.mark.usefixtures("seeded")
def test_default_period_is_the_year_of_the_last_data(api: TestClient) -> None:
    """Sem período pedido, vale o ano do último mês com dado."""
    period = api.get("/api/inflation/groups").json()["period"]

    assert (period["start"], period["end"]) == ("2022-01-01", "2022-12-01")


@pytest.mark.usefixtures("seeded")
def test_purchasing_power_by_ipca_raise(api: TestClient) -> None:
    """Com o reajuste pelo IPCA de 2022, a comida ficou 5,24% mais cara que o salário."""
    body = api.get(
        "/api/inflation/purchasing-power", params={**YEAR_2022, "reference": "ipca"}
    ).json()

    assert round(_food(body["groups"])["change"] * 100, 2) == -5.24
    assert body["groups"][0]["series_id"] == "ipca_food"


@pytest.mark.usefixtures("seeded")
def test_minimum_wage_raise_is_point_to_point(api: TestClient) -> None:
    """O reajuste do mínimo é o valor do fim do período sobre o do mês anterior ao
    início: R$ 1.212 sobre R$ 1.100."""
    body = api.get(
        "/api/inflation/purchasing-power",
        params={**YEAR_2022, "reference": "minimum_wage"},
    ).json()

    assert body["reference_raise"] == pytest.approx(
        MINIMUM_WAGE_2022 / MINIMUM_WAGE_DEC_2021 - 1
    )


@pytest.mark.usefixtures("seeded")
def test_custom_raise_requires_a_value(api: TestClient) -> None:
    """Reajuste digitado sem valor é 422; com valor, ele é a referência."""
    missing = api.get(
        "/api/inflation/purchasing-power", params={**YEAR_2022, "reference": "custom"}
    )
    given = api.get(
        "/api/inflation/purchasing-power",
        params={**YEAR_2022, "reference": "custom", "custom_raise": 0.06},
    ).json()

    assert missing.status_code == 422
    assert given["reference_raise"] == 0.06


@pytest.mark.usefixtures("seeded")
def test_period_is_clamped_to_cached_months(api: TestClient) -> None:
    """Um período que começa antes do cache é cortado no primeiro mês com dado."""
    response = api.get(
        "/api/inflation/purchasing-power",
        params={"start": "2021-06-01", "end": "2022-12-01", "reference": "inpc"},
    )

    assert response.status_code == 200
    assert response.json()["period"]["start"] == "2022-01-01"


def test_inpc_gap_is_a_conflict(api: TestClient, session: Session) -> None:
    """Sem o INPC de algum mês do período, a referência INPC é 409, com o motivo."""
    seed_2022(session)
    session.execute(
        delete(SeriesObservation).where(
            SeriesObservation.series_id == SeriesId.INPC,
            SeriesObservation.ref_date == date(2022, 12, 1),
        )
    )
    session.commit()

    response = api.get(
        "/api/inflation/purchasing-power", params={**YEAR_2022, "reference": "inpc"}
    )

    assert response.status_code == 409
    assert "INPC" in response.json()["detail"]


def test_empty_cache_is_a_conflict(api: TestClient) -> None:
    """Antes da primeira atualização, a tela recebe 409 com a explicação."""
    response = api.get("/api/inflation/groups")

    assert response.status_code == 409
    assert "IPCA" in response.json()["detail"]
