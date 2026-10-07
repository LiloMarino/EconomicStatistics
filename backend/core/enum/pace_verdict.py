from enum import StrEnum


class PaceVerdict(StrEnum):
    ACCELERATING = "accelerating"
    STEADY = "steady"
    SLOWING = "slowing"
