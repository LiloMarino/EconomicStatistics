import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { InflationGroups } from "@/features/inflation/use-inflation-groups";
import { ChartLegend } from "@/shared/components/chart-legend";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { formatMonth, formatPercent } from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";
import { type SeriesId, seriesLabels } from "@/shared/lib/series-labels";

const chartConfig = {
  group: { label: "Grupo", color: "var(--chart-1)" },
  general: { label: "Índice geral", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
  signDisplay: "negative",
});

interface Row {
  month: string;
  group: number;
  general?: number;
  labels: { group: string; general?: string };
}

function Panel({
  seriesId,
  rows,
  ticks,
  floor,
}: {
  seriesId: SeriesId;
  rows: Row[];
  ticks: number[];
  floor: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-label">{seriesLabels[seriesId]}</h3>
      <ChartContainer config={chartConfig} className="aspect-auto h-36 w-full">
        <LineChart data={rows} margin={{ left: 0, right: 24, top: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            minTickGap={32}
            tickFormatter={(month: string) => formatMonth(month)}
          />
          <YAxis
            domain={[floor, ticks.at(-1) ?? 0.01]}
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={(value: number) => axisPercent.format(value)}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const month: unknown = payload[0]?.payload?.month;
                  return typeof month === "string" ? formatMonth(month) : null;
                }}
                formatter={(_, name, item) => {
                  const key = String(name);
                  const value: unknown = item.payload?.labels?.[key];
                  const label = key === "group" ? seriesLabels[seriesId] : "Índice geral";
                  return (
                    <span className="flex w-full items-center justify-between gap-4">
                      {label}
                      <span className="tabular-nums">{String(value)}</span>
                    </span>
                  );
                }}
              />
            }
          />
          <Line
            dataKey="general"
            stroke="var(--color-general)"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            dataKey="group"
            stroke="var(--color-group)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

/** Um painel por grupo, todos na mesma escala, com o índice geral tracejado ao
fundo: dá para comparar a altura das linhas entre os painéis. */
export function Rolling12mPanels({ data }: { data: InflationGroups }) {
  const general = new Map(
    data.rolling_12m
      .filter((item) => item.series_id === "ipca_general")
      .map((item) => [item.ref_date, item.rate]),
  );
  const groups = [...new Set(data.rolling_12m.map((item) => item.series_id))].filter(
    (seriesId) => seriesId !== "ipca_general",
  );
  if (groups.length === 0) {
    return (
      <p className="text-muted-foreground">
        Nenhum mês do período tem os 12 meses anteriores com dado. A série por grupo começa em
        jan/2020, então o primeiro acumulado de 12 meses é o de dez/2020.
      </p>
    );
  }
  const rates = data.rolling_12m.map((item) => item.rate);
  // A escala parte do zero; um 12 meses negativo aparece abaixo dele, sem tick próprio
  const ticks = niceTicks(0, Math.max(0.01, ...rates), 3);
  const floor = Math.min(0, ...rates);

  return (
    <div className="flex flex-col gap-3">
      <ChartLegend
        entries={[
          { key: "group", label: "Grupo", color: "var(--chart-1)", shape: "line" },
          {
            key: "general",
            label: "Índice geral",
            color: "var(--muted-foreground)",
            shape: "dashed",
          },
        ]}
      />
      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((seriesId) => (
          <Panel
            key={seriesId}
            seriesId={seriesId}
            ticks={ticks}
            floor={floor}
            rows={data.rolling_12m
              .filter((item) => item.series_id === seriesId)
              .map((item) => {
                const generalRate = general.get(item.ref_date);
                return {
                  month: item.ref_date,
                  group: item.rate,
                  general: generalRate,
                  labels: {
                    group: formatPercent(item.rate),
                    general: generalRate === undefined ? undefined : formatPercent(generalRate),
                  },
                };
              })}
          />
        ))}
      </div>
    </div>
  );
}
