import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { MonthRange } from "@/shared/hooks/use-month-range";
import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

export type InflationGroups = components["schemas"]["InflationGroupsDTO"];

export function useInflationGroups(range: MonthRange) {
  return useQuery({
    queryKey: [...queryKeys.inflationGroups, range],
    queryFn: () => get("/api/inflation/groups", { query: range }),
    placeholderData: keepPreviousData,
  });
}
