"""Valores medidos contra o tamanho da economia: o PIB de 12 meses do mesmo mês."""

from __future__ import annotations


def share_of_gdp(value: float, gdp: float) -> float:
    """Valor e PIB na mesma moeda: US$ 362,8 bi de reservas contra um PIB de 12 meses
    de US$ 2,55 tri dão 0,142 (14,2% do PIB)."""
    return value / gdp
