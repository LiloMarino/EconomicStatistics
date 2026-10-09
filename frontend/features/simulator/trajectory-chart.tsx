import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { caseColor, scenarioColor } from "@/features/simulator/identity";
import type { DebtCase, DebtCaseId, Simulation } from "@/features/simulator/use-simulator";
import { ChartLegend } from "@/shared/components/chart-legend";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { formatPercent } from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

// A margem sobre o maior valor, para a linha não encostar no topo
const HEADROOM = 1.1;

/** A dívida/PIB de hoje até o fim do horizonte: a linha cheia é o cenário do usuário e as
tracejadas são os pontos de partida ligados. */
export function TrajectoryChart({
  simulation,
  cases,
  compared,
}: {
  simulation: Simulation;
  cases: DebtCase[];
  compared: DebtCaseId[];
}) {
  const shown = cases.filter((item) => compared.includes(item.id));
  const rows = simulation.path.map((value, year) => ({
    label: year === 0 ? "hoje" : `+${year}`,
    me: value,
    ...Object.fromEntries(shown.map((item) => [item.id, item.path[year] ?? null])),
  }));
  const values = [simulation.path, ...shown.map((item) => item.path)].flat();
  const ticks = niceTicks(Math.min(0, ...values), Math.max(...values) * HEADROOM, 5);
  const chartConfig = {
    me: { label: "Seu cenário", color: scenarioColor },
    ...Object.fromEntries(
      shown.map((item) => [item.id, { label: item.label, color: caseColor[item.id] }]),
    ),
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-2">
      <ChartLegend
        entries={[
          { key: "me", label: "Seu cenário", color: scenarioColor, shape: "line" },
          ...shown.map((item) => ({
            key: item.id,
            label: item.label,
            color: caseColor[item.id],
            shape: "dashed" as const,
          })),
        ]}
      />
      <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
        <LineChart data={rows} margin={{ left: 0, right: 24, top: 16, bottom: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis
            domain={[ticks.at(0) ?? 0, ticks.at(-1) ?? 1]}
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            width={52}
            tickFormatter={(value: number) => axisPercent.format(value)}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <span className="flex w-full items-center justify-between gap-4">
                    {Object.entries(chartConfig).find(([key]) => key === name)?.[1].label}
                    <span className="tabular-nums">
                      {typeof value === "number" ? formatPercent(value) : ""}
                    </span>
                  </span>
                )}
                filterNull
              />
            }
          />
          {shown.map((item) => (
            <Line
              key={item.id}
              dataKey={item.id}
              stroke={`var(--color-${item.id})`}
              strokeWidth={2.5}
              strokeDasharray="7 5"
              dot={false}
              isAnimationActive={false}
            />
          ))}
          <Line
            dataKey="me"
            stroke="var(--color-me)"
            strokeWidth={3.5}
            dot={{ r: 3.5, fill: "var(--color-me)" }}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
