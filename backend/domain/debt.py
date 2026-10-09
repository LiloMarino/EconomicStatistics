"""Dinâmica da dívida: o juro que ela paga contra o crescimento da economia, e o
primário que deixaria a dívida/PIB parada. Tudo em fração."""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from datetime import date
from statistics import fmean

from backend.core.enum import DebtTrend
from backend.domain.coverage import month_start
from backend.domain.rates import relative_change

# Variação da dívida/PIB no horizonte abaixo da qual ela conta como parada (0,5 ponto
# percentual do PIB)
STABLE_BAND = 0.005


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


def debt_path(
    debt: float, rate: float, growth: float, primary: float, years: int
) -> list[float]:
    """A dívida/PIB de hoje e de cada um dos `years` anos seguintes, em fração. Cada ano
    a dívida cresce por (1 + r), o PIB por (1 + g) e o superávit primário `primary`
    abate: d(t+1) = d(t) * (1 + r) / (1 + g) - p. Com 80%, r de 10%, g de 7% e
    p = 2,24% (o p* dessa dívida), ela fica em 80% todos os anos."""
    path = [debt]
    for _ in range(years):
        path.append(path[-1] * (1 + rate) / (1 + growth) - primary)
    return path


def debt_trend(path: Sequence[float]) -> DebtTrend:
    """Para onde a dívida/PIB foi do início ao fim do caminho. Variação menor que
    `STABLE_BAND` é dívida parada."""
    change = path[-1] - path[0]
    if abs(change) < STABLE_BAND:
        return DebtTrend.STABLE
    return DebtTrend.RISING if change > 0 else DebtTrend.FALLING


def still_rising(path: Sequence[float]) -> bool:
    """Se o último ano do caminho ainda subiu. A razão converge para um ponto fixo ou
    foge dele sempre no mesmo sentido, então isso diz se ela segue subindo depois do
    horizonte."""
    return len(path) > 1 and path[-1] > path[-2]


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
