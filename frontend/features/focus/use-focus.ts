import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

export type FocusReport = components["schemas"]["FocusReportDTO"];
export type FocusHistory = components["schemas"]["FocusHistoryDTO"];
export type FocusIndicator = components["schemas"]["FocusIndicator"];
export type FocusUnit = FocusReport["rows"][number]["unit"];

export function useFocusReport() {
  return useQuery({
    queryKey: queryKeys.focusReport,
    queryFn: () => get("/api/focus/report"),
  });
}

export function useFocusHistory(indicator: FocusIndicator, year: number | undefined) {
  return useQuery({
    queryKey: [...queryKeys.focusHistory, indicator, year],
    queryFn: () => get("/api/focus/history", { query: { indicator, year } }),
    placeholderData: keepPreviousData,
  });
}
