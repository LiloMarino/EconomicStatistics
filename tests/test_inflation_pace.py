from __future__ import annotations

from datetime import date
from typing import Any

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.domain.inflation_target import target_bands
from backend.domain.series import Observation
from tests.data_ipca import TOLERANCES, seed_ipca

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
def test_pace_band_follows_the_target_of_each_year(api: TestClient) -> None:
    """Em 2025 e 2026, a meta é 3% com limites de 1,5% e 4,5%."""
    body = api.get("/api/inflation/pace", params=AUG_2026).json()

    assert body["band"] == {
        "target": pytest.approx(0.03),
        "floor": pytest.approx(0.015),
        "ceiling": pytest.approx(0.045),
    }
    assert {
        (round(point["band"]["floor"], 4), round(point["band"]["ceiling"], 4))
        for point in body["general_12m"]
    } == {(0.015, 0.045)}


def test_tolerance_changes_with_the_period() -> None:
    """Em 2015, meta de 4,5% com limites de 2,5% e 6,5%; em 2004, a meta ajustada de
    5,5% com 2,5 pontos para cada lado; em 2026, 3% com 1,5% e 4,5%."""
    targets = [
        Observation(ref_date=date(2004, 1, 1), value=5.5),
        Observation(ref_date=date(2015, 1, 1), value=4.5),
        Observation(ref_date=date(2026, 1, 1), value=3.0),
    ]

    bands = target_bands(targets, (2004, 2015, 2026), TOLERANCES)

    assert [
        (
            year,
            round(band.floor * 100, 2),
            round(band.target * 100, 2),
            round(band.ceiling * 100, 2),
        )
        for year, band in bands.items()
    ] == [(2004, 3.0, 5.5, 8.0), (2015, 2.5, 4.5, 6.5), (2026, 1.5, 3.0, 4.5)]


def test_continuous_target_holds_after_the_last_published_year() -> None:
    """A meta contínua, desde 2025, segue valendo nos anos que a série ainda não
    publicou; antes dela, ano sem meta publicada fica sem faixa."""
    continuous = target_bands(
        [Observation(ref_date=date(2026, 1, 1), value=3.0)], (2027, 2028), TOLERANCES
    )
    calendar = target_bands(
        [Observation(ref_date=date(2018, 1, 1), value=4.5)], (2019,), TOLERANCES
    )

    assert [round(band.ceiling, 3) for band in continuous.values()] == [0.045, 0.045]
    assert calendar == {}


@pytest.mark.usefixtures("seeded")
def test_pace_compares_each_group_with_months_before(api: TestClient) -> None:
    """Habitação foi de 6,24% (mai/2026) para 4,91% (ago/2026) em 12 meses."""
    body = api.get("/api/inflation/pace", params=AUG_2026).json()

    housing = _group(body["groups"], "ipca_housing")
    three_months = next(item for item in housing["windows"] if item["months"] == 3)
    assert round(three_months["rolling_12m_before"] * 100, 2) == 6.24
    assert round(housing["rolling_12m"] * 100, 2) == 4.91
    assert round(three_months["change"] * 100, 2) == -1.33
    assert round(three_months["relative_change"] * 100) == -21


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
