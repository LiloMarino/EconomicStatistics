"""A Visão geral: um cartão por indicador, composto dos números das telas."""

from __future__ import annotations

from datetime import date
from typing import Any

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator, FocusTargetKind, OverviewIndicator
from backend.domain.focus import Expectation
from backend.repository.focus import upsert_expectations
from tests.data_activity import seed_activity, seed_activity_survey
from tests.data_credit import seed_credit
from tests.data_external import seed_external
from tests.data_interest import seed_interest
from tests.data_ipca import seed_ipca
from tests.data_public_accounts import seed_public_accounts

# A pesquisa de 4 semanas antes da última (2/out/2026)
EARLIER_SURVEY = date(2026, 9, 4)


def _ipca_year(survey_date: date, median: float) -> Expectation:
    return Expectation(
        indicator=FocusIndicator.IPCA,
        target_kind=FocusTargetKind.YEAR,
        target_year=2026,
        target_period=0,
        survey_date=survey_date,
        median=median,
        respondents=137,
    )


@pytest.fixture
def seeded(session: Session) -> None:
    seed_ipca(session)
    seed_interest(session)
    seed_public_accounts(session)
    seed_activity(session)
    seed_activity_survey(session)
    seed_external(session)
    seed_credit(session)
    upsert_expectations(
        session,
        [_ipca_year(EARLIER_SURVEY, 4.8), _ipca_year(date(2026, 10, 2), 5.01)],
    )
    session.commit()


def _by_indicator(body: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {item["indicator"]: item for item in body["indicators"]}


@pytest.mark.usefixtures("seeded")
def test_every_indicator_has_a_card(api: TestClient) -> None:
    """Com o cache completo, cada indicador do enum aparece uma vez."""
    body = api.get("/api/overview").json()

    assert sorted(_by_indicator(body)) == sorted(
        item.value for item in OverviewIndicator
    )
    assert len(body["indicators"]) == len(OverviewIndicator)


@pytest.mark.usefixtures("seeded")
def test_ipca_card_matches_the_pace_screen(api: TestClient) -> None:
    """O IPCA em 12 meses do cartão é o último da tela Inflação (4,22%), está dentro da
    faixa da meta e caiu contra o mesmo mês do ano anterior."""
    card = _by_indicator(api.get("/api/overview").json())["ipca_12m"]
    pace = api.get("/api/inflation/pace").json()

    assert card["value"] == pytest.approx(pace["general_12m"][-1]["rate"])
    assert round(card["value"] * 100, 2) == 4.22
    assert card["within_band"] is True
    assert round(card["band"]["floor"] * 100, 1) == 1.5
    assert round(card["band"]["ceiling"] * 100, 1) == 4.5
    assert card["change_months"] == 12
    assert card["change_kind"] == "points"
    assert len(card["sparkline"]) == 24


@pytest.mark.usefixtures("seeded")
def test_expected_ipca_compares_with_the_survey_four_weeks_before(
    api: TestClient,
) -> None:
    """O IPCA de 2026 esperado passou de 4,80% para 5,01% em 4 semanas: +0,21 ponto."""
    card = _by_indicator(api.get("/api/overview").json())["expected_ipca"]

    assert card["value"] == pytest.approx(0.0501)
    assert card["change"] == pytest.approx(0.0021)
    assert card["change_months"] == 1
    assert card["ref_date"] == "2026-10-02"


@pytest.mark.usefixtures("seeded")
def test_dollar_and_reserves_change_is_relative(api: TestClient) -> None:
    """Nível muda em proporção do valor de antes; o estoque de reservas sai em US$
    milhões, como o Banco Central publica."""
    cards = _by_indicator(api.get("/api/overview").json())

    assert cards["dollar"]["change_kind"] == "relative"
    assert cards["reserves"]["change_kind"] == "relative"
    assert cards["reserves"]["value"] == pytest.approx(362821.0)
    assert cards["current_account"]["change_kind"] == "points"


@pytest.mark.usefixtures("seeded")
def test_government_result_adds_primary_and_interest(api: TestClient) -> None:
    """Em ago/2026 o primário (0,62) mais os juros (8,86) dão o nominal (9,48), em % do
    PIB, e os juros são 93% do déficit."""
    result = api.get("/api/overview").json()["government_result"]

    assert result["ref_date"] == "2026-08-01"
    assert result["primary"] + result["interest"] == pytest.approx(result["nominal"])
    assert round(result["nominal"] * 100, 2) == 9.48
    assert round(result["interest_share"] * 100) == 93


@pytest.mark.usefixtures("seeded")
def test_selic_card_is_dated_today(api: TestClient) -> None:
    """A série da Selic meta termina na data da última reunião; o "dado até" do cartão é
    o último dia em cache."""
    card = _by_indicator(api.get("/api/overview").json())["selic"]

    assert card["ref_date"] == "2026-10-08"
    assert card["value"] == pytest.approx(0.1375)


def test_overview_without_cache_is_a_domain_error(api: TestClient) -> None:
    """Sem a primeira atualização, a tela recebe o envelope de erro com `detail`."""
    response = api.get("/api/overview")

    assert response.status_code == 409
    assert isinstance(response.json()["detail"], str)
