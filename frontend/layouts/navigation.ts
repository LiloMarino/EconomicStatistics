import {
  Activity,
  ChartColumn,
  ChartColumnStacked,
  CreditCard,
  Factory,
  Globe,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  type LucideIcon,
  Percent,
  ShoppingCart,
  SlidersHorizontal,
  Telescope,
} from "lucide-react";

import type { SeriesId } from "@/shared/lib/series-labels";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** O que a tela mostra, numa linha: o subtítulo do resultado na busca. */
  description: string;
  /** Termos que levam a esta tela na busca, além do rótulo. */
  keywords: string[];
  /** O pé da barra lateral com a tela aberta: a série que diz até quando há dado, com o
  nome curto dela, e quem publica. */
  footer?: { until?: { series: SeriesId; label: string }; sources: string };
}

/** O pé da barra lateral fora das telas de dado. */
export const defaultFooter: NonNullable<NavItem["footer"]> = {
  until: { series: "ipca_general", label: "IPCA" },
  sources: "IBGE e Banco Central",
};

// Paths em inglês acompanham o código; o rótulo é o que aparece pro usuário
export const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Painel",
    items: [
      {
        to: "/",
        label: "Visão geral",
        icon: LayoutDashboard,
        description: "Os indicadores de todas as telas, num cartão cada",
        keywords: ["painel", "resumo", "estatísticas", "indicadores", "início", "home"],
        footer: { sources: "IBGE e Banco Central" },
      },
    ],
  },
  {
    label: "Inflação",
    items: [
      {
        to: "/inflation",
        label: "Por categoria",
        icon: ChartColumn,
        description: "IPCA por grupo, ritmo e mês a mês",
        keywords: ["inflação", "ipca", "grupo", "acumulado", "12 meses", "ritmo", "sazonalidade"],
        footer: { until: { series: "ipca_general", label: "IPCA" }, sources: "IBGE" },
      },
      {
        to: "/purchasing-power",
        label: "Poder de compra",
        icon: ShoppingCart,
        description: "Quanto um reajuste compra de cada grupo",
        keywords: ["salário mínimo", "reajuste", "inpc", "ipca", "salário"],
        footer: {
          until: { series: "ipca_general", label: "IPCA" },
          sources: "IBGE e Banco Central",
        },
      },
    ],
  },
  {
    label: "Contas públicas",
    items: [
      {
        to: "/deficit",
        label: "Déficit",
        icon: ChartColumnStacked,
        description: "Primário, juros e nominal em % do PIB",
        keywords: [
          "déficit",
          "superávit",
          "primário",
          "juros",
          "nominal",
          "nfsp",
          "resultado fiscal",
        ],
        footer: {
          until: { series: "nominal_deficit", label: "Resultado fiscal" },
          sources: "Banco Central",
        },
      },
      {
        to: "/debt",
        label: "Dívida",
        icon: Landmark,
        description: "Dívida líquida e bruta, r − g e de que a dívida federal é feita",
        keywords: [
          "dívida pública",
          "dlsp",
          "dbgg",
          "r − g",
          "juro implícito",
          "dívida federal",
          "dpf",
          "prazo médio",
          "rolagem",
          "indexador",
        ],
        footer: {
          until: { series: "net_debt", label: "Dívida líquida" },
          sources: "Banco Central e Tesouro Nacional",
        },
      },
      {
        to: "/simulator",
        label: "Simulador da dívida",
        icon: SlidersHorizontal,
        description: "Juros, crescimento e primário: para onde vai a dívida em 10 anos",
        keywords: [
          "simulador",
          "trajetória da dívida",
          "r − g",
          "primário que estabiliza",
          "cenário",
          "japão",
          "grécia",
          "argentina",
          "crise",
          "sustentabilidade",
        ],
        footer: { sources: "Banco Central e FMI" },
      },
    ],
  },
  {
    label: "Economia real e mundo",
    items: [
      {
        to: "/activity",
        label: "Atividade",
        icon: Factory,
        description: "PIB, IBC-Br e desemprego",
        keywords: [
          "pib",
          "ibc-br",
          "desemprego",
          "desocupação",
          "pnad",
          "crescimento",
          "recessão",
          "atividade econômica",
        ],
        footer: {
          until: { series: "unemployment_rate", label: "Desemprego" },
          sources: "IBGE e Banco Central",
        },
      },
      {
        to: "/external-sector",
        label: "Setor externo",
        icon: Globe,
        description: "Dólar, transações correntes, IDP e reservas",
        keywords: [
          "dólar",
          "câmbio",
          "ptax",
          "reservas",
          "idp",
          "investimento direto",
          "transações correntes",
          "posição internacional",
        ],
        footer: {
          until: { series: "dollar_month_end", label: "Dólar" },
          sources: "Banco Central",
        },
      },
      {
        to: "/credit",
        label: "Crédito",
        icon: CreditCard,
        description: "Custo do crédito, spread e concessões",
        keywords: [
          "crédito",
          "icc",
          "custo do crédito",
          "spread",
          "concessões",
          "empréstimo",
          "financiamento",
          "juros do banco",
        ],
        footer: {
          until: { series: "credit_cost", label: "Custo do crédito" },
          sources: "Banco Central",
        },
      },
    ],
  },
  {
    label: "Juros e expectativas",
    items: [
      {
        to: "/interest",
        label: "Juros",
        icon: Percent,
        description: "Selic, Copom e juro real",
        keywords: ["selic", "copom", "juro real", "juros", "taxa básica", "juro neutro"],
        footer: {
          until: { series: "selic_target", label: "Selic" },
          sources: "Banco Central, pesquisa Focus",
        },
      },
      {
        to: "/focus",
        label: "Focus",
        icon: Telescope,
        description: "O que o mercado espera e como a previsão mudou",
        keywords: [
          "focus",
          "expectativas",
          "previsão",
          "mercado",
          "relatório de mercado",
          "projeção",
          "mediana",
        ],
        footer: { sources: "Banco Central, pesquisa Focus" },
      },
    ],
  },
  {
    label: "Explorar",
    items: [
      {
        to: "/economy-health",
        label: "Saúde da economia",
        icon: Activity,
        description:
          "Os sinais de crise: inflação contra a meta, primário e a referência dos demais",
        keywords: [
          "check engine",
          "semáforo",
          "crise",
          "sinais",
          "meta de inflação",
          "primário que estabiliza",
          "juro neutro",
          "nairu",
          "reservas",
        ],
        footer: { sources: "IBGE e Banco Central" },
      },
      {
        to: "/learn",
        label: "Aprender",
        icon: GraduationCap,
        description: "Glossário dos conceitos do app",
        keywords: ["conceitos", "glossário", "explicação"],
      },
    ],
  },
];

/** O item fica ativo na tela dele e nos detalhes abaixo dela. */
export function isActive(to: string, pathname: string): boolean {
  if (to === "/") return pathname === to;
  return pathname === to || pathname.startsWith(`${to}/`);
}
