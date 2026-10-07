import type { Concept } from "@/shared/concepts/concept";

/** Minúsculas e sem acento, para "divida" achar "dívida". */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** O texto em que a busca procura um conceito: título, sigla, palavras-chave e resumo. */
export function conceptSearchText(concept: Concept): string[] {
  return [concept.title, concept.abbr ?? "", ...concept.keywords, concept.summary];
}

/** Se todos os termos da busca aparecem em algum dos textos, ignorando acento. */
export function matches(texts: string[], query: string): boolean {
  const haystack = normalize(texts.join(" "));
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}
