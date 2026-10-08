"""create federal debt stock and dataset fetch log

Revision ID: 325a72a7aec4
Revises: eb6e4dbbfa55
Create Date: 2026-10-08 11:08:29.243073
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "325a72a7aec4"
down_revision: str | Sequence[str] | None = "eb6e4dbbfa55"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "dataset_fetch_log",
        sa.Column(
            "dataset",
            sa.String(length=64),
            nullable=False,
        ),
        sa.Column("attempted_at", sa.DateTime(), nullable=False),
        sa.Column("succeeded_at", sa.DateTime(), nullable=True),
        sa.Column("gap", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("dataset", name=op.f("pk_dataset_fetch_log")),
    )
    op.create_table(
        "federal_debt_stock",
        sa.Column("stock_month", sa.Date(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("maturity", sa.Date(), nullable=False),
        sa.Column(
            "holder",
            sa.String(length=64),
            nullable=False,
        ),
        sa.Column("external", sa.Boolean(), nullable=False),
        sa.Column("value", sa.Double[float](), nullable=False),
        sa.PrimaryKeyConstraint(
            "stock_month",
            "title",
            "maturity",
            "holder",
            name=op.f("pk_federal_debt_stock"),
        ),
    )


def downgrade() -> None:
    op.drop_table("federal_debt_stock")
    op.drop_table("dataset_fetch_log")
