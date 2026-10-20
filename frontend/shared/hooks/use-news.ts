import { useQuery } from "@tanstack/react-query";

import { get } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { Dataset, SeriesId } from "@/shared/lib/series-labels";
import type { components } from "@/types/openapi.generated";

export type News = components["schemas"]["NewsDTO"];
export type SeriesNews = News["series"][number];
export type DatasetNews = News["datasets"][number];

/** As fontes de que um número é feito. */
export interface NewsSources {
  series?: SeriesId[];
  datasets?: Dataset[];
}

/** O que chegou desde a última visita à tela de cada fonte. */
export function useNews() {
  return useQuery({
    queryKey: queryKeys.news,
    queryFn: () => get("/api/news"),
  });
}

/** Se alguma das fontes tem período que você ainda não viu. */
export function useHasNews({ series = [], datasets = [] }: NewsSources): boolean {
  const { data } = useNews();
  if (!data) return false;
  return (
    data.series.some((item) => series.includes(item.series_id)) ||
    data.datasets.some((item) => datasets.includes(item.dataset))
  );
}
