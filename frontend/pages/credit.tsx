import { CircleAlert } from "lucide-react";

import { BaselChart } from "@/features/credit/basel-chart";
import { ConcessionsChart } from "@/features/credit/concessions-chart";
import { CostChart } from "@/features/credit/cost-chart";
import { SummaryCards } from "@/features/credit/summary-cards";
import { useCredit } from "@/features/credit/use-credit";
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

export function CreditPage() {
  const { data, isPending, error } = useCredit();

  return (
    <>
      <PageHeader
        title="Crédito"
        description="Quanto custa pegar dinheiro emprestado, quanto está sendo emprestado e se os bancos aguentam"
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
          <CostChart cost={data.cost} />
          <ConcessionsChart concessions={data.concessions} />
          <BaselChart basel={data.basel} />
          <footer className="text-caption text-muted-foreground border-t pt-5">
            Fonte: Banco Central, séries do SGS 25351 (indicador de custo do crédito), 20635
            (concessões de recursos livres a pessoas jurídicas), 20663 (concessões de recursos
            livres a pessoas físicas, não rotativo) e 432 (meta Selic); IF.data, relatório de
            informações de capital (patrimônio de referência e ativos ponderados pelo risco, somados
            sobre as instituições).
          </footer>
        </>
      )}
    </>
  );
}
