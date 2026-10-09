from enum import StrEnum


class ImfIndicator(StrEnum):
    """Indicador do FMI DataMapper, pelo código que a API publica."""

    GROSS_DEBT = "GGXWDG_NGDP"
    INFLATION = "PCPIPCH"
