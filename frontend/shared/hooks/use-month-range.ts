import { useSearchParams } from "react-router-dom";

import { fromUrlMonth, toUrlMonth } from "@/shared/lib/months";

export const periodModes = ["month", "year", "12m", "previous", "custom"] as const;

export type PeriodMode = (typeof periodModes)[number];

export interface MonthRange {
  start?: string;
  end?: string;
}

function isPeriodMode(value: string | null): value is PeriodMode {
  return periodModes.some((mode) => mode === value);
}

/** O período da tela mora na URL (`?mode=custom&start=2026-01&end=2026-08`). Sem ele,
vale o ano atual, e a API usa o ano do último dado. */
export function useMonthRange() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("mode");
  const mode: PeriodMode = isPeriodMode(requested) ? requested : "year";
  const range: MonthRange = {
    start: fromUrlMonth(searchParams.get("start")),
    end: fromUrlMonth(searchParams.get("end")),
  };

  function setRange(next: { mode: PeriodMode; start: string; end: string }) {
    setSearchParams((params) => {
      params.set("mode", next.mode);
      params.set("start", toUrlMonth(next.start));
      params.set("end", toUrlMonth(next.end));
      return params;
    });
  }

  return { mode, range, setRange };
}
