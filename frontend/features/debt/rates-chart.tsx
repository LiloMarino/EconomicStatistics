import { BookOpen } from "lucide-react";
import { CartesianGrid, Line, LineChart, ReferenceArea, XAxis, YAxis } from "recharts";

import type { DebtOverview } from "@/features/debt/use-debt";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { formatMonth, formatMonthRange, formatPercent } from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

type Rates = DebtOverview["rates"][number];

const chartConfig = {
  implicit_rate: { label: "r, juro implícito", color: "var(--debt-rate)" },
  nominal_growth: { label: "g, crescimento nominal", color: "var(--debt-growth)" },
} satisfies ChartConfig;

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

// Rótulo do eixo x em janeiro, a cada 4 anos
const YEARS_BETWEEN_TICKS = 4;

/** Os trechos seguidos de meses em que r passa g, do primeiro ao último mês de cada. */
function rateAboveGrowth(rates: Rates[]): { start: string; end: string }[] {
  const spans: { start: string; end: string }[] = [];
  let open: { start: string; end: string } | undefined;
  for (const point of rates) {
    if (point.implicit_rate > point.nominal_growth) {
      open = open
        ? { ...open, end: point.ref_date }
        : { start: point.ref_date, end: point.ref_date };
    } else if (open) {
      spans.push(open);
      open = undefined;
    }
  }
  if (open) spans.push(open);
  return spans;
}

function HowToRead() {
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="Por que r − g decide" concept="r-minus-g" explainer="why-r-minus-g">
        <p>
          A dívida cresce todo ano pelo juro (r), e o PIB, que é o tamanho da economia, cresce por
          g. Se r passa g, a dívida/PIB sobe sozinha, mesmo com o primário zerado; para segurá-la, o
          governo precisa de superávit.
        </p>
      </TrayItem>
      <TrayItem title="O caso de 2021 e 2022" concept="nominal-gdp-growth">
        <p>
          Com a inflação alta, o PIB nominal cresceu rápido e passou o juro: a dívida líquida caiu
          de 61,4% do PIB em dezembro de 2020 para 55,1% em dezembro de 2021, com um superávit
          primário pequeno, de 0,72% do PIB.
        </p>
      </TrayItem>
    </div>
  );
}

/** r e g em 12 meses, mês a mês, com sombra nos meses em que o juro passa o
crescimento. */
export function RatesChart({ rates }: { rates: Rates[] }) {
  const first = rates.at(0);
  const last = rates.at(-1);
  if (!first || !last) return null;
  const values = rates.flatMap((point) => [point.implicit_rate, point.nominal_growth]);
  const ticks = niceTicks(Math.min(0, ...values), Math.max(...values), 5);
  const lastYear = Number(last.ref_date.slice(0, 4));
  const yearTicks = rates
    .filter(
      (point) =>
        point.ref_date.slice(5, 7) === "01" &&
        (lastYear - Number(point.ref_date.slice(0, 4))) % YEARS_BETWEEN_TICKS === 0,
    )
    .map((point) => point.ref_date);

  return (
    <ExplainedCard
      title="Juro da dívida contra crescimento da economia"
      subtitle={`% em 12 meses, nominal · ${formatMonthRange(first.ref_date, last.ref_date)} · na área sombreada o juro passa o crescimento`}
      explain={{ label: "Como ler", icon: BookOpen, heading: "COMO LER", content: <HowToRead /> }}
    >
      <div className="flex flex-col gap-2">
        <ChartLegend
          entries={[
            {
              key: "implicit_rate",
              label: "r, juro implícito da dívida",
              color: "var(--debt-rate)",
              shape: "line",
            },
            {
              key: "nominal_growth",
              label: "g, crescimento do PIB nominal",
              color: "var(--debt-growth)",
              shape: "line",
            },
            {
              key: "shade",
              label: "r maior que g",
              color: "var(--debt-rate-shade)",
              shape: "square",
            },
          ]}
        />
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <LineChart data={rates} margin={{ left: 0, right: 16, top: 16, bottom: 4 }}>
            {rateAboveGrowth(rates).map((span) => (
              <ReferenceArea
                key={span.start}
                x1={span.start}
                x2={span.end}
                fill="var(--debt-rate-shade)"
                fillOpacity={1}
                ifOverflow="hidden"
              />
            ))}
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
              domain={[ticks.at(0) ?? 0, ticks.at(-1) ?? 0.3]}
              ticks={ticks}
              tickLine={false}
              axisLine={false}
              width={44}
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
                      {name === "implicit_rate" ? "r, juro implícito" : "g, crescimento nominal"}
                      <span className="tabular-nums">
                        {typeof value === "number" ? formatPercent(value) : ""}
                      </span>
                    </span>
                  )}
                />
              }
            />
            <Line
              dataKey="implicit_rate"
              stroke="var(--color-implicit_rate)"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="nominal_growth"
              stroke="var(--color-nominal_growth)"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </ExplainedCard>
  );
}
