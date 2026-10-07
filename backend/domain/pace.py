"""O ritmo da inflação: se o acumulado de 12 meses está subindo, parado ou caindo.

A inclinação é a diferença entre dois acumulados de 12 meses, em pontos percentuais.
É uma comparação de nível entre duas taxas, e não composição: por isso subtrai."""

from __future__ import annotations

from backend.core.enum import PaceVerdict

# Inclinação de até 0,10 p.p. para cima ou para baixo conta como estável
STEADY_BAND = 0.001


def verdict(change: float) -> PaceVerdict:
    if change > STEADY_BAND:
        return PaceVerdict.ACCELERATING
    if change < -STEADY_BAND:
        return PaceVerdict.SLOWING
    return PaceVerdict.STEADY
