"""A dívida pública federal pelo estoque título a título do Tesouro: de que ela é
feita, quando vence e quanto está na carteira do Banco Central."""

from __future__ import annotations

from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from datetime import date, timedelta
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
    `end`, de `start` em diante, e o valor em R$ dela. `within_12m` marca a faixa dos 12
    meses seguintes ao estoque, o que o governo precisa rolar primeiro."""

    start: date
    end: date | None
    share: float
    value: float
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


def _ranges(stock_month: date) -> list[tuple[date, date | None]]:
    """As faixas de vencimento a partir do estoque: os 12 meses seguintes, o resto do ano
    em que eles terminam, cada ano seguinte até o 4º depois do estoque, os 5 anos depois
    deles e o resto."""
    year = stock_month.year
    first = _first_month_after(stock_month, 1)
    after_12m = _first_month_after(stock_month, 13)
    ranges: list[tuple[date, date | None]] = [(first, after_12m - timedelta(days=1))]
    if after_12m.month != 1:
        ranges.append((after_12m, date(after_12m.year, 12, 31)))
    ranges.extend(
        (date(item, 1, 1), date(item, 12, 31))
        for item in range(
            after_12m.year + (after_12m.month != 1), year + SINGLE_YEARS + 1
        )
    )
    ranges.append(
        (
            date(year + SINGLE_YEARS + 1, 1, 1),
            date(year + SINGLE_YEARS + GROUPED_YEARS, 12, 31),
        )
    )
    ranges.append((date(year + SINGLE_YEARS + GROUPED_YEARS + 1, 1, 1), None))
    return ranges


def maturity_profile(
    holdings: Iterable[DebtHolding], stock_month: date
) -> list[MaturityBucket]:
    """A dívida em mercado por faixa de vencimento: os 12 meses seguintes ao estoque, que
    batem com `maturing_within_12m`, o resto do ano em que eles terminam, os anos seguintes
    um a um até o 4º depois do estoque, os 5 anos depois deles e o que vence mais tarde.
    Faixa sem nenhum título sai."""
    market = _market(holdings)
    total = sum(item.value for item in market)
    ranges = _ranges(stock_month)
    by_range = [0.0] * len(ranges)
    # As faixas são contíguas e em ordem: cada título cai na primeira cujo fim ele não
    # passa, e o que vence antes do início da primeira entra nela, como no
    # `maturing_within_12m`. Assim as faixas somam a dívida inteira.
    for item in market:
        index = next(
            index
            for index, (_, end) in enumerate(ranges)
            if end is None or item.maturity <= end
        )
        by_range[index] += item.value
    return [
        MaturityBucket(
            start=start,
            end=end,
            share=value / total,
            value=value,
            within_12m=index == 0,
        )
        for index, ((start, end), value) in enumerate(
            zip(ranges, by_range, strict=True)
        )
        if value > 0
    ]


def central_bank_share(holdings: Sequence[DebtHolding]) -> float:
    """A fração dos títulos federais emitidos que está na carteira do Banco Central,
    que os usa para controlar a liquidez do dia a dia."""
    total = sum(item.value for item in holdings)
    held = sum(
        item.value for item in holdings if item.holder is DebtHolder.CENTRAL_BANK
    )
    return held / total


def stock_total(holdings: Iterable[DebtHolding]) -> float:
    """O valor em R$ dos títulos federais em mercado, sem a carteira do Banco Central:
    a mesma base da composição e dos vencimentos."""
    return sum(item.value for item in _market(holdings))
