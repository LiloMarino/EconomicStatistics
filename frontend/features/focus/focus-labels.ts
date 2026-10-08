import type { FocusIndicator, FocusUnit } from "@/features/focus/use-focus";
import { formatMoney, formatPercent, formatUsdBillions } from "@/shared/lib/format";

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
});
const axisNumber = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
const cellNumber = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const focusIndicatorLabels: Record<FocusIndicator, string> = {
  ipca: "IPCA",
  ipca_administered: "IPCA administrados",
  ipca_free: "IPCA livres",
  ipca_services: "IPCA serviços",
  ipca_industrial_goods: "IPCA bens industrializados",
  ipca_food_at_home: "IPCA alimentação no domicílio",
  exchange_rate: "Câmbio",
  igpm: "IGP-M",
  unemployment: "Taxa de desocupação",
  selic: "Selic",
  gdp: "PIB",
  gdp_agriculture: "PIB agropecuária",
  gdp_industry: "PIB indústria",
  gdp_services: "PIB serviços",
  gdp_household_consumption: "Consumo das famílias",
  gdp_government_consumption: "Consumo do governo",
  gdp_investment: "Investimento (FBCF)",
  gdp_exports: "Exportações (PIB)",
  gdp_imports: "Importações (PIB)",
  primary_balance: "Resultado primário",
  nominal_balance: "Resultado nominal",
  net_debt: "Dívida líquida",
  gross_debt: "Dívida bruta",
  current_account: "Conta corrente",
  trade_balance: "Balança comercial",
  exports: "Exportações",
  imports: "Importações",
  fdi: "Investimento direto no país",
};

/** O que o número de cada indicador é, como o relatório Focus escreve ao lado do nome. */
export const focusIndicatorUnits: Partial<Record<FocusIndicator, string>> = {
  ipca: "variação no ano",
  gdp: "crescimento sobre o ano anterior",
  exchange_rate: "R$ por US$, fim do ano",
  selic: "% ao ano, fim do ano",
  igpm: "variação no ano",
  ipca_administered: "variação no ano",
  current_account: "US$ bilhões",
  trade_balance: "US$ bilhões",
  fdi: "US$ bilhões",
  net_debt: "% do PIB",
  primary_balance: "% do PIB; negativo é déficit",
  nominal_balance: "% do PIB; negativo é déficit",
};

export function isFocusIndicator(value: string): value is FocusIndicator {
  return Object.keys(focusIndicatorLabels).includes(value);
}

/** O valor chega na convenção da API: taxa em fração, câmbio em R$/US$ e contas
externas em US$ bilhões. */
export function formatFocusValue(value: number, unit: FocusUnit): string {
  switch (unit) {
    case "brl_per_usd":
      return formatMoney(value);
    case "usd_billion":
      return formatUsdBillions(value * 1000);
    default:
      return formatPercent(value);
  }
}

/** O rótulo do eixo, sem casas que não mudam: 0.05 vira "5%", e 5.2 no câmbio vira
"5,2". */
export function formatAxisValue(value: number, unit: FocusUnit): string {
  const text =
    unit === "brl_per_usd" || unit === "usd_billion"
      ? axisNumber.format(value)
      : axisPercent.format(value);
  return text.replace("-", "−");
}

/** O valor na tabela, como o relatório: câmbio e contas externas sem o "R$" e o
"US$ bi", que ficam no rótulo da linha. */
export function formatFocusCell(value: number, unit: FocusUnit): string {
  if (unit === "brl_per_usd" || unit === "usd_billion") {
    return cellNumber.format(value).replace("-", "−");
  }
  return formatPercent(value);
}
