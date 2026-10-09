from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator, SeriesId
from backend.core.errors import MissingDataError
from backend.domain.coverage import month_start
from backend.domain.focus import Expectation, monthly_expectations, rolling_12m_forecast
from backend.domain.rates import MonthlyRate, monthly_rates, rolling_12m
from backend.domain.series import Observation
from backend.features.monthly_forecast import MonthlyForecast, MonthValue
from backend.repository.focus import latest_survey
from backend.repository.series import last_cached, read_observations

CUT_SERIES = (
    SeriesId.FREE_PRICES,
    SeriesId.ADMINISTERED_PRICES,
    SeriesId.SERVICES_PRICES,
)

# O gráfico mostra os últimos 24 meses de 12 meses acumulados e segue 12 meses pelo
# Focus
WINDOW_MONTHS = 24
FORECAST_MONTHS = 12
# O 12 meses do primeiro mês da janela pede os 11 meses anteriores a ele
ROLLING_HISTORY_MONTHS = 11


@dataclass(frozen=True, slots=True, kw_only=True)
class PriceCut:
    """O IPCA em 12 meses do corte, em fração, mês a mês. `forecast` continua a linha
    com o que o Focus espera para o corte, composto com os meses reais."""

    months: list[MonthValue]
    forecast: MonthlyForecast | None


@dataclass(frozen=True, slots=True, kw_only=True)
class PriceCuts:
    free: PriceCut
    administered: PriceCut
    services: PriceCut


def price_cuts(session: Session) -> PriceCuts:
    cached = last_cached(session)
    if any(series_id not in cached for series_id in CUT_SERIES):
        raise MissingDataError(
            "Ainda não há o IPCA por forma de formação do preço no cache: a primeira "
            "atualização não terminou."
        )
    end = max(cached[series_id] for series_id in CUT_SERIES)
    observations = read_observations(
        session,
        CUT_SERIES,
        month_start(end, WINDOW_MONTHS + ROLLING_HISTORY_MONTHS),
        end,
    )
    survey = latest_survey(
        session,
        (
            FocusIndicator.IPCA_FREE,
            FocusIndicator.IPCA_ADMINISTERED,
            FocusIndicator.IPCA_SERVICES,
        ),
    )
    return PriceCuts(
        free=_cut(observations[SeriesId.FREE_PRICES], FocusIndicator.IPCA_FREE, survey),
        administered=_cut(
            observations[SeriesId.ADMINISTERED_PRICES],
            FocusIndicator.IPCA_ADMINISTERED,
            survey,
        ),
        services=_cut(
            observations[SeriesId.SERVICES_PRICES], FocusIndicator.IPCA_SERVICES, survey
        ),
    )


def _cut(
    observations: list[Observation],
    indicator: FocusIndicator,
    survey: tuple[date, list[Expectation]] | None,
) -> PriceCut:
    real = monthly_rates(observations)
    months = [
        MonthValue(ref_date=item.ref_date, value=item.rate)
        for item in rolling_12m(real)
    ][-WINDOW_MONTHS:]
    return PriceCut(months=months, forecast=_forecast(real, indicator, survey))


def _forecast(
    real: list[MonthlyRate],
    indicator: FocusIndicator,
    survey: tuple[date, list[Expectation]] | None,
) -> MonthlyForecast | None:
    """O 12 meses esperado nos meses depois do último dado, compondo os meses reais com
    o IPCA mensal do corte na pesquisa Focus mais recente."""
    if survey is None:
        return None
    survey_date, expectations = survey
    points = rolling_12m_forecast(real, monthly_expectations(expectations, indicator))
    months = [
        MonthValue(ref_date=item.ref_date, value=item.rate)
        for item in points[:FORECAST_MONTHS]
    ]
    return MonthlyForecast(survey_date=survey_date, months=months) if months else None
