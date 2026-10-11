from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.features.external_sector.service import external_sector
from backend.features.monthly_forecast_dto import MonthlyForecastDTO, MonthValueDTO

router = APIRouter(prefix="/api/external-sector", tags=["external-sector"])


class DollarDTO(BaseDTO):
    """A PTAX do fim de cada mês em reais por dólar; `change_12m` em fração contra o
    mesmo mês do ano anterior. `forecast` é o câmbio de fim de mês que o Focus
    espera. `days` é a PTAX de cada dia útil dos últimos 12 meses, datada no próprio
    dia."""

    months: list[MonthValueDTO]
    change_12m: float | None
    forecast: MonthlyForecastDTO | None
    days: list[MonthValueDTO]


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
    em US$ bilhões (-60.0 é um déficit de US$ 60 bilhões). `trade_balance` é a balança
    de mercadorias, e `services_and_income` o resto das transações correntes, os
    serviços e a renda."""

    survey_date: date
    year: int
    current_account: float
    fdi: float
    trade_balance: float
    services_and_income: float


class NationalIncomeDTO(BaseDTO):
    """A renda primária dos 12 meses que terminam em `ref_date`, em fração do PIB de 12
    meses: `received` entra, `sent` sai, `net_sent` é o que sai a mais (0.033 é 3,3% do
    PIB). `kept` é a renda nacional bruta sobre o PIB (0.967 é 96,7%)."""

    ref_date: date
    received: float
    sent: float
    net_sent: float
    kept: float


class ExternalSectorDTO(BaseDTO):
    """Cada gráfico na sua janela, terminando no último dado: 24 meses de dólar, 10
    anos de fluxos e de reservas, e um ponto por ano nos últimos 6 anos da posição."""

    dollar: DollarDTO
    flows: list[FlowPointDTO]
    flows_forecast: FlowsForecastDTO | None
    reserves: ReservesDTO
    position: list[PositionPointDTO]
    national_income: NationalIncomeDTO | None


@router.get("", responses=ERROR_RESPONSES)
def external_sector_overview(session: SessionDep) -> ExternalSectorDTO:
    return ExternalSectorDTO.model_validate(external_sector(session))
