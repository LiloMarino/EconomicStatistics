import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

export type Seasonality = components["schemas"]["SeasonalityDTO"];

/** Os meses de `year` contra o mesmo mês dos anos anteriores, por grupo. */
export function useSeasonality(year: number) {
  return useQuery({
    queryKey: [...queryKeys.seasonality, year],
    queryFn: () => get("/api/inflation/seasonality", { query: { year } }),
    placeholderData: keepPreviousData,
  });
}
