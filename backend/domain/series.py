"""O registro das séries: de onde cada uma vem e quando a próxima referência sai."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import Protocol

from backend.core.enum import Periodicity, SeriesId, Source, Unit


@dataclass(frozen=True, slots=True, kw_only=True)
class Observation:
    """Valor na unidade da série, datado no dia 1 do mês de referência. Série anual é
    datada em 1º de janeiro."""

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
    `lag_months` meses depois, a partir do dia `release_day`; numa série anual, a do
    ano que contém esse mês. `first_date` é o primeiro mês que a fonte publica.

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
    # O CMN fixa a meta antes de o ano começar, então a do ano corrente já existe
    SeriesId.INFLATION_TARGET: SeriesSpec(
        source=Source.BCB_SGS,
        code="13521",
        unit=Unit.PERCENT_YEAR,
        first_date=date(2019, 1, 1),
        lag_months=0,
        release_day=1,
        periodicity=Periodicity.ANNUAL,
    ),
}

# Intervalo de tolerância em volta da meta, em vigor desde 2017: o teto é a meta mais
# 1,5 ponto percentual
TARGET_TOLERANCE = 0.015

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
