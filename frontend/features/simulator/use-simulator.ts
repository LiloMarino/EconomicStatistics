import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

export type Simulation = components["schemas"]["SimulationDTO"];
export type DebtCase = components["schemas"]["DebtCaseDTO"];
export type DebtCaseId = components["schemas"]["DebtCaseId"];
export type CountryHistory = components["schemas"]["CountryHistoryDTO"];
export type Country = components["schemas"]["Country"];
export type CountryHistories = components["schemas"]["CountryHistoriesDTO"];

/** Os números do cenário, todos em fração: 0.8 é 80% do PIB. */
export interface Scenario {
  debt: number;
  rate: number;
  growth: number;
  primary: number;
}

/** A trajetória da dívida/PIB com os números do cenário. */
export function useDebtSimulation(scenario: Scenario, years: number) {
  const query = {
    debt: scenario.debt,
    r: scenario.rate,
    g: scenario.growth,
    primary: scenario.primary,
    years,
  };
  return useQuery({
    queryKey: [...queryKeys.debtSimulation, query],
    queryFn: () => get("/api/debt/simulation", { query }),
    placeholderData: keepPreviousData,
  });
}

/** Os pontos de partida: o Brasil de hoje, os casos que aconteceram e os exemplos. */
export function useDebtCases() {
  return useQuery({
    queryKey: queryKeys.debtCases,
    queryFn: () => get("/api/debt/simulation/cases"),
  });
}

/** A dívida bruta dos países do FMI e a inflação do último ano. */
export function useDebtCountries() {
  return useQuery({
    queryKey: queryKeys.debtCountries,
    queryFn: () => get("/api/debt/simulation/countries"),
  });
}
