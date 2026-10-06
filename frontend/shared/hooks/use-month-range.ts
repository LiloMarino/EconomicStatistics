import { useSearchParams } from "react-router-dom";

import { fromUrlMonth, toUrlMonth } from "@/shared/lib/months";

export interface MonthRange {
  start?: string;
  end?: string;
}

/** O período da tela mora na URL (`?start=2026-01&end=2026-08`). Sem ele, a API usa o
ano do último dado. */
export function useMonthRange() {
  const [searchParams, setSearchParams] = useSearchParams();
  const range: MonthRange = {
    start: fromUrlMonth(searchParams.get("start")),
    end: fromUrlMonth(searchParams.get("end")),
  };

  function setRange(next: Required<MonthRange>) {
    setSearchParams((params) => {
      params.set("start", toUrlMonth(next.start));
      params.set("end", toUrlMonth(next.end));
      return params;
    });
  }

  return { range, setRange };
}
