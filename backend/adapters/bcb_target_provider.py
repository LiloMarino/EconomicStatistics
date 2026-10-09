from __future__ import annotations

import re
import urllib.request
from collections.abc import Callable
from html.parser import HTMLParser

from pydantic import BaseModel

from backend.domain.inflation_target import Tolerance
from backend.domain.rates import PERCENT

PAGE_URL = "https://www.bcb.gov.br/api/paginasite/sitebcb/controleinflacao/"
CURRENT_PAGE = "metainflacao"
HISTORY_PAGE = "historicometas"
TIMEOUT_SECONDS = 30

# "para o período iniciado em janeiro de 2025 é 3,00%, com intervalo de tolerância de
# menos 1,50 ponto percentual e mais 1,50 ponto percentual"
_CURRENT_RULE = re.compile(
    r"período iniciado em \w+ de (\d{4}).{0,200}?"
    r"de menos ([\d,]+) pontos? percentua\w+ e mais ([\d,]+) pontos? percentua\w+"
)
_RANGE = re.compile(r"^(\d+(?:,\d+)?)-(\d+(?:,\d+)?)$")
_YEAR = re.compile(r"^(\d{4})\*?$")


class CmsPage(BaseModel):
    conteudo: str


class _Table(HTMLParser):
    """As linhas da primeira tabela, cada célula com o texto antes do primeiro `<br>`:
    as linhas de 2003 e 2004 trazem a norma nova e a antiga em `<br>` separados, e a
    primeira é a que vale."""

    def __init__(self) -> None:
        super().__init__()
        self.rows: list[list[str]] = []
        self._in_cell = False
        self._past_break = False
        self._cell = ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "tr":
            self.rows.append([])
        elif tag == "td":
            self._in_cell, self._past_break, self._cell = True, False, ""
        elif tag == "br":
            self._past_break = True

    def handle_endtag(self, tag: str) -> None:
        if tag == "td" and self._in_cell and self.rows:
            self.rows[-1].append(self._cell.replace("​", "").strip())
            self._in_cell = False

    def handle_data(self, data: str) -> None:
        if self._in_cell and not self._past_break:
            self._cell += data


class _Attributes(HTMLParser):
    """Os valores de atributo que trazem uma tabela: a página do histórico a embute no
    `card_body` de um componente de acordeão."""

    def __init__(self) -> None:
        super().__init__()
        self.tables: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.tables.extend(
            value.replace('\\"', '"')
            for _, value in attrs
            if value and "<table" in value
        )


class _Text(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []

    def handle_data(self, data: str) -> None:
        self.parts.append(data)


def _number(text: str) -> float:
    return float(text.replace(",", "."))


def _html(body: bytes) -> str:
    return CmsPage.model_validate_json(body).conteudo


def to_history(body: bytes) -> list[Tolerance]:
    """A tolerância de cada ano da tabela do histórico das metas. A distância da meta
    ao piso sai do intervalo ("1,5-6,5"), a célula que nenhum `rowspan` desloca de
    posição entre as linhas."""
    page = _html(body)
    embedded = _Attributes()
    embedded.feed(page)
    table = _Table()
    for fragment in (page, *embedded.tables):
        table.feed(fragment)
    items: list[Tolerance] = []
    for row in table.rows:
        year = _YEAR.match(row[0]) if row else None
        bounds = next((m for cell in row if (m := _RANGE.match(cell))), None)
        if year and bounds:
            floor, ceiling = _number(bounds[1]), _number(bounds[2])
            items.append(
                Tolerance(
                    year=int(year[1]),
                    width=round((ceiling - floor) / 2 / PERCENT, 6),
                )
            )
    if not items:
        raise ValueError("a tabela de metas não trouxe nenhum ano")
    return items


def to_current(body: bytes) -> Tolerance:
    """A tolerância da regra em vigor, da frase da página das metas: o ano em que o
    período começou e a distância da meta até o piso e até o teto."""
    text = _Text()
    text.feed(_html(body))
    match = _CURRENT_RULE.search(re.sub(r"\s+", " ", " ".join(text.parts)))
    if match is None:
        raise ValueError("a página das metas não traz a tolerância em vigor")
    below, above = _number(match[2]), _number(match[3])
    if below != above:
        raise ValueError(f"intervalo assimétrico ({below} e {above} p.p.)")
    return Tolerance(year=int(match[1]), width=round(below / PERCENT, 6))


def _download(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
        body: bytes = response.read()
    return body


class BcbTargetProvider:
    name = "bcb-target"

    def __init__(self, download: Callable[[str], bytes] = _download) -> None:
        self._download = download

    def get_tolerances(self, *, history: bool) -> list[Tolerance]:
        items = to_history(self._download(PAGE_URL + HISTORY_PAGE)) if history else []
        current = to_current(self._download(PAGE_URL + CURRENT_PAGE))
        return [item for item in items if item.year < current.year] + [current]
