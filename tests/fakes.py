from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date

from backend.core.enum import DebtHolder, Periodicity, Unit
from backend.domain.coverage import month_start, quarter_start
from backend.domain.federal_debt import DebtHolding
from backend.domain.series import Observation, SeriesSpec

FAKE_VALUES = {
    Unit.PERCENT_MONTH: 0.5,
    Unit.PERCENT_GDP: 2.0,
    Unit.BRL_PER_USD: 5.0,
}


@dataclass
class FakeProvider:
    """Fonte que publica um valor por período, de `first_date` até o período de `end`:
    0,5% nas séries em % ao mês, 2% nas em % do PIB, R$ 5 no dólar e 1.000 nas
    demais. Série trimestral publica no 1º mês de cada trimestre, e a anual ganha 3% em
    cada janeiro."""

    name: str = "fake"
    offline: bool = False
    calls: list[tuple[str, date, date]] = field(
        default_factory=list[tuple[str, date, date]]
    )

    def get_series(self, spec: SeriesSpec, start: date, end: date) -> list[Observation]:
        self.calls.append((spec.code, start, end))
        if self.offline:
            raise ConnectionError("sem rede")
        if spec.periodicity is Periodicity.ANNUAL:
            return [
                Observation(ref_date=date(year, 1, 1), value=3.0)
                for year in range(max(start, spec.first_date).year, end.year + 1)
            ]
        value = FAKE_VALUES.get(spec.unit, 1000.0)
        quarterly = spec.periodicity is Periodicity.QUARTERLY
        first = max(start, spec.first_date)
        month = quarter_start(first) if quarterly else month_start(first)
        observations: list[Observation] = []
        while month <= end:
            observations.append(Observation(ref_date=month, value=value))
            month = month_start(month, -3 if quarterly else -1)
        return observations


@dataclass
class FakeDebtProvider:
    """O Tesouro com o estoque de um mês só, `stock_month`: um título em mercado e um
    na carteira do Banco Central."""

    stock_month: date = date(2026, 8, 1)
    name: str = "fake-tesouro"
    offline: bool = False
    calls: int = 0

    def get_stock(self) -> list[DebtHolding]:
        self.calls += 1
        if self.offline:
            raise ConnectionError("sem rede")
        return [
            DebtHolding(
                stock_month=self.stock_month,
                title="LFT 010327",
                maturity=date(2027, 3, 1),
                holder=holder,
                external=False,
                value=value,
            )
            for holder, value in (
                (DebtHolder.MARKET, 300.0),
                (DebtHolder.CENTRAL_BANK, 100.0),
            )
        ]
