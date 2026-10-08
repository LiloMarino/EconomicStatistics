"""drop the monthly average dollar

Revision ID: 1e3f5046876c
Revises: e5805ad89663
Create Date: 2026-10-08 16:29:04.153325
"""

from __future__ import annotations

from collections.abc import Sequence

from alembic import op

revision: str = "1e3f5046876c"
down_revision: str | Sequence[str] | None = "e5805ad89663"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """O dólar passou a ser a PTAX do fim do mês, outra série. A média mensal sai do
    cache, e o refresh baixa a série nova inteira."""
    op.execute("DELETE FROM observations WHERE series_id = 'dollar_monthly'")
    op.execute("DELETE FROM fetch_log WHERE series_id = 'dollar_monthly'")


def downgrade() -> None:
    """O cache é rebaixável da fonte: a média mensal volta no próximo refresh."""
