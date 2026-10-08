from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.features.deficit.service import deficit

router = APIRouter(prefix="/api/deficit", tags=["deficit"])


class DeficitPointDTO(BaseDTO):
    """Os 12 meses que terminam em `ref_date`, em fração do PIB (0.0948 é 9,48%). Na
    convenção da NFSP, positivo é déficit e negativo é superávit; o nominal é o
    primário mais os juros."""

    ref_date: date
    nominal: float
    primary: float
    interest: float


class DeficitForecastDTO(BaseDTO):
    """O que o Focus espera para dezembro de cada ano, na mesma convenção e fração do
    PIB dos pontos reais; os juros são o nominal menos o primário."""

    survey_date: date
    years: list[DeficitPointDTO]


class DeficitDTO(BaseDTO):
    """`interest_share` é a fração do déficit nominal que é juro (0.93 é 93%), `null`
    sem déficit nominal. `years` traz dezembro de cada ano e, por último, o último
    mês publicado."""

    last: DeficitPointDTO
    interest_share: float | None
    years: list[DeficitPointDTO]
    forecast: DeficitForecastDTO | None


@router.get("", responses=ERROR_RESPONSES)
def deficit_overview(session: SessionDep) -> DeficitDTO:
    return DeficitDTO.model_validate(deficit(session))
