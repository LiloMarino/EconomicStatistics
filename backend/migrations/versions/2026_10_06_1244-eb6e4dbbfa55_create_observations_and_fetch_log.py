"""create observations and fetch_log

Revision ID: eb6e4dbbfa55
Revises:
Create Date: 2026-10-06 12:44:57.361729
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "eb6e4dbbfa55"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "fetch_log",
        sa.Column(
            "series_id",
            sa.String(length=64),
            nullable=False,
        ),
        sa.Column("attempted_at", sa.DateTime(), nullable=False),
        sa.Column("succeeded_at", sa.DateTime(), nullable=True),
        sa.Column("gap", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("series_id", name=op.f("pk_fetch_log")),
    )
    op.create_table(
        "observations",
        sa.Column(
            "series_id",
            sa.String(length=64),
            nullable=False,
        ),
        sa.Column("ref_date", sa.Date(), nullable=False),
        sa.Column("value", sa.Double[float](), nullable=False),
        sa.PrimaryKeyConstraint("series_id", "ref_date", name=op.f("pk_observations")),
    )


def downgrade() -> None:
    op.drop_table("observations")
    op.drop_table("fetch_log")
