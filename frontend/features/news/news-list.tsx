import { Link } from "react-router-dom";

import { type ScreenNews, newsByScreen } from "@/features/news/news-by-screen";
import { useMarkSeen } from "@/features/news/use-mark-seen";
import { Button } from "@/shared/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { type SeriesNews, useNews } from "@/shared/hooks/use-news";
import { formatDay, formatMonth, formatQuarter } from "@/shared/lib/format";
import { type Dataset, datasetLabels, seriesLabels } from "@/shared/lib/series-labels";

const formatYear = (value: string) => value.slice(0, 4);

const periodFormats: Record<SeriesNews["periodicity"], (value: string) => string> = {
  daily: formatDay,
  business_daily: formatDay,
  monthly: formatMonth,
  quarterly: formatQuarter,
  annual: formatYear,
};

const datasetFormats: Record<Dataset, (value: string) => string> = {
  focus_expectations: (value) => `pesquisa de ${formatDay(value)}`,
  federal_debt_stock: formatMonth,
  copom_meetings: formatDay,
  imf_countries: formatYear,
  inflation_tolerance: formatYear,
};

function Arrival({ label, last, seen }: { label: string; last: string; seen: string }) {
  return (
    <li>
      <strong className="font-semibold">{label}</strong>: agora vai até{" "}
      <strong className="font-semibold">{last}</strong>{" "}
      <span className="text-muted-foreground">(antes ia até {seen})</span>
    </li>
  );
}

function ScreenCard({ screen, series, datasets }: ScreenNews) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{screen.label}</CardTitle>
        <CardAction>
          <Link to={screen.to} className="text-caption font-semibold whitespace-nowrap">
            Ver em {screen.label} →
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-1.5">
          {series.map((item) => (
            <Arrival
              key={item.series_id}
              label={seriesLabels[item.series_id]}
              last={periodFormats[item.periodicity](item.last_ref_date)}
              seen={periodFormats[item.periodicity](item.seen_until)}
            />
          ))}
          {datasets.map((item) => (
            <Arrival
              key={item.dataset}
              label={datasetLabels[item.dataset]}
              last={datasetFormats[item.dataset](item.last_date)}
              seen={datasetFormats[item.dataset](item.seen_until)}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/** O que chegou desde a última visita, uma tela por cartão. Abrir a tela marca o que é
dela como visto. */
export function NewsList() {
  const { data } = useNews();
  const { mutate: markSeen, isPending } = useMarkSeen();
  if (!data) return null;

  const screens = newsByScreen(data);
  if (screens.length === 0) {
    return <p className="text-muted-foreground">Nada novo desde a última visita.</p>;
  }

  return (
    <section aria-labelledby="news" className="flex flex-col gap-3.5">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="news" className="font-heading text-section-title">
          Novidades
        </h2>
        <Button
          variant="pill"
          size="sm"
          disabled={isPending}
          onClick={() =>
            markSeen({
              series: data.series.map((item) => item.series_id),
              datasets: data.datasets.map((item) => item.dataset),
            })
          }
        >
          Marcar tudo como visto
        </Button>
      </div>

      {/* Uma tela por cartão */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-3">
        {screens.map((item) => (
          <ScreenCard key={item.screen.to} {...item} />
        ))}
      </div>
    </section>
  );
}
