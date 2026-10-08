"""create copom meetings

Revision ID: dfd844aa3b58
Revises: 1e3f5046876c
Create Date: 2026-10-08 20:04:26.013290
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "dfd844aa3b58"
down_revision: str | Sequence[str] | None = "1e3f5046876c"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "copom_meetings",
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("number", sa.Integer(), nullable=False),
        sa.Column("first_day", sa.Date(), nullable=False),
        sa.Column("second_day", sa.Date(), nullable=False),
        sa.PrimaryKeyConstraint("year", "number", name=op.f("pk_copom_meetings")),
    )


def downgrade() -> None:
    op.drop_table("copom_meetings")
