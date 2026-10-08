from enum import StrEnum


class Indexer(StrEnum):
    """O que corrige o valor de um título até o vencimento."""

    SELIC = "selic"
    FIXED = "fixed"
    IPCA = "ipca"
    IGPM = "igpm"
    FX = "fx"
    OTHER = "other"
