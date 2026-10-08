from __future__ import annotations

import logging
from datetime import datetime

from sqlalchemy.orm import Session

from backend.core.enum import Dataset
from backend.domain.copom import (
    CopomProvider,
    Meeting,
    calendar_overdue,
    expected_calendar_year,
)
from backend.domain.coverage import FETCH_INTERVAL
from backend.features.dataset_refresh import DatasetRefresh, record_attempt
from backend.repository.copom import last_meeting_year, replace_meetings
from backend.repository.dataset_log import dataset_log

logger = logging.getLogger(__name__)


def refresh_copom(
    session: Session, provider: CopomProvider, now: datetime
) -> DatasetRefresh:
    """Busca o calendário só quando falta o ano que já devia estar publicado, e no
    máximo uma vez por intervalo. O pedido vai do ano corrente ao ano esperado, e esses
    anos passam a ser o que o Banco Central devolveu."""
    log = dataset_log(session, Dataset.COPOM_MEETINGS)
    last = last_meeting_year(session)
    today = now.date()
    if (log is not None and now - log.attempted_at < FETCH_INTERVAL) or (
        not calendar_overdue(last, today)
    ):
        return DatasetRefresh(updated=False, failed=False)

    first_year, last_year = today.year, expected_calendar_year(today)
    # A rede é consultada fora de transação
    session.commit()
    meetings = _fetch(provider, first_year, last_year)
    if meetings:
        replace_meetings(session, meetings, first_year, last_year)
        session.flush()
        last = last_meeting_year(session)

    return record_attempt(
        session,
        Dataset.COPOM_MEETINGS,
        log,
        now,
        succeeded=bool(meetings),
        gap=calendar_overdue(last, today),
    )


def _fetch(provider: CopomProvider, first_year: int, last_year: int) -> list[Meeting]:
    """Falha da fonte vira lista vazia: o cache fica como estava."""
    logger.info(
        "%s: buscando o calendário de %s a %s", provider.name, first_year, last_year
    )
    try:
        return provider.get_meetings(first_year, last_year)
    except Exception:
        logger.warning("%s falhou", provider.name, exc_info=True)
        return []
