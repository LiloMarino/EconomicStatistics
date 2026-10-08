from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator, SeriesId
from backend.core.errors import MissingDataError
from backend.domain.copom import Meeting
from backend.domain.coverage import month_start
from backend.domain.focus import (
    Expectation,
    meeting_expectations,
    next_12m_expectation,
)
from backend.domain.interest import (
    SelicChange,
    SelicStep,
    forecast_by_month,
    last_change,
    month_end_rates,
)
from backend.domain.rates import (
    PERCENT,
    MonthlyRate,
    monthly_rates,
    real_change,
    rolling_12m,
)
from backend.features.ipca_forecast import ipca_forecast
from backend.repository.copom import read_meetings
from backend.repository.focus import latest_survey
from backend.repository.series import last_cached, read_observations

# O gráfico mostra 24 meses de cada linha, e o 12 meses de cada mês lê os 11 anteriores
CHART_MONTHS = 24
# A última mudança da meta é procurada nos 10 anos até hoje
CHANGE_LOOKBACK_MONTHS = 10 * 12


@dataclass(frozen=True, slots=True, kw_only=True)
class RateForecast:
    """A taxa esperada em cada mês depois do último dado, pela pesquisa Focus de
    `survey_date`."""

    survey_date: date
    months: list[MonthlyRate]


@dataclass(frozen=True, slots=True, kw_only=True)
class Selic:
    """A meta no fim de cada mês, a de hoje e a última mudança dela."""

    months: list[MonthlyRate]
    current: float
    last_change: SelicChange | None
    forecast: RateForecast | None


@dataclass(frozen=True, slots=True, kw_only=True)
class Inflation:
    """O IPCA em 12 meses, mês a mês, e o que o Focus espera para os meses seguintes."""

    months: list[MonthlyRate]
    forecast: RateForecast | None


@dataclass(frozen=True, slots=True, kw_only=True)
class NextMeeting:
    """A próxima reunião, a meta que o mercado espera dela e a diferença para a meta de
    hoje (em pontos percentuais, como fração)."""

    meeting: Meeting
    expected: float
    change: float
    survey_date: date


@dataclass(frozen=True, slots=True, kw_only=True)
class RealRate:
    """A meta de hoje descontada, dividindo, da inflação esperada para os 12 meses
    seguintes."""

    rate: float
    selic: float
    expected_inflation: float
    survey_date: date


@dataclass(frozen=True, slots=True, kw_only=True)
class Interest:
    selic: Selic
    inflation: Inflation
    next_meeting: NextMeeting | None
    real_rate: RealRate | None


def interest(session: Session) -> Interest:
    cached = last_cached(session)
    if SeriesId.SELIC_TARGET not in cached or SeriesId.IPCA_GENERAL not in cached:
        raise MissingDataError(
            "Ainda não há Selic e IPCA no cache: a primeira atualização não terminou."
        )
    selic_end = cached[SeriesId.SELIC_TARGET]
    ipca_end = cached[SeriesId.IPCA_GENERAL]
    daily = read_observations(
        session,
        (SeriesId.SELIC_TARGET,),
        month_start(selic_end, CHANGE_LOOKBACK_MONTHS),
        selic_end,
    )[SeriesId.SELIC_TARGET]
    real = monthly_rates(
        read_observations(
            session,
            (SeriesId.IPCA_GENERAL,),
            month_start(ipca_end, CHART_MONTHS + 10),
            ipca_end,
        )[SeriesId.IPCA_GENERAL]
    )
    survey = latest_survey(session, (FocusIndicator.SELIC, FocusIndicator.IPCA))
    survey_date = survey[0] if survey else None
    expectations = survey[1] if survey else []
    current = daily[-1].value / PERCENT
    # As duas linhas do gráfico começam no mesmo mês: o 1º do IPCA em 12 meses mostrado
    chart_start = month_start(ipca_end, CHART_MONTHS - 1)

    meetings = _upcoming_meetings(session, expectations, selic_end)
    ipca_next = ipca_forecast(session, real)
    return Interest(
        selic=Selic(
            months=[
                item for item in month_end_rates(daily) if item.ref_date >= chart_start
            ],
            current=current,
            last_change=last_change(daily),
            forecast=(
                _selic_forecast(current, meetings, selic_end, survey_date)
                if survey_date
                else None
            ),
        ),
        inflation=Inflation(
            months=rolling_12m(real)[-CHART_MONTHS:],
            forecast=(
                None
                if ipca_next is None
                else RateForecast(
                    survey_date=ipca_next.survey_date, months=ipca_next.points
                )
            ),
        ),
        next_meeting=(
            _next_meeting(current, meetings, survey_date)
            if survey_date and meetings
            else None
        ),
        real_rate=_real_rate(current, expectations, survey_date),
    )


def _upcoming_meetings(
    session: Session, expectations: list[Expectation], today: date
) -> list[tuple[Meeting, float]]:
    """As reuniões que ainda não decidiram e que têm data no calendário, cada uma com a
    meta que o Focus espera, em fração."""
    expected = meeting_expectations(expectations, FocusIndicator.SELIC)
    return [
        (meeting, expected[(meeting.year, meeting.number)] / PERCENT)
        for meeting in read_meetings(session, today.year, today.year + 1)
        if meeting.second_day >= today and (meeting.year, meeting.number) in expected
    ]


def _selic_forecast(
    current: float,
    meetings: list[tuple[Meeting, float]],
    today: date,
    survey_date: date,
) -> RateForecast | None:
    if not meetings:
        return None
    steps = [
        SelicStep(effective_date=meeting.effective_from, rate=rate)
        for meeting, rate in meetings
    ]
    months = forecast_by_month(
        current,
        steps,
        month_start(today, -1),
        month_start(max(step.effective_date for step in steps)),
    )
    return RateForecast(survey_date=survey_date, months=months)


def _next_meeting(
    current: float, meetings: list[tuple[Meeting, float]], survey_date: date
) -> NextMeeting:
    meeting, expected = meetings[0]
    return NextMeeting(
        meeting=meeting,
        expected=expected,
        change=expected - current,
        survey_date=survey_date,
    )


def _real_rate(
    current: float, expectations: list[Expectation], survey_date: date | None
) -> RealRate | None:
    """Ex-ante: a inflação que o mercado espera, e não a que já passou."""
    expected = next_12m_expectation(expectations, FocusIndicator.IPCA)
    if expected is None or survey_date is None:
        return None
    return RealRate(
        rate=real_change(current, expected / PERCENT),
        selic=current,
        expected_inflation=expected / PERCENT,
        survey_date=survey_date,
    )
