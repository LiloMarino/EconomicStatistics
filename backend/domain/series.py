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
class SeriesSpec:
    """`code` é o endereço da série na fonte. A referência do mês M fica disponível
    `lag_months` meses depois, a partir do dia `release_day`; numa série anual, a do
    ano que contém esse mês."""

    source: Source
    code: str
    unit: Unit
    first_date: date
    lag_months: int
    release_day: int
    periodicity: Periodicity = Periodicity.MONTHLY


class SeriesProvider(Protocol):
    name: str

    def get_series(self, spec: SeriesSpec, start: date, end: date) -> list[Observation]:
        """Valores com referência de `start` a `end`, inclusive."""
        ...


# A tabela 7060 do IBGE é o IPCA por grupo desde jan/2020; o IBGE publica o mês por
# volta do dia 10 do seguinte, e o dia 15 dá a folga.
IPCA_GROUPS_START = date(2020, 1, 1)
IPCA_RELEASE_DAY = 15


def _ipca_7060(category: int) -> SeriesSpec:
    return SeriesSpec(
        source=Source.IBGE,
        code=f"7060/63/315/{category}",
        unit=Unit.PERCENT_MONTH,
        first_date=IPCA_GROUPS_START,
        lag_months=1,
        release_day=IPCA_RELEASE_DAY,
    )


SERIES: dict[SeriesId, SeriesSpec] = {
    SeriesId.IPCA_GENERAL: _ipca_7060(7169),
    SeriesId.IPCA_FOOD: _ipca_7060(7170),
    SeriesId.IPCA_HOUSING: _ipca_7060(7445),
    SeriesId.IPCA_HOUSEHOLD: _ipca_7060(7486),
    SeriesId.IPCA_APPAREL: _ipca_7060(7558),
    SeriesId.IPCA_TRANSPORT: _ipca_7060(7625),
    SeriesId.IPCA_HEALTH: _ipca_7060(7660),
    SeriesId.IPCA_PERSONAL: _ipca_7060(7712),
    SeriesId.IPCA_EDUCATION: _ipca_7060(7766),
    SeriesId.IPCA_COMMUNICATION: _ipca_7060(7786),
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
