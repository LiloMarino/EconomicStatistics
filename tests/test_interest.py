"""A Selic meta, o juro real e a tela Juros."""

from __future__ import annotations

from datetime import date

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete
from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator, FocusTargetKind
from backend.core.models.models import FocusExpectation
from backend.domain.interest import (
    SelicChange,
    SelicStep,
    forecast_by_month,
    last_change,
    month_end_rates,
)
from backend.domain.rates import real_change
from backend.domain.series import Observation
from backend.repository.focus import upsert_expectations
from tests.data_interest import SURVEY, expectation, seed_interest, selic_days
from tests.data_ipca import seed_ipca


@pytest.fixture
def seeded(session: Session) -> None:
    seed_ipca(session)
    seed_interest(session)


def test_month_end_keeps_the_last_target_of_each_month() -> None:
    """Em setembro a meta caiu de 14,00% para 13,75% no dia 17: o fim do mês traz
    13,75%, e agosto fecha em 14,00%. No mês corrente vale o último dia em cache."""
    months = {item.ref_date: item.rate for item in month_end_rates(selic_days())}

    assert months[date(2026, 8, 1)] == pytest.approx(0.14)
    assert months[date(2026, 9, 1)] == pytest.approx(0.1375)
    assert months[date(2026, 10, 1)] == pytest.approx(0.1375)


def test_last_change_is_the_latest_step_of_the_target() -> None:
    """A última mudança foi o corte de 0,25 ponto percentual que valeu em 17/9/2026."""
    assert last_change(selic_days()) == SelicChange(
        effective_date=date(2026, 9, 17), before=0.14, after=0.1375
    )


def test_last_change_is_none_when_the_target_never_moved() -> None:
    """Uma meta parada no período não tem mudança para mostrar."""
    flat = [Observation(ref_date=date(2026, 10, day), value=15.0) for day in (1, 2, 3)]

    assert last_change(flat) is None


def test_forecast_holds_each_meeting_until_the_next() -> None:
    """A meta de hoje vale até a 1ª reunião; cada reunião vale a partir do dia seguinte
    à decisão e segue até a próxima. Uma reunião no meio do mês só aparece no fim dele."""
    steps = [
        SelicStep(effective_date=date(2026, 11, 5), rate=0.135),
        SelicStep(effective_date=date(2026, 12, 10), rate=0.1325),
    ]

    months = forecast_by_month(0.1375, steps, date(2026, 10, 1), date(2027, 1, 1))

    assert [(item.ref_date.month, item.rate) for item in months] == [
        (10, 0.1375),
        (11, 0.135),
        (12, 0.1325),
        (1, 0.1325),
    ]


def test_real_rate_divides_the_selic_by_the_expected_inflation() -> None:
    """Selic de 13,75% contra 4,59% esperados: 1,1375 / 1,0459 - 1 = 8,76%. A conta
    subtraída daria 9,16%."""
    assert round(real_change(0.1375, 0.0459) * 100, 2) == 8.76


@pytest.mark.usefixtures("seeded")
def test_interest_brings_the_selic_the_next_meeting_and_the_real_rate(
    api: TestClient,
) -> None:
    """A tela traz a meta de hoje (13,75%), a próxima reunião (a 7ª de 2026, 3 e 4 de
    novembro) com o corte de 0,25 ponto esperado, a meta de cada mês até jan/2027 e o
    juro real ex-ante de 8,76%."""
    body = api.get("/api/interest").json()

    selic = body["selic"]
    assert selic["current"] == pytest.approx(0.1375)
    assert selic["months"][-1] == {"ref_date": "2026-10-01", "rate": 0.1375}
    # As duas linhas começam em set/2024, o 1º mês do IPCA em 12 meses mostrado
    assert selic["months"][0]["ref_date"] == "2024-09-01"
    assert len(body["inflation"]["months"]) == 24
    assert selic["last_change"]["effective_date"] == "2026-09-17"
    assert [(m["ref_date"], m["rate"]) for m in selic["forecast"]["months"]] == [
        ("2026-11-01", 0.135),
        ("2026-12-01", 0.1325),
        ("2027-01-01", 0.13),
    ]
    assert selic["forecast"]["survey_date"] == "2026-10-02"

    meeting = body["next_meeting"]
    assert meeting["meeting"] == {
        "year": 2026,
        "number": 7,
        "first_day": "2026-11-03",
        "second_day": "2026-11-04",
    }
    assert meeting["expected"] == pytest.approx(0.135)
    assert meeting["change"] == pytest.approx(-0.0025)

    assert body["real_rate"]["rate"] == pytest.approx(1.1375 / 1.0459 - 1)
    assert body["inflation"]["months"][-1]["ref_date"] == "2026-08-01"
    assert body["inflation"]["forecast"]["months"][0]["ref_date"] == "2026-09-01"


@pytest.mark.usefixtures("seeded")
def test_meeting_without_a_date_in_the_calendar_stays_off_the_screen(
    api: TestClient, session: Session
) -> None:
    """O Focus já pergunta reuniões de 2028, que o Banco Central ainda não datou: elas
    não entram na previsão nem viram a próxima reunião."""
    upsert_expectations(
        session,
        [expectation(FocusIndicator.SELIC, FocusTargetKind.MEETING, 2028, 1, 11.0)],
    )
    session.commit()

    body = api.get("/api/interest").json()

    assert body["selic"]["forecast"]["months"][-1]["ref_date"] == "2027-01-01"
    assert body["selic"]["forecast"]["survey_date"] == SURVEY.isoformat()


@pytest.mark.usefixtures("seeded")
def test_interest_without_the_focus_still_shows_the_realized(
    api: TestClient, session: Session
) -> None:
    """Sem pesquisa em cache, a tela mostra a Selic e o IPCA realizados e deixa a
    previsão, a próxima reunião e o juro real de fora."""
    session.execute(delete(FocusExpectation))
    session.commit()

    body = api.get("/api/interest").json()

    assert body["selic"]["current"] == pytest.approx(0.1375)
    assert body["selic"]["forecast"] is None
    assert body["next_meeting"] is None
    assert body["real_rate"] is None


def test_interest_without_cache_is_409(api: TestClient) -> None:
    """Antes da primeira atualização, a tela recebe 409 com a explicação."""
    response = api.get("/api/interest")

    assert response.status_code == 409
    assert "Selic" in response.json()["detail"]
