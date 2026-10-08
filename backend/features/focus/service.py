from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta

from sqlalchemy.orm import Session

from backend.core.enum import FocusDirection, FocusIndicator, FocusTargetKind, Unit
from backend.core.errors import MissingDataError
from backend.domain.focus import (
    REPORT_UNITS,
    REPORT_YEARS,
    WEEKS_BEFORE,
    Expectation,
    to_fraction,
    weekly_streak,
)
from backend.domain.inflation_target import TargetBand
from backend.features.target_bands import target_bands_between
from backend.repository.focus import last_survey_date, read_history, read_survey


@dataclass(frozen=True, slots=True, kw_only=True)
class ReportRow:
    """A previsão de um indicador para um ano, na convenção da API: hoje, uma e quatro
    semanas antes, e há quantas semanas ela anda na mesma direção. Sem pesquisa
    naquela semana, o valor é `None`."""

    indicator: FocusIndicator
    unit: Unit
    year: int
    today: float
    week_before: float | None
    weeks_before: float | None
    direction: FocusDirection | None
    streak_weeks: int | None
    respondents: int


@dataclass(frozen=True, slots=True, kw_only=True)
class FocusReport:
    survey_date: date
    rows: list[ReportRow]


@dataclass(frozen=True, slots=True, kw_only=True)
class HistoryPoint:
    survey_date: date
    value: float
    respondents: int


@dataclass(frozen=True, slots=True, kw_only=True)
class FocusHistory:
    """A previsão de `indicator` para `year` em cada pesquisa semanal, com a sequência
    da última semana (`streak_start` é o valor de onde ela saiu) e, no IPCA, a meta
    do ano."""

    indicator: FocusIndicator
    unit: Unit
    year: int
    years: list[int]
    points: list[HistoryPoint]
    direction: FocusDirection | None
    streak_weeks: int | None
    streak_start: float | None
    band: TargetBand | None


def last_survey(session: Session) -> date:
    last = last_survey_date(session)
    if last is None:
        raise MissingDataError(
            "Ainda não há pesquisa Focus no cache: a primeira atualização não terminou."
        )
    return last


def _on_or_before(history: list[Expectation], day: date) -> Expectation | None:
    """A pesquisa da semana de `day`: a de sexta, ou a de antes num feriado."""
    return next((item for item in reversed(history) if item.survey_date <= day), None)


def _fraction(item: Expectation | None, unit: Unit) -> float | None:
    return None if item is None else to_fraction(item.median, unit)


def focus_report(session: Session) -> FocusReport:
    """A tabela do relatório Focus da última pesquisa: cada indicador no ano dela e nos
    3 seguintes."""
    last = last_survey(session)
    rows: list[ReportRow] = []
    for indicator, unit in REPORT_UNITS.items():
        for year in range(last.year, last.year + REPORT_YEARS):
            history = read_history(session, indicator, FocusTargetKind.YEAR, year, 0)
            if not history or history[-1].survey_date != last:
                continue
            streak = weekly_streak([item.median for item in history])
            rows.append(
                ReportRow(
                    indicator=indicator,
                    unit=unit,
                    year=year,
                    today=to_fraction(history[-1].median, unit),
                    week_before=_fraction(
                        _on_or_before(history, last - timedelta(weeks=1)), unit
                    ),
                    weeks_before=_fraction(
                        _on_or_before(history, last - timedelta(weeks=WEEKS_BEFORE)),
                        unit,
                    ),
                    direction=None if streak is None else streak.direction,
                    streak_weeks=None if streak is None else streak.weeks,
                    respondents=history[-1].respondents,
                )
            )
    return FocusReport(survey_date=last, rows=rows)


def focus_history(
    session: Session, indicator: FocusIndicator, year: int | None
) -> FocusHistory:
    """Sem ano pedido, vale o da última pesquisa. Os anos do seletor são os que a
    última pesquisa prevê para o indicador."""
    unit = REPORT_UNITS.get(indicator)
    if unit is None:
        raise MissingDataError("O indicador não está na tabela do relatório Focus.")
    last = last_survey(session)
    years = sorted(
        item.target_year
        for item in read_survey(session, last, (indicator,))
        if item.target_kind is FocusTargetKind.YEAR
    )
    chosen = year or last.year
    history = read_history(session, indicator, FocusTargetKind.YEAR, chosen, 0)
    if not history:
        raise MissingDataError(f"O Focus não tem previsão para {chosen} no cache.")
    streak = weekly_streak([item.median for item in history])
    band = (
        target_bands_between(session, chosen, chosen).get(chosen)
        if indicator is FocusIndicator.IPCA
        else None
    )
    return FocusHistory(
        indicator=indicator,
        unit=unit,
        year=chosen,
        years=years,
        points=[
            HistoryPoint(
                survey_date=item.survey_date,
                value=to_fraction(item.median, unit),
                respondents=item.respondents,
            )
            for item in history
        ],
        direction=None if streak is None else streak.direction,
        streak_weeks=None if streak is None else streak.weeks,
        streak_start=None if streak is None else to_fraction(streak.start, unit),
        band=band,
    )
