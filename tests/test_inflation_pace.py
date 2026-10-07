from __future__ import annotations

from typing import Any

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from tests.data_ipca import seed_ipca

AUG_2026 = {"end": "2026-08-01"}


@pytest.fixture
def seeded(session: Session) -> None:
    seed_ipca(session)


def _group(groups: list[dict[str, Any]], series_id: str) -> dict[str, Any]:
    return next(group for group in groups if group["series_id"] == series_id)


@pytest.mark.usefixtures("seeded")
def test_pace_in_august_2026_is_slowing(api: TestClient) -> None:
    """Em ago/2026 entrou -0,32% e saiu -0,11% (ago/2025): o 12 meses caiu de 4,44%
    para 4,22%, e em 3 meses caiu 0,50 p.p., o que dá "freando"."""
    body = api.get("/api/inflation/pace", params=AUG_2026).json()

    last = body["last_months"][-1]
    assert (round(last["rate"] * 100, 2), round(last["year_before"] * 100, 2)) == (
        -0.32,
        -0.11,
    )
    rolling = [round(point["rate"] * 100, 2) for point in body["general_12m"]]
    assert rolling[-2:] == [4.44, 4.22]
    assert len(rolling) == 24
    assert round(body["change_3m"] * 100, 2) == -0.50
    assert body["verdict"] == "slowing"


@pytest.mark.usefixtures("seeded")
def test_pace_ceiling_follows_the_target_of_each_year(api: TestClient) -> None:
    """O teto é a meta do ano mais 1,5 ponto: 4,5% em 2025 e 2026."""
    body = api.get("/api/inflation/pace", params=AUG_2026).json()

    assert body["ceiling"] == pytest.approx(0.045)
    assert {round(point["ceiling"], 4) for point in body["general_12m"]} == {0.045}


@pytest.mark.usefixtures("seeded")
def test_pace_compares_each_group_with_months_before(api: TestClient) -> None:
    """Habitação foi de 6,24% (mai/2026) para 4,91% (ago/2026) em 12 meses."""
    body = api.get("/api/inflation/pace", params=AUG_2026).json()

    housing = _group(body["groups"], "ipca_housing")
    assert round(housing["months_before_3"] * 100, 2) == 6.24
    assert round(housing["rolling_12m"] * 100, 2) == 4.91


@pytest.mark.usefixtures("seeded")
def test_pace_needs_fifteen_months(api: TestClient) -> None:
    """Sem 15 meses antes do fim, o ritmo é 409 com o motivo."""
    response = api.get("/api/inflation/pace", params={"end": "2020-12-01"})

    assert response.status_code == 409


@pytest.mark.usefixtures("seeded")
def test_seasonality_compares_with_five_previous_years(api: TestClient) -> None:
    """Educação em fev/2026 subiu 5,21%; a média dos fevereiros de 2021 a 2025 é
    4,81%."""
    body = api.get("/api/inflation/seasonality", params={"year": 2026}).json()

    assert body["years_compared"] == [2021, 2022, 2023, 2024, 2025]
    education = _group(body["groups"], "ipca_education")
    february = education["bands"][1]
    assert round(february["mean"] * 100, 2) == 4.81
    assert round(education["months"][1]["rate"] * 100, 2) == 5.21


@pytest.mark.usefixtures("seeded")
def test_accumulated_carries_the_simple_sum(api: TestClient) -> None:
    """O acumulado de Educação de jan a ago/2026 compõe 5,76%; a soma simples dá 5,73%."""
    body = api.get(
        "/api/inflation/groups", params={"start": "2026-01-01", "end": "2026-08-01"}
    ).json()

    education = _group(body["accumulated"], "ipca_education")
    assert round(education["rate"] * 100, 2) == 5.76
    assert round(education["simple_sum"] * 100, 2) == 5.73


@pytest.mark.usefixtures("seeded")
def test_purchasing_power_lists_every_reference(api: TestClient) -> None:
    """Os cartões recebem o reajuste de cada referência; sem INPC e salário mínimo no
    cache, eles vêm vazios, e o grupo traz a subtração para contraste."""
    body = api.get(
        "/api/inflation/purchasing-power",
        params={"start": "2026-01-01", "end": "2026-08-01", "reference": "ipca"},
    ).json()

    references = {item["reference"]: item["rate"] for item in body["references"]}
    assert round(references["ipca"] * 100, 2) == 3.11
    assert references["inpc"] is None
    assert references["minimum_wage"] is None
    education = _group(body["groups"], "ipca_education")
    assert round(education["change"] * 100, 2) == -2.51
    assert round(education["naive_change"] * 100, 2) == -2.65
