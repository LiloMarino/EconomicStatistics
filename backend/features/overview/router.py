from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.core.enum import ChangeKind, OverviewIndicator
from backend.features.overview.service import overview
from backend.features.target_band_dto import TargetBandDTO

router = APIRouter(prefix="/api/overview", tags=["overview"])


class IndicatorDTO(BaseDTO):
    """O último valor de um indicador: taxas em fração (0.0422 é 4,22%), o dólar em
    reais e as reservas em US$ milhões. `change` é a diferença para `change_months`
    meses antes, em fração se `change_kind` é `points` (0.003 são 0,3 ponto
    percentual) ou relativa se é `relative` (-0.041 são -4,1%). `sparkline` traz até
    os últimos 24 pontos. `band` e `within_band` dizem a faixa oficial e se o valor está
    dentro dela, e só existem onde há faixa."""

    indicator: OverviewIndicator
    ref_date: date
    value: float
    change: float | None
    change_kind: ChangeKind
    change_months: int | None
    sparkline: list[float]
    band: TargetBandDTO | None
    within_band: bool | None


class GovernmentResultDTO(BaseDTO):
    """Os 12 meses até `ref_date`, em fração do PIB e na convenção da NFSP: positivo é
    déficit. `interest_share` é a fração do déficit nominal que é juro."""

    ref_date: date
    primary: float
    interest: float
    nominal: float
    interest_share: float | None


class OverviewDTO(BaseDTO):
    """Um indicador some da lista quando o cache não tem o dado dele: o real, que
    depende da pesquisa Focus, e o IPCA esperado."""

    indicators: list[IndicatorDTO]
    government_result: GovernmentResultDTO


@router.get("", responses=ERROR_RESPONSES)
def overview_view(session: SessionDep) -> OverviewDTO:
    return OverviewDTO.model_validate(overview(session, date.today()))
