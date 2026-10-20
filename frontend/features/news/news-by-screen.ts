import { datasetScreen, seriesScreen } from "@/features/news/screens";
import type { DatasetNews, News, SeriesNews } from "@/shared/hooks/use-news";
import { type NavItem, navGroups } from "@/shared/lib/navigation";

export interface ScreenNews {
  screen: NavItem;
  series: SeriesNews[];
  datasets: DatasetNews[];
}

/** As novidades agrupadas pela tela-casa de cada fonte, na ordem da barra lateral. */
export function newsByScreen(news: News): ScreenNews[] {
  return navGroups
    .flatMap((group) => group.items)
    .map((screen) => ({
      screen,
      series: news.series.filter((item) => seriesScreen[item.series_id] === screen.to),
      datasets: news.datasets.filter((item) => datasetScreen[item.dataset] === screen.to),
    }))
    .filter((item) => item.series.length + item.datasets.length > 0);
}
