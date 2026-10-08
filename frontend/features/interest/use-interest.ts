import { useQuery } from "@tanstack/react-query";

import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

export type Interest = components["schemas"]["InterestDTO"];

/** A Selic e o IPCA em 12 meses nos últimos 24 meses, com a previsão do Focus. */
export function useInterest() {
  return useQuery({
    queryKey: queryKeys.interest,
    queryFn: () => get("/api/interest"),
  });
}
