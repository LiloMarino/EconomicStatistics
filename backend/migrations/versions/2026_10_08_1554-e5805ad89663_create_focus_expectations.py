"""create focus expectations

Revision ID: e5805ad89663
Revises: 325a72a7aec4
Create Date: 2026-10-08 15:54:52.572234
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "e5805ad89663"
down_revision: str | Sequence[str] | None = "325a72a7aec4"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "focus_expectations",
        sa.Column("indicator", sa.String(length=64), nullable=False),
        sa.Column("target_kind", sa.String(length=64), nullable=False),
        sa.Column("target_year", sa.Integer(), nullable=False),
        sa.Column("target_period", sa.Integer(), nullable=False),
        sa.Column("survey_date", sa.Date(), nullable=False),
        sa.Column("median", sa.Double[float](), nullable=False),
        sa.Column("respondents", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint(
            "indicator",
            "target_kind",
            "target_year",
            "target_period",
            "survey_date",
            name=op.f("pk_focus_expectations"),
        ),
    )
    with op.batch_alter_table("focus_expectations", schema=None) as batch_op:
        batch_op.create_index(
            batch_op.f("ix_focus_expectations_survey_date"),
            ["survey_date"],
            unique=False,
        )


def downgrade() -> None:
    with op.batch_alter_table("focus_expectations", schema=None) as batch_op:
        batch_op.drop_index(batch_op.f("ix_focus_expectations_survey_date"))

    op.drop_table("focus_expectations")
