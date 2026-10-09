from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete
from sqlalchemy.orm import Session

from backend.core.models.models import FocusExpectation
from tests.data_price_cuts import seed_price_cuts, seed_price_cuts_survey


@pytest.fixture
def seeded(session: Session) -> None:
    seed_price_cuts(session)
    seed_price_cuts_survey(session)


@pytest.mark.usefixtures("seeded")
def test_price_cuts_compose_12_months_for_the_last_24_months(api: TestClient) -> None:
    """Os 12 meses de ago/2026 compõem os meses de set/2025 a ago/2026: livres 4,11%,
    administrados 4,42% e serviços 5,46%. A tela recebe os 24 últimos pontos, de set/2024 a ago/2026."""
    body = api.get("/api/price-cuts").json()

    assert len(body["free"]["months"]) == 24
    assert body["free"]["months"][0]["ref_date"] == "2024-09-01"
    assert body["free"]["months"][-1]["ref_date"] == "2026-08-01"
    assert body["free"]["months"][-1]["value"] == pytest.approx(0.0411, abs=5e-5)
    assert body["administered"]["months"][-1]["value"] == pytest.approx(
        0.0442, abs=5e-5
    )
    assert body["services"]["months"][-1]["value"] == pytest.approx(0.0546, abs=5e-5)


@pytest.mark.usefixtures("seeded")
def test_price_cuts_forecast_continues_each_line_for_12_months(api: TestClient) -> None:
    """A pesquisa de 2/out/2026 compõe set/2026 em diante com os meses reais: o 12 meses
    de set/2026 é 4,44% nos livres, 3,85% nos administrados e 5,65% nos serviços, e a
    previsão para em ago/2027, mesmo com a pesquisa trazendo set/2027."""
    body = api.get("/api/price-cuts").json()

    free = body["free"]["forecast"]
    assert free["survey_date"] == "2026-10-02"
    assert free["months"][0]["ref_date"] == "2026-09-01"
    assert free["months"][-1]["ref_date"] == "2027-08-01"
    assert len(free["months"]) == 12
    assert free["months"][0]["value"] == pytest.approx(0.0444, abs=5e-5)
    assert body["administered"]["forecast"]["months"][0]["value"] == pytest.approx(
        0.0385, abs=5e-5
    )
    assert body["services"]["forecast"]["months"][0]["value"] == pytest.approx(
        0.0565, abs=5e-5
    )


@pytest.mark.usefixtures("seeded")
def test_price_cuts_without_survey_have_no_forecast(
    api: TestClient, session: Session
) -> None:
    """Sem pesquisa Focus em cache, as três previsões são nulas."""
    session.execute(delete(FocusExpectation))
    session.commit()

    body = api.get("/api/price-cuts").json()

    assert body["free"]["forecast"] is None
    assert body["administered"]["forecast"] is None
    assert body["services"]["forecast"] is None


def test_price_cuts_without_cache_is_409(api: TestClient) -> None:
    """Antes da primeira atualização, a tela recebe 409 com a explicação."""
    response = api.get("/api/price-cuts")

    assert response.status_code == 409
    assert "forma de formação do preço" in response.json()["detail"]
