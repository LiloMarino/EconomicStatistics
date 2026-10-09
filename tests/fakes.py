from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, timedelta

from backend.core.enum import (
    Country,
    DebtHolder,
    FocusIndicator,
    FocusTargetKind,
    ImfIndicator,
    Periodicity,
    Unit,
)
from backend.domain.copom import Meeting
from backend.domain.coverage import month_start, quarter_start
from backend.domain.federal_debt import DebtHolding
from backend.domain.focus import Expectation, week_start
from backend.domain.imf import CountryObservation
from backend.domain.inflation_target import Tolerance
from backend.domain.series import Observation, SeriesSpec
from tests.data_ipca import TOLERANCES

FAKE_VALUES = {
    Unit.PERCENT_MONTH: 0.5,
    Unit.PERCENT_YEAR: 15.0,
    Unit.PERCENT_GDP: 2.0,
    Unit.BRL_PER_USD: 5.0,
}


@dataclass
class FakeProvider:
    """Fonte que publica um valor por período, de `first_date` até o período de `end`:
    0,5% nas séries em % ao mês, 2% nas em % do PIB, R$ 5 no dólar e 1.000 nas
    demais. Série trimestral publica no 1º mês de cada trimestre, a anual ganha 3% em
    cada janeiro e a diária publica 15% ao ano em todos os dias."""

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
        if spec.periodicity is Periodicity.DAILY:
            days = (end - max(start, spec.first_date)).days
            return [
                Observation(
                    ref_date=max(start, spec.first_date) + timedelta(days=offset),
                    value=value,
                )
                for offset in range(days + 1)
            ]
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


@dataclass
class FakeFocusProvider:
    """O Focus com uma pesquisa por sexta em `surveys`, cada uma com a previsão do IPCA
    do ano dela: 5% mais 0,01 ponto por semana."""

    surveys: tuple[date, ...] = (date(2026, 9, 25), date(2026, 10, 2))
    name: str = "fake-focus"
    offline: bool = False
    calls: list[date | None] = field(default_factory=list[date | None])

    def get_expectations(self, since: date | None) -> list[Expectation]:
        self.calls.append(since)
        if self.offline:
            raise ConnectionError("sem rede")
        return [
            Expectation(
                indicator=FocusIndicator.IPCA,
                target_kind=FocusTargetKind.YEAR,
                target_year=survey.year,
                target_period=0,
                survey_date=survey,
                median=5.0 + index * 0.01,
                respondents=140,
            )
            for index, survey in enumerate(self.surveys)
            if since is None or survey >= week_start(since)
        ]


@dataclass
class FakeCopomProvider:
    """O Copom com duas reuniões por ano pedido, em março e em novembro, nos dias 16 e
    17 e 3 e 4."""

    name: str = "fake-copom"
    offline: bool = False
    calls: list[tuple[int, int]] = field(default_factory=list[tuple[int, int]])

    def get_meetings(self, first_year: int, last_year: int) -> list[Meeting]:
        self.calls.append((first_year, last_year))
        if self.offline:
            raise ConnectionError("sem rede")
        return [
            Meeting(
                year=year,
                number=number,
                first_day=date(year, month, day),
                second_day=date(year, month, day + 1),
            )
            for year in range(first_year, last_year + 1)
            for number, (month, day) in enumerate(((3, 16), (11, 3)), start=1)
        ]


@dataclass
class FakeToleranceProvider:
    """A tolerância do Banco Central: o histórico inteiro, ou só a regra em vigor,
    que é o último ponto."""

    name: str = "fake-target"
    offline: bool = False
    calls: list[bool] = field(default_factory=list[bool])

    def get_tolerances(self, *, history: bool) -> list[Tolerance]:
        self.calls.append(history)
        if self.offline:
            raise ConnectionError("sem rede")
        return list(TOLERANCES) if history else TOLERANCES[-1:]


@dataclass
class FakeImfProvider:
    """O FMI com a dívida bruta de 2024 a 2027 dos quatro países, em % do PIB, e a
    inflação de 2024 e 2025, em % ao ano: o 2027 é projeção, e a Argentina não tem a
    inflação de 2025."""

    name: str = "fake-imf"
    offline: bool = False
    calls: int = 0

    def get_observations(self) -> list[CountryObservation]:
        self.calls += 1
        if self.offline:
            raise ConnectionError("sem rede")
        debt = [
            CountryObservation(
                country=country,
                indicator=ImfIndicator.GROSS_DEBT,
                year=year,
                value=100.0 + index * 10 + (year - 2024),
            )
            for index, country in enumerate(Country)
            for year in range(2024, 2028)
        ]
        inflation = [
            CountryObservation(
                country=country,
                indicator=ImfIndicator.INFLATION,
                year=year,
                value=3.0 + (year - 2024),
            )
            for country in Country
            for year in (2024, 2025)
            if not (country is Country.ARG and year == 2025)
        ]
        return [*debt, *inflation]
