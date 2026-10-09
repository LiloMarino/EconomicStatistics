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
from backend.domain.copom import CopomProvider
from backend.domain.federal_debt import FederalDebtProvider
from backend.domain.focus import FocusProvider
from backend.domain.imf import ImfProvider
from backend.domain.series import SeriesProvider
from backend.features.providers import (
    get_copom_provider,
    get_debt_provider,
    get_focus_provider,
    get_imf_provider,
    get_providers,
)
from tests.fakes import (
    FakeCopomProvider,
    FakeDebtProvider,
    FakeFocusProvider,
    FakeImfProvider,
    FakeProvider,
)


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
def fake_debt_provider() -> FakeDebtProvider:
    return FakeDebtProvider()


@pytest.fixture
def fake_focus_provider() -> FakeFocusProvider:
    return FakeFocusProvider()


@pytest.fixture
def fake_copom_provider() -> FakeCopomProvider:
    return FakeCopomProvider()


@pytest.fixture
def fake_imf_provider() -> FakeImfProvider:
    return FakeImfProvider()


@pytest.fixture
def api(
    engine: Engine,
    fake_provider: FakeProvider,
    fake_debt_provider: FakeDebtProvider,
    fake_focus_provider: FakeFocusProvider,
    fake_copom_provider: FakeCopomProvider,
    fake_imf_provider: FakeImfProvider,
) -> TestClient:
    """App com a sessão apontando para o banco do teste e as fontes trocadas pelo
    fake: teste nenhum sai para a rede."""

    def session_override() -> Iterator[Session]:
        with Session(engine) as session:
            yield session

    def providers_override() -> dict[Source, SeriesProvider]:
        return {Source.IBGE: fake_provider, Source.BCB_SGS: fake_provider}

    def debt_provider_override() -> FederalDebtProvider:
        return fake_debt_provider

    def focus_provider_override() -> FocusProvider:
        return fake_focus_provider

    def copom_provider_override() -> CopomProvider:
        return fake_copom_provider

    def imf_provider_override() -> ImfProvider:
        return fake_imf_provider

    app = create_app()
    app.dependency_overrides[get_session] = session_override
    app.dependency_overrides[get_providers] = providers_override
    app.dependency_overrides[get_debt_provider] = debt_provider_override
    app.dependency_overrides[get_focus_provider] = focus_provider_override
    app.dependency_overrides[get_copom_provider] = copom_provider_override
    app.dependency_overrides[get_imf_provider] = imf_provider_override
    return TestClient(app)
