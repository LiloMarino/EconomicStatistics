"""Contas do setor externo: valores em dólar medidos contra o tamanho da economia."""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from datetime import date

from backend.domain.series import Observation


@dataclass(frozen=True, slots=True, kw_only=True)
class PositionPoint:
    """A posição internacional no fim de um trimestre, em fração do PIB de 12 meses:
    `net` é o que o país tem lá fora menos o que deve ou pertence a estrangeiros."""

    ref_date: date
    assets: float
    liabilities: float
    net: float


def share_of_gdp(value: float, gdp: float) -> float:
    """Valor e PIB na mesma moeda: US$ 362,8 bi de reservas contra um PIB de 12 meses
    de US$ 2,55 tri dão 0,142 (14,2% do PIB)."""
    return value / gdp


def quarter_last_month(quarter: date) -> date:
    """O trimestre vem datado no 1º mês dele; o estoque é o do fim do 3º."""
    return date(quarter.year, quarter.month + 2, 1)


def international_position(
    assets: Sequence[Observation],
    liabilities: Sequence[Observation],
    gdp_12m: Mapping[date, float],
) -> list[PositionPoint]:
    """Cada trimestre com ativo, passivo e o PIB de 12 meses do último mês dele. O
    estoque é a foto do fim do trimestre, e por isso se mede contra o PIB dos 12 meses
    que terminam ali."""
    liabilities_by_quarter = {item.ref_date: item.value for item in liabilities}
    points: list[PositionPoint] = []
    for item in assets:
        liability = liabilities_by_quarter.get(item.ref_date)
        gdp = gdp_12m.get(quarter_last_month(item.ref_date))
        if liability is None or gdp is None:
            continue
        points.append(
            PositionPoint(
                ref_date=item.ref_date,
                assets=share_of_gdp(item.value, gdp),
                liabilities=share_of_gdp(liability, gdp),
                net=share_of_gdp(item.value - liability, gdp),
            )
        )
    return points
