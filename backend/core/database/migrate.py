"""Migrations do banco: o schema nasce do Alembic, e o teste confere que ele bata com os models."""

from __future__ import annotations

from pathlib import Path

from alembic import command
from alembic.config import Config
from alembic.runtime.migration import MigrationContext
from alembic.script import ScriptDirectory
from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool

from backend.core.database.engine import sqlite_url

PYPROJECT = Path(__file__).resolve().parents[3] / "pyproject.toml"


def alembic_config(db_path: Path) -> Config:
    config = Config(toml_file=PYPROJECT)
    # O ConfigParser interpola `%`; dobrar é o escape
    config.set_main_option("sqlalchemy.url", sqlite_url(db_path).replace("%", "%%"))
    return config


def head_revision() -> str | None:
    script = ScriptDirectory.from_config(Config(toml_file=PYPROJECT))
    return script.get_current_head()


def current_revision(db_path: Path) -> str | None:
    engine = create_engine(sqlite_url(db_path), poolclass=NullPool)
    try:
        with engine.connect() as connection:
            return MigrationContext.configure(connection).get_current_revision()
    finally:
        engine.dispose()


def migrate(db_path: Path) -> None:
    """Leva o banco ao head. O banco é cache de dado público, rebaixável da fonte."""
    db_path.parent.mkdir(parents=True, exist_ok=True)
    command.upgrade(alembic_config(db_path), "head")
