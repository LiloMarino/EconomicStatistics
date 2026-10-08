"""Dinâmica da dívida: o juro que ela paga contra o crescimento da economia, e o
primário que deixaria a dívida/PIB parada. Tudo em fração."""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from datetime import date
from statistics import fmean

from backend.domain.coverage import month_start
from backend.domain.rates import relative_change


@dataclass(frozen=True, slots=True, kw_only=True)
class DebtRates:
    """`implicit_rate` é o r, o juro médio que a dívida líquida pagou nos 12 meses que
    terminam em `ref_date`; `nominal_growth` é o g, o crescimento do PIB nominal de 12
    meses contra o do ano anterior."""

    ref_date: date
    implicit_rate: float
    nominal_growth: float


def implicit_rate(interest: float, gdp_12m: float, net_debt: Sequence[float]) -> float:
    """Os juros de 12 meses em reais sobre a dívida líquida média dos mesmos 12 meses.
    `interest` é a fração do PIB que a NFSP publica: juros de 8,86% de um PIB de
    R$ 13,34 tri são R$ 1,18 tri, e sobre uma dívida média de R$ 9,0 tri dão r = 13,1%."""
    return interest * gdp_12m / fmean(net_debt)


def stabilizing_primary(debt: float, rate: float, growth: float) -> float:
    """O superávit primário, em fração do PIB, que deixa a dívida/PIB igual de um ano
    para o outro. A dívida cresce pelo fator (1 + r) e o PIB por (1 + g), então
    p* = d * ((1 + r) / (1 + g) - 1) = d * (r - g) / (1 + g). Com dívida de 80% do
    PIB, r de 10% e g de 7%: 0,8 * 0,03 / 1,07 = 2,24% do PIB."""
    return debt * (rate - growth) / (1 + growth)


def debt_rates(
    interest: Mapping[date, float],
    gdp_12m: Mapping[date, float],
    net_debt: Mapping[date, float],
) -> list[DebtRates]:
    """r e g de cada mês que tem os juros, o PIB de 12 meses dele e do ano anterior e a
    dívida líquida dos 12 meses que terminam nele. `interest` em fração do PIB, PIB e
    dívida na mesma moeda."""
    points: list[DebtRates] = []
    for ref_date in sorted(interest):
        months = [month_start(ref_date, back) for back in range(12)]
        gdp = gdp_12m.get(ref_date)
        gdp_year_before = gdp_12m.get(month_start(ref_date, 12))
        if (
            gdp is None
            or gdp_year_before is None
            or any(month not in net_debt for month in months)
        ):
            continue
        points.append(
            DebtRates(
                ref_date=ref_date,
                implicit_rate=implicit_rate(
                    interest[ref_date], gdp, [net_debt[month] for month in months]
                ),
                nominal_growth=relative_change(gdp, gdp_year_before),
            )
        )
    return points
