import { CircleAlert } from "lucide-react";

import { GrowthChart } from "@/features/activity/growth-chart";
import { SummaryCards } from "@/features/activity/summary-cards";
import { UnemploymentChart } from "@/features/activity/unemployment-chart";
import { useActivity } from "@/features/activity/use-activity";
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
          <UnemploymentChart unemployment={data.unemployment} />
          <footer className="text-caption text-muted-foreground border-t pt-5">
            Fonte: IBGE, Contas Nacionais Trimestrais (tabela 5932 do SIDRA, taxa acumulada em
            quatro trimestres do PIB a preços de mercado); Banco Central, séries do SGS 24363
            (índice do IBC-Br) e 24369 (taxa de desocupação da PNAD Contínua, do IBGE); a previsão
            vem da pesquisa Focus.
          </footer>
        </>
      )}
    </>
  );
}
