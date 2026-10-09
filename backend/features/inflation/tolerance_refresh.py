from __future__ import annotations

import logging
from datetime import datetime

from sqlalchemy.orm import Session

from backend.core.enum import Dataset
from backend.domain.coverage import FETCH_INTERVAL
from backend.domain.inflation_target import InflationToleranceProvider, Tolerance
from backend.features.dataset_refresh import DatasetRefresh, record_attempt
from backend.repository.dataset_log import dataset_log
from backend.repository.inflation_tolerance import read_tolerances, replace_tolerances

logger = logging.getLogger(__name__)


def refresh_tolerance(
    session: Session, provider: InflationToleranceProvider, now: datetime
) -> DatasetRefresh:
    """No máximo uma vez por intervalo. A primeira carga traz o histórico desde 1999; as
    seguintes só conferem a tolerância em vigor, porque o histórico já está fechado."""
    log = dataset_log(session, Dataset.INFLATION_TOLERANCE)
    if log is not None and now - log.attempted_at < FETCH_INTERVAL:
        return DatasetRefresh(updated=False, failed=False)

    first_load = not read_tolerances(session)
    # A rede é consultada fora de transação
    session.commit()
    items = _fetch(provider, history=first_load)
    if items:
        replace_tolerances(session, items)
        session.flush()

    return record_attempt(
        session,
        Dataset.INFLATION_TOLERANCE,
        log,
        now,
        succeeded=bool(items),
        gap=not read_tolerances(session),
    )


def _fetch(provider: InflationToleranceProvider, *, history: bool) -> list[Tolerance]:
    """Falha da fonte vira lista vazia: o cache fica como estava."""
    logger.info("%s: buscando a tolerância (histórico: %s)", provider.name, history)
    try:
        return provider.get_tolerances(history=history)
    except Exception:
        logger.warning("%s falhou", provider.name, exc_info=True)
        return []
