"""As novidades: a referência em cache que passou da que o usuário já viu."""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass
from datetime import date

from backend.core.enum import Periodicity
from backend.domain.series import SERIES

# A série diária ganha ponto todo dia útil e ficaria sempre nova: as novidades são de
# mês, trimestre e ano
NEWS_SERIES = frozenset(
    series_id
    for series_id, spec in SERIES.items()
    if spec.periodicity not in (Periodicity.DAILY, Periodicity.BUSINESS_DAILY)
)


@dataclass(frozen=True, slots=True, kw_only=True)
class Arrival[K]:
    key: K
    seen_until: date
    last: date


def arrivals[K](last: Mapping[K, date], seen: Mapping[K, date]) -> list[Arrival[K]]:
    """Só a fonte com marca tem novidade: a marca nasce na primeira carga, que é a
    linha de base."""
    return [
        Arrival(key=key, seen_until=seen[key], last=last_date)
        for key, last_date in last.items()
        if key in seen and last_date > seen[key]
    ]
