"""create imf observations

Revision ID: e40b52257d4a
Revises: dfd844aa3b58
Create Date: 2026-10-08 22:31:12.100725
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "e40b52257d4a"
down_revision: str | Sequence[str] | None = "dfd844aa3b58"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "imf_observations",
        sa.Column("country", sa.String(length=64), nullable=False),
        sa.Column("indicator", sa.String(length=64), nullable=False),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("value", sa.Double[float](), nullable=False),
        sa.PrimaryKeyConstraint(
            "country", "indicator", "year", name=op.f("pk_imf_observations")
        ),
    )


def downgrade() -> None:
    op.drop_table("imf_observations")
