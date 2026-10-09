import { BookOpen } from "lucide-react";
import { Area, CartesianGrid, ComposedChart, Line, ReferenceDot, XAxis, YAxis } from "recharts";

import type { Credit } from "@/features/credit/use-credit";
import { ChartLegend } from "@/shared/components/chart-legend";
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
  formatPoints,
  formatShortMonth,
} from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

type Cost = Credit["cost"];
type CostMonth = Cost["months"][number];

const chartConfig = {
  cost: { label: "Custo do crédito (ICC)", color: "var(--credit-cost)" },
  selic: { label: "Selic meta", color: "var(--indexer-selic)" },
} satisfies ChartConfig;

const seriesNames = new Map<string, string>(
  Object.entries(chartConfig).map(([key, item]) => [key, item.label]),
);

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

// O eixo x leva um rótulo a cada 4 meses, contados do último
const TICK_EVERY = 4;

function HowToRead({ cost }: { cost: Cost }) {
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="Custo do crédito" concept="credit-cost" color="var(--credit-cost)">
        <p>
          O que os bancos cobram, em média, por ano, de todo o crédito em aberto. Como pesa o que já
          foi emprestado, a linha anda devagar.
        </p>
      </TrayItem>
      <TrayItem title="Selic meta" concept="selic" color="var(--indexer-selic)">
        <p>
          A taxa básica de juros, no fim de cada mês. É o começo da conta do banco, e a linha anda
          em degraus porque só muda nas reuniões do Copom.
        </p>
      </TrayItem>
      <TrayItem title="O spread é a distância" concept="credit-spread">
        <p>
          A faixa sombreada entre as duas linhas é o spread: risco de calote, impostos, custos e
          lucro dos bancos. Hoje a diferença é de {formatPoints(cost.spread)}. Por isso cortar a
          Selic não derruba o juro do crédito na mesma proporção.
        </p>
      </TrayItem>
    </div>
  );
}

interface Row {
  ref_date: string;
  cost: number;
  selic: number;
  gapFloor: number;
  gapSize: number;
}

function buildRows(months: CostMonth[]): Row[] {
  return months.map((month) => ({
    ref_date: month.ref_date,
    cost: month.cost,
    selic: month.selic,
    gapFloor: Math.min(month.cost, month.selic),
    gapSize: Math.abs(month.cost - month.selic),
  }));
}

function valueLabel(rate: number, position: "top" | "bottom") {
  return {
    value: formatPercent(rate),
    position,
    offset: 12,
    fill: "var(--foreground)",
    fontSize: 15,
    fontWeight: 700,
  };
}

/** O custo do crédito e a Selic meta de fim de mês nos últimos 24 meses, com o spread
entre as duas. */
export function CostChart({ cost }: { cost: Cost }) {
  const rows = buildRows(cost.months);
  const first = rows.at(0);
  const last = rows.at(-1);
  if (!first || !last) return null;
  const values = rows.flatMap((row) => [row.cost, row.selic]);
  const ticks = niceTicks(0, Math.max(...values), 4);
  const monthTicks = rows
    .filter((_, index) => (rows.length - 1 - index) % TICK_EVERY === 0)
    .map((row) => row.ref_date);

  return (
    <ExplainedCard
      title="Quanto custa o crédito"
      subtitle={`ICC e Selic, % ao ano · a faixa entre as duas é o spread · ${formatMonthRange(first.ref_date, last.ref_date)}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead cost={cost} />,
      }}
    >
      <div className="flex flex-col gap-2">
        <ChartLegend
          entries={[
            {
              key: "cost",
              label: "Custo do crédito (ICC)",
              color: "var(--credit-cost)",
              shape: "line",
            },
            { key: "selic", label: "Selic meta", color: "var(--indexer-selic)", shape: "line" },
            { key: "gap", label: "Spread", color: "var(--ink-2)", shape: "square" },
          ]}
        />
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <ComposedChart data={rows} margin={{ left: 0, right: 40, top: 28, bottom: 4 }}>
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
              width={48}
              tickFormatter={(value: number) => axisPercent.format(value)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const month: unknown = payload[0]?.payload?.ref_date;
                    return typeof month === "string" ? formatMonth(month) : null;
                  }}
                  formatter={(value, name) => (
                    <span className="flex w-full items-center justify-between gap-4">
                      {seriesNames.get(String(name))}
                      <span className="tabular-nums">
                        {typeof value === "number" ? formatPercent(value) : ""}
                      </span>
                    </span>
                  )}
                  filterNull
                />
              }
            />
            <Area
              dataKey="gapFloor"
              stackId="gap"
              type="stepAfter"
              stroke="none"
              fill="none"
              tooltipType="none"
              isAnimationActive={false}
            />
            <Area
              dataKey="gapSize"
              stackId="gap"
              type="stepAfter"
              stroke="none"
              fill="var(--ink-2)"
              fillOpacity={0.14}
              tooltipType="none"
              isAnimationActive={false}
            />
            <Line
              dataKey="cost"
              stroke="var(--color-cost)"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="selic"
              type="stepAfter"
              stroke="var(--color-selic)"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
            <ReferenceDot
              x={last.ref_date}
              y={last.cost}
              r={6}
              fill="var(--highlight)"
              stroke="var(--credit-cost)"
              strokeWidth={2.5}
              label={valueLabel(last.cost, "top")}
            />
            <ReferenceDot
              x={last.ref_date}
              y={last.selic}
              r={6}
              fill="var(--highlight)"
              stroke="var(--indexer-selic)"
              strokeWidth={2.5}
              label={valueLabel(last.selic, "bottom")}
            />
          </ComposedChart>
        </ChartContainer>
      </div>
    </ExplainedCard>
  );
}
