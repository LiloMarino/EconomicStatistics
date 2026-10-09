import type { components } from "@/types/openapi.generated";

export type SeriesId = components["schemas"]["SeriesId"];

export type Dataset = components["schemas"]["Dataset"];

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
  selic_target: "Meta Selic",
  dollar_month_end: "Dólar (fim do mês)",
  current_account_gdp: "Transações correntes",
  fdi_gdp: "Investimento direto no país",
  reserves: "Reservas internacionais",
  gdp_usd_12m: "PIB de 12 meses em dólar",
  iip_assets: "Ativos externos",
  iip_liabilities: "Passivos externos",
  nominal_deficit: "Resultado nominal",
  primary_deficit: "Resultado primário",
  nominal_interest: "Juros nominais",
  primary_deficit_central: "Resultado primário do governo central",
  primary_deficit_regional: "Resultado primário de estados e municípios",
  primary_deficit_state_owned: "Resultado primário das estatais",
  nominal_interest_central: "Juros nominais do governo central",
  nominal_interest_regional: "Juros nominais de estados e municípios",
  nominal_interest_state_owned: "Juros nominais das estatais",
  net_debt: "Dívida líquida",
  net_debt_brl: "Dívida líquida em reais",
  gross_debt: "Dívida bruta",
  gdp_12m: "PIB de 12 meses em reais",
  federal_debt_maturity: "Prazo médio da dívida federal",
  gdp_growth_4q: "PIB em 4 trimestres",
  ibc_br: "IBC-Br",
  unemployment_rate: "Taxa de desocupação",
  credit_cost: "Custo do crédito",
  concessions_business: "Concessões a empresas",
  concessions_households: "Concessões a famílias",
};

export const datasetLabels: Record<Dataset, string> = {
  federal_debt_stock: "Estoque da dívida federal",
  focus_expectations: "Pesquisa Focus",
  copom_meetings: "Calendário do Copom",
  imf_countries: "Dívida e inflação dos países (FMI)",
};
