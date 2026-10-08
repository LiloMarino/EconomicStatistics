import { useQuery } from "@tanstack/react-query";

import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

export type ExternalSector = components["schemas"]["ExternalSectorDTO"];

/** Cada gráfico da tela na janela dele, terminando no último dado. */
export function useExternalSector() {
  return useQuery({
    queryKey: queryKeys.externalSector,
    queryFn: () => get("/api/external-sector"),
  });
}
