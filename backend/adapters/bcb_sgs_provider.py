from __future__ import annotations

import urllib.error
import urllib.request
from datetime import date, datetime, timedelta

from pydantic import BaseModel, TypeAdapter

from backend.domain.series import Observation, SeriesSpec

# O SGS recusa (406) janela de série diária maior que 10 anos
MAX_WINDOW = timedelta(days=3650)
TIMEOUT_SECONDS = 30


class SgsRow(BaseModel):
    data: str
    valor: str


_rows = TypeAdapter(list[SgsRow])


class BcbSgsProvider:
    name = "bcb-sgs"

    def get_series(self, spec: SeriesSpec, start: date, end: date) -> list[Observation]:
        observations: list[Observation] = []
        window_start = start
        while window_start <= end:
            window_end = min(window_start + MAX_WINDOW, end)
            observations.extend(_fetch(spec.code, window_start, window_end))
            window_start = window_end + timedelta(days=1)
        return observations


def _fetch(code: str, start: date, end: date) -> list[Observation]:
    url = (
        f"https://api.bcb.gov.br/dados/serie/bcdata.sgs.{code}/dados?formato=json"
        f"&dataInicial={start:%d/%m/%Y}&dataFinal={end:%d/%m/%Y}"
    )
    try:
        with urllib.request.urlopen(url, timeout=TIMEOUT_SECONDS) as response:
            body: bytes = response.read()
    except urllib.error.HTTPError as error:
        # Janela sem nenhum valor publicado é 404 no SGS
        if error.code == 404:
            return []
        raise
    return to_observations(body)


def to_observations(body: bytes) -> list[Observation]:
    return [
        Observation(
            ref_date=datetime.strptime(row.data, "%d/%m/%Y").date(),
            value=float(row.valor),
        )
        for row in _rows.validate_json(body)
    ]
