from enum import StrEnum


class FocusTargetKind(StrEnum):
    """Para quando é a previsão: um mês, um trimestre, uma reunião do Copom, um ano,
    ou os 12 meses que seguem a pesquisa."""

    MONTH = "month"
    QUARTER = "quarter"
    MEETING = "meeting"
    YEAR = "year"
    NEXT_12M = "next_12m"
