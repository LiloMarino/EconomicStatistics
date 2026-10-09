from __future__ import annotations

from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import SeriesId
from backend.domain.inflation_target import TargetBand, target_bands
from backend.domain.series import SERIES
from backend.repository.inflation_tolerance import read_tolerances
from backend.repository.series import read_observations


def target_bands_between(
    session: Session, first: int, last: int
) -> dict[int, TargetBand]:
    """A faixa da meta de cada ano de `first` a `last`, inclusive. A série é lida desde
    o começo: um ano depois do último publicado herda a meta contínua dele. Sem a
    tolerância em cache o ano fica sem faixa."""
    targets = read_observations(
        session,
        (SeriesId.INFLATION_TARGET,),
        SERIES[SeriesId.INFLATION_TARGET].first_date,
        date(last, 1, 1),
    )[SeriesId.INFLATION_TARGET]
    return target_bands(targets, range(first, last + 1), read_tolerances(session))
