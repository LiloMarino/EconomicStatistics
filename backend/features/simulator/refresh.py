from __future__ import annotations

import logging
from datetime import datetime

from sqlalchemy.orm import Session

from backend.core.enum import Dataset
from backend.domain.coverage import FETCH_INTERVAL
from backend.domain.imf import CountryObservation, ImfProvider, imf_overdue
from backend.features.dataset_refresh import DatasetRefresh, record_attempt
from backend.repository.dataset_log import dataset_log
from backend.repository.imf import upsert_observations

logger = logging.getLogger(__name__)


def refresh_imf(
    session: Session, provider: ImfProvider, now: datetime
) -> DatasetRefresh:
    """Busca os indicadores só quando a edição do WEO que já devia estar publicada ainda
    não foi buscada, e no máximo uma vez por intervalo. A fonte devolve tudo, e cada ano
    passa a ser o valor da edição mais nova."""
    log = dataset_log(session, Dataset.IMF_COUNTRIES)
    succeeded_at = log.succeeded_at if log is not None else None
    today = now.date()
    if (log is not None and now - log.attempted_at < FETCH_INTERVAL) or (
        not imf_overdue(succeeded_at, today)
    ):
        return DatasetRefresh(updated=False, failed=False)

    # A rede é consultada fora de transação
    session.commit()
    observations = _fetch(provider)
    if observations:
        upsert_observations(session, observations)
        session.flush()

    return record_attempt(
        session,
        Dataset.IMF_COUNTRIES,
        log,
        now,
        succeeded=bool(observations),
        gap=not observations,
    )


def _fetch(provider: ImfProvider) -> list[CountryObservation]:
    """Falha da fonte vira lista vazia: o cache fica como estava."""
    logger.info("%s: buscando os indicadores dos países", provider.name)
    try:
        return provider.get_observations()
    except Exception:
        logger.warning("%s falhou", provider.name, exc_info=True)
        return []
