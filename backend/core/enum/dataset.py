from enum import StrEnum


class Dataset(StrEnum):
    """Fonte que não cabe em `observations`, com tabela e refresh próprios."""

    FEDERAL_DEBT_STOCK = "federal_debt_stock"
