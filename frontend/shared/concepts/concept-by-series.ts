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
  dollar_monthly: "ptax",
  current_account_gdp: "current-account",
  fdi_gdp: "fdi",
  reserves: "international-reserves",
  gdp_usd_12m: "share-of-gdp",
  iip_assets: "international-investment-position",
  iip_liabilities: "international-investment-position",
  nominal_deficit: "nominal-balance",
  primary_deficit: "primary-balance",
  nominal_interest: "nominal-interest",
  net_debt: "net-debt",
  net_debt_brl: "net-debt",
  gross_debt: "gross-debt",
  gdp_12m: "nominal-gdp-growth",
  federal_debt_maturity: "average-maturity",
};
