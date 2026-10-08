import { type LucideIcon, MoveRight, TrendingDown, TrendingUp } from "lucide-react";

import type { InflationPace } from "@/shared/hooks/use-inflation-pace";
import type { StatTone } from "@/shared/components/stat-card";

type Verdict = InflationPace["verdict"];

/** Como cada veredito do ritmo aparece: o nome, a seta e a cor. */
export const verdictLook: Record<
  Verdict,
  { label: string; icon: LucideIcon; tone: StatTone; color: string }
> = {
  accelerating: {
    label: "Acelerando",
    icon: TrendingUp,
    tone: "up",
    color: "var(--trend-up)",
  },
  steady: { label: "Estável", icon: MoveRight, tone: "default", color: "var(--foreground)" },
  slowing: {
    label: "Freando",
    icon: TrendingDown,
    tone: "down",
    color: "var(--trend-down)",
  },
};
