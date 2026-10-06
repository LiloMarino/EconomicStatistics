"""API de agregados v3 do IBGE: cada categoria da tabela traz a própria série, um
valor por período (`{"202201": "0.54"}`)."""

from __future__ import annotations

import gzip
import urllib.request
from datetime import date
from urllib.parse import urlencode

from pydantic import BaseModel, TypeAdapter

from backend.domain.series import Observation, SeriesSpec

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
    """`spec.code` é `tabela/variável/classificação/categoria`, no nível Brasil."""

    name = "ibge"

    def get_series(self, spec: SeriesSpec, start: date, end: date) -> list[Observation]:
        table, variable, classification, category = spec.code.split("/")
        query = urlencode(
            {
                "localidades": "N1[all]",
                "classificacao": f"{classification}[{category}]",
            }
        )
        url = (
            f"{BASE_URL}/{table}/periodos/{start:%Y%m}-{end:%Y%m}"
            f"/variaveis/{variable}?{query}"
        )
        with urllib.request.urlopen(url, timeout=TIMEOUT_SECONDS) as response:
            body: bytes = response.read()
            encoding = response.headers.get("Content-Encoding")
        # Parte dos endpoints responde gzip mesmo sem o cliente pedir
        return to_observations(gzip.decompress(body) if encoding == "gzip" else body)


def to_observations(body: bytes) -> list[Observation]:
    observations: list[Observation] = []
    for variable in _variables.validate_json(body):
        for result in variable.resultados:
            for series in result.series:
                for period, raw in series.serie.items():
                    value = _parse(raw)
                    if value is not None:
                        observations.append(
                            Observation(
                                ref_date=date(int(period[:4]), int(period[4:]), 1),
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
