"""Contas de taxa, sempre em fração (0,0054 é 0,54%). Compor é multiplicar e
descontar uma taxa de outra é dividir: percentual nunca se soma nem se subtrai."""

from __future__ import annotations

from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from datetime import date

from backend.domain.coverage import month_start
from backend.domain.series import Observation

PERCENT = 100


@dataclass(frozen=True, slots=True, kw_only=True)
class MonthlyRate:
    ref_date: date
    rate: float


def monthly_rates(observations: Iterable[Observation]) -> list[MonthlyRate]:
    """Série publicada em % no mês para fração."""
    return [
        MonthlyRate(ref_date=item.ref_date, rate=item.value / PERCENT)
        for item in observations
    ]


def accumulate(rates: Iterable[float]) -> float:
    """1% num mês e 2% no seguinte dão 3,02% (1,01 * 1,02 - 1), e não 3%."""
    factor = 1.0
    for rate in rates:
        factor *= 1 + rate
    return factor - 1


def real_change(raise_: float, inflation: float) -> float:
    """Quanto o reajuste compra a mais (positivo) ou a menos (negativo) depois da
    inflação: reajuste de 5% contra inflação de 9% dá 1,05 / 1,09 - 1 = -3,7%."""
    return (1 + raise_) / (1 + inflation) - 1


def relative_change(current: float, before: float) -> float:
    """Quanto um valor mudou em relação a outro, dividindo: o dólar a R$ 5,14 contra
    R$ 5,40 um ano antes dá 5,14 / 5,40 - 1 = -4,8%."""
    return current / before - 1


def rolling_12m(rates: Sequence[MonthlyRate]) -> list[MonthlyRate]:
    """O acumulado dos 12 meses que terminam em cada mês, a partir de uma série em
    ordem de data. Mês sem os 11 anteriores em sequência fica de fora."""
    result: list[MonthlyRate] = []
    for end in range(11, len(rates)):
        window = rates[end - 11 : end + 1]
        if window[0].ref_date == month_start(window[-1].ref_date, 11):
            result.append(
                MonthlyRate(
                    ref_date=window[-1].ref_date,
                    rate=accumulate(item.rate for item in window),
                )
            )
    return result


def index_change_12m(index: Sequence[Observation]) -> list[MonthlyRate]:
    """A variação, em fração, da média dos 12 meses que terminam em cada mês sobre a
    média dos 12 meses anteriores, a partir de uma série mensal em ordem de data: é o
    acumulado em 12 meses de um índice de atividade, como o IBC-Br. Num fluxo, como as
    concessões de crédito, a razão das médias é a razão das somas de 12 meses. O mês
    precisa dos 23 anteriores em sequência."""
    result: list[MonthlyRate] = []
    for end in range(23, len(index)):
        window = index[end - 23 : end + 1]
        if window[0].ref_date == month_start(window[-1].ref_date, 23):
            before = sum(item.value for item in window[:12]) / 12
            after = sum(item.value for item in window[12:]) / 12
            result.append(
                MonthlyRate(
                    ref_date=window[-1].ref_date, rate=relative_change(after, before)
                )
            )
    return result
