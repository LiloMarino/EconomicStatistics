"""A meta de inflação de cada ano e o intervalo de tolerância em volta dela."""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass

from backend.domain.rates import PERCENT
from backend.domain.series import Observation

# A tolerância em pontos percentuais, do primeiro ano em que passou a valer, como as
# resoluções do CMN fixaram: 2 p.p. de 1999 a 2002, 2,5 de 2003 a 2005, 2 de 2006 a
# 2016 e 1,5 desde 2017
TOLERANCE_SINCE: tuple[tuple[int, float], ...] = (
    (1999, 0.02),
    (2003, 0.025),
    (2006, 0.02),
    (2017, 0.015),
)
# Desde 2025 a meta é contínua: vale até o CMN mudá-la, sem ano final
CONTINUOUS_SINCE = 2025


@dataclass(frozen=True, slots=True, kw_only=True)
class TargetBand:
    """A meta e os limites do intervalo, em fração (0.03 é 3%)."""

    target: float
    floor: float
    ceiling: float


def tolerance(year: int) -> float:
    return next(value for start, value in reversed(TOLERANCE_SINCE) if year >= start)


def target_bands(
    targets: Iterable[Observation], years: Iterable[int]
) -> dict[int, TargetBand]:
    """A faixa de cada ano pedido que tem meta. A série publica a meta em % no ano,
    datada em janeiro; depois do último ano publicado, a meta contínua segue valendo."""
    by_year = {item.ref_date.year: item.value / PERCENT for item in targets}
    last = max(by_year, default=None)
    bands: dict[int, TargetBand] = {}
    for year in years:
        target = by_year.get(year)
        if target is None and last is not None and CONTINUOUS_SINCE <= last < year:
            target = by_year[last]
        if target is None:
            continue
        width = tolerance(year)
        bands[year] = TargetBand(
            target=target, floor=target - width, ceiling=target + width
        )
    return bands
