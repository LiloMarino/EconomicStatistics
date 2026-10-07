import {
  Car,
  ChartNoAxesCombined,
  GraduationCap,
  HeartPulse,
  House,
  type LucideIcon,
  Shirt,
  Smartphone,
  Sofa,
  Utensils,
  Wallet,
} from "lucide-react";

import type { SeriesId } from "@/shared/lib/series-labels";

export type IpcaSeriesId = Extract<SeriesId, `ipca_${string}`>;

/** Cada grupo do IPCA tem um ícone e uma cor que não mudam de tela para tela. A cor é
um token do `index.css`, igual nos dois temas. */
export const groupIdentity: Record<IpcaSeriesId, { icon: LucideIcon; color: string }> = {
  ipca_general: { icon: ChartNoAxesCombined, color: "var(--group-general)" },
  ipca_food: { icon: Utensils, color: "var(--group-food)" },
  ipca_housing: { icon: House, color: "var(--group-housing)" },
  ipca_household: { icon: Sofa, color: "var(--group-household)" },
  ipca_apparel: { icon: Shirt, color: "var(--group-apparel)" },
  ipca_transport: { icon: Car, color: "var(--group-transport)" },
  ipca_health: { icon: HeartPulse, color: "var(--group-health)" },
  ipca_personal: { icon: Wallet, color: "var(--group-personal)" },
  ipca_education: { icon: GraduationCap, color: "var(--group-education)" },
  ipca_communication: { icon: Smartphone, color: "var(--group-communication)" },
};

export const ipcaSeriesIds = Object.keys(groupIdentity).filter(isIpcaSeries);

export function isIpcaSeries(seriesId: string): seriesId is IpcaSeriesId {
  return seriesId in groupIdentity;
}
