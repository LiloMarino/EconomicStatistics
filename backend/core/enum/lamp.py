from enum import StrEnum


class Lamp(StrEnum):
    """A cor do semáforo de um sinal com faixa oficial."""

    GREEN = "green"
    YELLOW = "yellow"
    RED = "red"
