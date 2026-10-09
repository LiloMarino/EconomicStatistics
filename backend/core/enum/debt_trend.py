from enum import StrEnum


class DebtTrend(StrEnum):
    """Para onde a dívida/PIB vai ao longo do horizonte do simulador."""

    FALLING = "falling"
    STABLE = "stable"
    RISING = "rising"
