import { type LucideIcon, MoveRight, TrendingDown, TrendingUp } from "lucide-react";

import type { Activity } from "@/features/activity/use-activity";
import type { StatTone } from "@/shared/components/stat-card";

type Verdict = Activity["ibc"]["verdict"];

/** Como cada veredito do ritmo do crescimento aparece: crescer mais depressa é a
direção boa, e crescer mais devagar pede atenção. */
export const growthPaceLook: Record<Verdict, { label: string; icon: LucideIcon; tone: StatTone }> =
  {
    accelerating: { label: "Acelerando", icon: TrendingUp, tone: "ok" },
    steady: { label: "Estável", icon: MoveRight, tone: "default" },
    slowing: { label: "Freando", icon: TrendingDown, tone: "caution" },
  };
