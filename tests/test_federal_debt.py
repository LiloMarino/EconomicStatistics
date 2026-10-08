from __future__ import annotations

from datetime import date, datetime, timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.core.enum import DebtHolder, Indexer
from backend.domain.federal_debt import (
    DebtHolding,
    central_bank_share,
    composition,
    expected_stock_month,
    indexer_of,
    maturing_within_12m,
    maturity_profile,
)
from backend.features.debt.refresh import refresh_federal_debt
from backend.repository.federal_debt import last_stock_month, replace_stock
from tests.data_public_accounts import seed_public_accounts
from tests.fakes import FakeDebtProvider

JULY = date(2026, 7, 1)
# O estoque de jul/2026 já está publicado em 20/10/2026, e o de ago/2026 ainda não
NOW = datetime(2026, 10, 20, 10)


def _holding(
    title: str,
    maturity: date,
    value: float,
    holder: DebtHolder = DebtHolder.MARKET,
    external: bool = False,
) -> DebtHolding:
    return DebtHolding(
        stock_month=JULY,
        title=title,
        maturity=maturity,
        holder=holder,
        external=external,
        value=value,
    )


STOCK = [
    _holding("LFT 010327", date(2027, 3, 1), 50.0),
    _holding("NTN-B 150835", date(2035, 8, 15), 25.0),
    _holding("LTN 010127", date(2027, 1, 1), 10.0),
    _holding("NTN-F 010129", date(2029, 1, 1), 5.0),
    _holding("Global 2047", date(2047, 2, 21), 6.0, external=True),
    _holding("ntn-i 150428", date(2028, 4, 15), 4.0),
    _holding("LFT 010926", date(2026, 9, 1), 30.0, holder=DebtHolder.CENTRAL_BANK),
]


@pytest.mark.parametrize(
    ("title", "external", "indexer"),
    [
        ("LFT-TD 010330", False, Indexer.SELIC),
        ("LTN 010127", False, Indexer.FIXED),
        ("NTN-F 010129", False, Indexer.FIXED),
        ("NTN-B 150835", False, Indexer.IPCA),
        ("NTN-C 010131", False, Indexer.IGPM),
        ("Global 2047", True, Indexer.FX),
        ("ntn-i 150428", False, Indexer.OTHER),
        ("TDA29030300", False, Indexer.OTHER),
    ],
)
def test_indexer_comes_from_the_title_prefix(
    title: str, external: bool, indexer: Indexer
) -> None:
    """O prefixo diz o indexador, sem olhar a caixa; dívida externa é câmbio."""
    assert indexer_of(title, external) is indexer


def test_composition_counts_only_the_market() -> None:
    """A carteira do Banco Central fica fora da composição: dos 100 em mercado, 50 são
    Selic, 25 IPCA, 15 prefixados, 6 câmbio e 4 outros."""
    shares = {item.indexer: item.share for item in composition(STOCK)}

    assert shares == {
        Indexer.SELIC: 0.50,
        Indexer.FIXED: 0.15,
        Indexer.IPCA: 0.25,
        Indexer.IGPM: 0.0,
        Indexer.FX: 0.06,
        Indexer.OTHER: 0.04,
    }


def test_maturing_within_12m_goes_until_the_end_of_the_12th_month() -> None:
    """Com estoque de jul/2026, vence em 12 meses o que vence até 31/07/2027: a LFT de
    mar/2027 e a LTN de jan/2027, 60 dos 100 em mercado."""
    assert maturing_within_12m(STOCK, JULY) == pytest.approx(0.60)


def test_maturity_profile_groups_by_year() -> None:
    """As faixas saem por ano, com 2031 a 2035 juntos e o resto depois; faixa vazia
    sai, e as que começam em até 12 meses ficam marcadas."""
    buckets = maturity_profile(STOCK, JULY)

    assert [
        (item.start, item.end, item.share, item.within_12m) for item in buckets
    ] == [
        (date(2027, 1, 1), date(2027, 12, 31), pytest.approx(0.60), True),
        (date(2028, 1, 1), date(2028, 12, 31), pytest.approx(0.04), False),
        (date(2029, 1, 1), date(2029, 12, 31), pytest.approx(0.05), False),
        (date(2031, 1, 1), date(2035, 12, 31), pytest.approx(0.25), False),
        (date(2036, 1, 1), None, pytest.approx(0.06), False),
    ]


def test_central_bank_share_is_over_every_title() -> None:
    """30 na carteira do BC sobre os 130 emitidos dão 23,1%."""
    assert round(central_bank_share(STOCK) * 100, 1) == 23.1


def test_expected_stock_month_waits_until_the_25th() -> None:
    """O estoque de agosto passa a ser cobrado em 25 de outubro."""
    assert expected_stock_month(date(2026, 10, 24)) == JULY
    assert expected_stock_month(date(2026, 10, 25)) == date(2026, 8, 1)


def test_second_refresh_does_not_hit_the_source(session: Session) -> None:
    """Com o estoque esperado em cache, o refresh não baixa o arquivo de novo, nem 7
    horas depois."""
    provider = FakeDebtProvider(stock_month=JULY)

    first = refresh_federal_debt(session, provider, NOW)
    refresh_federal_debt(session, provider, NOW + timedelta(hours=7))

    assert first.updated
    assert provider.calls == 1
    assert last_stock_month(session) == JULY


def test_offline_source_keeps_cache_and_warns_once(session: Session) -> None:
    """Sem rede, o estoque fica como estava e a falta é avisada só na primeira vez."""
    replace_stock(session, STOCK)
    session.commit()
    offline = FakeDebtProvider(offline=True)
    later = NOW + timedelta(days=60)

    first = refresh_federal_debt(session, offline, later)
    second = refresh_federal_debt(session, offline, later + timedelta(hours=7))

    assert last_stock_month(session) == JULY
    assert first.failed
    assert not second.failed
    assert offline.calls == 2


def test_federal_debt_endpoint_reads_the_last_stock(
    api: TestClient, session: Session
) -> None:
    """A tela recebe o estoque de jul/2026, a composição em mercado e o prazo médio do
    SGS em anos: 47,99 meses são 4,0 anos."""
    replace_stock(session, STOCK)
    seed_public_accounts(session)

    body = api.get("/api/debt/federal").json()

    assert body["stock_month"] == "2026-07-01"
    assert body["maturing_12m"] == pytest.approx(0.60)
    assert round(body["central_bank_share"] * 100, 1) == 23.1
    assert body["average_maturity"] == {
        "ref_date": "2026-08-01",
        "years": pytest.approx(47.99 / 12),
    }
    assert [item["ref_date"] for item in body["composition"]] == ["2026-07-01"]


def test_refresh_endpoint_reports_the_federal_debt(api: TestClient) -> None:
    """O refresh pela API também baixa a dívida federal e diz que ela foi atualizada."""
    body = api.post("/api/series/refresh").json()

    assert body["datasets_updated"] == ["federal_debt_stock"]
    assert body["datasets_failed"] == []
