"""Contas do setor externo: valores em dólar medidos contra o tamanho da economia."""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from datetime import date

from backend.domain.gdp import share_of_gdp
from backend.domain.series import Observation


@dataclass(frozen=True, slots=True, kw_only=True)
class PositionPoint:
    """A posição internacional no fim de um trimestre, em fração do PIB de 12 meses:
    `net` é o que o país tem lá fora menos o que deve ou pertence a estrangeiros."""

    ref_date: date
    assets: float
    liabilities: float
    net: float


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


@dataclass(frozen=True, slots=True, kw_only=True)
class NationalIncome:
    """A renda primária de 12 meses que termina em `ref_date`, em fração do PIB de 12
    meses: `received` entra no país, `sent` sai, e `net_sent` é o que sai a mais. `kept`
    é a renda nacional bruta sobre o PIB, a parte do que se produz aqui que fica com
    quem é daqui."""

    ref_date: date
    received: float
    sent: float
    net_sent: float
    kept: float


YEAR_MONTHS = 12


def national_income(
    received: Sequence[Observation],
    paid: Sequence[Observation],
    gdp_12m: Mapping[date, float],
) -> NationalIncome | None:
    """O último mês com os 12 meses das duas séries e o PIB de 12 meses publicados: em
    ago/2026, US$ 42,9 bi recebidos e US$ 126,8 bi enviados contra um PIB de US$ 2,55
    tri dão 1,68% e 4,96% do PIB, e o país fica com 96,7% do que produz."""
    received_by_month = {item.ref_date: item.value for item in received}
    paid_by_month = {item.ref_date: item.value for item in paid}
    months = sorted(received_by_month.keys() & paid_by_month.keys())
    for end in reversed(range(YEAR_MONTHS - 1, len(months))):
        window = months[end - YEAR_MONTHS + 1 : end + 1]
        gdp = gdp_12m.get(window[-1])
        if gdp is None or _months_apart(window[0], window[-1]) != YEAR_MONTHS - 1:
            continue
        sent = share_of_gdp(sum(paid_by_month[month] for month in window), gdp)
        income = share_of_gdp(sum(received_by_month[month] for month in window), gdp)
        return NationalIncome(
            ref_date=window[-1],
            received=income,
            sent=sent,
            net_sent=sent - income,
            kept=1 - (sent - income),
        )
    return None


def _months_apart(start: date, end: date) -> int:
    return (end.year - start.year) * YEAR_MONTHS + end.month - start.month
