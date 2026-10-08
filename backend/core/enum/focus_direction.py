from enum import StrEnum


class FocusDirection(StrEnum):
    """Para onde a previsão andou de uma pesquisa semanal para a seguinte."""

    UP = "up"
    DOWN = "down"
    STABLE = "stable"
