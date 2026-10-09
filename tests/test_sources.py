"""Parse das fontes sobre bytes gravados, no formato que cada uma responde."""

from __future__ import annotations

import gzip
import json
import urllib.error
import urllib.request
from datetime import date
from email.message import Message
from types import TracebackType

import pytest

from backend.adapters import bcb_sgs_provider, ibge_provider, tesouro_debt_provider
from backend.adapters.bcb_ifdata_provider import BcbIfDataProvider, to_total
from backend.adapters.bcb_sgs_provider import BcbSgsProvider
from backend.adapters.ibge_provider import IbgeAggregatesProvider
from backend.core.enum import DebtHolder, Periodicity, SeriesId
from backend.domain.series import SERIES

IBGE_BODY = json.dumps(
    [
        {
            "id": "63",
            "variavel": "IPCA - Variação mensal",
            "unidade": "%",
            "resultados": [
                {
                    "classificacoes": [
                        {"id": "315", "categoria": {"7170": "1.Alimentação e bebidas"}}
                    ],
                    "series": [
                        {
                            "localidade": {"id": "1", "nome": "Brasil"},
                            "serie": {
                                "202201": "1.11",
                                "202202": "-",
                                "202203": "...",
                                "202204": "2.06",
                            },
                        }
                    ],
                }
            ],
        }
    ]
).encode()

SGS_BODY = (
    b'[{"data":"01/12/2021","valor":"1100.00"},{"data":"01/01/2022","valor":"1212.00"}]'
)


TESOURO_CSV = """Titulo/Contrato;Vencimento do Titulo/Contrato;Valor do Estoque;Quantidade do Estoque;Mes do Estoque;Classe da Carteira;Tipo de Divida
LFT 010327;01/03/2027;105332979214,57;10024063,00;07/2026;Mercado;Dívida Interna
LFT 010327;01/03/2027;100,43;1,00;07/2026;Mercado;Dívida Interna
ntn-i 150428;15/04/2028;1136198,09;286596,00;07/2026;Banco Central;Dívida Interna
Global 2047;21/02/2047;12024419745,52;2789332,00;07/2026;Mercado;Dívida Externa
""".encode()


class FakeResponse:
    def __init__(self, body: bytes, headers: dict[str, str]) -> None:
        self._body = body
        self.headers = Message()
        for key, value in headers.items():
            self.headers[key] = value

    def read(self) -> bytes:
        return self._body

    def __enter__(self) -> FakeResponse:
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        tb: TracebackType | None,
    ) -> None:
        return None


def test_ibge_dash_is_zero_and_dots_are_missing() -> None:
    """No IBGE, "-" é zero absoluto e "..." é valor inexistente, que fica de fora."""
    observations = ibge_provider.to_observations(IBGE_BODY, Periodicity.MONTHLY)

    assert [(item.ref_date, item.value) for item in observations] == [
        (date(2022, 1, 1), 1.11),
        (date(2022, 2, 1), 0.0),
        (date(2022, 4, 1), 2.06),
    ]


# Tabela trimestral do IBGE (5932), como a SIDRA respondeu em 2026-10-08
IBGE_GDP_BODY = json.dumps(
    [
        {
            "id": "6562",
            "variavel": "Taxa acumulada em quatro trimestres",
            "unidade": "%",
            "resultados": [
                {
                    "classificacoes": [
                        {
                            "id": "11255",
                            "categoria": {"90707": "PIB a preços de mercado"},
                        }
                    ],
                    "series": [
                        {
                            "localidade": {"id": "1", "nome": "Brasil"},
                            "serie": {
                                "202504": "2.3",
                                "202601": "2.0",
                                "202602": "1.9",
                            },
                        }
                    ],
                }
            ],
        }
    ]
).encode()


def test_ibge_quarter_is_dated_on_the_first_day_of_its_first_month() -> None:
    """Na tabela trimestral, `202602` é o 2º trimestre e vira 1º de abril."""
    observations = ibge_provider.to_observations(IBGE_GDP_BODY, Periodicity.QUARTERLY)

    assert [(item.ref_date, item.value) for item in observations] == [
        (date(2025, 10, 1), 2.3),
        (date(2026, 1, 1), 2.0),
        (date(2026, 4, 1), 1.9),
    ]


def test_ibge_quarterly_request_asks_the_quarter_periods(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """O URL da série trimestral pede os períodos como `AAAATT`, e não como `AAAAMM`."""
    urls: list[str] = []

    def fake_urlopen(url: str, timeout: float) -> FakeResponse:
        urls.append(url)
        return FakeResponse(IBGE_GDP_BODY, {})

    monkeypatch.setattr(urllib.request, "urlopen", fake_urlopen)
    IbgeAggregatesProvider().get_series(
        SERIES[SeriesId.GDP_GROWTH_4Q], date(2025, 10, 1), date(2026, 10, 8)
    )

    assert "/5932/periodos/202504-202604/variaveis/6562?" in urls[0]
    assert "classificacao=11255%5B90707%5D" in urls[0]


def test_ibge_request_reads_gzip_and_asks_the_spec_category(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """O fetcher descomprime o gzip que o IBGE manda sem pedir, e o URL leva a tabela,
    o período e a categoria do registro."""
    urls: list[str] = []

    def fake_urlopen(url: str, timeout: float) -> FakeResponse:
        urls.append(url)
        return FakeResponse(gzip.compress(IBGE_BODY), {"Content-Encoding": "gzip"})

    monkeypatch.setattr(urllib.request, "urlopen", fake_urlopen)
    observations = IbgeAggregatesProvider().get_series(
        SERIES[SeriesId.IPCA_FOOD], date(2022, 1, 1), date(2022, 4, 30)
    )

    assert len(observations) == 3
    assert "/7060/periodos/202201-202204/variaveis/63?" in urls[0]
    assert "classificacao=315%5B7170%5D" in urls[0]


def test_sgs_values_become_floats_dated_on_the_first() -> None:
    """O `valor` do SGS chega como string e vira float, datado no dia 1 do mês."""
    observations = bcb_sgs_provider.to_observations(SGS_BODY)

    assert [(item.ref_date, item.value) for item in observations] == [
        (date(2021, 12, 1), 1100.0),
        (date(2022, 1, 1), 1212.0),
    ]


def test_sgs_quarter_is_dated_on_its_first_month() -> None:
    """O SGS data o estoque trimestral no 1º dia do trimestre: 01/04 é o 2º."""
    body = b'[{"data":"01/01/2026","valor":"2460430"},{"data":"01/04/2026","valor":"2461469"}]'

    observations = bcb_sgs_provider.to_observations(body)

    assert [item.ref_date for item in observations] == [
        date(2026, 1, 1),
        date(2026, 4, 1),
    ]


def test_sgs_window_without_data_is_empty(monkeypatch: pytest.MonkeyPatch) -> None:
    """Janela sem nenhum valor publicado é 404 no SGS, e isso é lista vazia."""

    def fake_urlopen(url: str, timeout: float) -> FakeResponse:
        raise urllib.error.HTTPError(url, 404, "Not Found", Message(), None)

    monkeypatch.setattr(urllib.request, "urlopen", fake_urlopen)

    assert (
        BcbSgsProvider().get_series(
            SERIES[SeriesId.INPC], date(1970, 1, 1), date(1970, 12, 31)
        )
        == []
    )


def test_tesouro_rows_become_holdings() -> None:
    """O CSV do Tesouro vem em UTF-8, com vírgula decimal: cada linha vira uma posição
    datada no dia 1 do mês do estoque, e a linha repetida soma no valor."""
    holdings = tesouro_debt_provider.to_holdings(TESOURO_CSV)

    assert [
        (
            item.title,
            item.stock_month,
            item.maturity,
            item.holder,
            item.external,
            item.value,
        )
        for item in holdings
    ] == [
        (
            "LFT 010327",
            date(2026, 7, 1),
            date(2027, 3, 1),
            DebtHolder.MARKET,
            False,
            pytest.approx(105332979315.0),
        ),
        (
            "ntn-i 150428",
            date(2026, 7, 1),
            date(2028, 4, 15),
            DebtHolder.CENTRAL_BANK,
            False,
            pytest.approx(1136198.09),
        ),
        (
            "Global 2047",
            date(2026, 7, 1),
            date(2047, 2, 21),
            DebtHolder.MARKET,
            True,
            pytest.approx(12024419745.52),
        ),
    ]


def _ifdata_row(institution: str, balance: float | None) -> dict[str, object]:
    return {
        "TipoInstituicao": 1,
        "CodInst": institution,
        "AnoMes": "202509",
        "NumeroRelatorio": "5",
        "Conta": "79649",
        "Saldo": balance,
    }


# O começo da resposta do patrimônio de referência de set/2025, como o Olinda a
# devolveu em 2026-10-09: cada instituição vem em três linhas iguais
IFDATA_BODY = json.dumps(
    {
        "value": [
            *[_ifdata_row("00068987", 81255823.28)] * 3,
            *[_ifdata_row("00075847", 314500304.68)] * 3,
            *[_ifdata_row("03795072", None)] * 3,
        ]
    }
).encode()


def test_ifdata_sums_each_institution_once() -> None:
    """A conta soma uma linha por instituição, sem a repetição do Olinda nem o saldo
    vazio: 81,3 mi + 314,5 mi."""
    assert to_total(IFDATA_BODY) == pytest.approx(81255823.28 + 314500304.68)


def test_ifdata_quarter_not_yet_published_is_skipped() -> None:
    """Trimestre que ainda não saiu volta com a lista vazia e não vira observação; o
    publicado é datado no 1º mês do trimestre e pedido pelo último."""
    urls: list[str] = []

    def download(url: str) -> bytes:
        urls.append(url)
        return IFDATA_BODY if "202509" in url else b'{"value": []}'

    observations = BcbIfDataProvider(download).get_series(
        SERIES[SeriesId.BASEL_CAPITAL], date(2025, 7, 1), date(2025, 12, 31)
    )

    assert [item.ref_date for item in observations] == [date(2025, 7, 1)]
    assert len(urls) == 2
    assert "%40AnoMes=202509" in urls[0]
    assert "%40AnoMes=202512" in urls[1]
    assert "%24filter=Conta%20eq%20%2779649%27" in urls[0]
