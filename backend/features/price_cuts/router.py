from __future__ import annotations

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.features.monthly_forecast_dto import MonthlyForecastDTO, MonthValueDTO
from backend.features.price_cuts.service import price_cuts

router = APIRouter(prefix="/api/price-cuts", tags=["price-cuts"])


class PriceCutDTO(BaseDTO):
    """O IPCA em 12 meses do corte, em fração (0.0412 é 4,12%), nos últimos 24 meses.
    `forecast` continua a linha pelo Focus, até 12 meses depois do último dado."""

    months: list[MonthValueDTO]
    forecast: MonthlyForecastDTO | None


class PriceCutsDTO(BaseDTO):
    """O IPCA dividido pela forma como o preço se forma: livres (o mercado forma),
    administrados (dependem de governo ou contrato) e serviços (parte dos livres)."""

    free: PriceCutDTO
    administered: PriceCutDTO
    services: PriceCutDTO


@router.get("", responses=ERROR_RESPONSES)
def price_cuts_overview(session: SessionDep) -> PriceCutsDTO:
    return PriceCutsDTO.model_validate(price_cuts(session))
