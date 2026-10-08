import { CircleAlert } from "lucide-react";

import { SelicChart } from "@/features/interest/selic-chart";
import { SummaryCards } from "@/features/interest/summary-cards";
import { useInterest } from "@/features/interest/use-interest";
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

export function InterestPage() {
  const { data, isPending, error } = useInterest();

  return (
    <>
      <PageHeader
        title="Juros"
        description="Selic, Copom e juro real: o preço do dinheiro no país"
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
          <SelicChart data={data} />
          <footer className="text-caption text-muted-foreground border-t pt-5">
            Fonte: Banco Central, série 432 do SGS (meta Selic) e calendário de reuniões do Copom;
            IBGE, IPCA (tabela 7060 do SIDRA); a previsão e a inflação esperada para 12 meses vêm da
            pesquisa Focus.
          </footer>
        </>
      )}
    </>
  );
}
