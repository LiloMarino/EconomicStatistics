import { BookOpen } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { ExternalSector } from "@/features/external-sector/use-external-sector";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import {
  formatMonth,
  formatMonthRange,
  formatPercent,
  formatUsdBillions,
} from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

type Reserves = ExternalSector["reserves"];

const chartConfig = {
  value: { label: "Reservas internacionais", color: "var(--trend-down)" },
} satisfies ChartConfig;

const axisBillions = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

// Rótulo do eixo x em janeiro, a cada 3 anos
const YEARS_BETWEEN_TICKS = 3;

function HowToRead({ reserves }: { reserves: Reserves }) {
  const share = reserves.gdp_share;
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="Para que servem" concept="international-reserves">
        <p>
          Numa fuga de dólares, o Banco Central vende reservas para segurar o câmbio. Como são
          dólares, quando o dólar sobe elas passam a valer mais reais, e isso alivia a dívida
          líquida do setor público.
        </p>
      </TrayItem>
      {share && (
        <TrayItem title="Do tamanho de quê" concept="share-of-gdp">
          <p>
            Em {formatMonth(share.ref_date)}, as reservas equivaliam a{" "}
            <strong>{formatPercent(share.share)}</strong> de tudo o que o país produziu em 12 meses,
            medido em dólar.
          </p>
        </TrayItem>
      )}
    </div>
  );
}

/** O estoque de reservas no fim de cada mês, nos últimos 10 anos. */
export function ReservesChart({ reserves }: { reserves: Reserves }) {
  const months = reserves.months;
  const first = months.at(0);
  const last = months.at(-1);
  if (!first || !last) return null;
  const values = months.map((month) => month.value);
  const ticks = niceTicks(Math.min(...values), Math.max(...values), 3);
  const lastYear = Number(last.ref_date.slice(0, 4));
  const yearTicks = months
    .filter(
      (month) =>
        month.ref_date.slice(5, 7) === "01" &&
        (lastYear - Number(month.ref_date.slice(0, 4))) % YEARS_BETWEEN_TICKS === 0,
    )
    .map((month) => month.ref_date);

  return (
    <ExplainedCard
      title="O colchão"
      subtitle={`Reservas internacionais, US$ bilhões · ${formatMonthRange(first.ref_date, last.ref_date)}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead reserves={reserves} />,
      }}
    >
      <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
        <LineChart data={months} margin={{ left: 0, right: 16, top: 16, bottom: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="ref_date"
            ticks={yearTicks}
            tickLine={false}
            axisLine={false}
            interval={0}
            tickFormatter={(month: string) => month.slice(0, 4)}
          />
          <YAxis
            domain={[ticks.at(0) ?? 0, ticks.at(-1) ?? 1]}
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            width={84}
            tickFormatter={(value: number) => `US$ ${axisBillions.format(value / 1000)} bi`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const month: unknown = payload[0]?.payload?.ref_date;
                  return typeof month === "string" ? formatMonth(month) : null;
                }}
                formatter={(value) => (
                  <span className="flex w-full items-center justify-between gap-4">
                    Reservas
                    <span className="tabular-nums">
                      {typeof value === "number" ? formatUsdBillions(value) : ""}
                    </span>
                  </span>
                )}
              />
            }
          />
          <Line
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </ExplainedCard>
  );
}
