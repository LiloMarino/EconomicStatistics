from __future__ import annotations

from backend.core.dto import BaseDTO


class TargetBandDTO(BaseDTO):
    """A meta de inflação do ano e os limites do intervalo de tolerância, em fração."""

    target: float
    floor: float
    ceiling: float
