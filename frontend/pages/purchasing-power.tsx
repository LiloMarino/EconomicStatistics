import { CircleAlert } from "lucide-react";

import { PurchasingPowerChart } from "@/features/purchasing-power/purchasing-power-chart";
import {
  referenceDescriptions,
  referenceLabels,
} from "@/features/purchasing-power/reference-labels";
import { ReferenceSelect } from "@/features/purchasing-power/reference-select";
import {
  type PurchasingPower,
  parseRaise,
  usePurchasingPower,
  useRaiseReference,
} from "@/features/purchasing-power/use-purchasing-power";
import { MonthRangeSelect } from "@/shared/components/month-range-select";
import { PageHeader } from "@/shared/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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
import { formatMonth, formatPercent } from "@/shared/lib/format";
import { seriesLabels } from "@/shared/lib/series-labels";

/** A frase de leitura: o reajuste do período, a maior perda e o maior ganho. */
function Summary({ data }: { data: PurchasingPower }) {
  const worst = data.groups[0];
  const best = data.groups.at(-1);
  return (
    <p className="text-body">
      Reajuste de <strong>{formatPercent(data.reference_raise)}</strong> entre{" "}
      {formatMonth(data.period.start)} e {formatMonth(data.period.end)} (
      {referenceLabels[data.reference]}).
      {worst && worst.change < 0 && (
        <>
          {" "}
          A maior perda foi em <strong>{seriesLabels[worst.series_id]}</strong>: o dinheiro passou a
          comprar <strong>{formatPercent(-worst.change)} a menos</strong>.
        </>
      )}
      {best && best.change > 0 && (
        <>
          {" "}
          O maior ganho foi em <strong>{seriesLabels[best.series_id]}</strong>:{" "}
          <strong>{formatPercent(best.change)} a mais</strong>.
        </>
      )}
    </p>
  );
}

export function PurchasingPowerPage() {
  const { range, setRange } = useMonthRange();
  const { reference, raiseText, update } = useRaiseReference();
  const customRaise = parseRaise(raiseText);
  const { data, isPending, error } = usePurchasingPower(range, reference, customRaise);
  const waitingForRaise = reference === "custom" && customRaise === undefined;

  return (
    <>
      <PageHeader
        title="Poder de compra por categoria"
        description="Se a renda subiu por um reajuste, em quais gastos o dinheiro passou a comprar mais e em quais passou a comprar menos. Nenhum órgão publica esta conta pronta: ela cruza a inflação de cada grupo do IPCA com o reajuste escolhido."
        actions={data && <MonthRangeSelect period={data.period} onChange={setRange} />}
      />

      {/* Referência de reajuste */}
      <div className="flex flex-col gap-1.5">
        <ReferenceSelect
          reference={reference}
          raiseText={raiseText}
          onReferenceChange={(next) => update({ reference: next })}
          onRaiseChange={(text) => update({ raiseText: text })}
        />
        <p className="text-caption text-muted-foreground max-w-3xl">
          {referenceDescriptions[reference]}
        </p>
      </div>

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
        <Card>
          <CardHeader>
            <CardTitle>Quanto o dinheiro compra de cada grupo</CardTitle>
            <CardDescription>
              Conta: (1 + reajuste) ÷ (1 + inflação do grupo) − 1. Exemplo: com reajuste de 5% e a
              comida subindo 9%, 1,05 ÷ 1,09 − 1 = −3,7%, ou seja, o mesmo salário compra 3,7% menos
              comida do que comprava no início do período. A conta divide em vez de subtrair, porque
              os percentuais se compõem.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Summary data={data} />
            <PurchasingPowerChart data={data} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
