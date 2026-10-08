from enum import StrEnum


class DebtHolder(StrEnum):
    """A carteira em que o título está: a do mercado ou a do Banco Central."""

    MARKET = "market"
    CENTRAL_BANK = "central_bank"
