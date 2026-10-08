from __future__ import annotations

from datetime import date

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete
from sqlalchemy.orm import Session

from backend.core.models.models import FocusExpectation
from backend.domain.rates import index_change_12m
from tests.data_activity import IBC_BR, seed_activity, seed_activity_survey
from tests.data_external import months_from


def test_index_change_compares_the_last_12_months_average_with_the_12_before() -> None:
    """A média do IBC-Br de ago/2025 a jul/2026 sobre a de ago/2024 a jul/2025 dá
    +1,48% em jul/2026."""
    changes = index_change_12m(months_from(date(2024, 8, 1), IBC_BR))

    assert [item.ref_date for item in changes] == [date(2026, 7, 1)]
    assert round(changes[0].rate * 100, 2) == 1.48


def test_index_change_skips_months_without_the_23_before() -> None:
    """Com um mês faltando na janela, o 12 meses daquele mês não é calculado."""
    index = months_from(date(2024, 8, 1), IBC_BR)
    del index[5]

    assert index_change_12m(index) == []


def test_flat_index_has_no_change() -> None:
    """Índice parado em 100 durante 24 meses não varia."""
    flat = months_from(date(2024, 8, 1), [100.0] * 24)

    assert index_change_12m(flat)[0].rate == 0.0


@pytest.fixture
def seeded(session: Session) -> None:
    seed_activity(session)
    seed_activity_survey(session)


@pytest.mark.usefixtures("seeded")
def test_activity_reads_each_chart_until_its_last_data(api: TestClient) -> None:
    """O PIB do 2º tri/2026 (1,9%) fica no mês em que o trimestre termina, o IBC-Br dá
    1,48% em jul/2026 e a desocupação de ago/2026 (5,3%) caiu 0,3 ponto contra ago/2025
    (5,6%)."""
    body = api.get("/api/activity").json()

    assert body["gdp"]["quarters"][-1] == {
        "ref_date": "2026-06-01",
        "value": pytest.approx(0.019),
    }
    assert [item["ref_date"] for item in body["gdp"]["quarters"]] == [
        "2025-03-01",
        "2025-06-01",
        "2025-09-01",
        "2025-12-01",
        "2026-03-01",
        "2026-06-01",
    ]
    assert body["ibc"]["months"] == [
        {"ref_date": "2026-07-01", "value": pytest.approx(0.0148, abs=5e-5)}
    ]
    unemployment = body["unemployment"]
    assert unemployment["months"][-1] == {
        "ref_date": "2026-08-01",
        "value": pytest.approx(0.053),
    }
    assert unemployment["change_12m"] == pytest.approx(-0.003)


@pytest.mark.usefixtures("seeded")
def test_activity_forecast_comes_from_the_latest_focus_survey(api: TestClient) -> None:
    """O PIB esperado vem em dezembro de 2026 e de 2027, e a desocupação, mês a mês,
    depois de ago/2026 e até dez/2027: jan/2028 fica de fora."""
    body = api.get("/api/activity").json()

    assert body["gdp"]["forecast"] == {
        "survey_date": "2026-10-02",
        "months": [
            {"ref_date": "2026-12-01", "value": pytest.approx(0.018549)},
            {"ref_date": "2027-12-01", "value": pytest.approx(0.014)},
        ],
    }
    expected = body["unemployment"]["forecast"]
    assert expected["survey_date"] == "2026-10-02"
    assert [item["ref_date"] for item in expected["months"]] == [
        "2026-09-01",
        "2026-10-01",
        "2026-12-01",
        "2027-01-01",
    ]


@pytest.mark.usefixtures("seeded")
def test_activity_without_survey_has_no_forecast(
    api: TestClient, session: Session
) -> None:
    """Sem pesquisa Focus em cache, as duas previsões são nulas."""
    session.execute(delete(FocusExpectation))
    session.commit()

    body = api.get("/api/activity").json()

    assert body["gdp"]["forecast"] is None
    assert body["unemployment"]["forecast"] is None


def test_activity_without_cache_is_409(api: TestClient) -> None:
    """Antes da primeira atualização, a tela recebe 409 com a explicação."""
    response = api.get("/api/activity")

    assert response.status_code == 409
    assert "atividade" in response.json()["detail"]
