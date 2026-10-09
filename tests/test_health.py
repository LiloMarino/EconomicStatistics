"""O semáforo dos sinais com faixa oficial: a meta de inflação e o primário."""

from __future__ import annotations

from datetime import date

from backend.core.enum import Lamp
from backend.domain.health import BandedRate, inflation_strip, primary_lamp
from backend.domain.inflation_target import TargetBand

BAND = TargetBand(target=0.03, floor=0.015, ceiling=0.045)


def _points(rates: list[float], band: TargetBand | None = BAND) -> list[BandedRate]:
    return [
        BandedRate(ref_date=date(2026, month, 1), rate=rate, band=band)
        for month, rate in enumerate(rates, start=1)
    ]


def _lamps(rates: list[float], band: TargetBand | None = BAND) -> list[Lamp | None]:
    return [cell.lamp for cell in inflation_strip(_points(rates, band))]


def test_inside_the_band_is_green_and_the_limits_are_inside() -> None:
    """Com a faixa de 1,5% a 4,5%, 3,0% e os dois limites são verdes."""
    assert _lamps([0.03, 0.015, 0.045]) == [Lamp.GREEN] * 3


def test_five_months_outside_are_yellow_and_the_sixth_is_red() -> None:
    """Fora da faixa por 5 meses seguidos é amarelo; o sexto mês seguido fica
    vermelho, que é quando o Banco Central tem de escrever a carta aberta."""
    lamps = _lamps([0.05] * 6)

    assert lamps == [Lamp.YELLOW] * 5 + [Lamp.RED]


def test_returning_inside_restarts_the_count() -> None:
    """Depois de 5 meses fora, um mês dentro zera a sequência: o mês fora seguinte
    volta a ser amarelo."""
    cells = inflation_strip(_points([0.05] * 5 + [0.04, 0.05]))

    assert [cell.lamp for cell in cells[-2:]] == [Lamp.GREEN, Lamp.YELLOW]
    assert [cell.months_out for cell in cells] == [1, 2, 3, 4, 5, 0, 1]


def test_below_the_floor_counts_as_outside() -> None:
    """Inflação abaixo do piso também descumpre a meta."""
    assert _lamps([0.01]) == [Lamp.YELLOW]


def test_month_without_band_has_no_color_and_restarts_the_count() -> None:
    """Sem faixa no ano não há cor, e o mês sem faixa interrompe a sequência."""
    points = [
        *_points([0.05, 0.05]),
        BandedRate(ref_date=date(2026, 3, 1), rate=0.05, band=None),
        BandedRate(ref_date=date(2026, 4, 1), rate=0.05, band=BAND),
    ]

    cells = inflation_strip(points)

    assert [cell.lamp for cell in cells] == [
        Lamp.YELLOW,
        Lamp.YELLOW,
        None,
        Lamp.YELLOW,
    ]
    assert cells[-1].months_out == 1


def test_primary_covering_the_stabilizing_one_is_green() -> None:
    """Superávit de 2,0% do PIB cobre os 1,94% necessários, e o exato também cobre."""
    assert primary_lamp(0.02, 0.0194) is Lamp.GREEN
    assert primary_lamp(0.0194, 0.0194) is Lamp.GREEN


def test_primary_short_of_the_stabilizing_one_is_red() -> None:
    """Déficit de 0,62% do PIB não cobre os 1,94% necessários."""
    assert primary_lamp(-0.0062, 0.0194) is Lamp.RED
