from __future__ import annotations

from datetime import date

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.domain.external import international_position
from backend.domain.gdp import share_of_gdp
from backend.domain.series import Observation
from tests.data_external import (
    DOLLAR,
    GDP_USD_12M,
    IIP_ASSETS,
    IIP_LIABILITIES,
    RESERVES,
    seed_external,
)


@pytest.fixture
def seeded(session: Session) -> None:
    seed_external(session)


def test_share_of_gdp_divides_by_the_12_month_gdp() -> None:
    """As reservas de ago/2026 sobre o PIB de 12 meses do mesmo mês dão 14,59%."""
    assert round(share_of_gdp(RESERVES[1], GDP_USD_12M[-1]) * 100, 2) == 14.59


def test_position_uses_the_gdp_of_the_quarter_last_month() -> None:
    """O estoque do 2º trimestre (datado em abril) se mede contra o PIB de junho, e o
    saldo é ativo menos passivo."""
    quarter = date(2026, 4, 1)
    points = international_position(
        [Observation(ref_date=quarter, value=IIP_ASSETS[1])],
        [Observation(ref_date=quarter, value=IIP_LIABILITIES[1])],
        {date(2026, 6, 1): GDP_USD_12M[3]},
    )

    assert len(points) == 1
    assert round(points[0].assets * 100, 2) == 46.01
    assert round(points[0].liabilities * 100, 2) == 98.59
    assert round(points[0].net * 100, 2) == -52.58


def test_position_skips_quarter_without_gdp() -> None:
    """Trimestre sem o PIB do último mês dele fica de fora."""
    quarter = date(2026, 4, 1)
    points = international_position(
        [Observation(ref_date=quarter, value=IIP_ASSETS[1])],
        [Observation(ref_date=quarter, value=IIP_LIABILITIES[1])],
        {date(2026, 5, 1): GDP_USD_12M[2]},
    )

    assert points == []


@pytest.mark.usefixtures("seeded")
def test_external_sector_reads_each_chart_until_its_last_data(api: TestClient) -> None:
    """O dólar do fim de setembro cai 2,59% contra o de set/2025; os fluxos saem em fração
    do PIB; as reservas usam o PIB de agosto, o último publicado; e a posição traz um
    ponto por ano, o trimestre mais recente."""
    body = api.get("/api/external-sector").json()

    dollar = body["dollar"]
    assert dollar["months"][-1] == {"ref_date": "2026-09-01", "value": DOLLAR[-1]}
    assert round(dollar["change_12m"] * 100, 2) == -2.59
    assert body["flows"][-1] == {
        "ref_date": "2026-08-01",
        "current_account": pytest.approx(-0.0247),
        "fdi": pytest.approx(0.0339),
    }
    assert body["reserves"]["months"][-1]["value"] == RESERVES[-1]
    assert body["reserves"]["gdp_share"]["ref_date"] == "2026-08-01"
    assert [point["ref_date"] for point in body["position"]] == ["2026-04-01"]


def test_external_sector_without_cache_is_409(api: TestClient) -> None:
    """Antes da primeira atualização, a tela recebe 409 com a explicação."""
    response = api.get("/api/external-sector")

    assert response.status_code == 409
    assert "setor externo" in response.json()["detail"]
