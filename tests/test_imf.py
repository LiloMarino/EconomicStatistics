"""O FMI: o parse do DataMapper, a agenda das edições do WEO, o refresh e a leitura por
país."""

from __future__ import annotations

import json
from datetime import date, datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.adapters.imf_provider import ImfDataMapperProvider, to_observations
from backend.core.enum import Country, ImfIndicator
from backend.domain.imf import imf_overdue, latest_release
from backend.features.simulator.refresh import refresh_imf
from backend.features.simulator.service import country_histories
from backend.repository.imf import last_year, read_observations
from tests.fakes import FakeImfProvider

NOW = datetime(2026, 10, 8, 10)
# O WEO de abril/2026 já saiu e o de outubro ainda não
APRIL_WEO = datetime(2026, 4, 25, 10)


def _body(indicator: str) -> bytes:
    return json.dumps(
        {
            "values": {
                indicator: {
                    "SDN": {"2024": 262.6},
                    "BRA": {"2025": 93.3, "2024": 87.0},
                    "JPN": {"2024": 214.5},
                },
                "": None,
            },
            "api": {"version": "1", "output-method": "json"},
        }
    ).encode()


def test_imf_body_keeps_only_the_countries_the_app_uses() -> None:
    """A API devolve os ~226 países, e o app guarda os quatro da comparação, na ordem da
    tela e com os anos em sequência; a Argentina, ausente, não aparece."""
    observations = to_observations(_body("GGXWDG_NGDP"), ImfIndicator.GROSS_DEBT)

    assert [(item.country, item.year, item.value) for item in observations] == [
        (Country.JPN, 2024, 214.5),
        (Country.BRA, 2024, 87.0),
        (Country.BRA, 2025, 93.3),
    ]


def test_provider_asks_for_each_indicator_once() -> None:
    """Um pedido por indicador, e a resposta de cada um é lida com o código dele."""
    asked: list[str] = []

    def download(url: str) -> bytes:
        asked.append(url)
        return _body(url.rsplit("/", 1)[1])

    observations = ImfDataMapperProvider(download).get_observations()

    assert [url.rsplit("/", 1)[1] for url in asked] == ["GGXWDG_NGDP", "PCPIPCH"]
    assert {item.indicator for item in observations} == set(ImfIndicator)


def test_weo_is_expected_from_the_20th_of_april_and_october() -> None:
    """O WEO de abril e o de outubro já estão publicados a partir do dia 20."""
    assert latest_release(date(2026, 10, 8)) == date(2026, 4, 20)
    assert latest_release(date(2026, 10, 20)) == date(2026, 10, 20)
    assert latest_release(date(2027, 3, 1)) == date(2026, 10, 20)


def test_cache_is_overdue_only_after_a_new_release() -> None:
    """Uma busca de 25/abr/2026 está em dia até 19/out e passa a faltar em 20/out, com
    o WEO de outubro."""
    fetched = datetime(2026, 4, 25, 10)

    assert imf_overdue(None, date(2026, 10, 8))
    assert not imf_overdue(fetched, date(2026, 10, 19))
    assert imf_overdue(fetched, date(2026, 10, 20))


def test_first_refresh_fills_the_cache(session: Session) -> None:
    provider = FakeImfProvider()

    result = refresh_imf(session, provider, NOW)

    assert result.updated
    assert provider.calls == 1
    assert last_year(session, ImfIndicator.GROSS_DEBT) == 2027
    assert len(read_observations(session, ImfIndicator.INFLATION)) == 7


def test_second_refresh_does_not_hit_the_source(session: Session) -> None:
    """Com a busca em dia, o refresh não volta à fonte, nem 7 horas depois."""
    provider = FakeImfProvider()

    refresh_imf(session, provider, NOW)
    refresh_imf(session, provider, NOW + timedelta(hours=7))

    assert provider.calls == 1


def test_new_release_asks_again(session: Session) -> None:
    """Depois do WEO de outubro a busca passa a faltar, e o refresh a refaz."""
    provider = FakeImfProvider()

    refresh_imf(session, provider, APRIL_WEO)
    refresh_imf(session, provider, datetime(2026, 10, 21, 10))

    assert provider.calls == 2


def test_offline_source_keeps_cache_and_warns_once(session: Session) -> None:
    """Sem rede, o cache fica como estava e a falta é avisada só na primeira vez."""
    refresh_imf(session, FakeImfProvider(), APRIL_WEO)
    offline = FakeImfProvider(offline=True)
    later = datetime(2026, 10, 21, 10)

    first = refresh_imf(session, offline, later)
    second = refresh_imf(session, offline, later + timedelta(hours=7))

    assert last_year(session, ImfIndicator.GROSS_DEBT) == 2027
    assert first.failed
    assert not second.failed
    assert offline.calls == 2


def test_countries_keep_only_the_closed_years(session: Session) -> None:
    """Em out/2026 o FMI ainda projeta 2026 e 2027, então a dívida de cada país vai até
    2025. A inflação é a do último ano com dado: 2025 no Brasil, 2024 na Argentina, que
    não tem a de 2025. Valores em fração."""
    refresh_imf(session, FakeImfProvider(), NOW)

    histories = {
        item.country: item for item in country_histories(session, date(2026, 10, 8))
    }

    assert list(histories) == [Country.JPN, Country.GRC, Country.ARG, Country.BRA]
    brazil = histories[Country.BRA]
    assert [item.year for item in brazil.debt] == [2024, 2025]
    assert brazil.debt[0].value == 1.30
    assert brazil.inflation is not None
    assert (brazil.inflation.year, brazil.inflation.value) == (2025, 0.04)
    argentina = histories[Country.ARG].inflation
    assert argentina is not None
    assert argentina.year == 2024


def test_countries_endpoint_reads_the_cache_after_the_refresh(api: TestClient) -> None:
    """O refresh pela API carrega o FMI, e a lista de países sai na ordem da tela."""
    body = api.post("/api/series/refresh").json()
    countries = api.get("/api/debt/simulation/countries").json()["countries"]

    assert "imf_countries" in body["datasets_updated"]
    assert [item["country"] for item in countries] == ["JPN", "GRC", "ARG", "BRA"]
    assert countries[0]["debt"][0]["year"] == 2024


def test_countries_without_the_cache_are_409(api: TestClient) -> None:
    assert api.get("/api/debt/simulation/countries").status_code == 409
