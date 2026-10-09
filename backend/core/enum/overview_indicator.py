from enum import StrEnum


class OverviewIndicator(StrEnum):
    """Os indicadores que a Visão geral mostra, um cartão para cada."""

    IPCA_12M = "ipca_12m"
    EXPECTED_IPCA = "expected_ipca"
    SELIC = "selic"
    REAL_RATE = "real_rate"
    NET_DEBT = "net_debt"
    GROSS_DEBT = "gross_debt"
    IBC_BR = "ibc_br"
    GDP = "gdp"
    UNEMPLOYMENT = "unemployment"
    DOLLAR = "dollar"
    RESERVES = "reserves"
    CURRENT_ACCOUNT = "current_account"
    FDI = "fdi"
    INTERNATIONAL_POSITION = "international_position"
    CREDIT_COST = "credit_cost"
    HOUSEHOLD_CONCESSIONS = "household_concessions"
    BASEL_RATIO = "basel_ratio"
