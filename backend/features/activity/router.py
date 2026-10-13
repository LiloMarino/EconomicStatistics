from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.core.enum import PaceVerdict
from backend.features.activity.service import activity
from backend.features.monthly_forecast_dto import MonthlyForecastDTO, MonthValueDTO

router = APIRouter(prefix="/api/activity", tags=["activity"])


class GdpDTO(BaseDTO):
    """O PIB acumulado em 4 trimestres, em fração (0.019 é 1,9%), datado no mês em que
    cada trimestre termina. `quarter_on_quarter` é a variação de cada trimestre sobre o
    anterior, com ajuste sazonal, em fração e com a mesma data. `forecast` é o PIB que o
    Focus espera para cada ano do relatório, em dezembro."""

    quarters: list[MonthValueDTO]
    quarter_on_quarter: list[MonthValueDTO]
    forecast: MonthlyForecastDTO | None


class IbcDTO(BaseDTO):
    """A variação em 12 meses do IBC-Br, em fração, calculada do índice mensal: média
    dos 12 meses que terminam em `ref_date` sobre a média dos 12 anteriores.
    `month_on_month` é a variação de cada mês sobre o anterior no índice com ajuste
    sazonal, em fração (-0.0022 é -0,22%).

    O ritmo: `change_1m` e `change_3m` são a inclinação do 12 meses no último mês e nos
    últimos 3, em fração (-0.0016 é -0,16 p.p.). O veredito usa a de 3 meses, e
    inclinação dentro de `steady_band` para cima ou para baixo é estável."""

    months: list[MonthValueDTO]
    month_on_month: list[MonthValueDTO]
    change_1m: float
    change_3m: float
    verdict: PaceVerdict
    steady_band: float


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
