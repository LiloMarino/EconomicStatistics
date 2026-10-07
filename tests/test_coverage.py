from __future__ import annotations

from datetime import date, datetime, timedelta

from backend.core.enum import SeriesId
from backend.domain.coverage import (
    LastFetch,
    expected_ref_date,
    fetch_request,
    month_start,
)
from backend.domain.series import SERIES

IPCA = SERIES[SeriesId.IPCA_FOOD]
MINIMUM_WAGE = SERIES[SeriesId.MINIMUM_WAGE]
TARGET = SERIES[SeriesId.INFLATION_TARGET]


def test_ipca_month_is_expected_from_day_15_of_the_next_month() -> None:
    """O IPCA de setembro só é cobrado a partir de 15 de outubro."""
    assert expected_ref_date(IPCA, date(2026, 10, 14)) == date(2026, 8, 1)
    assert expected_ref_date(IPCA, date(2026, 10, 15)) == date(2026, 9, 1)


def test_minimum_wage_is_expected_in_its_own_month() -> None:
    """O mínimo vale desde o dia 1 do próprio mês: não tem atraso de publicação."""
    assert expected_ref_date(MINIMUM_WAGE, date(2026, 10, 6)) == date(2026, 10, 1)


def test_annual_target_is_expected_from_january_of_its_own_year() -> None:
    """A meta do ano já é cobrada em janeiro, e com a do ano em cache não há pedido."""
    assert expected_ref_date(TARGET, date(2027, 1, 2)) == date(2027, 1, 1)
    assert fetch_request(TARGET, date(2026, 1, 1), None, datetime(2026, 10, 20)) is None

    request = fetch_request(TARGET, date(2026, 1, 1), None, datetime(2027, 1, 2))
    assert request is not None
    assert request.start == date(2025, 1, 1)


def test_first_load_asks_for_the_whole_series() -> None:
    """Sem nada em cache, o pedido vai da primeira data da série até hoje."""
    now = datetime(2026, 10, 20, 10)
    request = fetch_request(IPCA, None, None, now)

    assert request is not None
    assert (request.start, request.end) == (IPCA.first_date, now.date())


def test_late_cache_refetches_the_revision_window() -> None:
    """Com o cache atrasado, a busca regrava os 12 meses anteriores ao último em cache."""
    request = fetch_request(IPCA, date(2026, 7, 1), None, datetime(2026, 10, 20, 10))

    assert request is not None
    assert request.start == date(2025, 7, 1)


def test_up_to_date_cache_asks_nothing() -> None:
    """Com a referência esperada já em cache, não há pedido."""
    assert fetch_request(IPCA, date(2026, 9, 1), None, datetime(2026, 10, 20)) is None


def test_recent_attempt_waits_for_the_interval() -> None:
    """Uma tentativa há menos de 6 horas segura a próxima, mesmo com o cache atrasado."""
    now = datetime(2026, 10, 20, 10)
    last = LastFetch(attempted_at=now - timedelta(hours=5), succeeded_at=None, gap=True)

    assert fetch_request(IPCA, date(2026, 7, 1), last, now) is None


def test_month_start_crosses_year_boundary() -> None:
    """Voltar meses atravessa a virada do ano."""
    assert month_start(date(2026, 2, 17), 3) == date(2025, 11, 1)
