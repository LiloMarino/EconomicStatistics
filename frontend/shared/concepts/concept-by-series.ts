import type { ConceptId } from "@/shared/concepts/concept";
import type { SeriesId } from "@/shared/lib/series-labels";

/** O conceito que explica cada série. Uma série nova no backend só compila depois de
ganhar o conceito dela aqui. */
export const conceptBySeries: Record<SeriesId, ConceptId> = {
  ipca_general: "ipca",
  ipca_food: "ipca-group",
  ipca_housing: "ipca-group",
  ipca_household: "ipca-group",
  ipca_apparel: "ipca-group",
  ipca_transport: "ipca-group",
  ipca_health: "ipca-group",
  ipca_personal: "ipca-group",
  ipca_education: "ipca-group",
  ipca_communication: "ipca-group",
  inpc: "inpc",
  minimum_wage: "minimum-wage",
  inflation_target: "inflation-target",
};
