import { BookOpen } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { Activity } from "@/features/activity/use-activity";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { formatMonth, formatMonthRange, formatPercent, formatPoints } from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";
import { cn } from "@/shared/lib/utils";

type Underutilization = Activity["underutilization"];

const chartConfig = {
  unemployment: { label: "Desocupação", color: "var(--foreground)" },
  underutilization: { label: "Subutilização", color: "var(--trend-up)" },
  gap: { label: "Distância", color: "var(--ink-2)" },
} satisfies ChartConfig;

const seriesNames = new Map<string, string>(
  Object.entries(chartConfig).map(([key, item]) => [key, item.label]),
);

const axisPercent = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 0 });

/** A taxa de desocupação ao lado da de subutilização, que soma quem desistiu de procurar,
quem trabalha menos do que queria e quem não pode começar agora. As duas aparecem
sempre juntas: o que o cartão mostra é a distância entre elas. */
export function UnderutilizationCard({ underutilization }: { underutilization: Underutilization }) {
  const { months, gap } = underutilization;
  const first = months.at(0);
  const last = months.at(-1);
  if (!first || !last) return null;

  const ticks = niceTicks(0, Math.max(...months.map((point) => point.underutilization)), 4);
  const januaries = months
    .map((point) => point.ref_date)
    .filter((month) => month.slice(5, 7) === "01");

  return (
    <ExplainedCard
      title="O desemprego além da taxa"
      subtitle={`Taxas de desocupação e de subutilização da força de trabalho, %, trimestre móvel · ${formatMonthRange(first.ref_date, last.ref_date)}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: (
          <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-start gap-x-8 gap-y-5">
            <TrayItem title="Desocupação" color="var(--foreground)" concept="unemployment-rate">
              <p>
                A taxa do cartão de cima: quem procurou trabalho e não achou, sobre todos que
                trabalham ou procuram.
              </p>
            </TrayItem>
            <TrayItem title="Subutilização" color="var(--trend-up)" concept="underutilization">
              <p>
                Soma à desocupação quem trabalha menos horas do que queria (o subocupado), quem
                desistiu de procurar porque acha que não vai achar (o desalentado) e quem queria
                trabalhar mas não pode começar agora.
              </p>
            </TrayItem>
            <TrayItem title="A distância entre as duas">
              <p>
                Em {formatMonth(last.ref_date)}, {formatPoints(gap)} separam as duas linhas: é a
                gente que a taxa de desemprego não conta. Quando a distância diminui, o mercado de
                trabalho melhorou além do que a taxa mostra.
              </p>
            </TrayItem>
          </div>
        ),
      }}
    >
      <ChartLegend
        entries={[
          { key: "unemployment", label: "Desocupação", color: "var(--foreground)" },
          { key: "underutilization", label: "Subutilização", color: "var(--trend-up)" },
        ]}
      />
      <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
        <LineChart data={months} margin={{ left: 0, right: 40, top: 16, bottom: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="ref_date"
            ticks={januaries}
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
            width={52}
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
                  <span
                    className={cn(
                      "flex w-full items-center justify-between gap-4",
                      name === "gap" && "mt-0.5 border-t pt-1.5",
                    )}
                  >
                    {seriesNames.get(String(name))}
                    <span className="tabular-nums">
                      {typeof value !== "number"
                        ? ""
                        : name === "gap"
                          ? formatPoints(value)
                          : formatPercent(value)}
                    </span>
                  </span>
                )}
              />
            }
          />
          <Line
            dataKey="unemployment"
            stroke="var(--color-unemployment)"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            dataKey="underutilization"
            stroke="var(--color-underutilization)"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            dataKey="gap"
            stroke="none"
            dot={false}
            activeDot={false}
            legendType="none"
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </ExplainedCard>
  );
}
