import type { components } from "@/types/openapi.generated";

export type SeriesId = components["schemas"]["SeriesId"];

export const seriesLabels: Record<SeriesId, string> = {
  ipca_general: "Índice geral",
  ipca_food: "Alimentação e bebidas",
  ipca_housing: "Habitação",
  ipca_household: "Artigos de residência",
  ipca_apparel: "Vestuário",
  ipca_transport: "Transportes",
  ipca_health: "Saúde e cuidados pessoais",
  ipca_personal: "Despesas pessoais",
  ipca_education: "Educação",
  ipca_communication: "Comunicação",
  inpc: "INPC",
  minimum_wage: "Salário mínimo",
  inflation_target: "Meta de inflação",
  dollar_monthly: "Dólar (média do mês)",
  current_account_gdp: "Transações correntes",
  fdi_gdp: "Investimento direto no país",
  reserves: "Reservas internacionais",
  gdp_usd_12m: "PIB de 12 meses em dólar",
  iip_assets: "Ativos externos",
  iip_liabilities: "Passivos externos",
};
