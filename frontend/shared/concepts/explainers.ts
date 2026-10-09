import type { ConceptId, ConceptSource } from "@/shared/concepts/concept";

export const explainerIds = [
  "loops-and-bridges",
  "why-r-minus-g",
  "three-debts",
  "debt-sustainability",
  "inertia-and-real",
  "money-printing",
  "reserves-and-fx",
  "fiscal-dominance",
] as const;

/** O id do explicador é também o endereço da página dele em `/learn/explainers/<id>`. */
export type ExplainerId = (typeof explainerIds)[number];

export function isExplainerId(value: string): value is ExplainerId {
  return explainerIds.some((id) => id === value);
}

export interface Explainer {
  title: string;
  /** Duas frases: o cartão da lista em Aprender e o resultado da busca. */
  summary: string;
  readingMinutes: number;
  /** Termos que a busca acha além do título e do resumo. */
  keywords: string[];
  /** Os conceitos que o texto usa, linkados no cabeçalho. */
  uses: ConceptId[];
  /** Toda página do Aprender cita a fonte oficial de cada fato dela. */
  sources: [ConceptSource, ...ConceptSource[]];
}

const fiscalStatistics: ConceptSource = {
  name: "Banco Central, Manual de Estatísticas Fiscais (edição de maio de 2019)",
  url: "https://www.bcb.gov.br/content/estatisticas/Documents/notas_metodologicas/estatisticas-fiscais/estatisticasfiscais.pdf",
  backs:
    "A bruta deixa o Banco Central de fora, mas inclui as operações compromissadas dele com títulos públicos; a líquida inclui as estatais federais, exceto Petrobras e Eletrobras, e a dívida externa líquida, com as reservas internacionais.",
};

const sgs: ConceptSource = {
  name: "Banco Central, séries do SGS",
  url: "https://www3.bcb.gov.br/sgspub/",
  backs: "Os valores de hoje que os nós do desenho mostram.",
};

export const explainers: Record<ExplainerId, Explainer> = {
  "loops-and-bridges": {
    title: "Os dois loops e as três pontes",
    summary:
      "Dívida e inflação são dois ciclos que se alimentam sozinhos. Câmbio, emissão de moeda e juros levam a carga de um para o outro.",
    readingMinutes: 8,
    keywords: [
      "loop",
      "ciclo",
      "ponte",
      "dívida e inflação",
      "emissão de moeda",
      "dominância fiscal",
    ],
    uses: ["gross-debt", "selic", "ipca", "exchange-rate"],
    sources: [
      {
        name: "Constituição Federal, art. 164, § 1º",
        url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
        backs: "O Banco Central não pode conceder empréstimos ao Tesouro Nacional.",
      },
      {
        name: "Lei de Responsabilidade Fiscal, art. 39",
        url: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm",
        backs:
          "O Banco Central não compra título da dívida no dia em que ele é lançado no mercado e só compra direto do Tesouro para refinanciar o que vence na carteira dele (art. 39, I e § 2º).",
      },
      fiscalStatistics,
      sgs,
    ],
  },
  "why-r-minus-g": {
    title: "Por que r − g decide a dívida",
    summary:
      "A conta que diz se a dívida em relação ao PIB sobe ou desce, com dois países de exemplo.",
    readingMinutes: 7,
    keywords: ["r − g", "juro menos crescimento", "dívida/PIB", "primário", "país a", "país b"],
    uses: ["r-minus-g", "real-rate", "gdp", "primary-balance"],
    sources: [
      fiscalStatistics,
      {
        name: "Banco Central, séries 5760, 4382, 4478 e 4513 do SGS",
        url: "https://www3.bcb.gov.br/sgspub/",
        backs:
          "O juro implícito (r) e o crescimento do PIB nominal (g) que a tela Dívida usa para o Brasil.",
      },
    ],
  },
  "three-debts": {
    title: "As três dívidas",
    summary: "DBGG, DLSP e DPF: qual é qual, o que cada uma conta e por que os números não batem.",
    readingMinutes: 5,
    keywords: ["dbgg", "dlsp", "dpf", "dívida bruta", "dívida líquida", "dívida federal"],
    uses: ["gross-debt", "net-debt", "federal-debt", "international-reserves"],
    sources: [
      fiscalStatistics,
      {
        name: "Banco Central, Estatísticas fiscais (nota de dezembro de 2024)",
        url: "https://www.bcb.gov.br/content/estatisticas/hist_estatisticasfiscais/202501_Texto_de_estatisticas_fiscais.pdf",
        backs:
          "A bruta compreende o governo federal, o INSS e os governos estaduais e municipais; em 2024, com o dólar 27,9% mais caro, o efeito foi de −2,9 pontos do PIB na líquida e de +1,0 na bruta.",
      },
      {
        name: "Tesouro Nacional, Relatório Mensal da Dívida",
        url: "https://www.tesourotransparente.gov.br/publicacoes/relatorio-mensal-da-divida-rmd/",
        backs:
          "A DPF inclui as dívidas interna e externa de responsabilidade do Tesouro em mercado.",
      },
    ],
  },
  "debt-sustainability": {
    title: "Por que a dívida não explode",
    summary:
      "O tamanho da dívida importa menos do que o prazo, a moeda, os credores e a conta de r − g.",
    readingMinutes: 7,
    keywords: [
      "sustentabilidade",
      "rolagem",
      "japão",
      "grécia",
      "collor",
      "prazo",
      "moeda",
      "credores",
    ],
    uses: ["rollover", "average-maturity", "r-minus-g", "gross-debt"],
    sources: [
      {
        name: "FMI, DataMapper: dívida bruta do governo geral (WEO)",
        url: "https://www.imf.org/external/datamapper/GGXWDG_NGDP@WEO",
        backs: "A dívida de Japão, Grécia e Brasil em % do PIB, ano a ano.",
      },
      fiscalStatistics,
    ],
  },
  "inertia-and-real": {
    title: "A inércia e o Plano Real",
    summary:
      "Como a inflação de ontem virava a de amanhã, como a URV e o Real quebraram o ciclo e onde a inércia ainda mora.",
    readingMinutes: 6,
    keywords: [
      "inércia",
      "inflação inercial",
      "indexação",
      "urv",
      "plano real",
      "cruzeiro real",
      "1994",
    ],
    uses: ["ipca", "services-inflation", "unanchored-expectations", "minimum-wage"],
    sources: [
      {
        name: "Lei 8.880, de 27 de maio de 1994",
        url: "https://www.planalto.gov.br/ccivil_03/leis/l8880.htm",
        backs:
          "Institui a URV, que vale CR$ 647,50 em 1º de março de 1994, e a transforma em Real na primeira emissão, marcada para 1º de julho de 1994 (art. 1º a 3º).",
      },
      {
        name: "Banco Central, Síntese dos Padrões Monetários Brasileiros (Museu de Valores)",
        url: "https://www.bcb.gov.br/content/acessoinformacao/museudocs/pub/SintesePadroesMonetariosBrasileiros.pdf",
        backs:
          "A conversão para o Real, em vigor a partir de 1º de julho de 1994: CR$ 2.750,00 = R$ 1,00.",
      },
      {
        name: "IBGE, INPC e IPCA de dezembro de 1993",
        url: "https://biblioteca.ibge.gov.br/visualizacao/periodicos/236/inpc_ipca_1993_dez.pdf",
        backs: "O IPCA acumulado em 1993: 2.477,15%.",
      },
      {
        name: "IBGE, Carta do IBGE de janeiro de 1996",
        url: "https://biblioteca.ibge.gov.br/visualizacao/periodicos/151/carta_ibge_1996_v1_n17_jan.pdf",
        backs: "O IPCA acumulado em 1995: 22,41%.",
      },
      sgs,
    ],
  },
  "money-printing": {
    title: "Emitir moeda gera inflação?",
    summary:
      "Por que o déficit de hoje vira dívida e não moeda, o atalho que a lei fechou e o que o Banco Central faz com títulos.",
    readingMinutes: 6,
    keywords: [
      "emissão",
      "imprimir dinheiro",
      "senhoriagem",
      "monetização",
      "compromissadas",
      "financiamento monetário",
    ],
    uses: ["nominal-balance", "federal-debt", "selic", "ipca"],
    sources: [
      {
        name: "Constituição Federal, art. 164, § 1º",
        url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
        backs: "O Banco Central não pode conceder empréstimos ao Tesouro Nacional.",
      },
      {
        name: "Lei de Responsabilidade Fiscal, art. 39",
        url: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm",
        backs:
          "O Banco Central só compra título do Tesouro no lançamento para refinanciar o que vence na carteira dele (art. 39, § 2º).",
      },
      sgs,
    ],
  },
  "reserves-and-fx": {
    title: "Reservas, câmbio e dívida",
    summary:
      "As reservas como seguro contra a fuga de dólares, por que o câmbio mexe na dívida líquida e quanto custa carregar o seguro.",
    readingMinutes: 6,
    keywords: ["reservas", "câmbio", "dólar", "seguro", "custo de carregamento", "dívida líquida"],
    uses: ["international-reserves", "exchange-rate", "net-debt", "gross-debt"],
    sources: [
      {
        name: "Banco Central, Relatório de Gestão das Reservas Internacionais (2026)",
        url: "https://www.bcb.gov.br/content/publicacoes/relgestaoreservas/GESTAORESERVAS202603-relatorio_anual_reservas_internacionais_2026.pdf",
        backs:
          "O objetivo de dar confiança de que o país honra os compromissos externos; em 2025, retorno de 5,26% em juros e outros fatores, em dólar, e de −2,97% em reais.",
      },
      {
        name: "Banco Central, Estatísticas fiscais (nota de dezembro de 2024)",
        url: "https://www.bcb.gov.br/content/estatisticas/hist_estatisticasfiscais/202501_Texto_de_estatisticas_fiscais.pdf",
        backs:
          "Em 2024, com o dólar 27,9% mais caro, o efeito foi de −2,9 pontos do PIB na líquida e de +1,0 na bruta.",
      },
      {
        name: "IFI, Nota Técnica nº 39: Custo de carregamento e nível adequado das reservas internacionais (2019)",
        url: "https://www12.senado.leg.br/ifi/publicacoes-1/pasta-notas-tecnicas/2019/outubro/custo-de-carregamento-e-nivel-adequado-das-reservas-internacionais",
        backs:
          "A Selic como custo de carregar as reservas, financiadas por operações compromissadas, menos o que elas rendem; com a variação cambial, o custo líquido foi negativo na maior parte do tempo desde meados de 2011.",
      },
      sgs,
    ],
  },
  "fiscal-dominance": {
    title: "Dominância fiscal",
    summary:
      "Quando o juro que combate a inflação piora a dívida, assusta o investidor e acaba empurrando a própria inflação para cima.",
    readingMinutes: 5,
    keywords: ["dominância fiscal", "juro e dívida", "2002", "blanchard", "calote", "risco"],
    uses: ["selic", "inflation-target", "nominal-interest", "stabilizing-primary"],
    sources: [
      {
        name: "Olivier Blanchard, Fiscal Dominance and Inflation Targeting: Lessons from Brazil (NBER, 2004)",
        url: "https://www.nber.org/papers/w10389",
        backs:
          "Com dívida alta, parte em moeda estrangeira, e prêmio de risco alto, juro maior pode depreciar o câmbio e subir a inflação; o Brasil esteve nessa situação em 2002 e 2003.",
      },
      sgs,
    ],
  },
};
