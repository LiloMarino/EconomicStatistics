import type { QueryClient, QueryKey } from "@tanstack/react-query";

// Tudo o que sai do cache de séries fica debaixo de "series": o refresh invalida a raiz
export const queryKeys = {
  series: ["series"] as const,
  seriesStatus: ["series", "status"] as const,
  inflationGroups: ["series", "inflation-groups"] as const,
  inflationPace: ["series", "inflation-pace"] as const,
  seasonality: ["series", "seasonality"] as const,
  purchasingPower: ["series", "purchasing-power"] as const,
  externalSector: ["series", "external-sector"] as const,
};

export function invalidateKeys(queryClient: QueryClient, keys: readonly QueryKey[]): Promise<void> {
  return queryClient.invalidateQueries({
    predicate: ({ queryKey }) =>
      keys.some((key) => key.every((part, index) => queryKey[index] === part)),
  });
}
