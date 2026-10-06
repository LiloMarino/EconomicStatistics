import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import type { PurchasingPower } from "@/features/purchasing-power/use-purchasing-power";
import { ChartLegend } from "@/shared/components/chart-legend";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { formatPercent, formatSignedPercent } from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";
import { seriesLabels } from "@/shared/lib/series-labels";

const chartConfig = {
  change: { label: "Poder de compra", color: "var(--color-power-loss)" },
} satisfies ChartConfig;

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

/** Uma barra por grupo, da maior perda ao maior ganho: à esquerda do zero o dinheiro
reajustado compra menos daquele grupo; à direita, mais. */
export function PurchasingPowerChart({ data }: { data: PurchasingPower }) {
  const rows = data.groups.map((group) => ({
    label: seriesLabels[group.series_id],
    change: group.change,
    text: formatSignedPercent(group.change),
    inflation: formatPercent(group.inflation),
  }));
  const raise = formatPercent(data.reference_raise);
  // Eixo simétrico em torno do zero, com folga para o rótulo da barra mais longa
  const extent = Math.max(...rows.map((row) => Math.abs(row.change)), 0.01) * 1.15;
  const ticks = niceTicks(-extent, extent);

  return (
    <div className="flex flex-col gap-3">
      <ChartLegend
        entries={[
          {
            key: "loss",
            label: "Compra menos (perdeu poder de compra)",
            color: "var(--color-power-loss)",
            shape: "square",
          },
          {
            key: "gain",
            label: "Compra mais (ganhou poder de compra)",
            color: "var(--color-power-gain)",
            shape: "square",
          },
        ]}
      />
      <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
        <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 64 }}>
          <CartesianGrid horizontal={false} />
          <XAxis
            type="number"
            domain={[ticks[0] ?? -extent, ticks.at(-1) ?? extent]}
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => axisPercent.format(value)}
          />
          <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={170} />
          <ReferenceLine x={0} stroke="var(--border-strong)" />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideIndicator
                formatter={(_, __, item) => {
                  const text: unknown = item.payload?.text;
                  const inflation: unknown = item.payload?.inflation;
                  return (
                    <div className="flex flex-col gap-0.5">
                      <span>Inflação do grupo: {String(inflation)}</span>
                      <span>Reajuste: {raise}</span>
                      <span className="font-medium tabular-nums">
                        Poder de compra: {String(text)}
                      </span>
                    </div>
                  );
                }}
              />
            }
          />
          <Bar dataKey="change" radius={4} isAnimationActive={false}>
            {rows.map((row) => (
              <Cell
                key={row.label}
                fill={row.change < 0 ? "var(--color-power-loss)" : "var(--color-power-gain)"}
              />
            ))}
            <LabelList dataKey="text" position="right" className="fill-foreground" fontSize={12} />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
