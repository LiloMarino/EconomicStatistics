import type { Country, DebtCaseId } from "@/features/simulator/use-simulator";

/** A cor de cada ponto de partida, a mesma no gráfico, na lista e na tabela. */
export const caseColor: Record<DebtCaseId, string> = {
  brazil_today: "var(--sim-brazil)",
  brazil_collor: "var(--sim-collor)",
  brazil_2002: "var(--sim-brazil-2002)",
  brazil_2015: "var(--sim-brazil-2015)",
  japan: "var(--sim-japan)",
  greece: "var(--sim-greece)",
  argentina_2001: "var(--sim-argentina)",
  argentina_2023: "var(--sim-argentina-2023)",
  country_a: "var(--sim-country-a)",
  country_b: "var(--sim-country-b)",
};

/** A linha do cenário do usuário. */
export const scenarioColor = "var(--sim-me)";

/** O país na seção histórica leva a cor e o contexto do caso dele no simulador. */
export const countryIdentity: Record<Country, { label: string; caseId: DebtCaseId }> = {
  JPN: { label: "Japão", caseId: "japan" },
  GRC: { label: "Grécia", caseId: "greece" },
  ARG: { label: "Argentina", caseId: "argentina_2001" },
  BRA: { label: "Brasil", caseId: "brazil_today" },
};
