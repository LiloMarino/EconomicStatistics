import { Bar, BarChart, CartesianGrid, LabelList, ReferenceLine, XAxis, YAxis } from "recharts";

import type { InflationGroups } from "@/features/inflation/use-inflation-groups";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { formatPercent } from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";
import { seriesLabels } from "@/shared/lib/series-labels";

const chartConfig = {
  rate: { label: "Acumulado no período", color: "var(--chart-1)" },
} satisfies ChartConfig;

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
  signDisplay: "negative",
});

/** Uma barra por grupo, da maior alta à menor, com o índice geral tracejado: o grupo
que passa da linha subiu mais que a média. */
export function AccumulatedChart({ data }: { data: InflationGroups }) {
  const general = data.accumulated.find((item) => item.series_id === "ipca_general");
  const rows = data.accumulated
    .filter((item) => item.series_id !== "ipca_general")
    .map((item) => ({
      label: seriesLabels[item.series_id],
      rate: item.rate,
      text: formatPercent(item.rate),
    }))
    .sort((a, b) => b.rate - a.rate);
  const rates = rows.map((row) => row.rate);
  const ticks = niceTicks(Math.min(0, ...rates), Math.max(0.01, ...rates) * 1.1, 5);

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
      <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 56, top: 20 }}>
        <CartesianGrid horizontal={false} />
        <XAxis
          type="number"
          domain={[ticks[0] ?? 0, ticks.at(-1) ?? 0.01]}
          ticks={ticks}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => axisPercent.format(value)}
        />
        <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={170} />
        <ReferenceLine x={0} stroke="var(--border-strong)" />
        {general && (
          <ReferenceLine
            x={general.rate}
            stroke="var(--muted-foreground)"
            strokeDasharray="5 4"
            strokeWidth={2}
            label={{
              value: `Índice geral ${formatPercent(general.rate)}`,
              position: "top",
              fill: "var(--muted-foreground)",
              fontSize: 12,
            }}
          />
        )}
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideIndicator
              formatter={(_, __, item) => {
                const text: unknown = item.payload?.text;
                return <span className="tabular-nums">{String(text)}</span>;
              }}
            />
          }
        />
        <Bar dataKey="rate" fill="var(--color-rate)" radius={4} isAnimationActive={false}>
          <LabelList dataKey="text" position="right" className="fill-foreground" fontSize={12} />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
