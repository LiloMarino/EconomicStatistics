from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta

from sqlalchemy.orm import Session

from backend.core.enum import (
    ChangeKind,
    FocusIndicator,
    FocusTargetKind,
    OverviewIndicator,
    SeriesId,
)
from backend.domain.coverage import month_start
from backend.domain.focus import REPORT_UNITS, WEEKS_BEFORE, to_fraction
from backend.domain.inflation_target import TargetBand
from backend.domain.rates import relative_change
from backend.features.activity.service import activity
from backend.features.credit.service import credit
from backend.features.debt.service import debt_overview
from backend.features.deficit.service import deficit
from backend.features.external_sector.service import external_sector
from backend.features.inflation.service import inflation_pace
from backend.features.interest.service import interest
from backend.features.monthly_forecast import MonthValue
from backend.repository.focus import last_survey_date, read_history
from backend.repository.series import last_cached

# O cartão desenha no máximo os últimos 24 pontos da série
SPARKLINE_POINTS = 24
MONTHS_PER_YEAR = 12


@dataclass(frozen=True, slots=True, kw_only=True)
class Indicator:
    """O último valor de um indicador, na unidade da série (fração nas taxas, R$ no
    dólar, US$ milhões nas reservas). `change` é a diferença para o ponto de
    `change_months` meses antes, medida como diz `change_kind`; sem ponto de
    comparação, é `None`. `band` e `within_band` só existem onde há faixa oficial."""

    indicator: OverviewIndicator
    ref_date: date
    value: float
    change: float | None
    change_kind: ChangeKind
    change_months: int | None
    sparkline: list[float]
    band: TargetBand | None
    within_band: bool | None


@dataclass(frozen=True, slots=True, kw_only=True)
class GovernmentResult:
    """Os 12 meses até `ref_date`, em fração do PIB e na convenção da NFSP (positivo é
    déficit). `interest_share` é a parte do déficit nominal que é juro."""

    ref_date: date
    primary: float
    interest: float
    nominal: float
    interest_share: float | None


@dataclass(frozen=True, slots=True, kw_only=True)
class Overview:
    indicators: list[Indicator]
    government_result: GovernmentResult


def overview(session: Session, today: date) -> Overview:
    pace = inflation_pace(session, None)
    rates = interest(session)
    debt = debt_overview(session)
    result = deficit(session)
    activity_view = activity(session)
    external = external_sector(session)
    credit_view = credit(session)

    selic_until = min(today, last_cached(session)[SeriesId.SELIC_TARGET])
    ipca = _indicator(
        OverviewIndicator.IPCA_12M,
        [MonthValue(ref_date=p.ref_date, value=p.rate) for p in pace.general_12m],
        ChangeKind.POINTS,
        MONTHS_PER_YEAR,
        # A faixa da meta vale para o ano do último IPCA
        band=pace.band,
    )

    indicators = [
        ipca,
        _expected_ipca(session),
        _indicator(
            OverviewIndicator.SELIC,
            [MonthValue(ref_date=m.ref_date, value=m.rate) for m in rates.selic.months],
            ChangeKind.POINTS,
            3,
            ref_date=selic_until,
        ),
        None
        if rates.real_rate is None
        else Indicator(
            indicator=OverviewIndicator.REAL_RATE,
            ref_date=rates.real_rate.survey_date,
            value=rates.real_rate.rate,
            change=None,
            change_kind=ChangeKind.POINTS,
            change_months=None,
            sparkline=[],
            band=None,
            within_band=None,
        ),
        _indicator(
            OverviewIndicator.NET_DEBT,
            [MonthValue(ref_date=d.ref_date, value=d.net) for d in debt.levels],
            ChangeKind.POINTS,
            MONTHS_PER_YEAR,
        ),
        _indicator(
            OverviewIndicator.GROSS_DEBT,
            [MonthValue(ref_date=d.ref_date, value=d.gross) for d in debt.levels],
            ChangeKind.POINTS,
            MONTHS_PER_YEAR,
        ),
        _indicator(
            OverviewIndicator.IBC_BR, activity_view.ibc.months, ChangeKind.POINTS, 3
        ),
        _indicator(
            OverviewIndicator.GDP, activity_view.gdp.quarters, ChangeKind.POINTS, 3
        ),
        _indicator(
            OverviewIndicator.UNEMPLOYMENT,
            activity_view.unemployment.months,
            ChangeKind.POINTS,
            MONTHS_PER_YEAR,
        ),
        _indicator(
            OverviewIndicator.DOLLAR,
            external.dollar.months,
            ChangeKind.RELATIVE,
            MONTHS_PER_YEAR,
        ),
        _indicator(
            OverviewIndicator.RESERVES,
            external.reserves.months,
            ChangeKind.RELATIVE,
            MONTHS_PER_YEAR,
        ),
        _indicator(
            OverviewIndicator.CURRENT_ACCOUNT,
            [
                MonthValue(ref_date=f.ref_date, value=f.current_account)
                for f in external.flows
            ],
            ChangeKind.POINTS,
            MONTHS_PER_YEAR,
        ),
        _indicator(
            OverviewIndicator.FDI,
            [MonthValue(ref_date=f.ref_date, value=f.fdi) for f in external.flows],
            ChangeKind.POINTS,
            MONTHS_PER_YEAR,
        ),
        # A posição vem um ponto por ano: compara com o ponto anterior
        _indicator(
            OverviewIndicator.INTERNATIONAL_POSITION,
            [MonthValue(ref_date=p.ref_date, value=p.net) for p in external.position],
            ChangeKind.POINTS,
            1,
        ),
        _indicator(
            OverviewIndicator.CREDIT_COST,
            [
                MonthValue(ref_date=m.ref_date, value=m.cost)
                for m in credit_view.cost.months
            ],
            ChangeKind.POINTS,
            MONTHS_PER_YEAR,
        ),
        _indicator(
            OverviewIndicator.HOUSEHOLD_CONCESSIONS,
            credit_view.concessions.households,
            ChangeKind.POINTS,
            3,
        ),
        _indicator(
            OverviewIndicator.BASEL_RATIO,
            credit_view.basel.quarters,
            ChangeKind.POINTS,
            MONTHS_PER_YEAR,
        ),
    ]
    return Overview(
        indicators=[item for item in indicators if item is not None],
        government_result=GovernmentResult(
            ref_date=result.last.ref_date,
            primary=result.last.primary,
            interest=result.last.interest,
            nominal=result.last.nominal,
            interest_share=result.interest_share,
        ),
    )


def _months_between(later: date, earlier: date) -> int:
    return (later.year - earlier.year) * MONTHS_PER_YEAR + later.month - earlier.month


def _difference(kind: ChangeKind, current: float, before: float) -> float:
    return (
        current - before
        if kind is ChangeKind.POINTS
        else relative_change(current, before)
    )


def _indicator(
    indicator: OverviewIndicator,
    points: list[MonthValue],
    kind: ChangeKind,
    window_months: int,
    ref_date: date | None = None,
    band: TargetBand | None = None,
) -> Indicator:
    """O ponto de comparação é o último com data até `window_months` meses antes do
    último: numa série sem aquele mês exato, vale o anterior mais próximo, e
    `change_months` diz a distância real."""
    last = points[-1]
    target = month_start(last.ref_date, window_months)
    before = next((p for p in reversed(points) if p.ref_date <= target), None)
    return Indicator(
        indicator=indicator,
        ref_date=ref_date or last.ref_date,
        value=last.value,
        change=None if before is None else _difference(kind, last.value, before.value),
        change_kind=kind,
        change_months=None
        if before is None
        else _months_between(last.ref_date, before.ref_date),
        sparkline=[p.value for p in points[-SPARKLINE_POINTS:]],
        band=band,
        within_band=None if band is None else band.floor <= last.value <= band.ceiling,
    )


def _expected_ipca(session: Session) -> Indicator | None:
    """A mediana do Focus para o IPCA do ano da última pesquisa, semana a semana. A
    variação compara com a pesquisa de 4 semanas antes, que é 1 mês."""
    last = last_survey_date(session)
    if last is None:
        return None
    history = read_history(
        session, FocusIndicator.IPCA, FocusTargetKind.YEAR, last.year, 0
    )
    if not history:
        return None
    unit = REPORT_UNITS[FocusIndicator.IPCA]
    current = history[-1]
    value = to_fraction(current.median, unit)
    before = next(
        (
            item
            for item in reversed(history)
            if item.survey_date <= current.survey_date - timedelta(weeks=WEEKS_BEFORE)
        ),
        None,
    )
    return Indicator(
        indicator=OverviewIndicator.EXPECTED_IPCA,
        ref_date=current.survey_date,
        value=value,
        change=None if before is None else value - to_fraction(before.median, unit),
        change_kind=ChangeKind.POINTS,
        change_months=None if before is None else 1,
        sparkline=[
            to_fraction(item.median, unit) for item in history[-SPARKLINE_POINTS:]
        ],
        band=None,
        within_band=None,
    )
