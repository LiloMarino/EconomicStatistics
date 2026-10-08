from __future__ import annotations

import urllib.parse
import urllib.request
from collections.abc import Callable
from datetime import date, datetime, timedelta, timezone

from pydantic import BaseModel, Field

from backend.domain.copom import Meeting

BASE_URL = "https://www.bcb.gov.br/api/servico/sitebcb/calendar/anual"
LIST_NAME = "Reuniões do Copom"
TIMEOUT_SECONDS = 30
# O site dá cada dia da reunião à meia-noite de Brasília, escrita em UTC
BRASILIA = timezone(timedelta(hours=-3))


class CalendarEvent(BaseModel):
    day: datetime = Field(alias="dataEvento")


class CalendarPage(BaseModel):
    events: list[CalendarEvent] = Field(alias="conteudo")


def calendar_url(first_year: int, last_year: int) -> str:
    query = urllib.parse.urlencode(
        {
            "inicioAgenda": f"'{first_year}-01-01'",
            "fimAgenda": f"'{last_year}-12-31'",
            "lista": LIST_NAME,
        },
        quote_via=urllib.parse.quote,
    )
    return f"{BASE_URL}?{query}"


def to_meetings(body: bytes) -> list[Meeting]:
    """O site lista um evento por dia de reunião. Dias seguidos são a mesma reunião, e a
    ordem dela no ano é a posição entre as reuniões desse ano."""
    days = sorted(
        {
            event.day.astimezone(BRASILIA).date()
            for event in CalendarPage.model_validate_json(body).events
        }
    )
    spans: list[tuple[date, date]] = []
    for day in days:
        if spans and day - spans[-1][1] <= timedelta(days=1):
            spans[-1] = (spans[-1][0], day)
        else:
            spans.append((day, day))
    meetings: list[Meeting] = []
    for first_day, second_day in spans:
        number = 1 + sum(1 for item in meetings if item.year == first_day.year)
        meetings.append(
            Meeting(
                year=first_day.year,
                number=number,
                first_day=first_day,
                second_day=second_day,
            )
        )
    return meetings


def _download(url: str) -> bytes:
    with urllib.request.urlopen(url, timeout=TIMEOUT_SECONDS) as response:
        body: bytes = response.read()
    return body


class BcbCopomProvider:
    name = "bcb-copom"

    def __init__(self, download: Callable[[str], bytes] = _download) -> None:
        self._download = download

    def get_meetings(self, first_year: int, last_year: int) -> list[Meeting]:
        return to_meetings(self._download(calendar_url(first_year, last_year)))
