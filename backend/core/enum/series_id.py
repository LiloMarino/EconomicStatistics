from enum import StrEnum


class SeriesId(StrEnum):
    IPCA_GENERAL = "ipca_general"
    IPCA_FOOD = "ipca_food"
    IPCA_HOUSING = "ipca_housing"
    IPCA_HOUSEHOLD = "ipca_household"
    IPCA_APPAREL = "ipca_apparel"
    IPCA_TRANSPORT = "ipca_transport"
    IPCA_HEALTH = "ipca_health"
    IPCA_PERSONAL = "ipca_personal"
    IPCA_EDUCATION = "ipca_education"
    IPCA_COMMUNICATION = "ipca_communication"
    INPC = "inpc"
    MINIMUM_WAGE = "minimum_wage"
    INFLATION_TARGET = "inflation_target"
    DOLLAR_MONTHLY = "dollar_monthly"
    CURRENT_ACCOUNT_GDP = "current_account_gdp"
    FDI_GDP = "fdi_gdp"
    RESERVES = "reserves"
    GDP_USD_12M = "gdp_usd_12m"
    IIP_ASSETS = "iip_assets"
    IIP_LIABILITIES = "iip_liabilities"
