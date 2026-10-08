import { useQuery } from "@tanstack/react-query";

import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

export type Activity = components["schemas"]["ActivityDTO"];

/** Cada gráfico da tela nos últimos 4 anos, terminando no último dado. */
export function useActivity() {
  return useQuery({
    queryKey: queryKeys.activity,
    queryFn: () => get("/api/activity"),
  });
}
