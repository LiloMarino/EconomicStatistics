from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.core.enum import PaceVerdict, RaiseReference, SeriesId
from backend.features.inflation.service import (
    inflation_groups,
    inflation_pace,
    purchasing_power,
    seasonality,
)

router = APIRouter(prefix="/api/inflation", tags=["inflation"])


class PeriodDTO(BaseDTO):
    """Meses datados no dia 1: o período efetivo e o intervalo com dado no cache."""

    start: date
    end: date
    first_available: date
    last_available: date


class GroupRateDTO(BaseDTO):
    series_id: SeriesId
    ref_date: date
    rate: float


class GroupAccumulatedDTO(BaseDTO):
    """`simple_sum` soma as variações mensais: a conta errada, só para contraste."""

    series_id: SeriesId
    rate: float
    simple_sum: float


class InflationGroupsDTO(BaseDTO):
    """Taxas em fração (0.0054 é 0,54%). `rolling_12m` só traz os meses com os 12
    meses completos no cache."""

    period: PeriodDTO
    monthly: list[GroupRateDTO]
    accumulated: list[GroupAccumulatedDTO]
    rolling_12m: list[GroupRateDTO]


class GroupPurchasingPowerDTO(BaseDTO):
    """`change` negativo é perda de poder de compra no grupo; positivo, ganho.
    `naive_change` é a subtração, só para contraste."""

    series_id: SeriesId
    inflation: float
    change: float
    naive_change: float


class ReferenceRaiseDTO(BaseDTO):
    """O reajuste da referência no período; `null` quando o cache não o cobre."""

    reference: RaiseReference
    rate: float | None


class PurchasingPowerDTO(BaseDTO):
    """Taxas em fração; os grupos vêm da maior perda ao maior ganho."""

    period: PeriodDTO
    reference: RaiseReference
    reference_raise: float
    references: list[ReferenceRaiseDTO]
    groups: list[GroupPurchasingPowerDTO]


class RollingPointDTO(BaseDTO):
    """O 12 meses que termina em `ref_date` e o teto da meta do ano, em fração."""

    ref_date: date
    rate: float
    ceiling: float | None


class MonthVsYearBeforeDTO(BaseDTO):
    """Um mês contra o mesmo mês do ano anterior; `difference` em fração de ponto."""

    ref_date: date
    rate: float
    year_before: float
    difference: float


class PaceWindowDTO(BaseDTO):
    """O 12 meses `months` meses antes do fim e a inclinação até o fim, em fração;
    `relative_change` é a inclinação como fração do valor de antes (-0.21 é -21%)."""

    months: int
    rolling_12m_before: float
    change: float
    relative_change: float


class GroupPaceDTO(BaseDTO):
    """O 12 meses do grupo no fim, em fração, e as janelas de 1, 3 e 6 meses que têm
    dado no cache."""

    series_id: SeriesId
    rolling_12m: float
    windows: list[PaceWindowDTO]


class InflationPaceDTO(BaseDTO):
    """O ritmo no fim do período. As inclinações são diferenças entre dois 12 meses,
    em fração (-0.005 é -0,50 p.p.); o veredito usa a de 3 meses, e inclinação dentro
    de `steady_band` para cima ou para baixo é estável. `last_months_difference` soma
    as diferenças dos 3 últimos meses contra o ano anterior."""

    end: date
    general_12m: list[RollingPointDTO]
    target: float | None
    ceiling: float | None
    last_months: list[MonthVsYearBeforeDTO]
    last_months_difference: float
    change_1m: float
    change_3m: float
    verdict: PaceVerdict
    steady_band: float
    groups: list[GroupPaceDTO]


class MonthRateDTO(BaseDTO):
    ref_date: date
    rate: float


class MonthBandDTO(BaseDTO):
    """A faixa de um mês do calendário (1 a 12) nos anos comparados, em fração."""

    month: int
    low: float
    high: float
    mean: float


class DeviationDTO(BaseDTO):
    ref_date: date
    rate: float
    typical: float
    difference: float


class GroupSeasonalityDTO(BaseDTO):
    series_id: SeriesId
    months: list[MonthRateDTO]
    bands: list[MonthBandDTO]
    largest_deviation: DeviationDTO | None


class SeasonalityDTO(BaseDTO):
    year: int
    years_compared: list[int]
    groups: list[GroupSeasonalityDTO]


@router.get("/groups", responses=ERROR_RESPONSES)
def groups(
    session: SessionDep, start: date | None = None, end: date | None = None
) -> InflationGroupsDTO:
    return InflationGroupsDTO.model_validate(inflation_groups(session, start, end))


@router.get("/pace", responses=ERROR_RESPONSES)
def pace(session: SessionDep, end: date | None = None) -> InflationPaceDTO:
    return InflationPaceDTO.model_validate(inflation_pace(session, end))


@router.get("/seasonality", responses=ERROR_RESPONSES)
def seasonality_by_group(
    session: SessionDep, year: int | None = None
) -> SeasonalityDTO:
    return SeasonalityDTO.model_validate(seasonality(session, year))


@router.get("/purchasing-power", responses=ERROR_RESPONSES)
def purchasing_power_by_group(
    session: SessionDep,
    reference: RaiseReference = RaiseReference.IPCA,
    start: date | None = None,
    end: date | None = None,
    custom_raise: float | None = None,
) -> PurchasingPowerDTO:
    """`custom_raise` em fração (0.06 é 6%), obrigatório com `reference=custom`."""
    return PurchasingPowerDTO.model_validate(
        purchasing_power(session, start, end, reference, custom_raise)
    )
