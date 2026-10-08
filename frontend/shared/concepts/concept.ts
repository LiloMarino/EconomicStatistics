import type { ReactNode } from "react";

export const conceptIds = [
  "ipca",
  "inpc",
  "ipca-group",
  "accumulated",
  "rolling-12m",
  "base-effect",
  "seasonality",
  "percentage-point",
  "purchasing-power",
  "inflation-target",
  "minimum-wage",
  "exchange-rate",
  "ptax",
  "current-account",
  "fdi",
  "international-reserves",
  "international-investment-position",
  "share-of-gdp",
  "nfsp",
  "primary-balance",
  "nominal-interest",
  "nominal-balance",
  "net-debt",
  "gross-debt",
  "implicit-rate",
  "nominal-gdp-growth",
  "r-minus-g",
  "stabilizing-primary",
  "federal-debt",
  "rollover",
  "indexer",
  "average-maturity",
  "focus-survey",
  "median",
  "unanchored-expectations",
  "gdp",
  "ibc-br",
  "real-growth",
  "unemployment-rate",
  "moving-quarter",
] as const;

/** O id do conceito é também o endereço da página dele em `/learn/<id>`. */
export type ConceptId = (typeof conceptIds)[number];

export const topics = [
  "inflation",
  "public-accounts",
  "activity",
  "external",
  "expectations",
] as const;

export type Topic = (typeof topics)[number];

export const topicLabels: Record<Topic, string> = {
  inflation: "Inflação",
  "public-accounts": "Contas públicas",
  activity: "Atividade",
  external: "Setor externo",
  expectations: "Expectativas",
};

export function isTopic(value: string): value is Topic {
  return topics.some((topic) => topic === value);
}

export interface ConceptSource {
  /** Quem publica e o documento: "IBGE, tabela 7060 do SIDRA". */
  name: string;
  url: string;
  /** O que essa fonte comprova na página. */
  backs: string;
}

export interface Concept {
  title: string;
  /** A sigla ou o apelido que aparece ao lado do título: "IBGE", "p.p.". */
  abbr?: string;
  topic: Topic;
  /** Uma linha, no glossário e na busca. */
  summary: string;
  /** Duas ou três frases: abrem a página do conceito e são o "?" das telas. */
  lead: ReactNode;
  /** Termos que a busca acha além do título, da sigla e do resumo. */
  keywords: string[];
  measures: ReactNode;
  formula?: { tex: string; legend: { symbol: string; text: ReactNode }[] };
  /** A conta com números reais, datada no título: "Com os números de agosto de 2026". */
  example?: { title: string; content: ReactNode };
  reading: ReactNode;
  cautions?: { title: string; text: ReactNode }[];
  related: ConceptId[];
  /** Uma seção a mais, depois de "O que mede", para o que o conceito tem de próprio. */
  details?: { title: string; content: ReactNode };
  /** Toda página do Aprender cita a fonte oficial de cada fato e de cada número dela. */
  sources: [ConceptSource, ...ConceptSource[]];
  /** De quanto em quanto tempo o dado sai, quando o conceito tem série. */
  frequency?: string;
  /** As telas do app em que o conceito aparece. */
  screens: { to: string; label: string }[];
}

export function isConceptId(value: string): value is ConceptId {
  return conceptIds.some((id) => id === value);
}
