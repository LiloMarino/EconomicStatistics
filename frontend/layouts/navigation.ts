import {
  ChartColumn,
  ChartColumnStacked,
  Globe,
  GraduationCap,
  Landmark,
  type LucideIcon,
  ShoppingCart,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** O que a tela mostra, numa linha: o subtítulo do resultado na busca. */
  description: string;
  /** Termos que levam a esta tela na busca, além do rótulo. */
  keywords: string[];
}

// Paths em inglês acompanham o código; o rótulo é o que aparece pro usuário
export const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Inflação",
    items: [
      {
        to: "/inflation",
        label: "Por categoria",
        icon: ChartColumn,
        description: "IPCA por grupo, ritmo e mês a mês",
        keywords: ["inflação", "ipca", "grupo", "acumulado", "12 meses", "ritmo", "sazonalidade"],
      },
      {
        to: "/purchasing-power",
        label: "Poder de compra",
        icon: ShoppingCart,
        description: "Quanto um reajuste compra de cada grupo",
        keywords: ["salário mínimo", "reajuste", "inpc", "ipca", "salário"],
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
      },
    ],
  },
  {
    label: "Economia real e mundo",
    items: [
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
      },
    ],
  },
  {
    label: "Explorar",
    items: [
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
  return pathname === to || pathname.startsWith(`${to}/`);
}
