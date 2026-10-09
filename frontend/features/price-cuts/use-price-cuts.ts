import { useQuery } from "@tanstack/react-query";

import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

export type PriceCuts = components["schemas"]["PriceCutsDTO"];

/** O IPCA em 12 meses de livres, administrados e serviços, nos últimos 24 meses. */
export function usePriceCuts() {
  return useQuery({
    queryKey: queryKeys.priceCuts,
    queryFn: () => get("/api/price-cuts"),
  });
}
