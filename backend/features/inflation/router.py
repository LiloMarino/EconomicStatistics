from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.core.enum import RaiseReference, SeriesId
from backend.features.inflation.service import inflation_groups, purchasing_power

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
    series_id: SeriesId
    rate: float


class InflationGroupsDTO(BaseDTO):
    """Taxas em fração (0.0054 é 0,54%). `rolling_12m` só traz os meses com os 12
    meses completos no cache."""

    period: PeriodDTO
    monthly: list[GroupRateDTO]
    accumulated: list[GroupAccumulatedDTO]
    rolling_12m: list[GroupRateDTO]


class GroupPurchasingPowerDTO(BaseDTO):
    """`change` negativo é perda de poder de compra no grupo; positivo, ganho."""

    series_id: SeriesId
    inflation: float
    change: float


class PurchasingPowerDTO(BaseDTO):
    """Taxas em fração; os grupos vêm da maior perda ao maior ganho."""

    period: PeriodDTO
    reference: RaiseReference
    reference_raise: float
    groups: list[GroupPurchasingPowerDTO]


@router.get("/groups", responses=ERROR_RESPONSES)
def groups(
    session: SessionDep, start: date | None = None, end: date | None = None
) -> InflationGroupsDTO:
    return InflationGroupsDTO.model_validate(inflation_groups(session, start, end))


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
