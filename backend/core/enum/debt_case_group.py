from enum import StrEnum


class DebtCaseGroup(StrEnum):
    """Se o ponto de partida do simulador aconteceu de verdade ou é um exemplo para entender a conta."""

    HAPPENED = "happened"
    EXAMPLE = "example"
