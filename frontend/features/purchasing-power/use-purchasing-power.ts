import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import type { MonthRange } from "@/shared/hooks/use-month-range";
import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

export type PurchasingPower = components["schemas"]["PurchasingPowerDTO"];
export type RaiseReference = components["schemas"]["RaiseReference"];

export const raiseReferences: RaiseReference[] = ["ipca", "inpc", "minimum_wage", "custom"];

function isRaiseReference(value: string | null): value is RaiseReference {
  return raiseReferences.some((reference) => reference === value);
}

/** O reajuste digitado em %, aceitando vírgula ("6,5"): vira fração para a API. */
export function parseRaise(text: string): number | undefined {
  const value = Number(text.replace(",", "."));
  return text.trim() !== "" && Number.isFinite(value) ? value / 100 : undefined;
}

/** A referência e o reajuste digitado moram na URL (`?reference=custom&raise=6`). */
export function useRaiseReference() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("reference");
  const reference: RaiseReference = isRaiseReference(requested) ? requested : "ipca";
  const raiseText = searchParams.get("raise") ?? "";

  function update(next: { reference?: RaiseReference; raiseText?: string }) {
    setSearchParams((params) => {
      if (next.reference) params.set("reference", next.reference);
      if (next.raiseText !== undefined) params.set("raise", next.raiseText);
      return params;
    });
  }

  return { reference, raiseText, update };
}

export function usePurchasingPower(
  range: MonthRange,
  reference: RaiseReference,
  customRaise: number | undefined,
) {
  const query = { ...range, reference, custom_raise: customRaise };
  return useQuery({
    queryKey: [...queryKeys.purchasingPower, query],
    queryFn: () => get("/api/inflation/purchasing-power", { query }),
    // O reajuste digitado só vai para a API depois de virar número
    enabled: reference !== "custom" || customRaise !== undefined,
    placeholderData: keepPreviousData,
  });
}
