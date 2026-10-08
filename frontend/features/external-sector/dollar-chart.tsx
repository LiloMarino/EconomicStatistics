import { BookOpen } from "lucide-react";
import { CartesianGrid, Line, LineChart, ReferenceDot, XAxis, YAxis } from "recharts";

import type { ExternalSector } from "@/features/external-sector/use-external-sector";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import {
  formatMoney,
  formatMonth,
  formatMonthRange,
  formatShortMonth,
  formatSignedPercent,
} from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

type Dollar = ExternalSector["dollar"];

const chartConfig = {
  value: { label: "Dólar, média do mês", color: "var(--foreground)" },
} satisfies ChartConfig;

// Rótulo do eixo x a cada 4 meses
const TICK_EVERY = 4;

function HowToRead({ dollar }: { dollar: Dollar }) {
  const last = dollar.months.at(-1);
  const yearBefore = dollar.months.at(-13);
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="O que cada ponto é" concept="ptax">
        <p>
          A média da PTAX nos dias úteis do mês: quantos reais compravam um dólar, pela taxa de
          referência que o Banco Central calcula todo dia.
        </p>
      </TrayItem>
      {last && yearBefore && dollar.change_12m !== null && (
        <TrayItem title="Em 12 meses">
          <p>
            Em {formatMonth(last.ref_date)}, o dólar saiu em média a{" "}
            <strong>{formatMoney(last.value)}</strong>, contra {formatMoney(yearBefore.value)} em{" "}
            {formatMonth(yearBefore.ref_date)}: {formatSignedPercent(dollar.change_12m)}.{" "}
            {dollar.change_12m < 0
              ? "Dólar mais barato barateia o que vem de fora, como eletrônicos e combustível."
              : "Dólar mais caro encarece o que vem de fora, como eletrônicos e combustível."}
          </p>
        </TrayItem>
      )}
      <TrayItem title="O que mexe no dólar" concept="exchange-rate">
        <p>
          Os juros daqui contra os de fora, o risco do país, o preço das commodities que o Brasil
          exporta e o humor do mundo. Quando a dívida pública preocupa, o dólar costuma ser o
          primeiro a subir.
        </p>
      </TrayItem>
    </div>
  );
}

/** A média mensal da PTAX nos 24 meses até o último dado. */
export function DollarChart({ dollar }: { dollar: Dollar }) {
  const months = dollar.months;
  const first = months.at(0);
  const last = months.at(-1);
  if (!first || !last) return null;
  const values = months.map((month) => month.value);
  const ticks = niceTicks(Math.min(...values), Math.max(...values), 4);
  const monthTicks = months
    .filter((_, index) => (months.length - 1 - index) % TICK_EVERY === 0)
    .map((month) => month.ref_date);

  return (
    <ExplainedCard
      title="O dólar"
      subtitle={`PTAX, média de cada mês · ${formatMonthRange(first.ref_date, last.ref_date)}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead dollar={dollar} />,
      }}
    >
      <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
        <LineChart data={months} margin={{ left: 0, right: 40, top: 28, bottom: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="ref_date"
            ticks={monthTicks}
            tickLine={false}
            axisLine={false}
            interval={0}
            tickFormatter={(month: string) => `${formatShortMonth(month)}/${month.slice(2, 4)}`}
          />
          <YAxis
            domain={[ticks.at(0) ?? 0, ticks.at(-1) ?? 1]}
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            width={64}
            tickFormatter={(value: number) => formatMoney(value)}
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
                    Dólar, média do mês
                    <span className="tabular-nums">
                      {typeof value === "number" ? formatMoney(value) : ""}
                    </span>
                  </span>
                )}
              />
            }
          />
          <Line
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
          <ReferenceDot
            x={last.ref_date}
            y={last.value}
            r={6}
            fill="var(--highlight)"
            stroke="var(--foreground)"
            strokeWidth={2.5}
            label={{
              value: formatMoney(last.value),
              position: "top",
              offset: 12,
              fill: "var(--foreground)",
              fontSize: 15,
              fontWeight: 700,
            }}
          />
        </LineChart>
      </ChartContainer>
    </ExplainedCard>
  );
}
