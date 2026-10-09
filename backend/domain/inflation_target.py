"""A meta de inflação de cada ano e o intervalo de tolerância em volta dela."""

from __future__ import annotations

from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from typing import Protocol

from backend.domain.rates import PERCENT
from backend.domain.series import Observation

# Desde 2025 a meta é contínua: vale até o CMN mudá-la, sem ano final
CONTINUOUS_SINCE = 2025


@dataclass(frozen=True, slots=True, kw_only=True)
class Tolerance:
    """A distância do piso e do teto até a meta, em fração (0.015 é 1,5 p.p.), válida
    desde `year` até o ano anterior ao da tolerância seguinte."""

    year: int
    width: float


class InflationToleranceProvider(Protocol):
    name: str

    def get_tolerances(self, *, history: bool) -> list[Tolerance]:
        """A tolerância em vigor; com `history`, também a de cada ano desde 1999."""
        ...


@dataclass(frozen=True, slots=True, kw_only=True)
class TargetBand:
    """A meta e os limites do intervalo, em fração (0.03 é 3%)."""

    target: float
    floor: float
    ceiling: float


def tolerance(tolerances: Iterable[Tolerance], year: int) -> float | None:
    """A tolerância do ano: a do último ponto que começou até ele."""
    started = [item for item in tolerances if item.year <= year]
    return max(started, key=lambda item: item.year).width if started else None


def target_bands(
    targets: Iterable[Observation],
    years: Iterable[int],
    tolerances: Sequence[Tolerance],
) -> dict[int, TargetBand]:
    """A faixa de cada ano pedido que tem meta e tolerância. A série publica a meta em %
    no ano, datada em janeiro; depois do último ano publicado, a meta contínua segue
    valendo."""
    by_year = {item.ref_date.year: item.value / PERCENT for item in targets}
    last = max(by_year, default=None)
    bands: dict[int, TargetBand] = {}
    for year in years:
        target = by_year.get(year)
        if target is None and last is not None and CONTINUOUS_SINCE <= last < year:
            target = by_year[last]
        width = tolerance(tolerances, year)
        if target is None or width is None:
            continue
        bands[year] = TargetBand(
            target=target, floor=target - width, ceiling=target + width
        )
    return bands
