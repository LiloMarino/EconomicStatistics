from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.core.enum import Country, DebtCaseGroup, DebtCaseId, DebtTrend
from backend.features.simulator.service import (
    CASE_YEARS,
    country_histories,
    debt_cases,
    simulate,
)

router = APIRouter(prefix="/api/debt/simulation", tags=["simulator"])


class FirstYearDTO(BaseDTO):
    """A conta do primeiro ano, em fração do PIB: `grown_debt` é a dívida depois do juro
    e do crescimento, `debt` é ela depois de abatido o primário."""

    grown_debt: float
    debt: float


class SimulationDTO(BaseDTO):
    """A trajetória da dívida/PIB em fração (0.8 é 80%), com a de hoje em `path[0]` e
    uma posição por ano. `change` é o fim menos o início; `still_rising` diz se o último
    ano ainda subiu; `stabilizing_primary` é o primário que deixa a dívida parada;
    `primary_gap` é o que falta dele até o primário escolhido (negativo é folga);
    `rate_minus_growth` é o r menos o g."""

    years: int
    path: list[float]
    end: float
    change: float
    trend: DebtTrend
    still_rising: bool
    stabilizing_primary: float
    primary_gap: float
    rate_minus_growth: float
    first_year: FirstYearDTO


class CaseContextDTO(BaseDTO):
    currency: str
    term: str
    lender: str
    story: str


class DebtCaseDTO(BaseDTO):
    """Um ponto de partida: dívida, juro, crescimento e primário em fração, a
    trajetória de `years` anos e `rate_minus_growth` (r menos g). O exemplo não tem
    `context`."""

    id: DebtCaseId
    label: str
    group: DebtCaseGroup
    debt: float
    rate: float
    growth: float
    primary: float
    context: CaseContextDTO | None
    path: list[float]
    end: float
    rate_minus_growth: float


class DebtCasesDTO(BaseDTO):
    years: int
    cases: list[DebtCaseDTO]


class YearValueDTO(BaseDTO):
    year: int
    value: float


class CountryHistoryDTO(BaseDTO):
    """A dívida bruta do governo geral em fração do PIB, ano a ano, e a inflação do
    último ano com dado do FMI (`null` sem dado)."""

    country: Country
    debt: list[YearValueDTO]
    inflation: YearValueDTO | None


class CountryHistoriesDTO(BaseDTO):
    countries: list[CountryHistoryDTO]


@router.get("", responses=ERROR_RESPONSES)
def simulation(
    debt: float, r: float, g: float, primary: float, years: int = CASE_YEARS
) -> SimulationDTO:
    """Tudo em fração: `debt=0.8` é 80% do PIB, `r=0.1` é 10% ao ano e `primary=0.0224`
    é um superávit de 2,24% do PIB."""
    return SimulationDTO.model_validate(
        simulate(debt=debt, rate=r, growth=g, primary=primary, years=years)
    )


@router.get("/cases", responses=ERROR_RESPONSES)
def cases(session: SessionDep) -> DebtCasesDTO:
    return DebtCasesDTO(
        years=CASE_YEARS,
        cases=[DebtCaseDTO.model_validate(item) for item in debt_cases(session)],
    )


@router.get("/countries", responses=ERROR_RESPONSES)
def countries(session: SessionDep) -> CountryHistoriesDTO:
    return CountryHistoriesDTO(
        countries=[
            CountryHistoryDTO.model_validate(item)
            for item in country_histories(session, date.today())
        ]
    )
