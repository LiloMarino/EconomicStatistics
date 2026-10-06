from __future__ import annotations

from datetime import date

from backend.domain.rates import (
    MonthlyRate,
    accumulate,
    monthly_rates,
    real_change,
    rolling_12m,
)
from tests.data_2022 import IPCA_FOOD_2022, IPCA_GENERAL_2022, months_2022


def _accumulated_percent(values: list[float]) -> float:
    rates = monthly_rates(months_2022(values))
    return round(accumulate(item.rate for item in rates) * 100, 2)


def test_composed_2022_ipca_from_published_months() -> None:
    """Compondo os mensais publicados com 2 casas, 2022 dá 5,78% no geral e 11,63% em
    Alimentação; o IBGE publica 5,79% e 11,64%, calculados do índice sem arredondar."""
    assert _accumulated_percent(IPCA_GENERAL_2022) == 5.78
    assert _accumulated_percent(IPCA_FOOD_2022) == 11.63


def test_raise_by_ipca_buys_less_food_in_2022() -> None:
    """O salário reajustado pelo IPCA de 2022 comprou 5,24% menos comida."""
    general = _accumulated_percent(IPCA_GENERAL_2022) / 100
    food = _accumulated_percent(IPCA_FOOD_2022) / 100

    assert round(real_change(general, food) * 100, 2) == -5.24


def test_accumulate_composes_instead_of_adding() -> None:
    """1% e depois 2% dão 3,02%, e não 3%."""
    assert round(accumulate([0.01, 0.02]), 6) == 0.0302


def test_rolling_12m_skips_incomplete_windows() -> None:
    """Só entra o mês que tem os 11 anteriores em sequência: com um buraco em
    março, o 12 meses só volta a existir 12 meses depois dele."""
    rates = [
        MonthlyRate(ref_date=date(2021 + (m - 1) // 12, (m - 1) % 12 + 1, 1), rate=0.01)
        for m in range(1, 31)
        if m != 3
    ]

    result = rolling_12m(rates)

    assert result[0].ref_date == date(2022, 3, 1)
    assert round(result[0].rate, 6) == round(1.01**12 - 1, 6)
