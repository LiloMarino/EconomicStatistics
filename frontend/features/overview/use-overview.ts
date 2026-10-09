import { useQuery } from "@tanstack/react-query";

import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

export type Overview = components["schemas"]["OverviewDTO"];
export type Indicator = Overview["indicators"][number];
export type OverviewIndicator = Indicator["indicator"];
export type GovernmentResult = Overview["government_result"];

/** Um cartão para cada indicador das telas, mais o resultado do governo. */
export function useOverview() {
  return useQuery({
    queryKey: queryKeys.overview,
    queryFn: () => get("/api/overview"),
  });
}
