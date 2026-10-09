from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.core.enum import Indexer
from backend.features.debt.service import debt_overview, federal_debt

router = APIRouter(prefix="/api/debt", tags=["debt"])


class DebtLevelDTO(BaseDTO):
    """Dívida líquida do setor público e bruta do governo geral, em fração do PIB
    (0.6926 é 69,26%)."""

    ref_date: date
    net: float
    gross: float


class DebtRatesDTO(BaseDTO):
    """Os 12 meses que terminam em `ref_date`, em fração: `implicit_rate` é o r, juro
    médio da dívida líquida; `nominal_growth` é o g, crescimento do PIB nominal."""

    ref_date: date
    implicit_rate: float
    nominal_growth: float


class StabilizationDTO(BaseDTO):
    """A conta do primário que estabiliza a dívida/PIB, em fração. `debt` é a dívida
    líquida; `primary_surplus` é o superávit feito (negativo é déficit); `primary_gap`
    é o quanto falta do feito até o `stabilizing_primary`."""

    ref_date: date
    debt: float
    implicit_rate: float
    nominal_growth: float
    stabilizing_primary: float
    primary_surplus: float
    primary_gap: float


class LevelsForecastDTO(BaseDTO):
    """A dívida líquida e a bruta que o Focus espera para dezembro de cada ano, em
    fração do PIB."""

    survey_date: date
    years: list[DebtLevelDTO]


class DebtOverviewDTO(BaseDTO):
    levels: list[DebtLevelDTO]
    levels_forecast: LevelsForecastDTO | None
    rates: list[DebtRatesDTO]
    stabilization: StabilizationDTO


class AverageMaturityDTO(BaseDTO):
    ref_date: date
    years: float


class IndexerShareDTO(BaseDTO):
    indexer: Indexer
    share: float


class YearCompositionDTO(BaseDTO):
    """A fração da dívida federal em mercado de cada indexador no fim do mês."""

    ref_date: date
    shares: list[IndexerShareDTO]


class MaturityBucketDTO(BaseDTO):
    """A fração da dívida em mercado que vence de `start` até `end`; sem `end`, de
    `start` em diante. `within_12m` marca as faixas que começam nos 12 meses
    seguintes ao estoque."""

    start: date
    end: date | None
    share: float
    within_12m: bool


class FederalDebtDTO(BaseDTO):
    """O estoque do último mês do Tesouro. `stock_total` é o valor em R$ dos títulos
    em mercado, sem a carteira do Banco Central. As frações são da dívida em mercado, menos
    `central_bank_share`, que é a parte de todos os títulos emitidos na carteira do
    Banco Central. `average_maturity` vem do SGS, `null` antes de ele estar no cache."""

    stock_month: date
    stock_total: float
    maturing_12m: float
    central_bank_share: float
    average_maturity: AverageMaturityDTO | None
    composition: list[YearCompositionDTO]
    maturities: list[MaturityBucketDTO]


@router.get("", responses=ERROR_RESPONSES)
def debt(session: SessionDep) -> DebtOverviewDTO:
    return DebtOverviewDTO.model_validate(debt_overview(session))


@router.get("/federal", responses=ERROR_RESPONSES)
def federal(session: SessionDep) -> FederalDebtDTO:
    return FederalDebtDTO.model_validate(federal_debt(session))
