import { useQuery } from "@tanstack/react-query";

import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

export type DeficitFinancing = components["schemas"]["DeficitFinancingDTO"];

/** A carteira do Banco Central, as compromissadas e a base monetária, em % do PIB, e quem
tem os títulos federais emitidos. */
export function useDeficitFinancing() {
  return useQuery({
    queryKey: queryKeys.deficitFinancing,
    queryFn: () => get("/api/deficit/financing"),
  });
}
