import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

const tones = {
  default: "",
  up: "text-trend-up",
  down: "text-trend-down",
};

export type StatTone = keyof typeof tones;

interface StatCardProps {
  label: ReactNode;
  /** O "?" ao lado do rótulo. */
  hint?: ReactNode;
  value?: ReactNode;
  tone?: StatTone;
  /** A linha de apoio embaixo do número. */
  children?: ReactNode;
}

/** Um número do resumo da tela: rótulo, o número grande e a linha que o explica. */
export function StatCard({ label, hint, value, tone = "default", children }: StatCardProps) {
  return (
    <div className="bg-card flex min-w-0 flex-col gap-1.5 rounded-xl px-4.5 py-4">
      <div className="text-label text-muted-foreground flex items-center justify-between gap-2">
        <span>{label}</span>
        {hint}
      </div>
      {value !== undefined && (
        <span className={cn("font-heading text-kpi flex items-center gap-2.5", tones[tone])}>
          {value}
        </span>
      )}
      {children}
    </div>
  );
}
