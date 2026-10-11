from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.features.activity.service import activity
from backend.features.monthly_forecast_dto import MonthlyForecastDTO, MonthValueDTO

router = APIRouter(prefix="/api/activity", tags=["activity"])


class GdpDTO(BaseDTO):
    """O PIB acumulado em 4 trimestres, em fração (0.019 é 1,9%), datado no mês em que
    cada trimestre termina. `forecast` é o PIB que o Focus espera para cada ano do
    relatório, em dezembro."""

    quarters: list[MonthValueDTO]
    forecast: MonthlyForecastDTO | None


class IbcDTO(BaseDTO):
    """A variação em 12 meses do IBC-Br, em fração, calculada do índice mensal: média
    dos 12 meses que terminam em `ref_date` sobre a média dos 12 anteriores."""

    months: list[MonthValueDTO]


class UnemploymentDTO(BaseDTO):
    """A taxa de desocupação do trimestre móvel que termina em cada mês, em fração.
    `change_12m` é a diferença contra o mesmo mês do ano anterior, em fração (-0.008 é
    -0,8 ponto percentual). `employed` é a parte da força de trabalho que tem trabalho
    no último mês (0.947 com desocupação de 5,3%). `forecast` é a taxa que o Focus espera
    mês a mês."""

    months: list[MonthValueDTO]
    change_12m: float | None
    employed: float
    forecast: MonthlyForecastDTO | None


class RatePairDTO(BaseDTO):
    """A desocupação e a subutilização do trimestre móvel que termina em `ref_date`, em
    fração."""

    ref_date: date
    unemployment: float
    underutilization: float


class UnderutilizationDTO(BaseDTO):
    """As duas taxas da PNAD Contínua mês a mês, nos últimos 4 anos. `gap` é a
    subutilização menos a desocupação no último mês, em fração (0.078 é 7,8 pontos)."""

    months: list[RatePairDTO]
    gap: float


class ActivityDTO(BaseDTO):
    """Cada gráfico nos últimos 4 anos, terminando no último dado da série."""

    gdp: GdpDTO
    ibc: IbcDTO
    unemployment: UnemploymentDTO
    underutilization: UnderutilizationDTO


@router.get("", responses=ERROR_RESPONSES)
def activity_overview(session: SessionDep) -> ActivityDTO:
    return ActivityDTO.model_validate(activity(session))
