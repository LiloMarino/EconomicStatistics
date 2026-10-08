import { useQuery } from "@tanstack/react-query";

import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

export type Deficit = components["schemas"]["DeficitDTO"];

/** O resultado fiscal do último mês e o de dezembro de cada ano, desde 2002. */
export function useDeficit() {
  return useQuery({
    queryKey: queryKeys.deficit,
    queryFn: () => get("/api/deficit"),
  });
}
