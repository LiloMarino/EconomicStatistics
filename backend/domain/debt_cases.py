"""Os pontos de partida do simulador da dívida: casos que aconteceram e exemplos para
entender a conta. Dívida, juro, crescimento e primário em fração do PIB (0.8 é 80%);
primário positivo é superávit.

Cada caso é um retrato de um período que já passou, então os números são convenção,
com a fonte ao lado. Sem fonte própria, o juro é o das contas do FMI (World Economic
Outlook de abril de 2026, DataMapper): os juros pagos do ano sobre a dívida bruta do
ano anterior. O crescimento é o nominal, a composição do PIB real com a inflação, e o
primário é o do governo geral.
"""

from __future__ import annotations

from dataclasses import dataclass

from backend.core.enum import DebtCaseGroup, DebtCaseId


@dataclass(frozen=True, slots=True, kw_only=True)
class CaseContext:
    """O que a conta não mostra sobre a dívida do caso."""

    currency: str
    term: str
    lender: str
    story: str


@dataclass(frozen=True, slots=True, kw_only=True)
class DebtCase:
    id: DebtCaseId
    label: str
    group: DebtCaseGroup
    debt: float
    rate: float
    growth: float
    primary: float
    context: CaseContext | None


def brazil_today(
    *, debt: float, rate: float, growth: float, primary: float
) -> DebtCase:
    """Os números da tela Dívida de hoje: dívida líquida, r e g dos últimos 12 meses e o
    primário feito."""
    return DebtCase(
        id=DebtCaseId.BRAZIL_TODAY,
        label="Brasil hoje",
        group=DebtCaseGroup.HAPPENED,
        debt=debt,
        rate=rate,
        growth=growth,
        primary=primary,
        context=CaseContext(
            currency="Quase toda em reais",
            term="Média de uns 4 anos",
            lender="Principalmente residentes",
            story="Sobe devagar, com juro acima do crescimento.",
        ),
    )


# Na ordem em que aparecem na tela, depois do Brasil hoje
CASES: tuple[DebtCase, ...] = (
    # Dívida líquida de cerca de 40% do PIB (estimativa: o SGS 4513 só começa em
    # dez/2001). Em 1990 a inflação passou de 2.900%, então r é o juro real e g, o PIB
    # real (-4,2%, FMI): em termos nominais a conta não diz nada
    DebtCase(
        id=DebtCaseId.BRAZIL_COLLOR,
        label="Brasil, Collor (1990)",
        group=DebtCaseGroup.HAPPENED,
        debt=0.40,
        rate=0.15,
        growth=-0.04,
        primary=0.02,
        context=CaseContext(
            currency="Cruzeiro, em hiperinflação",
            term="Muito curta",
            lender="Residentes",
            story=(
                "Dívida pequena, mas tão curta e numa moeda tão instável que o "
                "governo bloqueou a poupança para não ter de rolar."
            ),
        ),
    ),
    # Dívida líquida de dez/2002 (SGS 4513, 59,9%); r, g e primário de 2002 (FMI)
    DebtCase(
        id=DebtCaseId.BRAZIL_2002,
        label="Brasil, crise de 2002",
        group=DebtCaseGroup.HAPPENED,
        debt=0.599,
        rate=0.182,
        growth=0.118,
        primary=0.034,
        context=CaseContext(
            currency="Parte atrelada ao dólar",
            term="Curta",
            lender="Residentes e estrangeiros",
            story=(
                "A desconfiança na eleição desvalorizou o real, e a parte em dólar "
                "levou a dívida líquida a perto de 60% do PIB."
            ),
        ),
    ),
    # Dívida líquida de dez/2015 (SGS 4513, 35,6%); r, g e primário de 2016 (FMI)
    DebtCase(
        id=DebtCaseId.BRAZIL_2015,
        label="Brasil, 2015-2016",
        group=DebtCaseGroup.HAPPENED,
        debt=0.356,
        rate=0.139,
        growth=0.051,
        primary=-0.020,
        context=CaseContext(
            currency="Reais",
            term="Média",
            lender="Principalmente residentes",
            story=(
                "Déficit primário e PIB caindo ao mesmo tempo: a dívida subiu rápido "
                "sem crise de rolagem."
            ),
        ),
    ),
    # Dívida de 2015; r, g e primário são a média de 2010 a 2019 (FMI)
    DebtCase(
        id=DebtCaseId.JAPAN,
        label="Japão, anos 2010",
        group=DebtCaseGroup.HAPPENED,
        debt=2.001,
        rate=0.011,
        growth=0.018,
        primary=-0.045,
        context=CaseContext(
            currency="Iene, que o próprio país emite",
            term="Longa",
            lender="Residentes e o banco central japonês",
            story=(
                "A dívida subiu para perto de 250% do PIB sem crise: juro perto de "
                "zero e credores de dentro."
            ),
        ),
    ),
    # Números de 2010 (FMI)
    DebtCase(
        id=DebtCaseId.GREECE,
        label="Grécia, 2010",
        group=DebtCaseGroup.HAPPENED,
        debt=1.478,
        rate=0.048,
        growth=-0.013,
        primary=-0.053,
        context=CaseContext(
            currency="Euro, que a Grécia não emite",
            term="Curta para o tamanho",
            lender="Bancos estrangeiros",
            story=(
                "O mercado se recusou a rolar, veio o resgate e, em 2012, a "
                "reestruturação com os credores privados."
            ),
        ),
    ),
    # Números de 2001 (FMI)
    DebtCase(
        id=DebtCaseId.ARGENTINA_2001,
        label="Argentina, 2001-2002",
        group=DebtCaseGroup.HAPPENED,
        debt=0.48,
        rate=0.101,
        growth=-0.055,
        primary=-0.013,
        context=CaseContext(
            currency="Boa parte em dólar",
            term="Curta",
            lender="Parte relevante de estrangeiros",
            story=(
                "Calote no fim de 2001; em 2002 o peso desvalorizou e a dívida passou "
                "de 100% do PIB. O simulador não vê esse salto de moeda."
            ),
        ),
    ),
    # Dívida de 2022, antes da desvalorização de 2023; g, r e primário de 2023 (FMI)
    DebtCase(
        id=DebtCaseId.ARGENTINA_2023,
        label="Argentina, 2023",
        group=DebtCaseGroup.HAPPENED,
        debt=0.843,
        rate=0.030,
        growth=1.291,
        primary=-0.028,
        context=CaseContext(
            currency="Pesos e dólares",
            term="Curta",
            lender="Residentes, FMI e estrangeiros",
            story=(
                "A moeda perdeu a confiança e a inflação passou de 200% ao ano. A "
                "inflação derrete a parte em pesos, e por isso a linha cai aqui; a "
                "parte em dólar o simulador não vê."
            ),
        ),
    ),
    # Exemplos para entender a conta: r abaixo de g com dívida grande, e o contrário
    DebtCase(
        id=DebtCaseId.COUNTRY_A,
        label="País A",
        group=DebtCaseGroup.EXAMPLE,
        debt=1.20,
        rate=0.02,
        growth=0.06,
        primary=0.0,
        context=None,
    ),
    DebtCase(
        id=DebtCaseId.COUNTRY_B,
        label="País B",
        group=DebtCaseGroup.EXAMPLE,
        debt=0.60,
        rate=0.15,
        growth=0.03,
        primary=-0.01,
        context=None,
    ),
)
