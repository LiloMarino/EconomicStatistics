"""A dívida pública federal pelo estoque título a título do Tesouro: de que ela é
feita, quando vence e quanto está na carteira do Banco Central."""

from __future__ import annotations

from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from datetime import date
from typing import Protocol

from backend.core.enum import DebtHolder, Indexer
from backend.domain.coverage import month_start

# O Tesouro publica o estoque do mês M por volta do dia 16 de M + 2, e o dia 25 dá a
# folga
STOCK_LAG_MONTHS = 2
STOCK_RELEASE_DAY = 25

# Os prefixos são do nome do título no arquivo do Tesouro, em caixa alta
INDEXER_PREFIXES: tuple[tuple[str, Indexer], ...] = (
    ("LFT", Indexer.SELIC),
    ("LTN", Indexer.FIXED),
    ("NTN-F", Indexer.FIXED),
    ("NTN-B", Indexer.IPCA),
    ("NTN-C", Indexer.IGPM),
)

# As faixas de vencimento depois do ano do estoque: cada um dos 4 anos seguintes, os
# 5 anos depois deles e o que vence mais tarde
SINGLE_YEARS = 4
GROUPED_YEARS = 5


@dataclass(frozen=True, slots=True, kw_only=True)
class DebtHolding:
    """Uma linha do estoque: o valor em R$ de um título com um vencimento, numa
    carteira, no fim de `stock_month` (datado no dia 1)."""

    stock_month: date
    title: str
    maturity: date
    holder: DebtHolder
    external: bool
    value: float


class FederalDebtProvider(Protocol):
    name: str

    def get_stock(self) -> list[DebtHolding]:
        """O arquivo inteiro: todos os meses que a fonte publica."""
        ...


@dataclass(frozen=True, slots=True, kw_only=True)
class IndexerShare:
    indexer: Indexer
    share: float


@dataclass(frozen=True, slots=True, kw_only=True)
class MaturityBucket:
    """A fração da dívida em mercado que vence de `start` até `end`, inclusive; sem
    `end`, de `start` em diante. `within_12m` diz se a faixa começa nos 12 meses
    seguintes ao estoque, o que o governo precisa rolar primeiro."""

    start: date
    end: date | None
    share: float
    within_12m: bool


def expected_stock_month(today: date) -> date:
    """O mês de estoque que já devia estar publicado hoje."""
    months_back = STOCK_LAG_MONTHS + (0 if today.day >= STOCK_RELEASE_DAY else 1)
    return month_start(today, months_back)


def indexer_of(title: str, external: bool) -> Indexer:
    """Dívida externa é câmbio. Na interna, o prefixo do título diz o indexador: LFT é
    Selic, LTN e NTN-F são prefixados, NTN-B é IPCA e NTN-C é IGP-M. Os títulos
    legados (TDA, CVS, NTN-I…) somam menos de 1% e ficam em "outros"."""
    if external:
        return Indexer.FX
    name = title.upper()
    for prefix, indexer in INDEXER_PREFIXES:
        if name.startswith(prefix):
            return indexer
    return Indexer.OTHER


def _market(holdings: Iterable[DebtHolding]) -> list[DebtHolding]:
    """A dívida federal que o Tesouro reporta é a em mercado: a carteira do Banco
    Central fica de fora."""
    return [item for item in holdings if item.holder is DebtHolder.MARKET]


def composition(holdings: Iterable[DebtHolding]) -> list[IndexerShare]:
    """A fração da dívida em mercado de cada indexador, na ordem do enum."""
    market = _market(holdings)
    total = sum(item.value for item in market)
    by_indexer = dict.fromkeys(Indexer, 0.0)
    for item in market:
        by_indexer[indexer_of(item.title, item.external)] += item.value
    return [
        IndexerShare(indexer=indexer, share=value / total)
        for indexer, value in by_indexer.items()
    ]


def _first_month_after(stock_month: date, months: int) -> date:
    """O 1º dia do mês que vem `months` meses depois do mês do estoque."""
    return month_start(stock_month, -months)


def maturing_within_12m(holdings: Iterable[DebtHolding], stock_month: date) -> float:
    """A fração da dívida em mercado que vence até o fim do 12º mês depois do estoque:
    o estoque de jul/2026 conta o que vence até 31/07/2027."""
    market = _market(holdings)
    limit = _first_month_after(stock_month, 13)
    total = sum(item.value for item in market)
    return sum(item.value for item in market if item.maturity < limit) / total


def _year_bucket(years_ahead: int) -> int:
    """A faixa de um vencimento pela distância em anos até o ano do estoque: 0 é o
    próprio ano, de 1 a 4 cada ano seguinte, 5 os 5 anos depois deles e 6 o resto."""
    if years_ahead <= SINGLE_YEARS:
        return max(years_ahead, 0)
    if years_ahead <= SINGLE_YEARS + GROUPED_YEARS:
        return SINGLE_YEARS + 1
    return SINGLE_YEARS + 2


def _bucket_range(stock_month: date, bucket: int) -> tuple[date, date | None]:
    year = stock_month.year
    if bucket == 0:
        return _first_month_after(stock_month, 1), date(year, 12, 31)
    if bucket <= SINGLE_YEARS:
        return date(year + bucket, 1, 1), date(year + bucket, 12, 31)
    if bucket == SINGLE_YEARS + 1:
        return (
            date(year + SINGLE_YEARS + 1, 1, 1),
            date(year + SINGLE_YEARS + GROUPED_YEARS, 12, 31),
        )
    return date(year + SINGLE_YEARS + GROUPED_YEARS + 1, 1, 1), None


def maturity_profile(
    holdings: Iterable[DebtHolding], stock_month: date
) -> list[MaturityBucket]:
    """A dívida em mercado por faixa de vencimento: o resto do ano do estoque, os 4 anos
    seguintes um a um, os 5 anos depois deles e o que vence mais tarde. Faixa sem
    nenhum título, como o resto do ano num estoque de dezembro, sai."""
    market = _market(holdings)
    total = sum(item.value for item in market)
    by_bucket: dict[int, float] = {}
    for item in market:
        bucket = _year_bucket(item.maturity.year - stock_month.year)
        by_bucket[bucket] = by_bucket.get(bucket, 0.0) + item.value
    limit = _first_month_after(stock_month, 13)
    buckets: list[MaturityBucket] = []
    for bucket in sorted(by_bucket):
        start, end = _bucket_range(stock_month, bucket)
        buckets.append(
            MaturityBucket(
                start=start,
                end=end,
                share=by_bucket[bucket] / total,
                within_12m=start < limit,
            )
        )
    return buckets


def central_bank_share(holdings: Sequence[DebtHolding]) -> float:
    """A fração dos títulos federais emitidos que está na carteira do Banco Central,
    que os usa para controlar a liquidez do dia a dia."""
    total = sum(item.value for item in holdings)
    held = sum(
        item.value for item in holdings if item.holder is DebtHolder.CENTRAL_BANK
    )
    return held / total
