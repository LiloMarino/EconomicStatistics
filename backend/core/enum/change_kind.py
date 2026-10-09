from enum import StrEnum


class ChangeKind(StrEnum):
    """Como a variação de um indicador é medida: `POINTS` é a diferença entre duas
    taxas (0.003 são 0,3 ponto percentual) e `RELATIVE` é a mudança de um nível sobre
    o valor de antes (-0.041 são -4,1%)."""

    POINTS = "points"
    RELATIVE = "relative"
