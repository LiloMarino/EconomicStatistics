from __future__ import annotations

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.features.activity.service import activity
from backend.features.monthly_forecast_dto import MonthlyForecastDTO, MonthValueDTO

router = APIRouter(prefix="/api/activity", tags=["activity"])


class GdpDTO(BaseDTO):
    """O PIB acumulado em 4 trimestres, em fração (0.019 é 1,9%), datado no mês em que
    cada trimestre termina. `forecast` é o PIB do ano que o Focus espera, em dezembro
    do ano corrente e do seguinte."""

    quarters: list[MonthValueDTO]
    forecast: MonthlyForecastDTO | None


class IbcDTO(BaseDTO):
    """A variação em 12 meses do IBC-Br, em fração, calculada do índice mensal: média
    dos 12 meses que terminam em `ref_date` sobre a média dos 12 anteriores."""

    months: list[MonthValueDTO]


class UnemploymentDTO(BaseDTO):
    """A taxa de desocupação do trimestre móvel que termina em cada mês, em fração.
    `change_12m` é a diferença contra o mesmo mês do ano anterior, em fração (-0.008 é
    -0,8 ponto percentual). `forecast` é a taxa que o Focus espera mês a mês."""

    months: list[MonthValueDTO]
    change_12m: float | None
    forecast: MonthlyForecastDTO | None


class ActivityDTO(BaseDTO):
    """Cada gráfico nos últimos 4 anos, terminando no último dado da série."""

    gdp: GdpDTO
    ibc: IbcDTO
    unemployment: UnemploymentDTO


@router.get("", responses=ERROR_RESPONSES)
def activity_overview(session: SessionDep) -> ActivityDTO:
    return ActivityDTO.model_validate(activity(session))
