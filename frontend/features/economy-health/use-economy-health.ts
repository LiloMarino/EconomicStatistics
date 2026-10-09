import { useQuery } from "@tanstack/react-query";

import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

export type EconomyHealth = components["schemas"]["EconomyHealthDTO"];
export type Lamp = components["schemas"]["Lamp"];

/** Os dois sinais com faixa oficial, com a cor, e os demais, só com o número. */
export function useEconomyHealth() {
  return useQuery({
    queryKey: queryKeys.economyHealth,
    queryFn: () => get("/api/economy-health"),
  });
}
