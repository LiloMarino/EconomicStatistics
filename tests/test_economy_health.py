"""A tela Saúde da economia: dois sinais com semáforo e os demais com o número."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from tests.data_activity import seed_activity, seed_activity_survey
from tests.data_external import seed_external
from tests.data_interest import seed_interest
from tests.data_ipca import seed_ipca
from tests.data_public_accounts import seed_public_accounts


@pytest.fixture
def seeded(session: Session) -> None:
    seed_ipca(session)
    seed_interest(session)
    seed_public_accounts(session)
    seed_activity(session)
    seed_activity_survey(session)
    seed_external(session)


@pytest.mark.usefixtures("seeded")
def test_inflation_strip_shows_the_last_24_months_with_the_letter_rule(
    api: TestClient,
) -> None:
    """De set/2024 a ago/2026 são 24 meses. O IPCA fica fora da faixa de 1,5% a 4,5% de
    out/2024 a out/2025: amarelo até fev/2025, vermelho do 6º mês seguido (mar/2025).
    Volta para dentro em nov/2025 e, em ago/2026, está dentro (4,22%)."""
    inflation = api.get("/api/economy-health").json()["inflation"]
    strip = {cell["ref_date"]: cell for cell in inflation["strip"]}

    assert len(inflation["strip"]) == 24
    assert inflation["strip"][0]["ref_date"] == "2024-09-01"
    assert strip["2025-02-01"]["lamp"] == "yellow"
    assert strip["2025-03-01"]["lamp"] == "red"
    assert strip["2025-10-01"]["months_out"] == 13
    assert strip["2025-11-01"]["lamp"] == "green"
    assert strip["2026-05-01"]["lamp"] == "yellow"
    assert inflation["lamp"] == "green"
    assert round(inflation["rate"] * 100, 2) == 4.22
    assert inflation["band"] == pytest.approx(
        {"target": 0.03, "floor": 0.015, "ceiling": 0.045}
    )


@pytest.mark.usefixtures("seeded")
def test_primary_is_red_when_it_does_not_cover_the_stabilizing_one(
    api: TestClient,
) -> None:
    """Em ago/2026 o primário foi déficit de 0,62% do PIB, abaixo do que estabiliza a
    dívida: o sinal fica vermelho e o que falta é a soma do déficit com o necessário."""
    primary = api.get("/api/economy-health").json()["primary"]
    stabilization = api.get("/api/debt").json()["stabilization"]

    assert primary["lamp"] == "red"
    assert primary["surplus"] == pytest.approx(-0.0062)
    assert primary["stabilizing"] == pytest.approx(stabilization["stabilizing_primary"])
    assert primary["gap"] == pytest.approx(primary["stabilizing"] - primary["surplus"])


@pytest.mark.usefixtures("seeded")
def test_references_carry_numbers_without_color(api: TestClient) -> None:
    """Os sinais sem faixa oficial trazem só o número: desocupação de 5,3%, dívida
    bruta de 82,86% do PIB e as reservas de US$ 362,8 bi."""
    references = api.get("/api/economy-health").json()["references"]

    assert references["unemployment"]["value"] == pytest.approx(0.053)
    assert references["gross_debt"]["value"] == pytest.approx(0.8286)
    assert references["reserves"]["value"] == pytest.approx(362821.0)
    assert references["real_rate"]["rate"] == pytest.approx(
        (1 + 0.1375) / (1 + 0.04590) - 1, abs=1e-4
    )
    assert references["expected_inflation"] is None


def test_economy_health_without_cache_is_a_domain_error(api: TestClient) -> None:
    """Sem a primeira atualização, a tela recebe o envelope de erro com `detail`."""
    response = api.get("/api/economy-health")

    assert response.status_code == 409
    assert isinstance(response.json()["detail"], str)
