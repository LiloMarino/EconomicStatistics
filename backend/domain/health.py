from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass
from datetime import date

from backend.core.enum import Lamp
from backend.domain.inflation_target import TargetBand

# A meta contínua é descumprida quando a inflação fica fora do intervalo por 6 meses
# seguidos: é aí que o Banco Central tem de escrever a carta aberta
LETTER_AFTER_MONTHS = 6


@dataclass(frozen=True, slots=True, kw_only=True)
class BandedRate:
    """O IPCA em 12 meses de um mês, em fração, e a faixa da meta daquele ano."""

    ref_date: date
    rate: float
    band: TargetBand | None


@dataclass(frozen=True, slots=True, kw_only=True)
class StripCell:
    """A cor de um mês e há quantos meses seguidos o IPCA está fora da faixa (0 dentro
    dela). Sem faixa no ano, não há cor."""

    ref_date: date
    rate: float
    lamp: Lamp | None
    months_out: int


def inflation_strip(points: Sequence[BandedRate]) -> list[StripCell]:
    """Verde dentro do intervalo (os limites estão dentro), amarelo fora há menos de 6
    meses seguidos e vermelho a partir do sexto. A sequência conta a partir do primeiro
    ponto recebido e zera ao voltar para dentro ou num mês sem faixa."""
    cells: list[StripCell] = []
    run = 0
    for point in points:
        band = point.band
        if band is None:
            run = 0
            cells.append(
                StripCell(
                    ref_date=point.ref_date, rate=point.rate, lamp=None, months_out=0
                )
            )
            continue
        outside = not band.floor <= point.rate <= band.ceiling
        run = run + 1 if outside else 0
        lamp = (
            Lamp.GREEN
            if not outside
            else Lamp.RED
            if run >= LETTER_AFTER_MONTHS
            else Lamp.YELLOW
        )
        cells.append(
            StripCell(
                ref_date=point.ref_date, rate=point.rate, lamp=lamp, months_out=run
            )
        )
    return cells


def primary_lamp(surplus: float, needed: float) -> Lamp:
    """Verde se o primário feito cobre o que estabiliza a dívida/PIB, vermelho se não:
    superávit de 2,0% do PIB contra 1,94% necessário cobre; déficit de 0,62% não."""
    return Lamp.GREEN if surplus >= needed else Lamp.RED
