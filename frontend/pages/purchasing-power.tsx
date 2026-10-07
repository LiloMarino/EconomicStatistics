import { CircleAlert } from "lucide-react";

import { PurchasingPowerChart } from "@/features/purchasing-power/purchasing-power-chart";
import { ReferenceCards } from "@/features/purchasing-power/reference-cards";
import { SummaryCards } from "@/features/purchasing-power/summary-cards";
import {
  parseRaise,
  usePurchasingPower,
  useRaiseReference,
} from "@/features/purchasing-power/use-purchasing-power";
import { PageHeader } from "@/shared/components/page-header";
import { PeriodPicker } from "@/shared/components/period-picker";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useMonthRange } from "@/shared/hooks/use-month-range";
import { getApiErrorMessage } from "@/shared/lib/api";

export function PurchasingPowerPage() {
  const { mode, range, setRange } = useMonthRange();
  const { reference, raiseText, group, update } = useRaiseReference();
  const customRaise = parseRaise(raiseText);
  const { data, isPending, error } = usePurchasingPower(range, reference, customRaise);
  const waitingForRaise = reference === "custom" && customRaise === undefined;

  return (
    <>
      <PageHeader
        title="Poder de compra"
        description="Quanto um reajuste compra de cada grupo de gasto do IPCA"
        controls={data && <PeriodPicker period={data.period} mode={mode} onChange={setRange} />}
      />

      <ReferenceCards
        reference={reference}
        references={data?.references}
        raiseText={raiseText}
        onReferenceChange={(next) => update({ reference: next })}
        onRaiseChange={(text) => update({ raiseText: text })}
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
      ) : waitingForRaise ? (
        <p className="text-muted-foreground">Digite o reajuste para comparar.</p>
      ) : isPending ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <>
          <SummaryCards data={data} />
          <PurchasingPowerChart
            data={data}
            selected={group}
            onSelect={(next) => update({ group: next })}
          />
          <footer className="text-caption text-muted-foreground border-t pt-5">
            Fontes: IBGE, tabelas 655, 2938, 1419 e 7060 (IPCA por grupo de gasto, desde ago/1999);
            Banco Central, séries 188 (INPC) e 1619 (salário mínimo).
          </footer>
        </>
      )}
    </>
  );
}
