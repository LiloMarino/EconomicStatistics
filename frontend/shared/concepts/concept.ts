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
] as const;

/** O id do conceito é também o endereço da página dele em `/learn/<id>`. */
export type ConceptId = (typeof conceptIds)[number];

export const topics = ["inflation"] as const;

export type Topic = (typeof topics)[number];

export const topicLabels: Record<Topic, string> = {
  inflation: "Inflação",
};

export function isTopic(value: string): value is Topic {
  return topics.some((topic) => topic === value);
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
  /** Onde a fonte oficial publica; uma convenção de leitura, como o p.p., não tem. */
  source?: { name: string; frequency: string; url: string };
  /** As telas do app em que o conceito aparece. */
  screens: { to: string; label: string }[];
}

export function isConceptId(value: string): value is ConceptId {
  return conceptIds.some((id) => id === value);
}
