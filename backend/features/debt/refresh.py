from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime

from sqlalchemy.orm import Session

from backend.core.enum import Dataset
from backend.core.models.models import DatasetFetchLog
from backend.domain.coverage import FETCH_INTERVAL
from backend.domain.federal_debt import (
    DebtHolding,
    FederalDebtProvider,
    expected_stock_month,
)
from backend.repository.federal_debt import dataset_log, last_stock_month, replace_stock

logger = logging.getLogger(__name__)


@dataclass(frozen=True, slots=True, kw_only=True)
class DatasetRefresh:
    """`failed` traz só o problema novo, como na `RefreshReport` das séries."""

    updated: bool
    failed: bool


def refresh_federal_debt(
    session: Session, provider: FederalDebtProvider, now: datetime
) -> DatasetRefresh:
    """Baixa o arquivo do Tesouro só quando falta o mês de estoque que já devia estar
    publicado, e no máximo uma vez por intervalo. O arquivo traz todos os meses, e a
    tabela inteira é trocada por ele."""
    log = dataset_log(session, Dataset.FEDERAL_DEBT_STOCK)
    last = last_stock_month(session)
    expected = expected_stock_month(now.date())
    if (log is not None and now - log.attempted_at < FETCH_INTERVAL) or (
        last is not None and last >= expected
    ):
        return DatasetRefresh(updated=False, failed=False)

    # A rede é consultada fora de transação
    session.commit()
    holdings = _fetch(provider)
    if holdings:
        replace_stock(session, holdings)
        session.flush()
        last = last_stock_month(session)

    gap = last is None or last < expected
    failed = gap and not (log is not None and log.gap)
    if log is None:
        session.add(
            DatasetFetchLog(
                dataset=Dataset.FEDERAL_DEBT_STOCK,
                attempted_at=now,
                succeeded_at=now if holdings else None,
                gap=gap,
            )
        )
    else:
        log.attempted_at = now
        log.succeeded_at = now if holdings else log.succeeded_at
        log.gap = gap
    session.commit()
    return DatasetRefresh(updated=bool(holdings), failed=failed)


def _fetch(provider: FederalDebtProvider) -> list[DebtHolding]:
    """Falha da fonte vira lista vazia: o cache fica como estava."""
    logger.info("%s: baixando o estoque da dívida federal", provider.name)
    try:
        return provider.get_stock()
    except Exception:
        logger.warning("%s falhou", provider.name, exc_info=True)
        return []
