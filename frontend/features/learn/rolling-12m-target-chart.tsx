import { CartesianGrid, Line, LineChart, ReferenceDot, XAxis, YAxis } from "recharts";

import { useInflationPace } from "@/shared/hooks/use-inflation-pace";
import { useSeriesStatus } from "@/shared/hooks/use-series-status";
import { ChartLegend } from "@/shared/components/chart-legend";
import { type ChartConfig, ChartContainer } from "@/shared/components/ui/chart";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  formatMonth,
  formatMonthRange,
  formatPercent,
  formatShortMonth,
} from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

const chartConfig = {
  rate: { label: "IPCA em 12 meses", color: "var(--foreground)" },
  target: { label: "Meta", color: "var(--ok)" },
  floor: { label: "Piso", color: "var(--trend-up)" },
  ceiling: { label: "Teto", color: "var(--trend-up)" },
} satisfies ChartConfig;

const axisPercent = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });

/** Os últimos 24 meses do IPCA em 12 meses contra a meta, o piso e o teto: o "é bom ou
ruim?" da página do conceito com o dado de hoje, que termina no último mês do IPCA. */
export function Rolling12mTargetChart() {
  const { data } = useSeriesStatus();
  const end = data?.find((item) => item.series_id === "ipca_general")?.last_ref_date;
  if (!end) return <Skeleton className="h-64 w-full" />;
  return <TargetChart end={end} />;
}

function TargetChart({ end }: { end: string }) {
  const pace = useInflationPace(end);
  if (!pace.data) return <Skeleton className="h-64 w-full" />;
  const rows = pace.data.general_12m.map((point) => ({
    ref_date: point.ref_date,
    rate: point.rate,
    target: point.band?.target ?? null,
    floor: point.band?.floor ?? null,
    ceiling: point.band?.ceiling ?? null,
  }));
  const first = rows.at(0);
  const last = rows.at(-1);
  if (!first || !last) return null;
  const values = rows.flatMap((row) =>
    [row.rate, row.floor, row.ceiling].filter((value) => value !== null),
  );
  const ticks = niceTicks(Math.min(...values), Math.max(...values), 4);
  const inside =
    last.floor !== null &&
    last.ceiling !== null &&
    last.rate >= last.floor &&
    last.rate <= last.ceiling;

  return (
    <figure className="bg-card flex flex-col gap-3 rounded-xl p-5">
      <figcaption className="flex flex-col gap-0.5">
        <strong>IPCA em 12 meses e a meta</strong>
        <span className="text-caption text-muted-foreground">
          {formatMonthRange(first.ref_date, last.ref_date)} · em {formatMonth(last.ref_date)},{" "}
          {formatPercent(last.rate)}: {inside ? "dentro do intervalo" : "fora do intervalo"}
        </span>
      </figcaption>
      <ChartLegend
        entries={[
          { key: "rate", label: "IPCA em 12 meses", color: "var(--foreground)", shape: "line" },
          { key: "target", label: "Meta", color: "var(--ok)", shape: "line" },
          { key: "limits", label: "Piso e teto", color: "var(--trend-up)", shape: "dashed" },
        ]}
      />
      <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
        <LineChart data={rows} margin={{ left: 0, right: 56, top: 12, bottom: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="ref_date"
            tickLine={false}
            axisLine={false}
            interval={5}
            tickFormatter={(month: string) => `${formatShortMonth(month)}/${month.slice(2, 4)}`}
          />
          <YAxis
            domain={[ticks.at(0) ?? 0, ticks.at(-1) ?? 0.1]}
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(value: number) => axisPercent.format(value)}
          />
          {(["floor", "ceiling"] as const).map((key) => (
            <Line
              key={key}
              dataKey={key}
              type="stepAfter"
              stroke="var(--color-floor)"
              strokeDasharray="5 4"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          ))}
          <Line
            dataKey="target"
            type="stepAfter"
            stroke="var(--color-target)"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            dataKey="rate"
            stroke="var(--color-rate)"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
          <ReferenceDot
            x={last.ref_date}
            y={last.rate}
            r={5}
            fill="var(--highlight)"
            stroke="var(--card)"
            label={{
              value: formatPercent(last.rate),
              position: "right",
              fontWeight: 700,
              fill: "var(--foreground)",
            }}
          />
        </LineChart>
      </ChartContainer>
    </figure>
  );
}
