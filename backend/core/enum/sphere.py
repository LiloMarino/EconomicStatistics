from enum import StrEnum


class Sphere(StrEnum):
    """A esfera do setor público em que o BCB divide a NFSP. O governo central é o
    governo federal com o Banco Central; as estatais ficam sem a Petrobras e os bancos
    públicos."""

    CENTRAL = "central"
    REGIONAL = "regional"
    STATE_OWNED = "state_owned"
