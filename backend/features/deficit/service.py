from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import SeriesId
from backend.core.errors import MissingDataError
from backend.domain.rates import PERCENT
from backend.domain.series import NFSP_START
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
class Deficit:
    """`interest_share` é a fração do déficit nominal que é juro; sem déficit nominal,
    ela não existe. `years` traz dezembro de cada ano e o último mês."""

    last: DeficitPoint
    interest_share: float | None
    years: list[DeficitPoint]


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
    )
