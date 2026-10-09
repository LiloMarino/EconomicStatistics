"""Os indicadores por país do FMI (World Economic Outlook), que sai em abril e em
outubro e revisa os anos passados a cada edição."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime
from typing import Protocol

from backend.core.enum import Country, ImfIndicator

# O FMI publica o WEO de abril e o de outubro até a segunda quinzena do mês
RELEASE_MONTHS = (4, 10)
RELEASE_SETTLED_DAY = 20


@dataclass(frozen=True, slots=True, kw_only=True)
class CountryObservation:
    """O valor de `indicator` no ano `year`, em % (a dívida em % do PIB, a inflação em
    % ao ano). Anos a partir do corrente são projeção do FMI."""

    country: Country
    indicator: ImfIndicator
    year: int
    value: float


class ImfProvider(Protocol):
    name: str

    def get_observations(self) -> list[CountryObservation]:
        """Todos os anos dos países e dos indicadores que o app usa: a fonte devolve o
        conjunto inteiro a cada pedido."""
        ...


def latest_release(today: date) -> date:
    """O dia a partir do qual o WEO mais recente já devia estar publicado."""
    settled = [
        date(year, month, RELEASE_SETTLED_DAY)
        for year in (today.year - 1, today.year)
        for month in RELEASE_MONTHS
    ]
    return max(day for day in settled if day <= today)


def imf_overdue(succeeded_at: datetime | None, today: date) -> bool:
    """Se falta buscar a edição do WEO que já devia estar publicada."""
    return succeeded_at is None or succeeded_at.date() < latest_release(today)
