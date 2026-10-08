"""A pesquisa Focus: o parse do Olinda, a pesquisa de cada semana e o refresh."""

from __future__ import annotations

import json
import urllib.parse
from datetime import date, datetime, timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.adapters.bcb_focus_provider import (
    BcbFocusProvider,
    FocusRow,
    to_expectations,
)
from backend.core.enum import FocusDirection, FocusIndicator, FocusTargetKind, SeriesId
from backend.domain.coverage import month_start
from backend.domain.focus import (
    Expectation,
    expected_survey_week,
    nfsp_from_balance,
    rolling_12m_forecast,
    survey_overdue,
    weekly_streak,
)
from backend.domain.rates import MonthlyRate
from backend.domain.series import Observation
from backend.features.focus.refresh import refresh_focus
from backend.repository.focus import last_survey_date, upsert_expectations
from backend.repository.series import upsert_observations
from tests.data_ipca import seed_ipca
from tests.data_public_accounts import seed_public_accounts
from tests.fakes import FakeFocusProvider


@pytest.fixture
def seeded_ipca(session: Session) -> None:
    seed_ipca(session)


@pytest.fixture
def seeded_public_accounts(session: Session) -> None:
    seed_public_accounts(session)


# Terça, 6/out/2026: a pesquisa da semana de 28/set a 2/out já devia ter saído
NOW = datetime(2026, 10, 6, 9, 0)

# Linhas como o Olinda responde, com o "í" corrompido do endpoint anual
ANNUAL_BODY = json.dumps(
    {
        "value": [
            {
                "Indicador": "D�­vida l�­quida do setor público",
                "IndicadorDetalhe": None,
                "Data": "2026-10-02",
                "DataReferencia": "2026",
                "Mediana": 70.0,
                "numeroRespondentes": 60,
                "baseCalculo": 0,
            },
            {
                "Indicador": "Balança comercial",
                "IndicadorDetalhe": "Saldo",
                "Data": "2026-10-02",
                "DataReferencia": "2027",
                "Mediana": 79.0,
                "numeroRespondentes": 30,
                "baseCalculo": 0,
            },
            {
                "Indicador": "IPC-Fipe",
                "IndicadorDetalhe": None,
                "Data": "2026-10-02",
                "DataReferencia": "2026",
                "Mediana": 4.0,
                "numeroRespondentes": 10,
                "baseCalculo": 0,
            },
        ]
    }
).encode()


def _rows(body: bytes) -> list[FocusRow]:
    return [FocusRow.model_validate(row) for row in json.loads(body)["value"]]


def test_corrupted_name_and_detail_become_the_indicator() -> None:
    """O nome com o "í" corrompido vira o mesmo indicador do nome certo, a balança se
    separa pelo detalhe e o indicador que o Focus não pergunta mais fica de fora."""
    expectations = to_expectations(FocusTargetKind.YEAR, _rows(ANNUAL_BODY))

    assert [
        (item.indicator, item.target_year, item.median, item.respondents)
        for item in expectations
    ] == [
        (FocusIndicator.NET_DEBT, 2026, 70.0, 60),
        (FocusIndicator.TRADE_BALANCE, 2027, 79.0, 30),
    ]


def test_month_quarter_and_meeting_become_year_and_period() -> None:
    """`10/2026` é o mês 10, `4/2026` o 4º trimestre e `R8/2026` a 8ª reunião."""
    base = {
        "Indicador": "IPCA",
        "Data": "2026-10-02",
        "Mediana": 0.31,
        "numeroRespondentes": 100,
    }
    month = to_expectations(
        FocusTargetKind.MONTH,
        [FocusRow.model_validate(base | {"DataReferencia": "10/2026"})],
    )
    quarter = to_expectations(
        FocusTargetKind.QUARTER,
        [FocusRow.model_validate(base | {"DataReferencia": "4/2026"})],
    )
    meeting = to_expectations(
        FocusTargetKind.MEETING,
        [FocusRow.model_validate(base | {"Indicador": "Selic", "Reuniao": "R8/2026"})],
    )

    assert (month[0].target_year, month[0].target_period) == (2026, 10)
    assert (quarter[0].target_year, quarter[0].target_period) == (2026, 4)
    assert (meeting[0].indicator, meeting[0].target_year, meeting[0].target_period) == (
        FocusIndicator.SELIC,
        2026,
        8,
    )


def test_friday_holiday_falls_back_to_the_day_before() -> None:
    """Uma consulta pede as sextas de uma vez, na base de 30 dias. A sexta sem pesquisa,
    como 2/abr/2021 (Sexta-feira Santa), é pedida de novo na quinta."""
    filters: list[str] = []

    def download(url: str) -> bytes:
        parts = urllib.parse.urlsplit(url)
        if not parts.path.endswith("/ExpectativasMercadoAnuais"):
            return b'{"value": []}'
        query = urllib.parse.parse_qs(parts.query)
        filters.append(query["$filter"][0])
        days = [
            part.split("'")[1]
            for part in query["$filter"][0].split(" or ")
            if "Data eq" in part
        ]
        rows = [
            {
                "Indicador": "IPCA",
                "Data": day,
                "DataReferencia": "2021",
                "Mediana": 4.0,
                "numeroRespondentes": 100,
            }
            for day in days
            if day != "2021-04-02"
        ]
        return json.dumps({"value": rows}).encode()

    provider = BcbFocusProvider(download=download, today=lambda: date(2021, 4, 10))
    expectations = provider.get_expectations(date(2021, 3, 26))

    assert [item.survey_date for item in expectations] == [
        date(2021, 3, 26),
        date(2021, 4, 9),
        date(2021, 4, 1),
    ]
    assert filters[0].startswith("baseCalculo eq 0 and (")
    assert "Data eq '2021-04-01'" in filters[1]


def test_expected_week_waits_until_tuesday() -> None:
    """Na segunda, 5/out, a pesquisa cobrada ainda é a da semana de 21/set; a partir
    da terça, a da semana de 28/set."""
    assert expected_survey_week(date(2026, 10, 5)) == date(2026, 9, 21)
    assert expected_survey_week(date(2026, 10, 6)) == date(2026, 9, 28)


def test_holiday_survey_counts_for_its_week() -> None:
    """A pesquisa de quinta, quando a sexta é feriado, cobre a semana dela."""
    assert not survey_overdue(date(2026, 10, 1), date(2026, 10, 6))
    assert survey_overdue(date(2026, 9, 25), date(2026, 10, 6))


def test_second_refresh_does_not_hit_the_source(session: Session) -> None:
    """Com a pesquisa da semana em cache, o refresh não volta à fonte, nem 7 horas
    depois."""
    provider = FakeFocusProvider()

    first = refresh_focus(session, provider, NOW)
    refresh_focus(session, provider, NOW + timedelta(hours=7))

    assert first.updated
    assert provider.calls == [None]
    assert last_survey_date(session) == date(2026, 10, 2)


def test_next_refresh_asks_from_the_last_survey(session: Session) -> None:
    """Na semana seguinte, o refresh pede a partir da última pesquisa em cache."""
    provider = FakeFocusProvider(surveys=(date(2026, 10, 2), date(2026, 10, 9)))

    refresh_focus(session, FakeFocusProvider(surveys=(date(2026, 10, 2),)), NOW)
    refresh_focus(session, provider, NOW + timedelta(weeks=1))

    assert provider.calls == [date(2026, 10, 2)]
    assert last_survey_date(session) == date(2026, 10, 9)


def test_offline_source_keeps_cache_and_warns_once(session: Session) -> None:
    """Sem rede, o cache fica como estava e a falta é avisada só na primeira vez."""
    refresh_focus(session, FakeFocusProvider(), NOW)
    offline = FakeFocusProvider(offline=True)
    later = NOW + timedelta(weeks=1)

    first = refresh_focus(session, offline, later)
    second = refresh_focus(session, offline, later + timedelta(hours=7))

    assert last_survey_date(session) == date(2026, 10, 2)
    assert first.failed
    assert not second.failed
    assert len(offline.calls) == 2


def test_refresh_endpoint_reports_the_focus(api: TestClient) -> None:
    """O refresh pela API também busca o Focus e diz que ele foi atualizado."""
    body = api.post("/api/series/refresh").json()

    assert "focus_expectations" in body["datasets_updated"]


def _annual(
    indicator: FocusIndicator, year: int, medians: list[float]
) -> list[Expectation]:
    """Uma pesquisa por sexta, terminando em 2/out/2026."""
    last = date(2026, 10, 2)
    return [
        Expectation(
            indicator=indicator,
            target_kind=FocusTargetKind.YEAR,
            target_year=year,
            target_period=0,
            survey_date=last - timedelta(weeks=len(medians) - 1 - index),
            median=median,
            respondents=140,
        )
        for index, median in enumerate(medians)
    ]


def test_streak_counts_weeks_in_the_same_direction() -> None:
    """Como no relatório de 2/out/2026: o IPCA de 2026 subiu 3 semanas seguidas, de
    4,90 para 5,01, e a mudança menor que 0,01 conta como estabilidade."""
    streak = weekly_streak([4.95, 4.90, 4.92, 4.9915, 5.0129])
    stable = weekly_streak([13.75, 13.5, 13.5, 13.504])

    assert streak is not None
    assert (streak.direction, streak.weeks, streak.start) == (
        FocusDirection.UP,
        3,
        4.90,
    )
    assert stable is not None
    assert (stable.direction, stable.weeks) == (FocusDirection.STABLE, 2)


def test_report_compares_with_one_and_four_weeks_before(
    api: TestClient, session: Session
) -> None:
    """A linha do IPCA de 2026 traz hoje (5,01%), uma semana antes (4,99%) e quatro
    semanas antes (5,00%), em fração; o primário mantém o sinal do Focus."""
    upsert_expectations(
        session,
        [
            *_annual(FocusIndicator.IPCA, 2026, [5.0, 4.90, 4.92, 4.9915, 5.0129]),
            *_annual(FocusIndicator.PRIMARY_BALANCE, 2026, [-0.5, -0.41]),
        ],
    )
    session.commit()

    body = api.get("/api/focus/report").json()

    ipca = next(row for row in body["rows"] if row["indicator"] == "ipca")
    primary = next(row for row in body["rows"] if row["indicator"] == "primary_balance")
    assert body["survey_date"] == "2026-10-02"
    assert (ipca["today"], ipca["week_before"], ipca["weeks_before"]) == (
        pytest.approx(0.050129),
        pytest.approx(0.049915),
        pytest.approx(0.05),
    )
    assert (ipca["direction"], ipca["streak_weeks"]) == ("up", 3)
    assert primary["today"] == pytest.approx(-0.0041)
    assert primary["weeks_before"] is None


def test_history_brings_the_target_of_the_year(
    api: TestClient, session: Session
) -> None:
    """O histórico do IPCA de 2027 tem uma previsão por semana e a meta contínua de
    3%, que segue valendo depois do último ano que a série publicou."""
    upsert_expectations(session, _annual(FocusIndicator.IPCA, 2027, [4.3, 4.31, 4.3]))
    upsert_observations(
        session,
        SeriesId.INFLATION_TARGET,
        [Observation(ref_date=date(2026, 1, 1), value=3.0)],
    )
    session.commit()

    body = api.get(
        "/api/focus/history", params={"indicator": "ipca", "year": 2027}
    ).json()

    assert [point["value"] for point in body["points"]] == [
        pytest.approx(0.043),
        pytest.approx(0.0431),
        pytest.approx(0.043),
    ]
    assert body["years"] == [2027]
    assert body["band"]["ceiling"] == pytest.approx(0.045)
    assert (body["direction"], body["streak_weeks"]) == ("down", 1)


def _expectation(
    indicator: FocusIndicator,
    kind: FocusTargetKind,
    year: int,
    period: int,
    median: float,
) -> Expectation:
    return Expectation(
        indicator=indicator,
        target_kind=kind,
        target_year=year,
        target_period=period,
        survey_date=date(2026, 10, 2),
        median=median,
        respondents=100,
    )


def test_forecast_12m_composes_real_and_expected_months() -> None:
    """Com 11 meses reais de 0,5% e setembro esperado em 1,0%, o 12 meses de setembro
    é 1,005^11 * 1,01 - 1 = 6,70%, composto multiplicando como o real."""
    real = [
        MonthlyRate(ref_date=month_start(date(2026, 8, 1), 11 - index), rate=0.005)
        for index in range(12)
    ]

    points = rolling_12m_forecast(real, {date(2026, 9, 1): 1.0, date(2026, 11, 1): 1.0})

    assert [item.ref_date for item in points] == [date(2026, 9, 1)]
    assert points[0].rate == pytest.approx(1.005**11 * 1.01 - 1)


def test_focus_balance_becomes_nfsp() -> None:
    """O primário de -0,41% do PIB no Focus é um déficit de 0,41%: 0,0041 na NFSP."""
    assert nfsp_from_balance(-0.41) == pytest.approx(0.0041)


@pytest.mark.usefixtures("seeded_ipca")
def test_pace_continues_with_the_latest_survey(
    api: TestClient, session: Session
) -> None:
    """O 12 meses segue depois de ago/2026 com o IPCA mensal esperado, e só quando o
    gráfico termina no último mês publicado."""
    upsert_expectations(
        session,
        [
            _expectation(FocusIndicator.IPCA, FocusTargetKind.MONTH, 2026, 9, 0.3),
            _expectation(FocusIndicator.IPCA, FocusTargetKind.MONTH, 2026, 10, 0.4),
        ],
    )
    session.commit()

    latest = api.get("/api/inflation/pace").json()
    earlier = api.get("/api/inflation/pace", params={"end": "2026-06-01"}).json()

    assert latest["forecast"]["survey_date"] == "2026-10-02"
    assert [point["ref_date"] for point in latest["forecast"]["points"]] == [
        "2026-09-01",
        "2026-10-01",
    ]
    assert latest["forecast"]["points"][0]["band"]["ceiling"] == pytest.approx(0.045)
    assert earlier["forecast"] is None


@pytest.mark.usefixtures("seeded_public_accounts")
def test_deficit_forecast_uses_the_nfsp_sign(api: TestClient, session: Session) -> None:
    """O Focus espera primário de -0,41% e nominal de -8,88% do PIB em 2026: na tela,
    déficit de 0,41% e de 8,88%, com 8,47% de juros."""
    upsert_expectations(
        session,
        [
            _expectation(
                FocusIndicator.PRIMARY_BALANCE, FocusTargetKind.YEAR, 2026, 0, -0.41
            ),
            _expectation(
                FocusIndicator.NOMINAL_BALANCE, FocusTargetKind.YEAR, 2026, 0, -8.88
            ),
        ],
    )
    session.commit()

    forecast = api.get("/api/deficit").json()["forecast"]

    assert forecast["years"] == [
        {
            "ref_date": "2026-12-01",
            "nominal": pytest.approx(0.0888),
            "primary": pytest.approx(0.0041),
            "interest": pytest.approx(0.0847),
        }
    ]


@pytest.mark.usefixtures("seeded_public_accounts")
def test_forecast_is_null_without_a_survey(api: TestClient) -> None:
    """Sem pesquisa Focus em cache, as telas continuam e só a previsão fica de fora."""
    assert api.get("/api/deficit").json()["forecast"] is None
    assert api.get("/api/debt").json()["levels_forecast"] is None
