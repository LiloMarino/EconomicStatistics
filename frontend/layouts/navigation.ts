import { ChartColumn, type LucideIcon, ShoppingCart } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

// Paths em inglês acompanham o código; o rótulo é o que aparece pro usuário
export const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Inflação",
    items: [
      { to: "/inflation", label: "Por categoria", icon: ChartColumn },
      { to: "/purchasing-power", label: "Poder de compra", icon: ShoppingCart },
    ],
  },
];

/** O item fica ativo na tela dele e nos detalhes abaixo dela. */
export function isActive(to: string, pathname: string): boolean {
  return pathname === to || pathname.startsWith(`${to}/`);
}
