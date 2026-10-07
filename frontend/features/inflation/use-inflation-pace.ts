import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

export type InflationPace = components["schemas"]["InflationPaceDTO"];

/** O ritmo no último mês do período que a tela mostra. */
export function useInflationPace(end: string) {
  return useQuery({
    queryKey: [...queryKeys.inflationPace, end],
    queryFn: () => get("/api/inflation/pace", { query: { end } }),
    placeholderData: keepPreviousData,
  });
}
