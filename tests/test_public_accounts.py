from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.domain.coverage import month_start
from backend.domain.debt import debt_rates, implicit_rate, stabilizing_primary
from tests.data_public_accounts import (
    AUGUST,
    GDP_12M,
    NET_DEBT_BRL,
    seed_public_accounts,
)


@pytest.fixture
def seeded(session: Session) -> None:
    seed_public_accounts(session)


def test_stabilizing_primary_divides_by_growth() -> None:
    """Com dívida de 80% do PIB, r de 10% e g de 7%, o primário que estabiliza é
    0,8 * 0,03 / 1,07 = 2,24% do PIB."""
    assert round(stabilizing_primary(0.8, 0.10, 0.07) * 100, 2) == 2.24


def test_implicit_rate_is_interest_over_average_debt() -> None:
    """Juros de 8,86% do PIB de ago/2026 sobre a dívida líquida média de set/2025 a
    ago/2026 dão r = 13,74%."""
    rate = implicit_rate(0.0886, GDP_12M[1], NET_DEBT_BRL)

    assert round(rate * 100, 2) == 13.74


def test_debt_rates_need_twelve_months_of_debt() -> None:
    """Mês sem a dívida dos 11 meses anteriores ou sem o PIB do ano anterior fica de
    fora."""
    net_debt = {month_start(AUGUST, back): 100.0 for back in range(11)}
    gdp = {AUGUST: 110.0, month_start(AUGUST, 12): 100.0}

    assert debt_rates({AUGUST: 0.05}, gdp, net_debt) == []

    net_debt[month_start(AUGUST, 11)] = 100.0
    [point] = debt_rates({AUGUST: 0.05}, gdp, net_debt)
    assert point.implicit_rate == pytest.approx(0.055)
    assert point.nominal_growth == pytest.approx(0.10)


@pytest.mark.usefixtures("seeded")
def test_deficit_is_primary_plus_interest(api: TestClient) -> None:
    """Em ago/2026, 0,62% de primário mais 8,86% de juros dão os 9,48% de déficit
    nominal, e 93,5% dele é juro. Os anos trazem dezembro e o último mês."""
    body = api.get("/api/deficit").json()

    last = body["last"]
    assert last["ref_date"] == "2026-08-01"
    assert last["primary"] + last["interest"] == pytest.approx(last["nominal"])
    assert last["nominal"] == pytest.approx(0.0948)
    assert round(body["interest_share"] * 100, 1) == 93.5
    assert [point["ref_date"] for point in body["years"]] == [
        "2025-12-01",
        "2026-08-01",
    ]


@pytest.mark.usefixtures("seeded")
def test_spheres_add_up_to_the_consolidated_deficit(api: TestClient) -> None:
    """Em ago/2026, o governo central, os estados e municípios e as estatais somam
    0,61% de primário e 8,86% de juros, contra 0,62% e 8,86% do consolidado: o 0,01
    que falta é arredondamento do BCB. O nominal de cada esfera é a soma das partes."""
    body = api.get("/api/deficit").json()

    spheres = body["spheres"]
    assert [sphere["sphere"] for sphere in spheres] == [
        "central",
        "regional",
        "state_owned",
    ]
    for sphere in spheres:
        assert sphere["primary"] + sphere["interest"] == pytest.approx(
            sphere["nominal"]
        )
    last = body["last"]
    for part in ("primary", "interest", "nominal"):
        total = sum(sphere[part] for sphere in spheres)
        assert total == pytest.approx(last[part], abs=0.0002)
    assert spheres[0]["nominal"] == pytest.approx(0.0859)


@pytest.mark.usefixtures("seeded")
def test_debt_overview_computes_the_stabilizing_primary(api: TestClient) -> None:
    """Em ago/2026, r = 13,74% e g = 7,23% sobre a dívida líquida de 69,26% do PIB pedem
    4,20% do PIB de superávit; com o déficit primário de 0,62%, faltam 4,82 pontos."""
    body = api.get("/api/debt").json()

    stabilization = body["stabilization"]
    assert stabilization["ref_date"] == "2026-08-01"
    assert round(stabilization["implicit_rate"] * 100, 2) == 13.74
    assert round(stabilization["nominal_growth"] * 100, 2) == 7.23
    assert round(stabilization["stabilizing_primary"] * 100, 2) == 4.20
    assert stabilization["primary_surplus"] == pytest.approx(-0.0062)
    assert round(stabilization["primary_gap"] * 100, 2) == 4.82
    assert body["levels"] == [
        {
            "ref_date": "2026-08-01",
            "net": pytest.approx(0.6926),
            "gross": pytest.approx(0.8286),
        }
    ]


def test_public_accounts_without_cache_is_409(api: TestClient) -> None:
    """Antes da primeira atualização, as duas telas recebem 409 com a explicação."""
    deficit = api.get("/api/deficit")
    debt = api.get("/api/debt")
    federal = api.get("/api/debt/federal")

    assert deficit.status_code == 409
    assert "resultado fiscal" in deficit.json()["detail"]
    assert debt.status_code == 409
    assert "dívida pública" in debt.json()["detail"]
    assert federal.status_code == 409
    assert "dívida federal" in federal.json()["detail"]
