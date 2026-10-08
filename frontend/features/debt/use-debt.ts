import { useQuery } from "@tanstack/react-query";

import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

export type DebtOverview = components["schemas"]["DebtOverviewDTO"];
export type FederalDebt = components["schemas"]["FederalDebtDTO"];
export type Indexer = components["schemas"]["Indexer"];

/** Dívida líquida e bruta, r e g, e a conta do primário que estabiliza. */
export function useDebt() {
  return useQuery({
    queryKey: queryKeys.debt,
    queryFn: () => get("/api/debt"),
  });
}

/** O estoque da dívida federal do Tesouro: composição, vencimentos e carteira do BC. */
export function useFederalDebt() {
  return useQuery({
    queryKey: queryKeys.federalDebt,
    queryFn: () => get("/api/debt/federal"),
  });
}
