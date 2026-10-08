import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

const tones = {
  default: "",
  up: "text-trend-up",
  down: "text-trend-down",
  "fiscal-primary": "text-fiscal-primary",
  "fiscal-interest": "text-fiscal-interest",
};

export type StatTone = keyof typeof tones;

const sizes = {
  default: { card: "bg-card gap-1.5 px-4.5 py-4", value: "text-kpi" },
  /** Dentro de outro cartão: fundo tingido e número menor. */
  compact: { card: "bg-muted gap-1 px-4 py-3.5", value: "text-kpi-sm" },
};

interface StatCardProps {
  label: ReactNode;
  /** O "?" ao lado do rótulo. */
  hint?: ReactNode;
  value?: ReactNode;
  tone?: StatTone;
  size?: keyof typeof sizes;
  /** A linha de apoio embaixo do número. */
  children?: ReactNode;
}

/** Um número do resumo da tela: rótulo, o número grande e a linha que o explica. */
export function StatCard({
  label,
  hint,
  value,
  tone = "default",
  size = "default",
  children,
}: StatCardProps) {
  return (
    <div className={cn("flex min-w-0 flex-col rounded-xl", sizes[size].card)}>
      <div className="text-label text-muted-foreground flex items-center justify-between gap-2">
        <span>{label}</span>
        {hint}
      </div>
      {value !== undefined && (
        <span
          className={cn("font-heading flex items-center gap-2.5", sizes[size].value, tones[tone])}
        >
          {value}
        </span>
      )}
      {children}
    </div>
  );
}
