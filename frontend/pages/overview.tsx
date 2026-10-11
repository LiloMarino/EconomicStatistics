import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

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
import { cn } from "@/shared/lib/utils";

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
      <Button
        variant="pill"
        size="sm"
        disabled={isPending}
        onClick={() =>
          refresh(undefined, {
            // O clique pede retorno: o que chegou de novo, ou que estava tudo em dia
            onSuccess: ({ updated, datasets_updated, failed, datasets_failed }) => {
              const fresh = updated.length + datasets_updated.length;
              if (failed.length + datasets_failed.length > 0) return;
              toast.success(
                fresh > 0
                  ? `Dados atualizados: ${fresh} ${fresh === 1 ? "fonte trouxe" : "fontes trouxeram"} número novo.`
                  : "Tudo em dia: nenhuma fonte tinha número novo.",
              );
            },
          })
        }
      >
        <RefreshCw className={isPending ? "animate-spin" : undefined} />
        {isPending ? "Atualizando…" : "Atualizar dados"}
      </Button>
    </div>
  );
}

// Na tela larga, cada bloco fecha as linhas: até 4 cartões numa linha só, e 5 em 3 + 2,
// numa grade de 6 colunas em que a 2ª linha alarga os cartões
const blockGrid: Record<number, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-6",
};

function cardSpan(index: number, total: number): string | undefined {
  if (total !== 5) return undefined;
  return index < 3 ? "xl:col-span-2" : "xl:col-span-3";
}

function BlockSection({ block, data }: { block: (typeof blocks)[number]; data: Overview }) {
  const indicators = data.indicators.filter(
    (item) => indicatorConfig[item.indicator].block === block.id,
  );
  // O resultado do governo ocupa dois lugares da grade do bloco fiscal
  const slots = indicators.length + (block.id === "fiscal" ? 2 : 0);

  return (
    <section aria-labelledby={`block-${block.id}`} className="flex flex-col gap-3.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`block-${block.id}`} className="font-heading text-section-title">
          {block.title}
        </h2>
        <span className="text-muted-foreground">{block.subtitle}</span>
      </div>
      <div
        className={cn(
          "grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] items-start gap-3",
          blockGrid[slots],
        )}
      >
        {indicators.map((item, index) => (
          <div key={item.indicator} className={cn("min-w-0", cardSpan(index, slots))}>
            <IndicatorCard data={item} />
          </div>
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
        fiscais, setor externo, crédito e IF.data). Cada cartão abre a tela do assunto.
      </footer>
    </>
  );
}
