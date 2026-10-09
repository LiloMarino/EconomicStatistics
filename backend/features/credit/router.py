from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.features.credit.service import credit
from backend.features.monthly_forecast_dto import MonthValueDTO

router = APIRouter(prefix="/api/credit", tags=["credit"])


class CostMonthDTO(BaseDTO):
    """O custo do crédito (ICC) e a Selic meta de fim do mês `ref_date`, ao ano e em
    fração (0.2419 é 24,19% ao ano)."""

    ref_date: date
    cost: float
    selic: float


class CostDTO(BaseDTO):
    """Os últimos 24 meses com ICC e Selic. `spread` é o ICC menos a Selic do último
    mês, em fração (0.09 é 9 pontos percentuais)."""

    months: list[CostMonthDTO]
    spread: float


class ConcessionsDTO(BaseDTO):
    """A variação em 12 meses das concessões de recursos livres, em fração (0.062 é
    6,2%), dos últimos 24 meses: a soma dos 12 meses que terminam em `ref_date` sobre a
    dos 12 anteriores. `households` não conta o rotativo do cartão."""

    business: list[MonthValueDTO]
    households: list[MonthValueDTO]


class BaselDTO(BaseDTO):
    """O índice de Basileia do sistema, o patrimônio de referência sobre os ativos
    ponderados pelo risco, em fração (0.1733 é 17,33%), em cada trimestre desde 2015,
    datado no último mês dele. `minimum` é o mínimo da regra (8%) e
    `minimum_with_buffer` soma o adicional de conservação (10,5%)."""

    quarters: list[MonthValueDTO]
    minimum: float
    minimum_with_buffer: float


class CreditDTO(BaseDTO):
    cost: CostDTO
    concessions: ConcessionsDTO
    basel: BaselDTO


@router.get("", responses=ERROR_RESPONSES)
def credit_overview(session: SessionDep) -> CreditDTO:
    return CreditDTO.model_validate(credit(session))
