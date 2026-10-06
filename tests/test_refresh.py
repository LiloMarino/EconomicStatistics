from __future__ import annotations

from datetime import date, datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.core.enum import SeriesId, Source
from backend.features.series.refresh import refresh_series
from backend.repository.series import last_cached
from tests.fakes import FakeProvider

NOW = datetime(2026, 10, 20, 10)


def _providers(provider: FakeProvider) -> dict[Source, FakeProvider]:
    return {Source.IBGE: provider, Source.BCB_SGS: provider}


def test_second_refresh_does_not_hit_the_source(session: Session) -> None:
    """Com o cache em dia, o refresh seguinte não consulta a fonte, nem 7 horas depois."""
    provider = FakeProvider()
    refresh_series(session, _providers(provider), NOW)
    first_calls = len(provider.calls)

    refresh_series(session, _providers(provider), NOW + timedelta(minutes=1))
    refresh_series(session, _providers(provider), NOW + timedelta(hours=7))

    assert first_calls == len(SeriesId)
    assert len(provider.calls) == first_calls


def test_first_refresh_fills_every_series(session: Session) -> None:
    """A primeira carga traz cada série até o mês de hoje."""
    report = refresh_series(session, _providers(FakeProvider()), NOW)

    assert set(report.updated) == set(SeriesId)
    assert report.failed == ()
    assert last_cached(session)[SeriesId.IPCA_FOOD] == date(2026, 10, 1)


def test_offline_source_keeps_cache_and_warns_once(session: Session) -> None:
    """Sem rede, o cache fica como estava e a falta é avisada só na primeira vez."""
    refresh_series(session, _providers(FakeProvider()), NOW)
    before = last_cached(session)
    offline = FakeProvider(offline=True)
    later = NOW + timedelta(days=70)

    first = refresh_series(session, _providers(offline), later)
    second = refresh_series(session, _providers(offline), later + timedelta(hours=7))

    assert last_cached(session) == before
    assert SeriesId.IPCA_FOOD in first.failed
    assert second.failed == ()
    assert len(offline.calls) == 2 * len(SeriesId)


def test_refresh_endpoint_feeds_the_status(api: TestClient) -> None:
    """O refresh pela API grava o cache, e o status diz até que mês há dado."""
    refreshed = api.post("/api/series/refresh")
    status = api.get("/api/series/status").json()

    assert refreshed.status_code == 200
    by_id = {item["series_id"]: item for item in status}
    assert by_id["ipca_food"]["last_ref_date"] is not None
