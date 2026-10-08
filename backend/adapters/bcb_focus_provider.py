from __future__ import annotations

import urllib.parse
import urllib.request
from collections.abc import Callable, Iterable
from dataclasses import dataclass
from datetime import date, timedelta

from pydantic import BaseModel, Field

from backend.core.enum import FocusIndicator, FocusTargetKind
from backend.domain.focus import Expectation, week_start

BASE_URL = "https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata"
TIMEOUT_SECONDS = 60
# O Olinda devolve no máximo 10 mil linhas por consulta
PAGE_SIZE = 10_000
# Sextas por consulta: 25 pesquisas do mensal dão cerca de 5 mil linhas
DATES_PER_REQUEST = 25
FRIDAY = 4


class FocusRow(BaseModel):
    """Uma linha de qualquer endpoint, já na base de 30 dias (`baseCalculo` 0). O
    período previsto vem em `DataReferencia` (`10/2026`, `4/2026` ou `2026`) ou em
    `Reuniao` (`R8/2026`); no 12 meses à frente, em nenhum dos dois."""

    indicator: str = Field(alias="Indicador")
    detail: str | None = Field(default=None, alias="IndicadorDetalhe")
    survey_date: date = Field(alias="Data")
    reference: str | None = Field(default=None, alias="DataReferencia")
    meeting: str | None = Field(default=None, alias="Reuniao")
    median: float | None = Field(alias="Mediana")
    respondents: int | None = Field(default=None, alias="numeroRespondentes")


class FocusPage(BaseModel):
    value: list[FocusRow]


@dataclass(frozen=True, slots=True, kw_only=True)
class Endpoint:
    """`order` ordena as linhas de uma pesquisa sem empate, para a paginação não
    repetir nem pular linha."""

    name: str
    kind: FocusTargetKind
    first_date: date
    order: str
    extra_filter: str = ""


ENDPOINTS = (
    Endpoint(
        name="ExpectativaMercadoMensais",
        kind=FocusTargetKind.MONTH,
        first_date=date(2000, 1, 3),
        order="Data,Indicador,DataReferencia",
    ),
    Endpoint(
        name="ExpectativasMercadoTrimestrais",
        kind=FocusTargetKind.QUARTER,
        first_date=date(2001, 11, 6),
        order="Data,Indicador,DataReferencia",
    ),
    Endpoint(
        name="ExpectativasMercadoAnuais",
        kind=FocusTargetKind.YEAR,
        first_date=date(1999, 4, 30),
        order="Data,Indicador,IndicadorDetalhe,DataReferencia",
    ),
    Endpoint(
        name="ExpectativasMercadoSelic",
        kind=FocusTargetKind.MEETING,
        first_date=date(2004, 11, 18),
        order="Data,Reuniao",
    ),
    # A suavizada é a que o relatório publica
    Endpoint(
        name="ExpectativasMercadoInflacao12Meses",
        kind=FocusTargetKind.NEXT_12M,
        first_date=date(2001, 11, 7),
        order="Data,Indicador",
        extra_filter=" and Suavizada eq 'S'",
    ),
)

# O nome como o BCB escreve, com `IndicadorDetalhe` quando ele separa o indicador
INDICATOR_NAMES: dict[tuple[str, str | None], FocusIndicator] = {
    ("IPCA", None): FocusIndicator.IPCA,
    ("IPCA Administrados", None): FocusIndicator.IPCA_ADMINISTERED,
    ("IPCA Livres", None): FocusIndicator.IPCA_FREE,
    ("IPCA Serviços", None): FocusIndicator.IPCA_SERVICES,
    ("IPCA Bens industrializados", None): FocusIndicator.IPCA_INDUSTRIAL_GOODS,
    ("IPCA Alimentação no domicílio", None): FocusIndicator.IPCA_FOOD_AT_HOME,
    ("Câmbio", None): FocusIndicator.EXCHANGE_RATE,
    ("IGP-M", None): FocusIndicator.IGPM,
    ("Taxa de desocupação", None): FocusIndicator.UNEMPLOYMENT,
    ("Selic", None): FocusIndicator.SELIC,
    ("PIB Total", None): FocusIndicator.GDP,
    ("PIB Agropecuária", None): FocusIndicator.GDP_AGRICULTURE,
    ("PIB Indústria", None): FocusIndicator.GDP_INDUSTRY,
    ("PIB Serviços", None): FocusIndicator.GDP_SERVICES,
    (
        "PIB Despesa de consumo das famílias",
        None,
    ): FocusIndicator.GDP_HOUSEHOLD_CONSUMPTION,
    (
        "PIB Despesa de consumo da administração pública",
        None,
    ): FocusIndicator.GDP_GOVERNMENT_CONSUMPTION,
    ("PIB Formação Bruta de Capital Fixo", None): FocusIndicator.GDP_INVESTMENT,
    ("PIB Exportação de bens e serviços", None): FocusIndicator.GDP_EXPORTS,
    ("PIB Importação de bens e serviços", None): FocusIndicator.GDP_IMPORTS,
    ("Resultado primário", None): FocusIndicator.PRIMARY_BALANCE,
    ("Resultado nominal", None): FocusIndicator.NOMINAL_BALANCE,
    ("Dívida líquida do setor público", None): FocusIndicator.NET_DEBT,
    ("Dívida bruta do governo geral", None): FocusIndicator.GROSS_DEBT,
    ("Conta corrente", None): FocusIndicator.CURRENT_ACCOUNT,
    ("Balança comercial", "Saldo"): FocusIndicator.TRADE_BALANCE,
    ("Balança comercial", "Exportações"): FocusIndicator.EXPORTS,
    ("Balança comercial", "Importações"): FocusIndicator.IMPORTS,
    ("Investimento direto no país", None): FocusIndicator.FDI,
}


def ascii_key(name: str) -> str:
    """O nome sem os caracteres não ASCII. Parte dos endpoints entrega o "í" como
    `\\ufffd\\xad`, e sem os acentos o nome certo e o corrompido dão a mesma chave."""
    return "".join(char for char in name if char.isascii())


_INDICATORS = {
    (ascii_key(name), detail and ascii_key(detail)): indicator
    for (name, detail), indicator in INDICATOR_NAMES.items()
}


def indicator_of(name: str, detail: str | None) -> FocusIndicator | None:
    """Indicador que o Focus deixou de perguntar (IPC-Fipe, IGP-DI…) fica de fora."""
    return _INDICATORS.get((ascii_key(name), detail and ascii_key(detail)))


def target_of(kind: FocusTargetKind, row: FocusRow) -> tuple[int, int]:
    match kind:
        case FocusTargetKind.MONTH | FocusTargetKind.QUARTER:
            period, year = (row.reference or "").split("/")
            return int(year), int(period)
        case FocusTargetKind.YEAR:
            return int(row.reference or ""), 0
        case FocusTargetKind.MEETING:
            meeting, year = (row.meeting or "").removeprefix("R").split("/")
            return int(year), int(meeting)
        case FocusTargetKind.NEXT_12M:
            return 0, 0


def to_expectations(
    kind: FocusTargetKind, rows: Iterable[FocusRow]
) -> list[Expectation]:
    expectations: list[Expectation] = []
    for row in rows:
        indicator = indicator_of(row.indicator, row.detail)
        if indicator is None or row.median is None:
            continue
        year, period = target_of(kind, row)
        expectations.append(
            Expectation(
                indicator=indicator,
                target_kind=kind,
                target_year=year,
                target_period=period,
                survey_date=row.survey_date,
                median=row.median,
                respondents=row.respondents or 0,
            )
        )
    return expectations


def fridays(start: date, end: date) -> list[date]:
    """As sextas das semanas de `start` a `end`, sem passar de `end`."""
    days: list[date] = []
    day = week_start(start) + timedelta(days=FRIDAY)
    while day <= end:
        days.append(day)
        day += timedelta(weeks=1)
    return days


def _download(url: str) -> bytes:
    with urllib.request.urlopen(url, timeout=TIMEOUT_SECONDS) as response:
        body: bytes = response.read()
    return body


def _batches(days: list[date]) -> Iterable[list[date]]:
    for index in range(0, len(days), DATES_PER_REQUEST):
        yield days[index : index + DATES_PER_REQUEST]


class BcbFocusProvider:
    name = "bcb-focus"

    def __init__(
        self,
        download: Callable[[str], bytes] = _download,
        today: Callable[[], date] = date.today,
    ) -> None:
        self._download = download
        self._today = today

    def get_expectations(self, since: date | None) -> list[Expectation]:
        today = self._today()
        return [
            item
            for endpoint in ENDPOINTS
            for item in self._weekly(
                endpoint, max(since or endpoint.first_date, endpoint.first_date), today
            )
        ]

    def _weekly(
        self, endpoint: Endpoint, start: date, today: date
    ) -> list[Expectation]:
        """A pesquisa de sexta de cada semana. A semana sem pesquisa na sexta (feriado)
        é pedida de novo no dia anterior, até a segunda."""
        result: list[Expectation] = []
        pending = fridays(start, today)
        for days_back in range(FRIDAY + 1):
            if not pending:
                break
            asked = [day - timedelta(days=days_back) for day in pending]
            found = self._on_dates(endpoint, asked)
            result.extend(found)
            answered = {week_start(item.survey_date) for item in found}
            pending = [day for day in pending if week_start(day) not in answered]
        return result

    def _on_dates(self, endpoint: Endpoint, days: list[date]) -> list[Expectation]:
        result: list[Expectation] = []
        for batch in _batches(days):
            dates = " or ".join(f"Data eq '{day.isoformat()}'" for day in batch)
            query = {
                "$format": "json",
                "$top": str(PAGE_SIZE),
                "$orderby": endpoint.order,
                "$filter": f"baseCalculo eq 0{endpoint.extra_filter} and ({dates})",
            }
            skip = 0
            while True:
                url = f"{BASE_URL}/{endpoint.name}?" + urllib.parse.urlencode(
                    {**query, "$skip": str(skip)}, quote_via=urllib.parse.quote
                )
                page = FocusPage.model_validate_json(self._download(url)).value
                result.extend(to_expectations(endpoint.kind, page))
                if len(page) < PAGE_SIZE:
                    break
                skip += PAGE_SIZE
        return result
