"""O registro das séries: de onde cada uma vem e quando a próxima referência sai."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import Protocol

from backend.core.enum import Periodicity, SeriesId, Source, Unit


@dataclass(frozen=True, slots=True, kw_only=True)
class Observation:
    """Valor na unidade da série, datado no dia 1 do mês de referência. Série
    trimestral é datada no 1º dia do trimestre, a anual em 1º de janeiro e a diária no
    próprio dia."""

    ref_date: date
    value: float


@dataclass(frozen=True, slots=True, kw_only=True)
class EarlierCode:
    """O endereço da mesma série numa tabela antiga da fonte, que vale até
    `last_ref_date`, inclusive."""

    code: str
    last_ref_date: date


@dataclass(frozen=True, slots=True, kw_only=True)
class CodeRange:
    code: str
    start: date
    end: date


@dataclass(frozen=True, slots=True, kw_only=True)
class SeriesSpec:
    """`code` é o endereço da série na fonte. A referência do mês M fica disponível
    `lag_months` meses depois, a partir do dia `release_day`; numa série trimestral ou
    anual, a do trimestre ou do ano que contém esse mês. `first_date` é o primeiro mês
    que a fonte publica.

    Quando a fonte trocou de tabela, `earlier_codes` traz as tabelas antigas em ordem
    de data, e `code` vale do mês seguinte ao da última delas em diante."""

    source: Source
    code: str
    unit: Unit
    first_date: date
    lag_months: int
    release_day: int
    periodicity: Periodicity = Periodicity.MONTHLY
    earlier_codes: tuple[EarlierCode, ...] = ()


def _next_month(day: date) -> date:
    return date(day.year + day.month // 12, day.month % 12 + 1, 1)


def code_ranges(spec: SeriesSpec, start: date, end: date) -> list[CodeRange]:
    """Os endereços que cobrem o pedido de `start` a `end`, cada um no trecho de datas
    em que vale."""
    ranges: list[CodeRange] = []
    segment_start = spec.first_date
    for earlier in spec.earlier_codes:
        ranges.append(
            CodeRange(code=earlier.code, start=segment_start, end=earlier.last_ref_date)
        )
        segment_start = _next_month(earlier.last_ref_date)
    ranges.append(CodeRange(code=spec.code, start=segment_start, end=end))
    return [
        CodeRange(code=item.code, start=max(item.start, start), end=min(item.end, end))
        for item in ranges
        if item.start <= end and item.end >= start
    ]


class SeriesProvider(Protocol):
    name: str

    def get_series(self, spec: SeriesSpec, start: date, end: date) -> list[Observation]:
        """Valores com referência de `start` a `end`, inclusive."""
        ...


# O IPCA com os 9 grupos de hoje sai em quatro tabelas do IBGE que se emendam sem
# sobreposição, com a mesma variável (63) e os mesmos códigos de categoria: 655, 2938,
# 1419 e a 7060, desde jan/2020. Antes de ago/1999 a estrutura tinha 7 grupos. O IBGE
# publica o mês por volta do dia 10 do seguinte, e o dia 15 dá a folga.
IPCA_GROUPS_START = date(1999, 8, 1)
IPCA_EARLIER_TABLES = (
    (655, date(2006, 6, 1)),
    (2938, date(2011, 12, 1)),
    (1419, date(2019, 12, 1)),
)
IPCA_RELEASE_DAY = 15


def _ipca(category: int) -> SeriesSpec:
    return SeriesSpec(
        source=Source.IBGE,
        code=f"7060/63/315/{category}",
        unit=Unit.PERCENT_MONTH,
        first_date=IPCA_GROUPS_START,
        lag_months=1,
        release_day=IPCA_RELEASE_DAY,
        earlier_codes=tuple(
            EarlierCode(code=f"{table}/63/315/{category}", last_ref_date=last)
            for table, last in IPCA_EARLIER_TABLES
        ),
    )


# A nota de estatísticas do setor externo do BCB sai perto do fim do mês seguinte ao
# de referência
EXTERNAL_NOTE_RELEASE_DAY = 28


def _external_note(code: str, first_date: date) -> SeriesSpec:
    return SeriesSpec(
        source=Source.BCB_SGS,
        code=code,
        unit=Unit.PERCENT_GDP,
        first_date=first_date,
        lag_months=1,
        release_day=EXTERNAL_NOTE_RELEASE_DAY,
    )


def _international_position(code: str) -> SeriesSpec:
    """O BCB publica o estoque do trimestre em até três meses depois do fim dele: o do
    2º trimestre (abr a jun) é cobrado a partir de 28 de setembro."""
    return SeriesSpec(
        source=Source.BCB_SGS,
        code=code,
        unit=Unit.USD_MILLION,
        first_date=date(2002, 1, 1),
        lag_months=5,
        release_day=EXTERNAL_NOTE_RELEASE_DAY,
        periodicity=Periodicity.QUARTERLY,
    )


# A nota de estatísticas fiscais do BCB sai perto do fim do mês seguinte ao de
# referência; o dia 5 do outro mês dá a folga
FISCAL_NOTE_LAG_MONTHS = 2
FISCAL_NOTE_RELEASE_DAY = 5


def _fiscal_note(code: str, unit: Unit, first_date: date) -> SeriesSpec:
    return SeriesSpec(
        source=Source.BCB_SGS,
        code=code,
        unit=unit,
        first_date=first_date,
        lag_months=FISCAL_NOTE_LAG_MONTHS,
        release_day=FISCAL_NOTE_RELEASE_DAY,
    )


# A nota de estatísticas monetárias e de crédito do BCB sai perto do fim do mês
# seguinte ao de referência
CREDIT_NOTE_RELEASE_DAY = 28

# A NFSP é a necessidade de financiamento: valor positivo é déficit. As séries são
# sem desvalorização cambial, em % do PIB e acumuladas em 12 meses. As três do setor
# público consolidado fecham a conta nominal = primário + juros, e as de cada esfera
# somam as do consolidado, a menos do arredondamento do BCB.
NFSP_START = date(2002, 11, 1)
# A dívida líquida começa em dez/2001, e o PIB de 12 meses vem um ano antes dela, para
# o crescimento contra o ano anterior
NET_DEBT_START = date(2001, 12, 1)


SERIES: dict[SeriesId, SeriesSpec] = {
    SeriesId.IPCA_GENERAL: _ipca(7169),
    SeriesId.IPCA_FOOD: _ipca(7170),
    SeriesId.IPCA_HOUSING: _ipca(7445),
    SeriesId.IPCA_HOUSEHOLD: _ipca(7486),
    SeriesId.IPCA_APPAREL: _ipca(7558),
    SeriesId.IPCA_TRANSPORT: _ipca(7625),
    SeriesId.IPCA_HEALTH: _ipca(7660),
    SeriesId.IPCA_PERSONAL: _ipca(7712),
    SeriesId.IPCA_EDUCATION: _ipca(7766),
    SeriesId.IPCA_COMMUNICATION: _ipca(7786),
    SeriesId.INPC: SeriesSpec(
        source=Source.BCB_SGS,
        code="188",
        unit=Unit.PERCENT_MONTH,
        first_date=date(1979, 4, 1),
        lag_months=1,
        release_day=IPCA_RELEASE_DAY,
    ),
    # O SGS publica o mínimo do ano inteiro já em janeiro. A série começa no Real:
    # antes dele o valor está em outras moedas, e a razão entre dois meses deixa de
    # ser reajuste.
    SeriesId.MINIMUM_WAGE: SeriesSpec(
        source=Source.BCB_SGS,
        code="1619",
        unit=Unit.BRL,
        first_date=date(1994, 7, 1),
        lag_months=0,
        release_day=1,
    ),
    # O CMN fixa a meta antes de o ano começar, então a do ano corrente já existe. A
    # série começa no primeiro ano do regime de metas
    SeriesId.INFLATION_TARGET: SeriesSpec(
        source=Source.BCB_SGS,
        code="13521",
        unit=Unit.PERCENT_YEAR,
        first_date=date(1999, 1, 1),
        lag_months=0,
        release_day=1,
        periodicity=Periodicity.ANNUAL,
    ),
    # A meta Selic vigente em cada dia corrido. A fonte já preenche os dias seguintes com
    # a meta em vigor, e o fetch vai só até hoje. `first_date` é o primeiro dia publicado.
    SeriesId.SELIC_TARGET: SeriesSpec(
        source=Source.BCB_SGS,
        code="432",
        unit=Unit.PERCENT_YEAR,
        first_date=date(1999, 3, 5),
        lag_months=0,
        release_day=1,
        periodicity=Periodicity.DAILY,
    ),
    # A PTAX do último dia útil do mês, a mesma medida que o Focus pergunta. Começa no
    # Real: antes dele o valor está em outras moedas.
    SeriesId.DOLLAR_MONTH_END: SeriesSpec(
        source=Source.BCB_SGS,
        code="3696",
        unit=Unit.BRL_PER_USD,
        first_date=date(1994, 7, 1),
        lag_months=1,
        release_day=5,
    ),
    # Os acumulados em 12 meses começam em dez/1995, o primeiro com 12 meses de dado
    SeriesId.CURRENT_ACCOUNT_GDP: _external_note("23079", date(1995, 12, 1)),
    SeriesId.FDI_GDP: _external_note("23080", date(1995, 12, 1)),
    SeriesId.GDP_USD_12M: SeriesSpec(
        source=Source.BCB_SGS,
        code="4192",
        unit=Unit.USD_MILLION,
        first_date=date(1990, 2, 1),
        lag_months=1,
        release_day=EXTERNAL_NOTE_RELEASE_DAY,
    ),
    # Reservas no conceito liquidez, a posição do último dia do mês
    SeriesId.RESERVES: SeriesSpec(
        source=Source.BCB_SGS,
        code="3546",
        unit=Unit.USD_MILLION,
        first_date=date(1971, 1, 1),
        lag_months=1,
        release_day=10,
    ),
    SeriesId.IIP_ASSETS: _international_position("24011"),
    SeriesId.IIP_LIABILITIES: _international_position("24040"),
    SeriesId.NOMINAL_DEFICIT: _fiscal_note("5727", Unit.PERCENT_GDP, NFSP_START),
    SeriesId.PRIMARY_DEFICIT: _fiscal_note("5793", Unit.PERCENT_GDP, NFSP_START),
    SeriesId.NOMINAL_INTEREST: _fiscal_note("5760", Unit.PERCENT_GDP, NFSP_START),
    SeriesId.PRIMARY_DEFICIT_CENTRAL: _fiscal_note(
        "5783", Unit.PERCENT_GDP, NFSP_START
    ),
    SeriesId.PRIMARY_DEFICIT_REGIONAL: _fiscal_note(
        "5786", Unit.PERCENT_GDP, NFSP_START
    ),
    SeriesId.PRIMARY_DEFICIT_STATE_OWNED: _fiscal_note(
        "5789", Unit.PERCENT_GDP, NFSP_START
    ),
    SeriesId.NOMINAL_INTEREST_CENTRAL: _fiscal_note(
        "5750", Unit.PERCENT_GDP, NFSP_START
    ),
    SeriesId.NOMINAL_INTEREST_REGIONAL: _fiscal_note(
        "5753", Unit.PERCENT_GDP, NFSP_START
    ),
    SeriesId.NOMINAL_INTEREST_STATE_OWNED: _fiscal_note(
        "5756", Unit.PERCENT_GDP, NFSP_START
    ),
    SeriesId.NET_DEBT: _fiscal_note("4513", Unit.PERCENT_GDP, NET_DEBT_START),
    SeriesId.NET_DEBT_BRL: _fiscal_note("4478", Unit.BRL_MILLION, NET_DEBT_START),
    SeriesId.GROSS_DEBT: _fiscal_note("13762", Unit.PERCENT_GDP, date(2006, 12, 1)),
    SeriesId.GDP_12M: _fiscal_note("4382", Unit.BRL_MILLION, date(2000, 12, 1)),
    # Prazo médio, em meses, dos títulos do Tesouro emitidos no mercado interno, com a
    # carteira do Banco Central: pesa cada pagamento, cupons inclusive, e não só o
    # vencimento
    SeriesId.FEDERAL_DEBT_MATURITY: _fiscal_note(
        "10618", Unit.MONTHS, date(2000, 10, 1)
    ),
    # O IBGE divulga o PIB do trimestre no começo do terceiro mês depois do fim dele: o
    # do 2º tri (abr a jun) sai em setembro, e o lag conta do 1º mês do trimestre. A
    # variável é a taxa acumulada em quatro trimestres contra os quatro anteriores.
    SeriesId.GDP_GROWTH_4Q: SeriesSpec(
        source=Source.IBGE,
        code="5932/6562/11255/90707",
        unit=Unit.PERCENT_4_QUARTERS,
        first_date=date(1996, 1, 1),
        lag_months=5,
        release_day=5,
        periodicity=Periodicity.QUARTERLY,
    ),
    # O índice do IBC-Br sem ajuste sazonal. O BCB publica o mês perto da metade do
    # segundo mês seguinte.
    SeriesId.IBC_BR: SeriesSpec(
        source=Source.BCB_SGS,
        code="24363",
        unit=Unit.INDEX,
        first_date=date(2003, 1, 1),
        lag_months=2,
        release_day=20,
    ),
    # A PNAD Contínua é um trimestre móvel e o SGS data cada valor no último mês dele. O
    # IBGE divulga no fim do mês seguinte.
    SeriesId.UNEMPLOYMENT_RATE: SeriesSpec(
        source=Source.BCB_SGS,
        code="24369",
        unit=Unit.PERCENT,
        first_date=date(2012, 3, 1),
        lag_months=1,
        release_day=30,
    ),
    # O indicador de custo do crédito (ICC) do BCB, total, em % ao ano
    SeriesId.CREDIT_COST: SeriesSpec(
        source=Source.BCB_SGS,
        code="25351",
        unit=Unit.PERCENT_YEAR,
        first_date=date(2013, 1, 1),
        lag_months=1,
        release_day=CREDIT_NOTE_RELEASE_DAY,
    ),
    # Concessões de recursos livres: pessoas jurídicas (total) e pessoas físicas sem o
    # rotativo do cartão, em R$ milhões no mês
    SeriesId.CONCESSIONS_BUSINESS: SeriesSpec(
        source=Source.BCB_SGS,
        code="20635",
        unit=Unit.BRL_MILLION,
        first_date=date(2011, 3, 1),
        lag_months=1,
        release_day=CREDIT_NOTE_RELEASE_DAY,
    ),
    SeriesId.CONCESSIONS_HOUSEHOLDS: SeriesSpec(
        source=Source.BCB_SGS,
        code="20663",
        unit=Unit.BRL_MILLION,
        first_date=date(2011, 3, 1),
        lag_months=1,
        release_day=CREDIT_NOTE_RELEASE_DAY,
    ),
}

IPCA_GROUPS: tuple[SeriesId, ...] = (
    SeriesId.IPCA_FOOD,
    SeriesId.IPCA_HOUSING,
    SeriesId.IPCA_HOUSEHOLD,
    SeriesId.IPCA_APPAREL,
    SeriesId.IPCA_TRANSPORT,
    SeriesId.IPCA_HEALTH,
    SeriesId.IPCA_PERSONAL,
    SeriesId.IPCA_EDUCATION,
    SeriesId.IPCA_COMMUNICATION,
)
