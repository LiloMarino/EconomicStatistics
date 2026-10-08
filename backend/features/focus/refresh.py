from __future__ import annotations

import logging
from datetime import date, datetime
from threading import Lock

from sqlalchemy.orm import Session

from backend.core.enum import Dataset
from backend.domain.coverage import FETCH_INTERVAL
from backend.domain.focus import Expectation, FocusProvider, survey_overdue
from backend.features.dataset_refresh import DatasetRefresh, record_attempt
from backend.repository.dataset_log import dataset_log
from backend.repository.focus import last_survey_date, upsert_expectations

logger = logging.getLogger(__name__)

# A primeira carga leva cerca de um minuto: o concorrente espera e encontra o cache
# em dia
_refresh_lock = Lock()


def refresh_focus(
    session: Session, provider: FocusProvider, now: datetime
) -> DatasetRefresh:
    """Busca as pesquisas Focus só quando falta a da semana que já devia estar
    publicada, e no máximo uma vez por intervalo. Depois da primeira carga, pede a
    partir da última pesquisa em cache, que o upsert regrava."""
    with _refresh_lock:
        log = dataset_log(session, Dataset.FOCUS_EXPECTATIONS)
        last = last_survey_date(session)
        if (log is not None and now - log.attempted_at < FETCH_INTERVAL) or (
            not survey_overdue(last, now.date())
        ):
            return DatasetRefresh(updated=False, failed=False)

        # A rede é consultada fora de transação
        session.commit()
        expectations = _fetch(provider, last)
        if expectations:
            upsert_expectations(session, expectations)
            session.flush()
            last = last_survey_date(session)

        return record_attempt(
            session,
            Dataset.FOCUS_EXPECTATIONS,
            log,
            now,
            succeeded=bool(expectations),
            gap=survey_overdue(last, now.date()),
        )


def _fetch(provider: FocusProvider, since: date | None) -> list[Expectation]:
    """Falha da fonte vira lista vazia: o cache fica como estava."""
    logger.info("%s: buscando as pesquisas Focus desde %s", provider.name, since)
    try:
        return provider.get_expectations(since)
    except Exception:
        logger.warning("%s falhou", provider.name, exc_info=True)
        return []
