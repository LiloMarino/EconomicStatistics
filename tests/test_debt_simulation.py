"""O simulador da dívida: a trajetória ano a ano, o primário que estabiliza e os casos."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.core.enum import DebtCaseGroup, DebtCaseId, DebtTrend
from backend.domain.debt import debt_path, debt_trend, stabilizing_primary, still_rising
from backend.domain.debt_cases import CASES
from tests.data_public_accounts import seed_public_accounts


@pytest.fixture
def seeded(session: Session) -> None:
    seed_public_accounts(session)


def test_debt_stays_put_at_the_stabilizing_primary() -> None:
    """Com dívida de 80% do PIB, r de 10% e g de 7%, o primário de 2,24% do PIB (o p*)
    deixa a dívida em 80% em todos os anos."""
    primary = stabilizing_primary(0.8, 0.10, 0.07)

    path = debt_path(0.8, 0.10, 0.07, primary, 10)

    assert len(path) == 11
    assert path == pytest.approx([0.8] * 11)


def test_path_composes_juro_and_growth_by_dividing() -> None:
    """Dívida de 100% do PIB, r de 10%, g de 5% e primário zero: no 1º ano ela vira
    1,10 / 1,05 = 104,76% do PIB, e não os 105% que a subtração de 10% - 5% daria."""
    path = debt_path(1.0, 0.10, 0.05, 0.0, 2)

    assert path[1] == pytest.approx(1.10 / 1.05)
    assert path[2] == pytest.approx((1.10 / 1.05) ** 2)


def test_surplus_above_the_stabilizing_primary_makes_the_debt_fall() -> None:
    """Com r de 10% e g de 7%, um superávit de 4% do PIB (acima dos 2,24% do p*) faz a
    dívida de 80% cair, e um déficit de 1% a faz subir."""
    assert debt_trend(debt_path(0.8, 0.10, 0.07, 0.04, 10)) is DebtTrend.FALLING
    assert debt_trend(debt_path(0.8, 0.10, 0.07, -0.01, 10)) is DebtTrend.RISING


def test_change_under_half_a_point_is_a_stable_debt() -> None:
    """Uma variação de 0,3 ponto do PIB em 10 anos conta como dívida parada."""
    assert debt_trend([0.80, 0.802, 0.803]) is DebtTrend.STABLE


def test_still_rising_follows_the_last_year() -> None:
    """A dívida que ainda subiu no último ano segue subindo depois do horizonte; a que
    já encostou no ponto fixo, não."""
    assert still_rising(debt_path(0.8, 0.10, 0.07, -0.01, 10))
    assert not still_rising(debt_path(0.8, 0.10, 0.07, 0.04, 10))


def test_simulation_endpoint_returns_the_path_and_the_gap(api: TestClient) -> None:
    """No p* de 2,24% a trajetória fica parada em 80%, não falta primário e a conta do
    1º ano repete a dívida."""
    primary = stabilizing_primary(0.8, 0.10, 0.07)

    body = api.get(
        "/api/debt/simulation",
        params={"debt": 0.8, "r": 0.10, "g": 0.07, "primary": primary},
    ).json()

    assert body["years"] == 10
    assert body["path"] == pytest.approx([0.8] * 11)
    assert body["trend"] == "stable"
    assert round(body["stabilizing_primary"] * 100, 2) == 2.24
    assert body["primary_gap"] == pytest.approx(0.0)
    assert body["rate_minus_growth"] == pytest.approx(0.03)
    assert body["first_year"]["debt"] == pytest.approx(0.8)


def test_simulation_gap_is_what_the_chosen_primary_misses(api: TestClient) -> None:
    """Com déficit primário de 0,62% e p* de 2,24%, faltam 2,86 pontos do PIB."""
    body = api.get(
        "/api/debt/simulation",
        params={"debt": 0.8, "r": 0.10, "g": 0.07, "primary": -0.0062, "years": 5},
    ).json()

    assert len(body["path"]) == 6
    assert round(body["primary_gap"] * 100, 2) == 2.86
    assert body["trend"] == "rising"
    assert body["still_rising"]


@pytest.mark.parametrize(
    "params",
    [
        {"debt": 0.8, "r": 0.10, "g": -1.0, "primary": 0.0},
        {"debt": 0.8, "r": -1.0, "g": 0.05, "primary": 0.0},
        {"debt": -0.1, "r": 0.10, "g": 0.05, "primary": 0.0},
        {"debt": 0.8, "r": 0.10, "g": 0.05, "primary": 0.0, "years": 0},
        {"debt": 0.8, "r": 0.10, "g": 0.05, "primary": 0.0, "years": 51},
    ],
)
def test_simulation_rejects_what_the_formula_cannot_take(
    api: TestClient, params: dict[str, float]
) -> None:
    """Crescimento ou juro de -100% (divisão por zero), dívida negativa e horizonte fora
    de 1 a 50 anos são 422."""
    response = api.get("/api/debt/simulation", params=params)

    assert response.status_code == 422
    assert isinstance(response.json()["detail"], str)


def test_simulation_without_a_number_is_422(api: TestClient) -> None:
    assert api.get("/api/debt/simulation", params={"debt": 0.8}).status_code == 422


@pytest.mark.usefixtures("seeded")
def test_brazil_today_carries_the_numbers_of_the_debt_screen(api: TestClient) -> None:
    """O Brasil hoje abre a lista com a dívida líquida, o r, o g e o superávit primário
    de ago/2026 que a tela Dívida mostra: 69,26%, 13,74%, 7,23% e -0,62%."""
    stabilization = api.get("/api/debt").json()["stabilization"]

    first = api.get("/api/debt/simulation/cases").json()["cases"][0]

    assert first["id"] == "brazil_today"
    assert first["debt"] == stabilization["debt"]
    assert first["rate"] == stabilization["implicit_rate"]
    assert first["growth"] == stabilization["nominal_growth"]
    assert first["primary"] == pytest.approx(-0.0062)
    assert first["rate_minus_growth"] == pytest.approx(
        stabilization["implicit_rate"] - stabilization["nominal_growth"]
    )


@pytest.mark.usefixtures("seeded")
def test_country_a_falls_and_country_b_rises(api: TestClient) -> None:
    """País A (120%, r 2%, g 6%) tem g acima de r e a dívida cai sozinha; no País B
    (60%, r 15%, g 3%, déficit de 1%) o juro corre mais que o PIB e ela sobe."""
    body = api.get("/api/debt/simulation/cases").json()
    by_id = {item["id"]: item for item in body["cases"]}

    assert body["years"] == 10
    assert len(by_id["country_a"]["path"]) == 11
    assert by_id["country_a"]["end"] < 1.20
    assert by_id["country_b"]["end"] > 0.60
    assert by_id["country_a"]["context"] is None


def test_cases_without_the_debt_cache_are_409(api: TestClient) -> None:
    assert api.get("/api/debt/simulation/cases").status_code == 409


def test_every_case_that_happened_explains_itself() -> None:
    """Escolher um caso abre o contexto dele (moeda, prazo, credores e o que aconteceu);
    só os exemplos não têm, e cada caso aparece uma vez."""
    ids = [case.id for case in CASES]

    assert len(ids) == len(set(ids))
    assert DebtCaseId.BRAZIL_TODAY not in ids
    for case in CASES:
        has_context = case.context is not None
        assert has_context == (case.group is DebtCaseGroup.HAPPENED)
