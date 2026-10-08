from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.features.external_sector.service import external_sector

router = APIRouter(prefix="/api/external-sector", tags=["external-sector"])


class MonthValueDTO(BaseDTO):
    ref_date: date
    value: float


class MonthlyForecastDTO(BaseDTO):
    """O valor esperado em cada mês depois do último dado, pela pesquisa Focus de
    `survey_date`."""

    survey_date: date
    months: list[MonthValueDTO]


class DollarDTO(BaseDTO):
    """A PTAX do fim de cada mês em reais por dólar; `change_12m` em fração contra o
    mesmo mês do ano anterior. `forecast` é o câmbio de fim de mês que o Focus
    espera."""

    months: list[MonthValueDTO]
    change_12m: float | None
    forecast: MonthlyForecastDTO | None


class FlowPointDTO(BaseDTO):
    """Transações correntes e investimento direto no país acumulados nos 12 meses que
    terminam em `ref_date`, em fração do PIB (-0.0247 é um déficit de 2,47% do PIB)."""

    ref_date: date
    current_account: float
    fdi: float


class GdpShareDTO(BaseDTO):
    ref_date: date
    share: float


class ReservesDTO(BaseDTO):
    """O estoque do fim de cada mês em US$ milhões, e a fração do PIB do último mês
    que tem o PIB de 12 meses."""

    months: list[MonthValueDTO]
    gdp_share: GdpShareDTO | None


class PositionPointDTO(BaseDTO):
    """A posição internacional no fim do trimestre que começa em `ref_date`, em fração
    do PIB de 12 meses; `net` é ativos menos passivos."""

    ref_date: date
    assets: float
    liabilities: float
    net: float


class FlowsForecastDTO(BaseDTO):
    """O que o Focus espera para o ano em transações correntes e investimento direto,
    em US$ bilhões (-60.0 é um déficit de US$ 60 bilhões)."""

    survey_date: date
    year: int
    current_account: float
    fdi: float


class ExternalSectorDTO(BaseDTO):
    """Cada gráfico na sua janela, terminando no último dado: 24 meses de dólar, 10
    anos de fluxos e de reservas, e um ponto por ano nos últimos 6 anos da posição."""

    dollar: DollarDTO
    flows: list[FlowPointDTO]
    flows_forecast: FlowsForecastDTO | None
    reserves: ReservesDTO
    position: list[PositionPointDTO]


@router.get("", responses=ERROR_RESPONSES)
def external_sector_overview(session: SessionDep) -> ExternalSectorDTO:
    return ExternalSectorDTO.model_validate(external_sector(session))
