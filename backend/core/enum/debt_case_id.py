from enum import StrEnum


class DebtCaseId(StrEnum):
    """Ponto de partida do simulador da dívida."""

    BRAZIL_TODAY = "brazil_today"
    BRAZIL_COLLOR = "brazil_collor"
    BRAZIL_2002 = "brazil_2002"
    BRAZIL_2015 = "brazil_2015"
    JAPAN = "japan"
    GREECE = "greece"
    ARGENTINA_2001 = "argentina_2001"
    ARGENTINA_2023 = "argentina_2023"
    COUNTRY_A = "country_a"
    COUNTRY_B = "country_b"
