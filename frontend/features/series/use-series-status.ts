import { useQuery } from "@tanstack/react-query";

import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";

export function useSeriesStatus() {
  return useQuery({
    queryKey: queryKeys.seriesStatus,
    queryFn: () => get("/api/series/status"),
  });
}
