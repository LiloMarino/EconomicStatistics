import type { Indexer } from "@/features/debt/use-debt";

/** O nome e a cor de cada indexador, na ordem em que a API manda. */
export const indexerIdentity: Record<Indexer, { label: string; color: string }> = {
  selic: { label: "Selic", color: "var(--indexer-selic)" },
  fixed: { label: "Prefixado", color: "var(--indexer-fixed)" },
  ipca: { label: "IPCA", color: "var(--indexer-ipca)" },
  igpm: { label: "IGP-M", color: "var(--indexer-igpm)" },
  fx: { label: "Câmbio", color: "var(--indexer-fx)" },
  other: { label: "Outros", color: "var(--indexer-other)" },
};
