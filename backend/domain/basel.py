"""O índice de Basileia: quanto capital próprio o sistema tem para cada real de ativo
ponderado pelo risco, em fração (0.17 é 17%)."""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
from datetime import date

from backend.domain.series import Observation

# A Resolução CMN 4.958/2021 fixa o patrimônio de referência mínimo em 8% dos ativos
# ponderados pelo risco (art. 4º) e soma o adicional de conservação de 2,5% desde
# abr/2022 (art. 8º, § 4º, II)
MIN_CAPITAL = 0.08
CONSERVATION_BUFFER = 0.025


# O calote do exemplo da bandeja: R$ 5 de cada R$ 100 emprestados
EXAMPLE_LOSS = 0.05


@dataclass(frozen=True, slots=True, kw_only=True)
class QuarterRatio:
    ref_date: date
    ratio: float


@dataclass(frozen=True, slots=True, kw_only=True)
class LossExample:
    """O exemplo da bandeja em frações do valor emprestado, para um sistema em que todo
    empréstimo tem o mesmo risco. `clients` é a parte que veio dos clientes e o banco
    deve devolver; um calote de `loss` deixa `repaid` voltando e sai inteiro do
    capital, que fica em `capital_after_loss`, e o índice cai para `ratio_after_loss`. `loss_to_minimum` é o
    calote que leva o índice ao mínimo com o colchão de conservação."""

    clients: float
    loss: float
    repaid: float
    capital_after_loss: float
    ratio_after_loss: float
    loss_to_minimum: float


def loss_example(
    ratio: float, minimum: float, loss: float = EXAMPLE_LOSS
) -> LossExample:
    """Com índice de 17,33%, R$ 5 de calote em R$ 100 deixam R$ 12,33 de capital sobre
    R$ 95 que ainda voltam, 12,98%. O calote L que leva ao mínimo m resolve
    (índice - L) / (1 - L) = m: com m de 10,5%, cabem R$ 7,63."""
    return LossExample(
        clients=1 - ratio,
        loss=loss,
        repaid=1 - loss,
        capital_after_loss=ratio - loss,
        ratio_after_loss=(ratio - loss) / (1 - loss),
        loss_to_minimum=(ratio - minimum) / (1 - minimum),
    )


def basel_ratios(
    capital: Iterable[Observation], risk_weighted: Iterable[Observation]
) -> list[QuarterRatio]:
    """O patrimônio de referência sobre os ativos ponderados pelo risco, somados sobre
    as instituições, em cada trimestre que traz os dois: R$ 1.748,7 bi sobre
    R$ 10.090,5 bi dão 17,33% em dez/2025."""
    assets = {item.ref_date: item.value for item in risk_weighted}
    return [
        QuarterRatio(ref_date=item.ref_date, ratio=item.value / assets[item.ref_date])
        for item in capital
        if assets.get(item.ref_date)
    ]
