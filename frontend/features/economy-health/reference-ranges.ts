/** A referência escrita ao lado de cada sinal sem faixa oficial: o que a fonte diz, com
quem diz e quando. São estimativas e opiniões com data, e a tela as mostra como tal. */
export const referenceRanges = {
  expectedInflation: {
    text: (target: number | null) =>
      target === null
        ? "Não há faixa formal para a expectativa."
        : `Meta de ${(target * 100).toLocaleString("pt-BR")}%. Não há faixa formal para a expectativa.`,
    source: "Banco Central, pesquisa Focus",
  },
  neutralRate: {
    text: "Juro neutro estimado em 5,0%: acima disso, o juro freia a economia.",
    source: "Banco Central, Relatório de Política Monetária de junho de 2025",
  },
  unemployment: {
    text: "Sem estimativa oficial da taxa que não acelera a inflação: o FGV-Ibre estimou cerca de 8,5% em 2022, e as projeções de mercado para 2025 e 2026 giravam em torno de 9,5%. Sem consenso.",
    source: "FGV-Ibre, Blog do Ibre, julho de 2022",
  },
  reserves: {
    text: "O FMI vê como adequado de 100% a 150% da métrica ARA. O Banco Central não publica o valor do Brasil.",
    source: "FMI, nota de abril de 2011 sobre adequação de reservas",
  },
  grossDebt: {
    text: "Não há limiar de consenso: o que pesa é a trajetória e o custo.",
    source: "Ver a tela Dívida",
  },
  dollar: {
    text: "Sem faixa citável. Vale olhar a velocidade da mudança.",
    source: "Banco Central, PTAX",
  },
} as const;
