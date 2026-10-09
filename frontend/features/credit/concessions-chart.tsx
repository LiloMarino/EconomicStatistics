import { BookOpen } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

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
  formatShortMonth,
  formatSignedPercent,
} from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

type Concessions = Credit["concessions"];

const chartConfig = {
  business: { label: "Empresas", color: "var(--credit-business)" },
  households: { label: "Famílias (sem rotativo)", color: "var(--credit-households)" },
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

function HowToRead() {
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="Crédito novo, não dívida" concept="credit-concessions">
        <p>
          Cada ponto compara o crédito novo dos últimos 12 meses com o dos 12 anteriores. Acima do
          zero, os bancos estão emprestando mais; abaixo, menos. O valor é nominal, sem descontar a
          inflação.
        </p>
      </TrayItem>
      <TrayItem title="Livres e direcionados" concept="free-and-directed-credit">
        <p>
          Só entra o crédito de recursos livres, em que banco e cliente negociam o juro. O
          direcionado, como o rural e o imobiliário com poupança, segue regras e reage menos à
          Selic.
        </p>
      </TrayItem>
      <TrayItem title="Por que sem o rotativo">
        <p>
          Nas famílias, o rotativo do cartão fica de fora: ele gira todo mês e infla o valor sem ser
          dinheiro novo de verdade, como na página do Banco Central.
        </p>
      </TrayItem>
    </div>
  );
}

/** A variação em 12 meses das concessões às empresas e às famílias nos últimos 24
meses. */
export function ConcessionsChart({ concessions }: { concessions: Concessions }) {
  const firstBusiness = concessions.business.at(0);
  const lastBusiness = concessions.business.at(-1);
  const lastHouseholds = concessions.households.at(-1);
  if (!firstBusiness || !lastBusiness || !lastHouseholds) return null;

  const business = new Map(concessions.business.map((point) => [point.ref_date, point.value]));
  const households = new Map(concessions.households.map((point) => [point.ref_date, point.value]));
  const dates = [...new Set([...business.keys(), ...households.keys()])].toSorted();
  const rows = dates.map((date) => ({
    ref_date: date,
    business: business.get(date) ?? null,
    households: households.get(date) ?? null,
  }));
  const last = dates.at(-1) ?? lastBusiness.ref_date;
  const values = [...concessions.business, ...concessions.households].map((point) => point.value);
  const ticks = niceTicks(Math.min(0, ...values), Math.max(...values), 4);
  const monthTicks = dates.filter((_, index) => (dates.length - 1 - index) % TICK_EVERY === 0);

  return (
    <ExplainedCard
      title="Quanto está sendo emprestado"
      subtitle={`Concessões de recursos livres, variação em 12 meses · ${formatMonthRange(firstBusiness.ref_date, last)}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead />,
      }}
    >
      <div className="flex flex-col gap-2">
        <ChartLegend
          entries={[
            { key: "business", label: "Empresas", color: "var(--credit-business)", shape: "line" },
            {
              key: "households",
              label: "Famílias (sem rotativo)",
              color: "var(--credit-households)",
              shape: "line",
            },
          ]}
        />
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <LineChart data={rows} margin={{ left: 0, right: 40, top: 28, bottom: 4 }}>
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
              width={52}
              tickFormatter={(value: number) => axisPercent.format(value).replace("-", "−")}
            />
            <ReferenceLine y={0} stroke="var(--ink-2)" />
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
                        {typeof value === "number" ? formatSignedPercent(value) : ""}
                      </span>
                    </span>
                  )}
                  filterNull
                />
              }
            />
            <Line
              dataKey="business"
              stroke="var(--color-business)"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="households"
              stroke="var(--color-households)"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
            <ReferenceDot
              x={lastBusiness.ref_date}
              y={lastBusiness.value}
              r={6}
              fill="var(--highlight)"
              stroke="var(--credit-business)"
              strokeWidth={2.5}
              label={{
                value: formatSignedPercent(lastBusiness.value),
                position: lastBusiness.value >= lastHouseholds.value ? "top" : "bottom",
                offset: 12,
                fill: "var(--foreground)",
                fontSize: 15,
                fontWeight: 700,
              }}
            />
            <ReferenceDot
              x={lastHouseholds.ref_date}
              y={lastHouseholds.value}
              r={6}
              fill="var(--highlight)"
              stroke="var(--credit-households)"
              strokeWidth={2.5}
              label={{
                value: formatSignedPercent(lastHouseholds.value),
                position: lastBusiness.value >= lastHouseholds.value ? "bottom" : "top",
                offset: 12,
                fill: "var(--foreground)",
                fontSize: 15,
                fontWeight: 700,
              }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </ExplainedCard>
  );
}
