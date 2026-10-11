from enum import StrEnum


class Periodicity(StrEnum):
    """`DAILY` tem valor todo dia do calendário; `BUSINESS_DAILY`, só nos dias úteis."""

    DAILY = "daily"
    BUSINESS_DAILY = "business_daily"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    ANNUAL = "annual"
