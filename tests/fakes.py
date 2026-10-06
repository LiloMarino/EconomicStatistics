from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date

from backend.core.enum import Unit
from backend.domain.coverage import month_start
from backend.domain.series import Observation, SeriesSpec


@dataclass
class FakeProvider:
    """Fonte que publica um valor por mês, de `first_date` até o mês de `end`: 0,5% nas
    séries em % e R$ 1.000 nas em reais."""

    name: str = "fake"
    offline: bool = False
    calls: list[tuple[str, date, date]] = field(
        default_factory=list[tuple[str, date, date]]
    )

    def get_series(self, spec: SeriesSpec, start: date, end: date) -> list[Observation]:
        self.calls.append((spec.code, start, end))
        if self.offline:
            raise ConnectionError("sem rede")
        value = 0.5 if spec.unit is Unit.PERCENT_MONTH else 1000.0
        observations: list[Observation] = []
        month = month_start(max(start, spec.first_date))
        while month <= end:
            observations.append(Observation(ref_date=month, value=value))
            month = date(month.year + month.month // 12, month.month % 12 + 1, 1)
        return observations
