import { useQuery } from "@tanstack/react-query";

import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

export type Credit = components["schemas"]["CreditDTO"];

/** Cada gráfico da tela nos últimos 24 meses, terminando no último dado. */
export function useCredit() {
  return useQuery({
    queryKey: queryKeys.credit,
    queryFn: () => get("/api/credit"),
  });
}
