from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator, SeriesId
from backend.core.errors import MissingDataError
from backend.domain.focus import annual_expectations, forecast_years, nfsp_from_balance
from backend.domain.rates import PERCENT
from backend.domain.series import NFSP_START
from backend.repository.focus import latest_survey
from backend.repository.series import last_cached, read_observations

DEFICIT_SERIES = (
    SeriesId.NOMINAL_DEFICIT,
    SeriesId.PRIMARY_DEFICIT,
    SeriesId.NOMINAL_INTEREST,
)


@dataclass(frozen=True, slots=True, kw_only=True)
class DeficitPoint:
    """Os 12 meses que terminam em `ref_date`, em fração do PIB, na convenção da NFSP:
    positivo é déficit. O nominal é o primário mais os juros."""

    ref_date: date
    nominal: float
    primary: float
    interest: float


@dataclass(frozen=True, slots=True, kw_only=True)
class DeficitForecast:
    """O resultado que o Focus espera para dezembro de cada ano, já na convenção da
    NFSP. Os juros são o nominal menos o primário: as três partes estão em % do PIB do
    mesmo ano."""

    survey_date: date
    years: list[DeficitPoint]


@dataclass(frozen=True, slots=True, kw_only=True)
class Deficit:
    """`interest_share` é a fração do déficit nominal que é juro; sem déficit nominal,
    ela não existe. `years` traz dezembro de cada ano e o último mês."""

    last: DeficitPoint
    interest_share: float | None
    years: list[DeficitPoint]
    forecast: DeficitForecast | None


def deficit(session: Session) -> Deficit:
    cached = last_cached(session)
    if any(series_id not in cached for series_id in DEFICIT_SERIES):
        raise MissingDataError(
            "Ainda não há resultado fiscal no cache: a primeira atualização não terminou."
        )
    end = min(cached[series_id] for series_id in DEFICIT_SERIES)
    observations = read_observations(session, DEFICIT_SERIES, NFSP_START, end)
    by_series = {
        series_id: {item.ref_date: item.value / PERCENT for item in items}
        for series_id, items in observations.items()
    }
    nominal = by_series[SeriesId.NOMINAL_DEFICIT]
    primary = by_series[SeriesId.PRIMARY_DEFICIT]
    interest = by_series[SeriesId.NOMINAL_INTEREST]
    points = [
        DeficitPoint(
            ref_date=ref_date,
            nominal=nominal[ref_date],
            primary=primary[ref_date],
            interest=interest[ref_date],
        )
        for ref_date in sorted(nominal)
        if ref_date in primary and ref_date in interest
    ]
    last = points[-1]
    years = [point for point in points if point.ref_date.month == 12]
    if last.ref_date.month != 12:
        years.append(last)
    return Deficit(
        last=last,
        interest_share=last.interest / last.nominal if last.nominal > 0 else None,
        years=years,
        forecast=_forecast(session, last.ref_date),
    )


def _forecast(session: Session, last: date) -> DeficitForecast | None:
    survey = latest_survey(
        session, (FocusIndicator.PRIMARY_BALANCE, FocusIndicator.NOMINAL_BALANCE)
    )
    if survey is None:
        return None
    survey_date, expectations = survey
    primary = annual_expectations(expectations, FocusIndicator.PRIMARY_BALANCE)
    nominal = annual_expectations(expectations, FocusIndicator.NOMINAL_BALANCE)
    years = [
        DeficitPoint(
            ref_date=date(year, 12, 1),
            nominal=nfsp_from_balance(nominal[year]),
            primary=nfsp_from_balance(primary[year]),
            interest=nfsp_from_balance(nominal[year])
            - nfsp_from_balance(primary[year]),
        )
        for year in forecast_years(last)
        if year in primary and year in nominal
    ]
    return DeficitForecast(survey_date=survey_date, years=years) if years else None
