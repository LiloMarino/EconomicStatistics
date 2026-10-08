"""O calendário das reuniões do Copom: o parse do site do Banco Central e o refresh."""

from __future__ import annotations

import json
import urllib.parse
from datetime import date, datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.adapters.bcb_copom_provider import (
    BcbCopomProvider,
    calendar_url,
    to_meetings,
)
from backend.domain.copom import calendar_overdue, expected_calendar_year
from backend.features.copom.refresh import refresh_copom
from backend.repository.copom import last_meeting_year, read_meetings
from tests.fakes import FakeCopomProvider

NOW = datetime(2026, 10, 8, 10)


def _event(day: str) -> dict[str, object]:
    return {
        "Id": 1,
        "evento": "Copom meeting - Monetary Policy Committee",
        "dataEvento": f"{day}T03:00:00Z",
        "fimEvento": f"{day}T03:00:00Z",
        "descricao": "<p>Day 1</p>",
        "local": None,
        "diaInteiro": "Sim",
    }


def _body(*days: str) -> bytes:
    return json.dumps({"conteudo": [_event(day) for day in days]}).encode()


def test_two_consecutive_days_are_one_meeting_numbered_in_the_year() -> None:
    """O site lista um evento por dia, à meia-noite de Brasília em UTC. Os dias 3 e 4 de
    novembro são a 1ª reunião listada de 2026, e a ordem recomeça em 2027."""
    meetings = to_meetings(
        _body("2026-11-03", "2026-11-04", "2026-12-08", "2026-12-09", "2027-01-26")
    )

    assert [
        (item.year, item.number, item.first_day, item.second_day) for item in meetings
    ] == [
        (2026, 1, date(2026, 11, 3), date(2026, 11, 4)),
        (2026, 2, date(2026, 12, 8), date(2026, 12, 9)),
        (2027, 1, date(2027, 1, 26), date(2027, 1, 26)),
    ]


def test_decision_takes_effect_the_day_after_the_second_day() -> None:
    """A decisão sai no fim do 2º dia (4/nov), e a Selic nova vale em 5/nov."""
    meeting = to_meetings(_body("2026-11-03", "2026-11-04"))[0]

    assert meeting.effective_from == date(2026, 11, 5)


def test_year_without_a_published_calendar_brings_no_meeting() -> None:
    """O Banco Central só divulga o calendário até junho do ano anterior: antes disso o
    ano volta vazio."""
    assert to_meetings(_body()) == []


def test_request_asks_the_whole_range_of_years() -> None:
    """O pedido vai de 1º de janeiro do primeiro ano a 31 de dezembro do último, na
    lista de reuniões do Copom."""
    query = urllib.parse.parse_qs(urllib.parse.urlparse(calendar_url(2026, 2027)).query)

    assert query["inicioAgenda"] == ["'2026-01-01'"]
    assert query["fimAgenda"] == ["'2027-12-31'"]
    assert query["lista"] == ["Reuniões do Copom"]


def test_provider_downloads_the_calendar_and_parses_it() -> None:
    """O provider baixa o endereço do pedido e devolve as reuniões do corpo."""
    asked: list[str] = []

    def download(url: str) -> bytes:
        asked.append(url)
        return _body("2026-11-03", "2026-11-04")

    meetings = BcbCopomProvider(download).get_meetings(2026, 2027)

    assert asked == [calendar_url(2026, 2027)]
    assert len(meetings) == 1


def test_next_year_is_expected_from_july() -> None:
    """O calendário de 2027 é divulgado até o fim de junho de 2026, então a partir de 1º
    de julho de 2026 ele já devia estar em cache."""
    assert expected_calendar_year(date(2026, 6, 30)) == 2026
    assert expected_calendar_year(date(2026, 7, 1)) == 2027
    assert calendar_overdue(2026, date(2026, 10, 8))
    assert not calendar_overdue(2027, date(2026, 10, 8))
    assert calendar_overdue(None, date(2026, 3, 1))


def test_first_refresh_fills_the_current_and_the_next_year(session: Session) -> None:
    """Em outubro de 2026 a primeira carga traz 2026 e 2027."""
    provider = FakeCopomProvider()

    result = refresh_copom(session, provider, NOW)

    assert result.updated
    assert provider.calls == [(2026, 2027)]
    assert last_meeting_year(session) == 2027
    assert len(read_meetings(session, 2026, 2027)) == 4


def test_second_refresh_does_not_hit_the_source(session: Session) -> None:
    """Com o calendário do ano esperado em cache, o refresh não volta à fonte, nem 7
    horas depois."""
    provider = FakeCopomProvider()

    refresh_copom(session, provider, NOW)
    refresh_copom(session, provider, NOW + timedelta(hours=7))

    assert provider.calls == [(2026, 2027)]


def test_new_year_asks_again_when_the_calendar_comes_out(session: Session) -> None:
    """Em julho de 2027 o calendário de 2028 passa a ser esperado, e o refresh o pede
    junto com o ano corrente."""
    provider = FakeCopomProvider()

    refresh_copom(session, provider, NOW)
    refresh_copom(session, provider, datetime(2027, 7, 1, 10))

    assert provider.calls == [(2026, 2027), (2027, 2028)]
    assert last_meeting_year(session) == 2028


def test_offline_source_keeps_cache_and_warns_once(session: Session) -> None:
    """Sem rede, o cache fica como estava e a falta é avisada só na primeira vez."""
    refresh_copom(session, FakeCopomProvider(), NOW)
    offline = FakeCopomProvider(offline=True)
    later = datetime(2027, 7, 1, 10)

    first = refresh_copom(session, offline, later)
    second = refresh_copom(session, offline, later + timedelta(hours=7))

    assert last_meeting_year(session) == 2027
    assert first.failed
    assert not second.failed
    assert len(offline.calls) == 2


def test_refresh_endpoint_reports_the_calendar(api: TestClient) -> None:
    """O refresh pela API também busca o calendário e diz que ele foi atualizado."""
    body = api.post("/api/series/refresh").json()

    assert "copom_meetings" in body["datasets_updated"]
