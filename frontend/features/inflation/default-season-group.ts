import type { Seasonality } from "@/features/inflation/use-seasonality";
import { type IpcaSeriesId, ipcaSeriesIds } from "@/shared/lib/group-identity";

/** O grupo que a tela abre: o do maior desvio entre os grupos, fora o índice geral. */
export function defaultSeasonGroup(data: Seasonality): IpcaSeriesId {
  const sorted = data.groups
    .filter((group) => group.series_id !== "ipca_general")
    .toSorted(
      (a, b) =>
        Math.abs(b.largest_deviation?.difference ?? 0) -
        Math.abs(a.largest_deviation?.difference ?? 0),
    );
  return ipcaSeriesIds.find((id) => id === sorted[0]?.series_id) ?? "ipca_general";
}
