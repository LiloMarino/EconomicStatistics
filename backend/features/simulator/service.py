from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import (
    Country,
    DebtCaseGroup,
    DebtCaseId,
    DebtTrend,
    ImfIndicator,
)
from backend.core.errors import InvalidRequestError, MissingDataError
from backend.domain.debt import debt_path, debt_trend, stabilizing_primary, still_rising
from backend.domain.debt_cases import CASES, CaseContext, DebtCase, brazil_today
from backend.domain.rates import PERCENT
from backend.features.debt.service import debt_overview
from backend.repository.imf import read_observations

# Horizonte da trajetória nos casos, e o máximo que o simulador aceita
CASE_YEARS = 10
MAX_YEARS = 50


@dataclass(frozen=True, slots=True, kw_only=True)
class FirstYear:
    """A conta do primeiro ano: a dívida depois do juro e do crescimento, e depois de
    abatido o primário."""

    grown_debt: float
    debt: float


@dataclass(frozen=True, slots=True, kw_only=True)
class Simulation:
    years: int
    path: list[float]
    end: float
    change: float
    trend: DebtTrend
    still_rising: bool
    stabilizing_primary: float
    primary_gap: float
    rate_minus_growth: float
    first_year: FirstYear


@dataclass(frozen=True, slots=True, kw_only=True)
class SimulatedCase:
    id: DebtCaseId
    label: str
    group: DebtCaseGroup
    debt: float
    rate: float
    growth: float
    primary: float
    context: CaseContext | None
    path: list[float]
    end: float
    rate_minus_growth: float


@dataclass(frozen=True, slots=True, kw_only=True)
class YearValue:
    year: int
    value: float


@dataclass(frozen=True, slots=True, kw_only=True)
class CountryHistory:
    country: Country
    debt: list[YearValue]
    inflation: YearValue | None


def simulate(
    *, debt: float, rate: float, growth: float, primary: float, years: int
) -> Simulation:
    if not 1 <= years <= MAX_YEARS:
        raise InvalidRequestError(f"O horizonte vai de 1 a {MAX_YEARS} anos.")
    if debt < 0:
        raise InvalidRequestError("A dívida não pode ser negativa.")
    if rate <= -1 or growth <= -1:
        raise InvalidRequestError(
            "Juro e crescimento têm de ficar acima de -100% ao ano."
        )
    path = debt_path(debt, rate, growth, primary, years)
    needed = stabilizing_primary(debt, rate, growth)
    return Simulation(
        years=years,
        path=path,
        end=path[-1],
        change=path[-1] - debt,
        trend=debt_trend(path),
        still_rising=still_rising(path),
        stabilizing_primary=needed,
        primary_gap=needed - primary,
        rate_minus_growth=rate - growth,
        first_year=FirstYear(grown_debt=debt * (1 + rate) / (1 + growth), debt=path[1]),
    )


def _simulate_case(case: DebtCase) -> SimulatedCase:
    path = debt_path(case.debt, case.rate, case.growth, case.primary, CASE_YEARS)
    return SimulatedCase(
        id=case.id,
        label=case.label,
        group=case.group,
        debt=case.debt,
        rate=case.rate,
        growth=case.growth,
        primary=case.primary,
        context=case.context,
        path=path,
        end=path[-1],
        rate_minus_growth=case.rate - case.growth,
    )


def debt_cases(session: Session) -> list[SimulatedCase]:
    """O Brasil de hoje, com os números da tela Dívida, seguido dos outros casos."""
    stabilization = debt_overview(session).stabilization
    today = brazil_today(
        debt=stabilization.debt,
        rate=stabilization.implicit_rate,
        growth=stabilization.nominal_growth,
        primary=stabilization.primary_surplus,
    )
    return [_simulate_case(case) for case in (today, *CASES)]


def country_histories(session: Session, today: date) -> list[CountryHistory]:
    """A dívida bruta de cada país e a inflação do último ano com dado, só dos anos já
    fechados: do ano corrente em diante o FMI projeta."""
    debt = read_observations(session, ImfIndicator.GROSS_DEBT)
    if not debt:
        raise MissingDataError("A dívida dos países do FMI ainda não está em cache.")
    inflation = read_observations(session, ImfIndicator.INFLATION)
    histories: list[CountryHistory] = []
    for country in Country:
        years = [
            YearValue(year=item.year, value=item.value / PERCENT)
            for item in debt
            if item.country == country and item.year < today.year
        ]
        prices = [
            YearValue(year=item.year, value=item.value / PERCENT)
            for item in inflation
            if item.country == country and item.year < today.year
        ]
        histories.append(
            CountryHistory(
                country=country, debt=years, inflation=prices[-1] if prices else None
            )
        )
    return histories
