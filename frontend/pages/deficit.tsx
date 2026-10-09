import { CircleAlert } from "lucide-react";

import { DeficitChart } from "@/features/deficit/deficit-chart";
import { FinancingChart } from "@/features/deficit/financing-chart";
import { FinancingDiagram } from "@/features/deficit/financing-diagram";
import { SpheresCard } from "@/features/deficit/spheres-card";
import { SummaryCards } from "@/features/deficit/summary-cards";
import { useDeficit } from "@/features/deficit/use-deficit";
import { useDeficitFinancing } from "@/features/deficit/use-deficit-financing";
import { useDeficitView } from "@/features/deficit/use-deficit-view";
import { NoData } from "@/shared/components/no-data";
import { PageHeader } from "@/shared/components/page-header";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useHashScroll } from "@/shared/hooks/use-hash-scroll";
import { getApiErrorMessage } from "@/shared/lib/api";

/** O resultado fiscal sai das séries da NFSP, e a seção de como o déficit é pago espera
também a carteira do Banco Central e a base monetária. */
export function DeficitPage() {
  const { data, isPending, error } = useDeficit();
  const financing = useDeficitFinancing();
  const { scale, setScale } = useDeficitView();
  // O link "Como o déficit é pago" chega a uma seção que só existe depois das duas consultas
  useHashScroll(isPending || financing.isPending);

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
          <section
            id="financing"
            aria-labelledby="financing-title"
            className="flex flex-col gap-3.5"
          >
            <h2 id="financing-title" className="font-heading text-section-title">
              Como o déficit é pago
            </h2>
            {financing.error ? (
              <NoData error={financing.error} />
            ) : financing.isPending ? (
              <Skeleton className="h-96 w-full" />
            ) : (
              <>
                <FinancingDiagram deficit={data.last} financing={financing.data} />
                <FinancingChart data={financing.data} />
              </>
            )}
          </section>
          <footer className="text-caption text-muted-foreground border-t pt-5">
            Fonte: Banco Central, estatísticas fiscais: necessidade de financiamento do setor
            público, sem desvalorização cambial, em % do PIB e acumulada em 12 meses. Séries do SGS
            5727 (nominal), 5793 (primário) e 5760 (juros nominais) do setor público consolidado;
            por esfera, primário e juros do governo central (5783 e 5750), de estados e municípios
            (5786 e 5753) e das estatais (5789 e 5756). A previsão vem da pesquisa Focus. Como o
            déficit é pago: títulos do Tesouro na carteira do Banco Central (4152), compromissadas
            (1832) e base monetária (1788), divididos pelo PIB de 12 meses (4382); a parte de todos
            os títulos federais na carteira do Banco Central vem do estoque da dívida pública
            federal do Tesouro.
          </footer>
        </>
      )}
    </>
  );
}
