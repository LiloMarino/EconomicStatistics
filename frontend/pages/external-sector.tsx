import { CircleAlert } from "lucide-react";

import { DollarChart } from "@/features/external-sector/dollar-chart";
import { FlowsChart } from "@/features/external-sector/flows-chart";
import { PositionChart } from "@/features/external-sector/position-chart";
import { ReservesChart } from "@/features/external-sector/reserves-chart";
import { SummaryCards } from "@/features/external-sector/summary-cards";
import { useExternalSector } from "@/features/external-sector/use-external-sector";
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

export function ExternalSectorPage() {
  const { data, isPending, error } = useExternalSector();

  return (
    <>
      <PageHeader
        title="Setor externo"
        description="De onde vem o preço do dólar e se o país depende de dinheiro que foge rápido"
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
          <DollarChart dollar={data.dollar} />
          <FlowsChart flows={data.flows} />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] gap-4">
            <ReservesChart reserves={data.reserves} />
            <PositionChart position={data.position} />
          </div>
          <footer className="text-caption text-muted-foreground border-t pt-5">
            Fonte: Banco Central, séries do SGS 3698 (dólar, média mensal da PTAX), 23079 e 23080
            (transações correntes e investimento direto no país em % do PIB), 3546 (reservas
            internacionais), 4192 (PIB de 12 meses em dólar), 24011 e 24040 (ativos e passivos da
            posição internacional de investimento).
          </footer>
        </>
      )}
    </>
  );
}
