from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.core.enum import Lamp
from backend.features.economy_health.service import economy_health
from backend.features.target_band_dto import TargetBandDTO

router = APIRouter(prefix="/api/economy-health", tags=["economy-health"])


class StripCellDTO(BaseDTO):
    """O IPCA em 12 meses de um mês, em fração, e a cor dele. `lamp` é `null` quando o
    ano não tem faixa da meta; `months_out` é há quantos meses seguidos o IPCA está fora
    da faixa, 0 dentro dela."""

    ref_date: date
    rate: float
    lamp: Lamp | None
    months_out: int


class InflationSignalDTO(BaseDTO):
    """O IPCA em 12 meses do último mês contra a faixa da meta do ano, com a cor dele e
    a de cada um dos últimos 24 meses. Verde dentro da faixa, amarelo fora há menos de 6
    meses seguidos, vermelho a partir do sexto."""

    ref_date: date
    rate: float
    band: TargetBandDTO | None
    lamp: Lamp | None
    months_out: int
    strip: list[StripCellDTO]


class PrimarySignalDTO(BaseDTO):
    """O primário feito contra o que estabiliza a dívida/PIB, em fração do PIB.
    `surplus` é negativo no déficit; `gap` é o que falta, e negativo é sobra. Verde se o
    feito cobre o necessário, vermelho se não."""

    ref_date: date
    surplus: float
    stabilizing: float
    gap: float
    lamp: Lamp


class ExpectedInflationDTO(BaseDTO):
    """A mediana do Focus para o IPCA do ano da pesquisa, em fração, e a meta do ano."""

    survey_date: date
    year: int
    median: float
    target: float | None


class RealRateDTO(BaseDTO):
    """O juro real ex-ante: a Selic de hoje descontada da inflação esperada, em fração."""

    rate: float
    selic: float
    expected_inflation: float
    survey_date: date


class DatedValueDTO(BaseDTO):
    ref_date: date
    value: float


class GdpShareDTO(BaseDTO):
    ref_date: date
    share: float


class ReservesDTO(BaseDTO):
    """O estoque em US$ milhões e, quando o PIB em dólar já saiu, a fração do PIB."""

    ref_date: date
    value: float
    gdp_share: GdpShareDTO | None


class DollarDTO(BaseDTO):
    """A PTAX do fim do mês, em reais, e a variação contra o mesmo mês do ano anterior."""

    ref_date: date
    value: float
    change_12m: float | None


class ReferencesDTO(BaseDTO):
    """Os sinais sem faixa oficial, só com o número: taxas e frações em fração (0.053
    é 5,3%). `expected_inflation` e `real_rate` dependem da pesquisa Focus."""

    expected_inflation: ExpectedInflationDTO | None
    real_rate: RealRateDTO | None
    unemployment: DatedValueDTO
    reserves: ReservesDTO
    gross_debt: DatedValueDTO
    dollar: DollarDTO


class EconomyHealthDTO(BaseDTO):
    inflation: InflationSignalDTO
    primary: PrimarySignalDTO
    references: ReferencesDTO


@router.get("", responses=ERROR_RESPONSES)
def economy_health_view(session: SessionDep) -> EconomyHealthDTO:
    return EconomyHealthDTO.model_validate(economy_health(session))
