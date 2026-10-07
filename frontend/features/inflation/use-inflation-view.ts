import { useSearchParams } from "react-router-dom";

import { type IpcaSeriesId, isIpcaSeries } from "@/shared/lib/group-identity";

export const paceWindows = [1, 3, 6] as const;

export type PaceWindow = (typeof paceWindows)[number];

/** O que a tela de inflação está mostrando, além do período, mora na URL: a janela do
ritmo (`?pace=3`), o grupo da sazonalidade (`?season=`) e o da conta do acumulado
(`?calc=`). */
export function useInflationView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedWindow = Number(searchParams.get("pace"));
  const paceWindow: PaceWindow = paceWindows.find((item) => item === requestedWindow) ?? 3;
  const season = searchParams.get("season");
  const calc = searchParams.get("calc");

  function update(key: "pace" | "season" | "calc", value: string) {
    setSearchParams(
      (params) => {
        params.set(key, value);
        return params;
      },
      { preventScrollReset: true },
    );
  }

  return {
    paceWindow,
    seasonGroup: season && isIpcaSeries(season) ? season : undefined,
    calcGroup: calc && isIpcaSeries(calc) ? calc : undefined,
    setPaceWindow: (value: PaceWindow) => update("pace", String(value)),
    setSeasonGroup: (value: IpcaSeriesId) => update("season", value),
    setCalcGroup: (value: IpcaSeriesId) => update("calc", value),
  };
}
