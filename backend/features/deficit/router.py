from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from backend.core.database.session import SessionDep
from backend.core.dto import ERROR_RESPONSES, BaseDTO
from backend.core.enum import Sphere
from backend.features.deficit.service import deficit, deficit_financing

router = APIRouter(prefix="/api/deficit", tags=["deficit"])


class DeficitPointDTO(BaseDTO):
    """Os 12 meses que terminam em `ref_date`, em fração do PIB (0.0948 é 9,48%). Na
    convenção da NFSP, positivo é déficit e negativo é superávit; o nominal é o
    primário mais os juros."""

    ref_date: date
    nominal: float
    primary: float
    interest: float


class SphereDeficitDTO(BaseDTO):
    """A parte de uma esfera no déficit do último mês, na mesma fração do PIB e
    convenção do consolidado; o nominal é o primário mais os juros, e as três esferas
    somam o consolidado, a menos do arredondamento do BCB."""

    sphere: Sphere
    nominal: float
    primary: float
    interest: float


class DeficitForecastDTO(BaseDTO):
    """O que o Focus espera para dezembro de cada ano, na mesma convenção e fração do
    PIB dos pontos reais; os juros são o nominal menos o primário."""

    survey_date: date
    years: list[DeficitPointDTO]


class DeficitDTO(BaseDTO):
    """`interest_share` é a fração do déficit nominal que é juro (0.93 é 93%), `null`
    sem déficit nominal. `years` traz dezembro de cada ano e, por último, o último
    mês publicado; `months`, os 12 meses que terminam em cada mês desde o começo da
    série; `spheres`, o último mês dividido entre as esferas."""

    last: DeficitPointDTO
    interest_share: float | None
    years: list[DeficitPointDTO]
    months: list[DeficitPointDTO]
    spheres: list[SphereDeficitDTO]
    forecast: DeficitForecastDTO | None


class FinancingPointDTO(BaseDTO):
    """O fim de `ref_date`, em fração do PIB de 12 meses (0.22 é 22%): os títulos do
    Tesouro na carteira do Banco Central, a parte deles que está com o mercado nas
    compromissadas e a base monetária."""

    ref_date: date
    central_bank_portfolio: float
    repo_operations: float
    monetary_base: float


class FinancingAmountsDTO(BaseDTO):
    """Os três estoques do último mês, em R$ milhões."""

    central_bank_portfolio: float
    repo_operations: float
    monetary_base: float


class DebtHoldersDTO(BaseDTO):
    """Quem tem os títulos federais emitidos em `stock_month`, pelo estoque do Tesouro:
    a fração na carteira do Banco Central e a no mercado, que somam 1."""

    stock_month: date
    central_bank_share: float
    market_share: float


class DeficitFinancingDTO(BaseDTO):
    """`years` traz dezembro de cada ano e, por último, o último mês publicado.
    `repo_share` é a fração da carteira do Banco Central que está nas compromissadas no
    último mês (0.468 é 46,8%). `holders` é `null` até o estoque do Tesouro chegar ao
    cache, e fecha num mês anterior ao de `last`."""

    last: FinancingPointDTO
    amounts: FinancingAmountsDTO
    repo_share: float
    years: list[FinancingPointDTO]
    holders: DebtHoldersDTO | None


@router.get("", responses=ERROR_RESPONSES)
def deficit_overview(session: SessionDep) -> DeficitDTO:
    return DeficitDTO.model_validate(deficit(session))


@router.get("/financing", responses=ERROR_RESPONSES)
def deficit_financing_overview(session: SessionDep) -> DeficitFinancingDTO:
    return DeficitFinancingDTO.model_validate(deficit_financing(session))
