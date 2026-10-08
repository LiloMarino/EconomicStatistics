import { useSearchParams } from "react-router-dom";

import { isFocusIndicator } from "@/features/focus/focus-labels";
import type { FocusIndicator } from "@/features/focus/use-focus";

/** A previsão que a tela Focus acompanha mora na URL: o indicador (`?indicator=ipca`)
e o ano previsto (`?year=2026`). Sem ano, vale o da última pesquisa. */
export function useFocusView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("indicator") ?? "";
  const indicator: FocusIndicator = isFocusIndicator(requested) ? requested : "ipca";
  const year = Number(searchParams.get("year")) || undefined;

  function update(key: "indicator" | "year", value: string) {
    setSearchParams(
      (params) => {
        params.set(key, value);
        return params;
      },
      { preventScrollReset: true },
    );
  }

  return {
    indicator,
    year,
    setIndicator: (value: FocusIndicator) => update("indicator", value),
    setYear: (value: number) => update("year", String(value)),
  };
}
