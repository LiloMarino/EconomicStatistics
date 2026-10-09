import { RefreshCw } from "lucide-react";

import { GovernmentResultCard } from "@/features/overview/government-result-card";
import { IndicatorCard } from "@/features/overview/indicator-card";
import { blocks, indicatorConfig } from "@/features/overview/indicator-config";
import { type Overview, useOverview } from "@/features/overview/use-overview";
import { useRefreshSeries } from "@/features/series/use-refresh-series";
import { NoData } from "@/shared/components/no-data";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useSeriesStatus } from "@/shared/hooks/use-series-status";
import { formatDateTime } from "@/shared/lib/format";

/** A última vez que alguma fonte respondeu, na hora do computador. */
function useLastChecked() {
  const { data } = useSeriesStatus();
  return data
    ?.map((item) => item.succeeded_at)
    .filter((value) => value !== null)
    .toSorted()
    .at(-1);
}

function RefreshControl() {
  const lastChecked = useLastChecked();
  const { mutate: refresh, isPending } = useRefreshSeries();

  return (
    <div className="text-muted-foreground flex flex-wrap items-center gap-3">
      {lastChecked && <span>Verificado em {formatDateTime(lastChecked)}</span>}
      <Button variant="pill" size="sm" disabled={isPending} onClick={() => refresh()}>
        <RefreshCw className={isPending ? "animate-spin" : undefined} />
        Atualizar dados
      </Button>
    </div>
  );
}

function BlockSection({ block, data }: { block: (typeof blocks)[number]; data: Overview }) {
  const indicators = data.indicators.filter(
    (item) => indicatorConfig[item.indicator].block === block.id,
  );

  return (
    <section aria-labelledby={`block-${block.id}`} className="flex flex-col gap-3.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`block-${block.id}`} className="font-heading text-section-title">
          {block.title}
        </h2>
        <span className="text-muted-foreground">{block.subtitle}</span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
        {indicators.map((item) => (
          <IndicatorCard key={item.indicator} data={item} />
        ))}
        {block.id === "fiscal" && (
          <div className="min-w-0 md:col-span-2">
            <GovernmentResultCard data={data.government_result} />
          </div>
        )}
      </div>
    </section>
  );
}

/** Cada indicador das telas num cartão, agrupado por bloco, com a conta e a tela onde ele
se explica. */
export function OverviewPage() {
  const overview = useOverview();

  return (
    <>
      <PageHeader
        title="Visão geral"
        description="A página de estatísticas do Banco Central, com cada número explicado"
        controls={<RefreshControl />}
      />

      {overview.error ? (
        <NoData error={overview.error} />
      ) : overview.isPending ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        blocks.map((block) => <BlockSection key={block.id} block={block} data={overview.data} />)
      )}

      <footer className="text-caption text-muted-foreground border-t pt-5">
        Fontes: IBGE (IPCA, PIB e PNAD Contínua) e Banco Central (SGS, pesquisa Focus, estatísticas
        fiscais, setor externo e crédito). Cada cartão abre a tela do assunto.
      </footer>
    </>
  );
}
