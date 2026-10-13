from __future__ import annotations

from datetime import date

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete
from sqlalchemy.orm import Session

from backend.core.models.models import FocusExpectation
from backend.domain.rates import index_change_1m, index_change_12m
from tests.data_activity import (
    IBC_BR,
    IBC_BR_SEASONALLY_ADJUSTED,
    seed_activity,
    seed_activity_survey,
)
from tests.data_external import months_from


def test_index_change_compares_the_last_12_months_average_with_the_12_before() -> None:
    """A média do IBC-Br de ago/2025 a jul/2026 sobre a de ago/2024 a jul/2025 dá
    +1,48% em jul/2026."""
    changes = index_change_12m(months_from(date(2024, 5, 1), IBC_BR))

    assert changes[-1].ref_date == date(2026, 7, 1)
    assert round(changes[-1].rate * 100, 2) == 1.48


def test_index_change_skips_months_without_the_23_before() -> None:
    """Com um mês faltando na janela, o 12 meses daquele mês não é calculado."""
    index = months_from(date(2024, 8, 1), IBC_BR[3:])
    del index[5]

    assert index_change_12m(index) == []


def test_flat_index_has_no_change() -> None:
    """Índice parado em 100 durante 24 meses não varia."""
    flat = months_from(date(2024, 8, 1), [100.0] * 24)

    assert index_change_12m(flat)[0].rate == 0.0


def test_month_change_divides_each_month_by_the_one_before() -> None:
    """O IBC-Br com ajuste sazonal caiu 0,88% em jun/2026 (110,16 contra 111,14) e
    0,22% em jul/2026 (109,92 contra 110,16)."""
    changes = index_change_1m(months_from(date(2025, 1, 1), IBC_BR_SEASONALLY_ADJUSTED))

    assert len(changes) == 18
    assert [round(item.rate * 100, 2) for item in changes[-2:]] == [-0.88, -0.22]


def test_month_change_skips_a_month_without_the_one_before() -> None:
    """Com um mês faltando, o mês seguinte a ele não tem variação."""
    index = months_from(date(2025, 1, 1), IBC_BR_SEASONALLY_ADJUSTED)
    del index[5]

    assert date(2025, 7, 1) not in [item.ref_date for item in index_change_1m(index)]


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
    assert body["ibc"]["months"][-1] == {
        "ref_date": "2026-07-01",
        "value": pytest.approx(0.0148, abs=5e-5),
    }
    unemployment = body["unemployment"]
    assert unemployment["months"][-1] == {
        "ref_date": "2026-08-01",
        "value": pytest.approx(0.053),
    }
    assert unemployment["change_12m"] == pytest.approx(-0.003)
    assert unemployment["employed"] == pytest.approx(0.947)


@pytest.mark.usefixtures("seeded")
def test_ibc_pace_is_the_slope_of_the_12_months_line(api: TestClient) -> None:
    """O IBC-Br em 12 meses foi de 1,64% em abr/2026 para 1,48% em jul/2026: caiu 0,16
    ponto em 3 meses, mais que a faixa de 0,10 de estável, e o ritmo é de freada. No
    último mês, de 1,50% para 1,48%, caiu 0,03 ponto."""
    ibc = api.get("/api/activity").json()["ibc"]

    assert [item["ref_date"] for item in ibc["months"]] == [
        "2026-04-01",
        "2026-05-01",
        "2026-06-01",
        "2026-07-01",
    ]
    assert ibc["change_3m"] == pytest.approx(-0.0016, abs=5e-6)
    assert ibc["change_1m"] == pytest.approx(-0.00025, abs=5e-6)
    assert ibc["verdict"] == "slowing"
    assert ibc["steady_band"] == pytest.approx(0.001)


@pytest.mark.usefixtures("seeded")
def test_short_term_changes_come_from_the_seasonally_adjusted_series(
    api: TestClient,
) -> None:
    """O IBC-Br com ajuste sazonal caiu 0,22% de jun para jul/2026, e o PIB do 2º
    tri/2026 cresceu 0,5% sobre o 1º, datado em junho, quando o trimestre termina."""
    body = api.get("/api/activity").json()

    assert body["ibc"]["month_on_month"][-1] == {
        "ref_date": "2026-07-01",
        "value": pytest.approx(-0.0022, abs=5e-5),
    }
    assert body["gdp"]["quarter_on_quarter"][-1] == {
        "ref_date": "2026-06-01",
        "value": pytest.approx(0.005),
    }
    assert len(body["gdp"]["quarter_on_quarter"]) == 6


@pytest.mark.usefixtures("seeded")
def test_underutilization_pairs_the_two_rates_of_the_same_quarter(
    api: TestClient,
) -> None:
    """A subutilização e a desocupação do mesmo trimestre móvel vêm juntas, mês a mês:
    em ago/2026, 13,1% contra 5,3%, 7,8 pontos de distância."""
    underutilization = api.get("/api/activity").json()["underutilization"]

    assert len(underutilization["months"]) == 13
    assert underutilization["months"][-1] == {
        "ref_date": "2026-08-01",
        "unemployment": pytest.approx(0.053),
        "underutilization": pytest.approx(0.131),
    }
    assert underutilization["gap"] == pytest.approx(0.078)


@pytest.mark.usefixtures("seeded")
def test_activity_forecast_comes_from_the_latest_focus_survey(api: TestClient) -> None:
    """O PIB esperado vem em dezembro de cada ano que a pesquisa traz, e a desocupação,
    mês a mês, depois de ago/2026 e até dez/2029, os anos do relatório Focus."""
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
        "2028-01-01",
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
