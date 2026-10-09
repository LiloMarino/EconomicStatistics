from __future__ import annotations

import urllib.request
from collections.abc import Callable

from pydantic import BaseModel

from backend.core.enum import Country, ImfIndicator
from backend.domain.imf import CountryObservation

BASE_URL = "https://www.imf.org/external/datamapper/api/v1"
TIMEOUT_SECONDS = 30


class IndicatorValues(BaseModel):
    """`values[indicador][país][ano]`: a API devolve os ~226 países, qualquer que seja o
    filtro do pedido, e uma chave vazia nula ao lado do indicador."""

    values: dict[str, dict[str, dict[str, float]] | None]


def to_observations(body: bytes, indicator: ImfIndicator) -> list[CountryObservation]:
    """Os anos de cada país que o app usa; país sem dado no indicador não aparece."""
    by_country = (
        IndicatorValues.model_validate_json(body).values.get(indicator.value) or {}
    )
    return [
        CountryObservation(
            country=country, indicator=indicator, year=int(year), value=value
        )
        for country in Country
        for year, value in sorted(by_country.get(country.value, {}).items())
    ]


def _download(url: str) -> bytes:
    # A Akamai do FMI recusa o User-Agent de navegador e aceita o padrão do urllib
    with urllib.request.urlopen(url, timeout=TIMEOUT_SECONDS) as response:
        body: bytes = response.read()
    return body


class ImfDataMapperProvider:
    name = "imf-datamapper"

    def __init__(self, download: Callable[[str], bytes] = _download) -> None:
        self._download = download

    def get_observations(self) -> list[CountryObservation]:
        return [
            observation
            for indicator in ImfIndicator
            for observation in to_observations(
                self._download(f"{BASE_URL}/{indicator.value}"), indicator
            )
        ]
