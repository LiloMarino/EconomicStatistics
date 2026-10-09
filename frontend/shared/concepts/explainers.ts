import type { ConceptId, ConceptSource } from "@/shared/concepts/concept";

export const explainerIds = [
  "loops-and-bridges",
  "why-r-minus-g",
  "three-debts",
  "debt-sustainability",
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
};
