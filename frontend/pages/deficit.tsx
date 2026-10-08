import { CircleAlert } from "lucide-react";

import { DeficitChart } from "@/features/deficit/deficit-chart";
import { SpheresCard } from "@/features/deficit/spheres-card";
import { SummaryCards } from "@/features/deficit/summary-cards";
import { useDeficit } from "@/features/deficit/use-deficit";
import { useDeficitView } from "@/features/deficit/use-deficit-view";
import { PageHeader } from "@/shared/components/page-header";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getApiErrorMessage } from "@/shared/lib/api";

export function DeficitPage() {
  const { data, isPending, error } = useDeficit();
  const { scale, setScale } = useDeficitView();

  return (
    <>
      <PageHeader
        title="Déficit"
        description="Quanto o setor público gasta além do que arrecada, e quanto disso é juro"
      />

      {error ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CircleAlert />
            </EmptyMedia>
            <EmptyTitle>Sem dados para mostrar</EmptyTitle>
            <EmptyDescription>{getApiErrorMessage(error)}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : isPending ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <>
          <SummaryCards data={data} />
          <DeficitChart
            years={data.years}
            months={data.months}
            forecast={data.forecast}
            scale={scale}
            onScaleChange={setScale}
          />
          <SpheresCard spheres={data.spheres} last={data.last} />
          <footer className="text-caption text-muted-foreground border-t pt-5">
            Fonte: Banco Central, estatísticas fiscais: necessidade de financiamento do setor
            público, sem desvalorização cambial, em % do PIB e acumulada em 12 meses. Séries do SGS
            5727 (nominal), 5793 (primário) e 5760 (juros nominais) do setor público consolidado;
            por esfera, primário e juros do governo central (5783 e 5750), de estados e municípios
            (5786 e 5753) e das estatais (5789 e 5756). A previsão vem da pesquisa Focus.
          </footer>
        </>
      )}
    </>
  );
}
