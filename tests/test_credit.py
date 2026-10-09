from __future__ import annotations

from datetime import date

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.domain.basel import basel_ratios
from backend.domain.series import Observation
from tests.data_credit import seed_credit


@pytest.fixture
def seeded(session: Session) -> None:
    seed_credit(session)


@pytest.mark.usefixtures("seeded")
def test_cost_pairs_the_credit_cost_with_the_selic_at_the_end_of_each_month(
    api: TestClient,
) -> None:
    """Em ago/2026 o ICC é 24,19% e a meta Selic, em vigor desde 6/ago, 14,00%: o
    spread é de 10,19 pontos percentuais."""
    cost = api.get("/api/credit").json()["cost"]

    assert cost["months"][-1] == {
        "ref_date": "2026-08-01",
        "cost": pytest.approx(0.2419),
        "selic": pytest.approx(0.14),
    }
    assert cost["spread"] == pytest.approx(0.1019)


@pytest.mark.usefixtures("seeded")
def test_cost_shows_the_last_24_months(api: TestClient) -> None:
    """Dos 25 meses em cache, o gráfico começa em set/2024 e termina em ago/2026."""
    months = api.get("/api/credit").json()["cost"]["months"]

    assert len(months) == 24
    assert months[0]["ref_date"] == "2024-09-01"
    assert months[0]["selic"] == pytest.approx(0.1075)


@pytest.mark.usefixtures("seeded")
def test_concessions_compare_the_last_12_months_sum_with_the_12_before(
    api: TestClient,
) -> None:
    """A soma de set/2025 a ago/2026 sobre a de set/2024 a ago/2025 dá +11,55% para as
    empresas e +12,86% para as famílias em ago/2026; o mês anterior só tem os 23
    anteriores e dá +9,41% e +11,54%."""
    concessions = api.get("/api/credit").json()["concessions"]

    assert [item["ref_date"] for item in concessions["business"]] == [
        "2026-07-01",
        "2026-08-01",
    ]
    assert [item["value"] for item in concessions["business"]] == [
        pytest.approx(0.09409, abs=5e-6),
        pytest.approx(0.11551, abs=5e-6),
    ]
    assert [item["value"] for item in concessions["households"]] == [
        pytest.approx(0.1154, abs=5e-6),
        pytest.approx(0.12862, abs=5e-6),
    ]


@pytest.mark.usefixtures("seeded")
def test_basel_divides_the_capital_by_the_risk_weighted_assets(api: TestClient) -> None:
    """Cada trimestre, datado no último mês dele, é o patrimônio de referência sobre os
    ativos ponderados pelo risco: 17,33% em dez/2025 e 16,98% em jun/2026, contra o
    mínimo de 8% e de 10,5% com o adicional de conservação."""
    basel = api.get("/api/credit").json()["basel"]

    by_quarter = {item["ref_date"]: item["value"] for item in basel["quarters"]}
    assert len(by_quarter) == 8
    assert basel["quarters"][0]["ref_date"] == "2024-09-01"
    assert by_quarter["2025-12-01"] == pytest.approx(0.1733, abs=5e-5)
    assert by_quarter["2026-06-01"] == pytest.approx(0.1698, abs=5e-5)
    assert basel["minimum"] == pytest.approx(0.08)
    assert basel["minimum_with_buffer"] == pytest.approx(0.105)


def test_basel_skips_a_quarter_without_both_accounts() -> None:
    """Trimestre com o patrimônio e sem os ativos ponderados fica de fora."""
    capital = [
        Observation(ref_date=date(2026, 1, 1), value=17.0),
        Observation(ref_date=date(2026, 4, 1), value=18.0),
    ]
    risk_weighted = [Observation(ref_date=date(2026, 1, 1), value=100.0)]

    ratios = basel_ratios(capital, risk_weighted)

    assert [(item.ref_date, item.ratio) for item in ratios] == [
        (date(2026, 1, 1), pytest.approx(0.17))
    ]


def test_credit_without_cache_is_409(api: TestClient) -> None:
    """Antes da primeira atualização, a tela recebe 409 com a explicação."""
    response = api.get("/api/credit")

    assert response.status_code == 409
    assert "crédito" in response.json()["detail"]
