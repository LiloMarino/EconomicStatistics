import { CircleAlert } from "lucide-react";

import { GrowthChart } from "@/features/activity/growth-chart";
import { ShortTermChart } from "@/features/activity/short-term-chart";
import { SummaryCards } from "@/features/activity/summary-cards";
import { UnderutilizationCard } from "@/features/activity/underutilization-card";
import { UnemploymentChart } from "@/features/activity/unemployment-chart";
import { useActivity } from "@/features/activity/use-activity";
import { useShortTermView } from "@/features/activity/use-short-term-view";
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

export function ActivityPage() {
  const { data, isPending, error } = useActivity();
  const { step, setStep } = useShortTermView();

  return (
    <>
      <PageHeader title="Atividade" description="Quanto a economia produz e quanto emprega" />

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
          <GrowthChart gdp={data.gdp} ibc={data.ibc} />
          <ShortTermChart gdp={data.gdp} ibc={data.ibc} step={step} onStepChange={setStep} />
          <UnemploymentChart unemployment={data.unemployment} />
          <UnderutilizationCard underutilization={data.underutilization} />
          <footer className="text-caption text-muted-foreground border-t pt-5">
            Fonte: IBGE, Contas Nacionais Trimestrais (tabela 5932 do SIDRA, taxa acumulada em
            quatro trimestres e taxa contra o trimestre imediatamente anterior do PIB a preços de
            mercado); Banco Central, séries do SGS 24363 e 24364 (índice do IBC-Br sem e com ajuste
            sazonal) e 24369 (taxa de desocupação da PNAD Contínua, do IBGE); IBGE, PNAD Contínua
            (tabela 6441 do SIDRA, taxa composta de subutilização); a previsão vem da pesquisa
            Focus.
          </footer>
        </>
      )}
    </>
  );
}
