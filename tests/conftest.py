from __future__ import annotations

from collections.abc import Iterator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Engine
from sqlalchemy.orm import Session

from backend.app import create_app
from backend.core.database.engine import create_engine_for
from backend.core.database.migrate import migrate
from backend.core.database.session import get_session
from backend.core.enum import Source
from backend.domain.series import SeriesProvider
from backend.features.providers import get_providers
from tests.fakes import FakeProvider


@pytest.fixture
def client() -> TestClient:
    return TestClient(create_app())


@pytest.fixture
def db_path(tmp_path: Path) -> Path:
    """Banco novo, migrado até o head pelo mesmo caminho do start do app."""
    path = tmp_path / "economic.db"
    migrate(path)
    return path


@pytest.fixture
def engine(db_path: Path) -> Iterator[Engine]:
    engine = create_engine_for(db_path)
    yield engine
    engine.dispose()


@pytest.fixture
def session(engine: Engine) -> Iterator[Session]:
    with Session(engine) as session:
        yield session


@pytest.fixture
def fake_provider() -> FakeProvider:
    return FakeProvider()


@pytest.fixture
def api(engine: Engine, fake_provider: FakeProvider) -> TestClient:
    """App com a sessão apontando para o banco do teste e as fontes trocadas pelo
    fake: teste nenhum sai para a rede."""

    def session_override() -> Iterator[Session]:
        with Session(engine) as session:
            yield session

    def providers_override() -> dict[Source, SeriesProvider]:
        return {Source.IBGE: fake_provider, Source.BCB_SGS: fake_provider}

    app = create_app()
    app.dependency_overrides[get_session] = session_override
    app.dependency_overrides[get_providers] = providers_override
    return TestClient(app)
