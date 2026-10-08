"""API de agregados v3 do IBGE: cada categoria da tabela traz a própria série, um
valor por período (`{"202201": "0.54"}`). O período é `AAAAMM` na tabela mensal e
`AAAATT` na trimestral (`202602` é o 2º trimestre)."""

from __future__ import annotations

import gzip
import urllib.request
from datetime import date
from urllib.parse import urlencode

from pydantic import BaseModel, TypeAdapter

from backend.core.enum import Periodicity
from backend.domain.series import Observation, SeriesSpec, code_ranges

BASE_URL = "https://servicodados.ibge.gov.br/api/v3/agregados"
TIMEOUT_SECONDS = 30
# Convenção do IBGE: "-" é zero absoluto; "..", "..." e "X" são valor inexistente
# (não se aplica, não disponível, omitido por sigilo).
ABSOLUTE_ZERO = "-"
NO_VALUE = frozenset({"..", "...", "X"})


class AggregateSeries(BaseModel):
    serie: dict[str, str | None]


class AggregateResult(BaseModel):
    series: list[AggregateSeries]


class AggregateVariable(BaseModel):
    resultados: list[AggregateResult]


_variables = TypeAdapter(list[AggregateVariable])


class IbgeAggregatesProvider:
    """Cada código é `tabela/variável/classificação/categoria`, no nível Brasil."""

    name = "ibge"

    def get_series(self, spec: SeriesSpec, start: date, end: date) -> list[Observation]:
        """Um pedido por tabela que cobre o intervalo, emendados em ordem de data."""
        return [
            observation
            for item in code_ranges(spec, start, end)
            for observation in self._get_table(
                item.code, item.start, item.end, spec.periodicity
            )
        ]

    def _get_table(
        self, code: str, start: date, end: date, periodicity: Periodicity
    ) -> list[Observation]:
        table, variable, classification, category = code.split("/")
        query = urlencode(
            {
                "localidades": "N1[all]",
                "classificacao": f"{classification}[{category}]",
            }
        )
        url = (
            f"{BASE_URL}/{table}/periodos/{_period(start, periodicity)}"
            f"-{_period(end, periodicity)}/variaveis/{variable}?{query}"
        )
        with urllib.request.urlopen(url, timeout=TIMEOUT_SECONDS) as response:
            body: bytes = response.read()
            encoding = response.headers.get("Content-Encoding")
        # Parte dos endpoints responde gzip mesmo sem o cliente pedir
        return to_observations(
            gzip.decompress(body) if encoding == "gzip" else body, periodicity
        )


def _period(day: date, periodicity: Periodicity) -> str:
    if periodicity is Periodicity.QUARTERLY:
        return f"{day.year}{(day.month - 1) // 3 + 1:02d}"
    return f"{day:%Y%m}"


def _ref_date(period: str, periodicity: Periodicity) -> date:
    """Mensal vira o dia 1 do mês, e trimestral, o dia 1 do 1º mês do trimestre."""
    year, number = int(period[:4]), int(period[4:])
    if periodicity is Periodicity.QUARTERLY:
        return date(year, (number - 1) * 3 + 1, 1)
    return date(year, number, 1)


def to_observations(body: bytes, periodicity: Periodicity) -> list[Observation]:
    observations: list[Observation] = []
    for variable in _variables.validate_json(body):
        for result in variable.resultados:
            for series in result.series:
                for period, raw in series.serie.items():
                    value = _parse(raw)
                    if value is not None:
                        observations.append(
                            Observation(
                                ref_date=_ref_date(period, periodicity),
                                value=value,
                            )
                        )
    return sorted(observations, key=lambda item: item.ref_date)


def _parse(raw: str | None) -> float | None:
    if raw is None or raw in NO_VALUE:
        return None
    if raw == ABSOLUTE_ZERO:
        return 0.0
    return float(raw)
