from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.core.enum import FocusDirection, FocusIndicator, Unit
from backend.features.focus.service import focus_history, focus_report
from backend.features.target_band_dto import TargetBandDTO

router = APIRouter(prefix="/api/focus", tags=["focus"])


class ReportRowDTO(BaseDTO):
    """A mediana do Focus para o ano hoje, uma semana e quatro semanas antes. O que o
    Focus publica em % vem em fração (0.0501 é 5,01%), o câmbio em R$/US$ e as contas
    externas em US$ bilhões. Primário e nominal seguem o sinal do Focus: negativo é
    déficit. `streak_weeks` conta as semanas seguidas na `direction` da última."""

    indicator: FocusIndicator
    unit: Unit
    year: int
    today: float
    week_before: float | None
    weeks_before: float | None
    direction: FocusDirection | None
    streak_weeks: int | None
    respondents: int


class FocusReportDTO(BaseDTO):
    survey_date: date
    rows: list[ReportRowDTO]


class HistoryPointDTO(BaseDTO):
    survey_date: date
    value: float
    respondents: int


class FocusHistoryDTO(BaseDTO):
    """A previsão para `year` em cada pesquisa semanal, na convenção do relatório.
    `streak_start` é o valor de onde a sequência da última semana saiu; `band` é a
    meta do ano, só no IPCA."""

    indicator: FocusIndicator
    unit: Unit
    year: int
    years: list[int]
    points: list[HistoryPointDTO]
    direction: FocusDirection | None
    streak_weeks: int | None
    streak_start: float | None
    band: TargetBandDTO | None


@router.get("/report", responses=ERROR_RESPONSES)
def report(session: SessionDep) -> FocusReportDTO:
    return FocusReportDTO.model_validate(focus_report(session))


@router.get("/history", responses=ERROR_RESPONSES)
def history(
    session: SessionDep, indicator: FocusIndicator, year: int | None = None
) -> FocusHistoryDTO:
    return FocusHistoryDTO.model_validate(focus_history(session, indicator, year))
