"""A tolerância da meta de inflação: o parse das páginas do Banco Central e o refresh."""

from __future__ import annotations

import json
from datetime import datetime, timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.adapters.bcb_target_provider import (
    CURRENT_PAGE,
    HISTORY_PAGE,
    PAGE_URL,
    BcbTargetProvider,
    to_current,
    to_history,
)
from backend.domain.inflation_target import Tolerance, tolerance
from backend.features.inflation.tolerance_refresh import refresh_tolerance
from backend.repository.inflation_tolerance import read_tolerances
from tests.data_ipca import TOLERANCES
from tests.fakes import FakeToleranceProvider

NOW = datetime(2026, 10, 8, 10)

# A tabela do histórico como o site a serve: dentro do `card_body` de um acordeão, com
# as aspas escapadas. As linhas de 2003 e 2004 trazem a norma nova e a antiga, e o
# `rowspan` de 2001 tira a norma e a data das linhas de 2000 e 1999.
HISTORY_TABLE = """
<table class=\\&#34;table\\&#34;>
<thead><tr><th>Ano</th><th>Norma</th><th>Data</th><th>Meta (%)</th>
<th>Tamanho<br>do intervalo +/- (p.p.)</th><th>Intervalo<br>de tolerância (%)</th></tr></thead>
<tbody>
<tr><td>2024<br></td><td><a href=\\&#34;/x\\&#34;>Resolução CMN nº 4.918</a><br></td>
<td>24/6/2021<br></td><td>3,00<br></td><td>1,50<br></td><td>1,50-4,50<br></td>
<td>4,83</td><td>Sim</td></tr>
<tr><td>2004*<br></td><td>Resolução CMN nº 3.108<br>Resolução CMN nº 2.972<br></td>
<td>25/6/2003<br>27/6/2002<br></td><td>5,5<br>3,75<br></td><td>2,5<br>2,5<br></td>
<td><span>3-8</span>\u200b<br><span>1,25-6,25</span><br></td><td>7,60</td><td>Não</td></tr>
<tr><td>2003*<br></td><td>Resolução CMN nº 2.972<br>Resolução CMN nº 2.842<br></td>
<td>27/6/2002<br>8/6/2001<br></td><td>4<br>3,25<br></td><td>2,5<br>2<br></td>
<td>1,5-6,5<br>1,25-5,25<br></td><td>9,30</td><td>Sim</td></tr>
<tr><td>2001<br></td><td rowspan=\\&#34;3\\&#34;>Resolução CMN nº 2.615</td>
<td rowspan=\\&#34;3\\&#34;>30/6/1999</td><td>4<br></td><td>2<br></td><td>2-6<br></td>
<td>7,67</td><td>Sim</td></tr>
<tr><td>2000<br></td><td>6<br></td><td>2<br></td><td>4-8<br></td><td>5,97</td><td>Não</td></tr>
</tbody></table>
"""
CURRENT_TEXT = (
    "<p>A meta para a inflação fixada pelo CMN para o período iniciado em janeiro de "
    "<b>2025</b> é 3,00%, com intervalo de tolerância de menos 1,50 ponto percentual "
    "e mais 1,50 ponto percentual, isto é, de 1,50% a 4,50%.</p>"
)


def _page(html: str) -> bytes:
    return json.dumps({"metatags": None, "conteudo": html}).encode()


def _history_page() -> bytes:
    return _page(
        f"<p>Histórico</p><bcb-accordion-page [card_body]=\"'{HISTORY_TABLE}'\">"
        "</bcb-accordion-page>"
    )


def test_history_reads_the_tolerance_of_each_year_from_the_table() -> None:
    """A distância da meta ao piso sai do intervalo de cada ano: 2004 e 2003 valem a
    norma nova (2,5 p.p.), e o `rowspan` não desloca as linhas de 2000 e 2001."""
    items = to_history(_history_page())

    assert [(item.year, item.width) for item in items] == [
        (2024, 0.015),
        (2004, 0.025),
        (2003, 0.025),
        (2001, 0.02),
        (2000, 0.02),
    ]


def test_history_without_a_table_is_an_error() -> None:
    """Página sem tabela de metas é erro, para o cache não ser trocado por vazio."""
    with pytest.raises(ValueError):
        to_history(_page("<p>Página reformulada</p>"))


def test_current_rule_reads_the_start_year_and_the_width() -> None:
    """A frase da página das metas diz que o período iniciado em 2025 tem tolerância
    de 1,50 p.p. para cada lado."""
    assert to_current(_page(CURRENT_TEXT)) == Tolerance(year=2025, width=0.015)


def test_current_rule_with_uneven_sides_is_an_error() -> None:
    """Intervalo assimétrico não cabe na faixa simétrica: o parse recusa."""
    text = CURRENT_TEXT.replace("mais 1,50", "mais 2,00")

    with pytest.raises(ValueError):
        to_current(_page(text))


def test_provider_asks_the_history_only_on_demand() -> None:
    """O provider baixa a página das metas sempre e a do histórico só quando pedida; a
    regra em vigor fecha a lista, e o histórico passa a ser anterior a ela."""
    asked: list[str] = []

    def download(url: str) -> bytes:
        asked.append(url)
        return _history_page() if url.endswith(HISTORY_PAGE) else _page(CURRENT_TEXT)

    provider = BcbTargetProvider(download)
    current_only = provider.get_tolerances(history=False)
    with_history = provider.get_tolerances(history=True)

    assert asked[0] == PAGE_URL + CURRENT_PAGE
    assert asked[1:] == [PAGE_URL + HISTORY_PAGE, PAGE_URL + CURRENT_PAGE]
    assert current_only == [Tolerance(year=2025, width=0.015)]
    assert [item.year for item in with_history] == [2024, 2004, 2003, 2001, 2000, 2025]


def test_tolerance_is_the_one_of_the_last_point_started() -> None:
    """2015 fica com os 2 p.p. de 2006, e 2026 com os 1,5 p.p. de 2017; antes de 1999
    não há tolerância."""
    assert tolerance(TOLERANCES, 2015) == 0.02
    assert tolerance(TOLERANCES, 2026) == 0.015
    assert tolerance(TOLERANCES, 1998) is None


def test_first_refresh_loads_the_history(session: Session) -> None:
    """Com o cache vazio, a primeira carga pede o histórico junto da regra em vigor."""
    provider = FakeToleranceProvider()

    result = refresh_tolerance(session, provider, NOW)

    assert result.updated
    assert provider.calls == [True]
    assert read_tolerances(session) == TOLERANCES


def test_second_refresh_does_not_hit_the_source(session: Session) -> None:
    """Dentro do intervalo de busca, o refresh não volta à fonte."""
    provider = FakeToleranceProvider()

    refresh_tolerance(session, provider, NOW)
    refresh_tolerance(session, provider, NOW + timedelta(hours=1))

    assert provider.calls == [True]


def test_later_refresh_checks_only_the_current_rule(session: Session) -> None:
    """Passado o intervalo, a conferência pede só a regra em vigor: o histórico já está
    no cache."""
    provider = FakeToleranceProvider()

    refresh_tolerance(session, provider, NOW)
    refresh_tolerance(session, provider, NOW + timedelta(hours=7))

    assert provider.calls == [True, False]
    assert read_tolerances(session) == TOLERANCES


def test_offline_source_with_an_empty_cache_warns_once(session: Session) -> None:
    """Sem rede e sem cache, o cache segue vazio e a falta é avisada só na primeira
    vez."""
    offline = FakeToleranceProvider(offline=True)

    first = refresh_tolerance(session, offline, NOW)
    second = refresh_tolerance(session, offline, NOW + timedelta(hours=7))

    assert read_tolerances(session) == []
    assert first.failed
    assert not second.failed


def test_offline_source_keeps_the_cached_tolerance(session: Session) -> None:
    """Com o cache cheio, uma falha de rede não é problema novo e não apaga nada."""
    refresh_tolerance(session, FakeToleranceProvider(), NOW)
    offline = FakeToleranceProvider(offline=True)

    result = refresh_tolerance(session, offline, NOW + timedelta(hours=7))

    assert not result.failed
    assert read_tolerances(session) == TOLERANCES


def test_refresh_endpoint_reports_the_tolerance(api: TestClient) -> None:
    """O refresh pela API também busca a tolerância e diz que ela foi atualizada."""
    body = api.post("/api/series/refresh").json()

    assert "inflation_tolerance" in body["datasets_updated"]
