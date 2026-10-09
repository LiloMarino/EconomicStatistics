"""Os sistemas externos injetados nas rotas: os testes trocam cada um por um fake."""

from __future__ import annotations

from collections.abc import Mapping
from typing import Annotated

from fastapi import Depends

from backend.adapters.bcb_copom_provider import BcbCopomProvider
from backend.adapters.bcb_focus_provider import BcbFocusProvider
from backend.adapters.bcb_sgs_provider import BcbSgsProvider
from backend.adapters.bcb_target_provider import BcbTargetProvider
from backend.adapters.ibge_provider import IbgeAggregatesProvider
from backend.adapters.imf_provider import ImfDataMapperProvider
from backend.adapters.tesouro_debt_provider import TesouroDebtProvider
from backend.core.enum import Source
from backend.domain.copom import CopomProvider
from backend.domain.federal_debt import FederalDebtProvider
from backend.domain.focus import FocusProvider
from backend.domain.imf import ImfProvider
from backend.domain.inflation_target import InflationToleranceProvider
from backend.domain.series import SeriesProvider


def get_providers() -> Mapping[Source, SeriesProvider]:
    return {Source.IBGE: IbgeAggregatesProvider(), Source.BCB_SGS: BcbSgsProvider()}


ProvidersDep = Annotated[Mapping[Source, SeriesProvider], Depends(get_providers)]


def get_debt_provider() -> FederalDebtProvider:
    return TesouroDebtProvider()


DebtProviderDep = Annotated[FederalDebtProvider, Depends(get_debt_provider)]


def get_focus_provider() -> FocusProvider:
    return BcbFocusProvider()


FocusProviderDep = Annotated[FocusProvider, Depends(get_focus_provider)]


def get_copom_provider() -> CopomProvider:
    return BcbCopomProvider()


CopomProviderDep = Annotated[CopomProvider, Depends(get_copom_provider)]


def get_tolerance_provider() -> InflationToleranceProvider:
    return BcbTargetProvider()


ToleranceProviderDep = Annotated[
    InflationToleranceProvider, Depends(get_tolerance_provider)
]


def get_imf_provider() -> ImfProvider:
    return ImfDataMapperProvider()


ImfProviderDep = Annotated[ImfProvider, Depends(get_imf_provider)]
