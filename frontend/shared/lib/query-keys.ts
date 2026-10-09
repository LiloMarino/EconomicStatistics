import type { QueryClient, QueryKey } from "@tanstack/react-query";

// Tudo o que sai do cache de séries fica debaixo de "series": o refresh invalida a raiz
export const queryKeys = {
  series: ["series"] as const,
  seriesStatus: ["series", "status"] as const,
  overview: ["series", "overview"] as const,
  economyHealth: ["series", "economy-health"] as const,
  inflationGroups: ["series", "inflation-groups"] as const,
  inflationPace: ["series", "inflation-pace"] as const,
  priceCuts: ["series", "price-cuts"] as const,
  seasonality: ["series", "seasonality"] as const,
  purchasingPower: ["series", "purchasing-power"] as const,
  externalSector: ["series", "external-sector"] as const,
  activity: ["series", "activity"] as const,
  interest: ["series", "interest"] as const,
  credit: ["series", "credit"] as const,
  deficit: ["series", "deficit"] as const,
  deficitFinancing: ["series", "deficit-financing"] as const,
  debt: ["series", "debt"] as const,
  federalDebt: ["series", "federal-debt"] as const,
  debtSimulation: ["series", "debt-simulation"] as const,
  debtCases: ["series", "debt-cases"] as const,
  debtCountries: ["series", "debt-countries"] as const,
  focusReport: ["series", "focus-report"] as const,
  focusHistory: ["series", "focus-history"] as const,
};

export function invalidateKeys(queryClient: QueryClient, keys: readonly QueryKey[]): Promise<void> {
  return queryClient.invalidateQueries({
    predicate: ({ queryKey }) =>
      keys.some((key) => key.every((part, index) => queryKey[index] === part)),
  });
}
