from __future__ import annotations

from datetime import date, datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.core.enum import FocusIndicator, FocusTargetKind, SeriesId, Source
from backend.core.models.models import SeenSeries
from backend.domain.focus import Expectation
from backend.domain.series import Observation
from backend.features.series.refresh import refresh_series
from backend.repository.focus import upsert_expectations
from backend.repository.seen import record_baseline
from backend.repository.series import last_cached, upsert_observations
from tests.fakes import FakeProvider

NOW = datetime(2026, 10, 20, 10)
# Em janeiro, a fonte já publicou o IPCA que o cache de outubro não tem
LATER = NOW + timedelta(days=80)


def _refresh(session: Session, now: datetime) -> None:
    """O refresh com a marca de visto antes e depois, na ordem do endpoint."""
    provider = FakeProvider()
    record_baseline(session)
    refresh_series(session, {source: provider for source in Source}, now)
    record_baseline(session)


def _survey(survey_date: date) -> Expectation:
    return Expectation(
        indicator=FocusIndicator.IPCA,
        target_kind=FocusTargetKind.YEAR,
        target_year=survey_date.year,
        target_period=0,
        survey_date=survey_date,
        median=5.0,
        respondents=140,
    )


def _news_series(api: TestClient) -> dict[str, dict[str, str]]:
    return {item["series_id"]: item for item in api.get("/api/news").json()["series"]}


def test_first_load_is_not_news(api: TestClient, session: Session) -> None:
    """A primeira carga pelo endpoint vira a linha de base: cada série com dado ganha
    a marca, e nada aparece como novidade."""
    api.post("/api/series/refresh")

    news = api.get("/api/news").json()
    marks = session.scalar(select(func.count()).select_from(SeenSeries))

    assert news == {"series": [], "datasets": []}
    assert marks is not None and marks > 0


def test_existing_cache_becomes_the_baseline(api: TestClient, session: Session) -> None:
    """O cache que já existia antes da marca de visto não aparece como novidade."""
    refresh_series(session, {source: FakeProvider() for source in Source}, NOW)

    record_baseline(session)

    assert api.get("/api/news").json() == {"series": [], "datasets": []}


def test_new_month_after_baseline_is_news(api: TestClient, session: Session) -> None:
    """O mês que chega por cima da linha de base é novidade, com o período visto e o
    que chegou."""
    _refresh(session, NOW)
    seen = last_cached(session)[SeriesId.IPCA_GENERAL]
    _refresh(session, LATER)
    last = last_cached(session)[SeriesId.IPCA_GENERAL]

    ipca = _news_series(api)["ipca_general"]

    assert seen < last
    assert ipca["seen_until"] == seen.isoformat()
    assert ipca["last_ref_date"] == last.isoformat()
    assert ipca["periodicity"] == "monthly"


def test_revised_value_is_not_news(api: TestClient, session: Session) -> None:
    """A fonte que corrige um mês já publicado não gera novidade: só período novo
    conta."""
    _refresh(session, NOW)
    last = last_cached(session)[SeriesId.IPCA_FOOD]

    upsert_observations(
        session, SeriesId.IPCA_FOOD, [Observation(ref_date=last, value=9.9)]
    )
    session.commit()

    assert api.get("/api/news").json()["series"] == []


def test_daily_series_never_become_news(api: TestClient, session: Session) -> None:
    """A Selic e o dólar diário ganham dia novo a cada refresh e ficam fora das
    novidades."""
    _refresh(session, NOW)
    _refresh(session, LATER)

    news = _news_series(api)

    assert SeriesId.SELIC_TARGET.value not in news
    assert SeriesId.DOLLAR_DAILY.value not in news


def test_new_focus_survey_is_news(api: TestClient, session: Session) -> None:
    """A pesquisa Focus da semana seguinte é novidade da fonte Focus."""
    upsert_expectations(session, [_survey(date(2026, 10, 2))])
    record_baseline(session)

    upsert_expectations(session, [_survey(date(2026, 10, 9))])
    session.commit()

    assert api.get("/api/news").json()["datasets"] == [
        {
            "dataset": "focus_expectations",
            "seen_until": "2026-10-02",
            "last_date": "2026-10-09",
        }
    ]


def test_marking_seen_clears_only_the_given_sources(
    api: TestClient, session: Session
) -> None:
    """Marcar uma série como vista tira só ela das novidades."""
    _refresh(session, NOW)
    _refresh(session, LATER)

    marked = api.post(
        "/api/news/seen", json={"series": ["ipca_general"], "datasets": []}
    )
    news = _news_series(api)

    assert marked.status_code == 204
    assert "ipca_general" not in news
    assert "ipca_food" in news
