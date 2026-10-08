from __future__ import annotations

from collections.abc import Collection, Sequence
from datetime import date

from sqlalchemy import delete, func, insert, select
from sqlalchemy.orm import Session

from backend.core.enum import Dataset
from backend.core.models.models import DatasetFetchLog, FederalDebtStock
from backend.domain.federal_debt import DebtHolding


def stock_months(session: Session) -> list[date]:
    return list(
        session.scalars(
            select(FederalDebtStock.stock_month)
            .distinct()
            .order_by(FederalDebtStock.stock_month)
        )
    )


def last_stock_month(session: Session) -> date | None:
    return session.scalar(select(func.max(FederalDebtStock.stock_month)))


def read_stock(
    session: Session, months: Collection[date]
) -> dict[date, list[DebtHolding]]:
    """As linhas de cada mês pedido; mês sem estoque vem como lista vazia."""
    result: dict[date, list[DebtHolding]] = {month: [] for month in months}
    for row in session.scalars(
        select(FederalDebtStock).where(FederalDebtStock.stock_month.in_(months))
    ):
        result[row.stock_month].append(
            DebtHolding(
                stock_month=row.stock_month,
                title=row.title,
                maturity=row.maturity,
                holder=row.holder,
                external=row.external,
                value=row.value,
            )
        )
    return result


def replace_stock(session: Session, holdings: Sequence[DebtHolding]) -> None:
    """A tabela passa a ser a cópia do arquivo novo, que traz todos os meses."""
    session.execute(delete(FederalDebtStock))
    session.execute(
        insert(FederalDebtStock),
        [
            {
                "stock_month": item.stock_month,
                "title": item.title,
                "maturity": item.maturity,
                "holder": item.holder,
                "external": item.external,
                "value": item.value,
            }
            for item in holdings
        ],
    )


def dataset_log(session: Session, dataset: Dataset) -> DatasetFetchLog | None:
    return session.get(DatasetFetchLog, dataset)
