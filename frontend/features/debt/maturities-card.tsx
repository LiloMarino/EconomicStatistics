import { BookOpen } from "lucide-react";

import type { FederalDebt } from "@/features/debt/use-debt";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { formatMonth, formatMonthRange, formatPercent } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

type Bucket = FederalDebt["maturities"][number];

/** "ago–dez/2026" no resto do ano, "2027" num ano, "2031–2035" na faixa de 5 anos e
"depois de 2035" na última. */
function bucketLabel(bucket: Bucket): string {
  const startYear = bucket.start.slice(0, 4);
  if (bucket.end === null) return `depois de ${Number(startYear) - 1}`;
  const endYear = bucket.end.slice(0, 4);
  if (startYear !== endYear) return `${startYear}–${endYear}`;
  return bucket.start.slice(5, 7) === "01"
    ? startYear
    : formatMonthRange(bucket.start, bucket.end, "–");
}

function HowToRead() {
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="Rolar a dívida" concept="rollover">
        <p>
          Quando um título vence, o Tesouro em geral emite outro para pagá-lo. Prazo curto obriga a
          rolar muito de uma vez, e é aí que a desconfiança do mercado vira crise: quem compra pede
          juro maior para continuar emprestando.
        </p>
      </TrayItem>
      <TrayItem title="Só o principal" concept="average-maturity">
        <p>
          As barras contam o valor de cada título na data em que ele vence. Os juros que os títulos
          pagam no meio do caminho ficam de fora, por isso o percentual do Tesouro para os próximos
          12 meses, que inclui esses juros, é um pouco maior.
        </p>
      </TrayItem>
    </div>
  );
}

/** A dívida federal em mercado por faixa de vencimento, a partir do mês do estoque. As
faixas que começam nos próximos 12 meses ficam em vermelho: é o que precisa ser rolado
primeiro. */
export function MaturitiesCard({ data }: { data: FederalDebt }) {
  const top = Math.max(...data.maturities.map((bucket) => bucket.share));

  return (
    <ExplainedCard
      title="Quanto vence e quando"
      subtitle={`% da dívida federal em mercado que vence em cada período · estoque de ${formatMonth(data.stock_month)}`}
      explain={{ label: "Como ler", icon: BookOpen, heading: "COMO LER", content: <HowToRead /> }}
    >
      <div className="flex max-w-3xl flex-col gap-3">
        <ChartLegend
          entries={[
            {
              key: "soon",
              label: "começa nos próximos 12 meses",
              color: "var(--trend-up)",
              shape: "square",
            },
            { key: "later", label: "mais tarde", color: "var(--trend-down)", shape: "square" },
          ]}
        />
        <ul className="flex flex-col gap-2.5">
          {data.maturities.map((bucket) => (
            <li
              key={bucket.start}
              className="text-small grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-3"
              style={{ "--width": `${(bucket.share / top) * 100}%` }}
            >
              <span className="text-muted-foreground">{bucketLabel(bucket)}</span>
              <span className="bg-chart-grid h-5 rounded-sm">
                <span
                  className={cn(
                    "block h-full w-(--width) rounded-sm",
                    bucket.within_12m ? "bg-trend-up" : "bg-trend-down",
                  )}
                />
              </span>
              <strong className="text-right tabular-nums">{formatPercent(bucket.share)}</strong>
            </li>
          ))}
        </ul>
      </div>
    </ExplainedCard>
  );
}
