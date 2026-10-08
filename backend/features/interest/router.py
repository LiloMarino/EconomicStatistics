from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.features.interest.service import interest

router = APIRouter(prefix="/api/interest", tags=["interest"])


class MonthRateDTO(BaseDTO):
    """A taxa do mês `ref_date`, em fração (0.1375 é 13,75%)."""

    ref_date: date
    rate: float


class RateForecastDTO(BaseDTO):
    """A taxa esperada em cada mês depois do último dado, pela pesquisa Focus de
    `survey_date`."""

    survey_date: date
    months: list[MonthRateDTO]


class SelicChangeDTO(BaseDTO):
    """O dia em que a meta passou de `before` para `after`, ao ano e em fração."""

    effective_date: date
    before: float
    after: float


class SelicDTO(BaseDTO):
    """A meta ao ano em vigor no fim de cada mês (no último, a de hoje), a de hoje em
    `current` e a previsão de fim de mês que sai das reuniões esperadas."""

    months: list[MonthRateDTO]
    current: float
    last_change: SelicChangeDTO | None
    forecast: RateForecastDTO | None


class InflationDTO(BaseDTO):
    """O IPCA acumulado em 12 meses, mês a mês, e a continuação pelo Focus."""

    months: list[MonthRateDTO]
    forecast: RateForecastDTO | None


class MeetingDTO(BaseDTO):
    """A reunião de ordem `number` no ano, a `R<number>/<year>` do Focus."""

    year: int
    number: int
    first_day: date
    second_day: date


class NextMeetingDTO(BaseDTO):
    """A próxima reunião, a meta que o mercado espera dela e a diferença para a meta de
    hoje, em fração do ano (-0.0025 é um corte de 0,25 ponto percentual)."""

    meeting: MeetingDTO
    expected: float
    change: float
    survey_date: date


class RealRateDTO(BaseDTO):
    """A meta de hoje dividida pela inflação esperada para os 12 meses seguintes."""

    rate: float
    selic: float
    expected_inflation: float
    survey_date: date


class InterestDTO(BaseDTO):
    selic: SelicDTO
    inflation: InflationDTO
    next_meeting: NextMeetingDTO | None
    real_rate: RealRateDTO | None


@router.get("", responses=ERROR_RESPONSES)
def interest_overview(session: SessionDep) -> InterestDTO:
    return InterestDTO.model_validate(interest(session))
