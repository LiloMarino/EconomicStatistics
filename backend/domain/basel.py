"""O índice de Basileia: quanto capital próprio o sistema tem para cada real de ativo
ponderado pelo risco, em fração (0.17 é 17%)."""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
from datetime import date

from backend.domain.series import Observation

# A Resolução CMN 4.958/2021 fixa o patrimônio de referência mínimo em 8% dos ativos
# ponderados pelo risco (art. 4º) e soma o adicional de conservação de 2,5% desde
# abr/2022 (art. 8º, § 4º, II)
MIN_CAPITAL = 0.08
CONSERVATION_BUFFER = 0.025


@dataclass(frozen=True, slots=True, kw_only=True)
class QuarterRatio:
    ref_date: date
    ratio: float


def basel_ratios(
    capital: Iterable[Observation], risk_weighted: Iterable[Observation]
) -> list[QuarterRatio]:
    """O patrimônio de referência sobre os ativos ponderados pelo risco, somados sobre
    as instituições, em cada trimestre que traz os dois: R$ 1.748,7 bi sobre
    R$ 10.090,5 bi dão 17,33% em dez/2025."""
    assets = {item.ref_date: item.value for item in risk_weighted}
    return [
        QuarterRatio(ref_date=item.ref_date, ratio=item.value / assets[item.ref_date])
        for item in capital
        if assets.get(item.ref_date)
    ]
