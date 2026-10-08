"""Os sistemas externos injetados nas rotas: os testes trocam cada um por um fake."""

from __future__ import annotations

from collections.abc import Mapping
from typing import Annotated

from fastapi import Depends

from backend.adapters.bcb_sgs_provider import BcbSgsProvider
from backend.adapters.ibge_provider import IbgeAggregatesProvider
from backend.adapters.tesouro_debt_provider import TesouroDebtProvider
from backend.core.enum import Source
from backend.domain.federal_debt import FederalDebtProvider
from backend.domain.series import SeriesProvider


def get_providers() -> Mapping[Source, SeriesProvider]:
    return {Source.IBGE: IbgeAggregatesProvider(), Source.BCB_SGS: BcbSgsProvider()}


ProvidersDep = Annotated[Mapping[Source, SeriesProvider], Depends(get_providers)]


def get_debt_provider() -> FederalDebtProvider:
    return TesouroDebtProvider()


DebtProviderDep = Annotated[FederalDebtProvider, Depends(get_debt_provider)]
