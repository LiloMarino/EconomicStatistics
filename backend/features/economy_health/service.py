from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator, Lamp, SeriesId
from backend.core.errors import MissingDataError
from backend.domain.coverage import month_start
from backend.domain.focus import annual_expectations
from backend.domain.health import (
    LETTER_AFTER_MONTHS,
    BandedRate,
    StripCell,
    inflation_strip,
    primary_lamp,
)
from backend.domain.inflation_target import TargetBand
from backend.domain.rates import PERCENT, monthly_rates, rolling_12m
from backend.features.activity.service import activity
from backend.features.debt.service import debt_overview
from backend.features.external_sector.service import GdpShare, external_sector
from backend.features.interest.service import RealRate, interest
from backend.features.target_bands import target_bands_between
from backend.repository.focus import latest_survey
from backend.repository.series import last_cached, read_observations

# A faixa mostra os últimos 24 meses
STRIP_MONTHS = 24
# O 12 meses de um mês lê os 11 anteriores, e a sequência de meses fora da faixa lê os
# anteriores à janela, para a cor do primeiro mês mostrado já saber a sequência
HISTORY_MONTHS = STRIP_MONTHS - 1 + 11 + LETTER_AFTER_MONTHS - 1


@dataclass(frozen=True, slots=True, kw_only=True)
class InflationSignal:
    """O IPCA em 12 meses contra a faixa da meta no último mês e a cor de cada um dos
    últimos 24. `months_out` é há quantos meses seguidos ele está fora da faixa."""

    ref_date: date
    rate: float
    band: TargetBand | None
    lamp: Lamp | None
    months_out: int
    strip: list[StripCell]


@dataclass(frozen=True, slots=True, kw_only=True)
class PrimarySignal:
    """O primário feito (superávit, com déficit negativo) contra o primário que
    estabiliza a dívida/PIB, em fração do PIB. `gap` é o que falta; negativo é sobra."""

    ref_date: date
    surplus: float
    stabilizing: float
    gap: float
    lamp: Lamp


@dataclass(frozen=True, slots=True, kw_only=True)
class ExpectedInflation:
    """A mediana do Focus para o IPCA do ano da última pesquisa e a meta do ano."""

    survey_date: date
    year: int
    median: float
    target: float | None


@dataclass(frozen=True, slots=True, kw_only=True)
class DatedValue:
    ref_date: date
    value: float


@dataclass(frozen=True, slots=True, kw_only=True)
class Dollar:
    """A PTAX do fim do mês e a variação contra o mesmo mês do ano anterior."""

    ref_date: date
    value: float
    change_12m: float | None


@dataclass(frozen=True, slots=True, kw_only=True)
class Reserves:
    """O estoque em US$ milhões e, quando o PIB em dólar já saiu, quanto ele é do PIB."""

    ref_date: date
    value: float
    gdp_share: GdpShare | None


@dataclass(frozen=True, slots=True, kw_only=True)
class References:
    """Os sinais sem faixa oficial: só o número, que a tela escreve ao lado da
    referência. O que depende da pesquisa Focus some quando ela não está no cache."""

    expected_inflation: ExpectedInflation | None
    real_rate: RealRate | None
    unemployment: DatedValue
    reserves: Reserves
    gross_debt: DatedValue
    dollar: Dollar


@dataclass(frozen=True, slots=True, kw_only=True)
class EconomyHealth:
    inflation: InflationSignal
    primary: PrimarySignal
    references: References


def economy_health(session: Session) -> EconomyHealth:
    debt = debt_overview(session)
    external = external_sector(session)
    unemployment = activity(session).unemployment.months[-1]
    stabilization = debt.stabilization
    last_level = debt.levels[-1]
    last_dollar = external.dollar.months[-1]
    last_reserves = external.reserves.months[-1]
    return EconomyHealth(
        inflation=_inflation(session),
        primary=PrimarySignal(
            ref_date=stabilization.ref_date,
            surplus=stabilization.primary_surplus,
            stabilizing=stabilization.stabilizing_primary,
            gap=stabilization.primary_gap,
            lamp=primary_lamp(
                stabilization.primary_surplus, stabilization.stabilizing_primary
            ),
        ),
        references=References(
            expected_inflation=_expected_inflation(session),
            real_rate=interest(session).real_rate,
            unemployment=DatedValue(
                ref_date=unemployment.ref_date, value=unemployment.value
            ),
            reserves=Reserves(
                ref_date=last_reserves.ref_date,
                value=last_reserves.value,
                gdp_share=external.reserves.gdp_share,
            ),
            gross_debt=DatedValue(ref_date=last_level.ref_date, value=last_level.gross),
            dollar=Dollar(
                ref_date=last_dollar.ref_date,
                value=last_dollar.value,
                change_12m=external.dollar.change_12m,
            ),
        ),
    )


def _inflation(session: Session) -> InflationSignal:
    cached = last_cached(session)
    if SeriesId.IPCA_GENERAL not in cached:
        raise MissingDataError(
            "Ainda não há IPCA no cache: a primeira atualização não terminou."
        )
    last = cached[SeriesId.IPCA_GENERAL]
    rolling = rolling_12m(
        monthly_rates(
            read_observations(
                session,
                (SeriesId.IPCA_GENERAL,),
                month_start(last, HISTORY_MONTHS),
                last,
            )[SeriesId.IPCA_GENERAL]
        )
    )
    if not rolling:
        raise MissingDataError("O IPCA em cache não tem 12 meses seguidos.")
    bands = target_bands_between(session, rolling[0].ref_date.year, last.year)
    strip = inflation_strip(
        [
            BandedRate(
                ref_date=item.ref_date,
                rate=item.rate,
                band=bands.get(item.ref_date.year),
            )
            for item in rolling
        ]
    )[-STRIP_MONTHS:]
    current = strip[-1]
    return InflationSignal(
        ref_date=current.ref_date,
        rate=current.rate,
        band=bands.get(current.ref_date.year),
        lamp=current.lamp,
        months_out=current.months_out,
        strip=strip,
    )


def _expected_inflation(session: Session) -> ExpectedInflation | None:
    survey = latest_survey(session, (FocusIndicator.IPCA,))
    if survey is None:
        return None
    survey_date, expectations = survey
    year = survey_date.year
    median = annual_expectations(expectations, FocusIndicator.IPCA).get(year)
    if median is None:
        return None
    band = target_bands_between(session, year, year).get(year)
    return ExpectedInflation(
        survey_date=survey_date,
        year=year,
        median=median / PERCENT,
        target=None if band is None else band.target,
    )
