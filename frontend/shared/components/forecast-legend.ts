import type { LegendEntry } from "@/shared/components/chart-legend";

/** A entrada da previsão do Focus na legenda: a linha tracejada neutra. */
export function forecastLegendEntry(label = "Previsão de mercado"): LegendEntry {
  return { key: "forecast", label, color: "var(--forecast)", shape: "dashed" };
}
