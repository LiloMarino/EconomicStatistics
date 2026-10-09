import type { OverviewIndicator } from "@/features/overview/use-overview";
import type { ConceptId } from "@/shared/concepts/concept";
import {
  formatDay,
  formatMoney,
  formatMonth,
  formatPercent,
  formatQuarter,
  formatSignedPercent,
  formatUsdBillions,
} from "@/shared/lib/format";

export const blocks = [
  {
    id: "monetary",
    title: "Inflação e juros",
    subtitle: "O preço das coisas e o preço do dinheiro",
  },
  {
    id: "fiscal",
    title: "Contas públicas",
    subtitle: "Quanto o governo deve e se gasta mais do que arrecada",
  },
  { id: "activity", title: "Atividade", subtitle: "Se a economia cresce e se há emprego" },
  {
    id: "external",
    title: "Setor externo",
    subtitle: "O dólar e o dinheiro que entra e sai do país",
  },
  { id: "credit", title: "Crédito", subtitle: "Quanto custa e quanto se empresta" },
] as const;

export type BlockId = (typeof blocks)[number]["id"];

export const valueFormats = {
  percent: formatPercent,
  growth: formatSignedPercent,
  money: formatMoney,
  usd: formatUsdBillions,
};

export const periodFormats = {
  month: formatMonth,
  quarter: formatQuarter,
  day: formatDay,
};

interface IndicatorConfig {
  block: BlockId;
  title: string;
  /** O conceito do catálogo que o "?" do cartão explica. */
  concept: ConceptId;
  format: keyof typeof valueFormats;
  /** Como a data do último dado se escreve. */
  period: keyof typeof periodFormats;
  /** O que o número é, ao lado dele: a unidade ou a janela. */
  unit: string | ((refDate: string) => string);
  source: string;
  /** A tela temática que o cartão abre. */
  to: string;
}

// O Record obriga a existir conceito, fonte e tela para cada indicador do backend
export const indicatorConfig: Record<OverviewIndicator, IndicatorConfig> = {
  ipca_12m: {
    block: "monetary",
    title: "IPCA em 12 meses",
    concept: "rolling-12m",
    format: "percent",
    period: "month",
    unit: "",
    source: "IBGE",
    to: "/inflation",
  },
  expected_ipca: {
    block: "monetary",
    title: "Inflação esperada",
    concept: "focus-survey",
    format: "percent",
    period: "day",
    unit: (refDate) => `mediana do Focus para ${refDate.slice(0, 4)}`,
    source: "Focus",
    to: "/focus",
  },
  selic: {
    block: "monetary",
    title: "Selic",
    concept: "selic",
    format: "percent",
    period: "day",
    unit: "ao ano",
    source: "Banco Central",
    to: "/interest",
  },
  real_rate: {
    block: "monetary",
    title: "Juro real",
    concept: "real-rate",
    format: "percent",
    period: "day",
    unit: "ao ano",
    source: "Banco Central e Focus",
    to: "/interest",
  },
  net_debt: {
    block: "fiscal",
    title: "Dívida líquida",
    concept: "net-debt",
    format: "percent",
    period: "month",
    unit: "do PIB",
    source: "Banco Central",
    to: "/debt",
  },
  gross_debt: {
    block: "fiscal",
    title: "Dívida bruta",
    concept: "gross-debt",
    format: "percent",
    period: "month",
    unit: "do PIB",
    source: "Banco Central",
    to: "/debt",
  },
  ibc_br: {
    block: "activity",
    title: "IBC-Br",
    concept: "ibc-br",
    format: "growth",
    period: "month",
    unit: "em 12 meses",
    source: "Banco Central",
    to: "/activity",
  },
  gdp: {
    block: "activity",
    title: "PIB",
    concept: "gdp",
    format: "growth",
    period: "quarter",
    unit: "em 4 trimestres",
    source: "IBGE",
    to: "/activity",
  },
  unemployment: {
    block: "activity",
    title: "Desemprego",
    concept: "unemployment-rate",
    format: "percent",
    period: "month",
    unit: "trimestre móvel",
    source: "IBGE",
    to: "/activity",
  },
  dollar: {
    block: "external",
    title: "Dólar",
    concept: "exchange-rate",
    format: "money",
    period: "month",
    unit: "no fim do mês",
    source: "Banco Central",
    to: "/external-sector",
  },
  reserves: {
    block: "external",
    title: "Reservas",
    concept: "international-reserves",
    format: "usd",
    period: "month",
    unit: "no fim do mês",
    source: "Banco Central",
    to: "/external-sector",
  },
  current_account: {
    block: "external",
    title: "Transações correntes",
    concept: "current-account",
    format: "percent",
    period: "month",
    unit: "do PIB em 12 meses",
    source: "Banco Central",
    to: "/external-sector",
  },
  fdi: {
    block: "external",
    title: "Investimento direto",
    concept: "fdi",
    format: "percent",
    period: "month",
    unit: "do PIB em 12 meses",
    source: "Banco Central",
    to: "/external-sector",
  },
  international_position: {
    block: "external",
    title: "Posição internacional",
    concept: "international-investment-position",
    format: "percent",
    period: "quarter",
    unit: "do PIB",
    source: "Banco Central",
    to: "/external-sector",
  },
  credit_cost: {
    block: "credit",
    title: "Custo do crédito",
    concept: "credit-cost",
    format: "percent",
    period: "month",
    unit: "ao ano (ICC)",
    source: "Banco Central",
    to: "/credit",
  },
  household_concessions: {
    block: "credit",
    title: "Concessões a famílias",
    concept: "credit-concessions",
    format: "growth",
    period: "month",
    unit: "em 12 meses, recursos livres",
    source: "Banco Central",
    to: "/credit",
  },
};
