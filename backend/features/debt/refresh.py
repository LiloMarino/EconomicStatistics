from __future__ import annotations

import logging
from datetime import datetime

from sqlalchemy.orm import Session

from backend.core.enum import Dataset
from backend.domain.coverage import FETCH_INTERVAL
from backend.domain.federal_debt import (
    DebtHolding,
    FederalDebtProvider,
    expected_stock_month,
)
from backend.features.dataset_refresh import DatasetRefresh, record_attempt
from backend.repository.dataset_log import dataset_log
from backend.repository.federal_debt import last_stock_month, replace_stock

logger = logging.getLogger(__name__)


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

    return record_attempt(
        session,
        Dataset.FEDERAL_DEBT_STOCK,
        log,
        now,
        succeeded=bool(holdings),
        gap=last is None or last < expected,
    )


def _fetch(provider: FederalDebtProvider) -> list[DebtHolding]:
    """Falha da fonte vira lista vazia: o cache fica como estava."""
    logger.info("%s: baixando o estoque da dívida federal", provider.name)
    try:
        return provider.get_stock()
    except Exception:
        logger.warning("%s falhou", provider.name, exc_info=True)
        return []
