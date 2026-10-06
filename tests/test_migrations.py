"""O schema que as migrations produzem é o que os models declaram."""

from __future__ import annotations

from pathlib import Path

from alembic.autogenerate import compare_metadata
from alembic.runtime.migration import MigrationContext
from sqlalchemy import Engine

from backend.core.database.migrate import (
    current_revision,
    head_revision,
)
from backend.core.models.models import Base


def test_schema_matches_models(engine: Engine) -> None:
    """Depois do upgrade até o head, o `compare_metadata` não acha diferença."""
    with engine.connect() as connection:
        context = MigrationContext.configure(connection, opts={"compare_type": True})
        diff = compare_metadata(context, Base.metadata)

    assert diff == []


def test_migrate_records_head_revision(db_path: Path) -> None:
    """O `migrate` deixa a `alembic_version` apontando para o head."""
    assert current_revision(db_path) == head_revision()
