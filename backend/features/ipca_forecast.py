from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator
from backend.domain.focus import monthly_expectations, rolling_12m_forecast
from backend.domain.rates import MonthlyRate
from backend.repository.focus import latest_survey


@dataclass(frozen=True, slots=True, kw_only=True)
class IpcaForecast:
    survey_date: date
    points: list[MonthlyRate]


def ipca_forecast(session: Session, real: list[MonthlyRate]) -> IpcaForecast | None:
    """O 12 meses esperado depois do último mês real, compondo os meses reais com o
    IPCA mensal da última pesquisa Focus."""
    survey = latest_survey(session, (FocusIndicator.IPCA,))
    if survey is None:
        return None
    survey_date, expectations = survey
    points = rolling_12m_forecast(
        real, monthly_expectations(expectations, FocusIndicator.IPCA)
    )
    return IpcaForecast(survey_date=survey_date, points=points) if points else None
