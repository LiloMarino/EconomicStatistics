import { BookOpen } from "lucide-react";
import { CartesianGrid, Line, LineChart, ReferenceDot, XAxis, YAxis } from "recharts";

import type { ExternalSector } from "@/features/external-sector/use-external-sector";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { forecastLegendEntry } from "@/shared/components/forecast-legend";
import { ForecastSpan } from "@/shared/components/forecast-span";
import { ChartLegend } from "@/shared/components/chart-legend";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import {
  formatDay,
  formatMoney,
  formatMonth,
  formatMonthRange,
  formatShortMonth,
  formatSignedPercent,
} from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

type Dollar = ExternalSector["dollar"];

const chartConfig = {
  value: { label: "Dólar, fim do mês", color: "var(--foreground)" },
  forecast: { label: "Previsão do Focus", color: "var(--forecast)" },
} satisfies ChartConfig;

// Até 8 rótulos no eixo x, a cada 4 meses ou mais
const MAX_TICKS = 8;
const TICK_EVERY = 4;

function HowToRead({ dollar }: { dollar: Dollar }) {
  const last = dollar.months.at(-1);
  const yearBefore = dollar.months.at(-13);
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="O que cada ponto é" concept="ptax">
        <p>
          A PTAX do último dia útil do mês: quantos reais compravam um dólar, pela taxa de
          referência que o Banco Central calcula todo dia.
        </p>
      </TrayItem>
      {last && yearBefore && dollar.change_12m !== null && (
        <TrayItem title="Em 12 meses">
          <p>
            No fim de {formatMonth(last.ref_date)}, o dólar estava a{" "}
            <strong>{formatMoney(last.value)}</strong>, contra {formatMoney(yearBefore.value)} em{" "}
            {formatMonth(yearBefore.ref_date)}: {formatSignedPercent(dollar.change_12m)}.{" "}
            {dollar.change_12m < 0
              ? "Dólar mais barato barateia o que vem de fora, como eletrônicos e combustível."
              : "Dólar mais caro encarece o que vem de fora, como eletrônicos e combustível."}
          </p>
        </TrayItem>
      )}
      {dollar.forecast && (
        <TrayItem title="A previsão" concept="focus-survey">
          <p>
            A linha tracejada é o dólar de fim de mês que o mercado espera, na pesquisa Focus de{" "}
            {formatDay(dollar.forecast.survey_date)}. É a mesma medida da linha real: a PTAX do
            último dia útil de cada mês.
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

/** A PTAX do fim de cada mês nos 24 meses até o último dado, seguida do câmbio que o
Focus espera. */
export function DollarChart({ dollar }: { dollar: Dollar }) {
  const months = dollar.months;
  const first = months.at(0);
  const last = months.at(-1);
  if (!first || !last) return null;
  const expected = dollar.forecast?.months ?? [];
  const forecastEnd = expected.at(-1);
  // O último mês real abre também a linha da previsão, para as duas se emendarem
  const rows = [
    ...months.map((month, index) => ({
      ref_date: month.ref_date,
      value: month.value,
      forecast: index === months.length - 1 && forecastEnd ? month.value : null,
    })),
    ...expected.map((month) => ({ ref_date: month.ref_date, value: null, forecast: month.value })),
  ];
  const values = [...months, ...expected].map((month) => month.value);
  const ticks = niceTicks(Math.min(...values), Math.max(...values), 4);
  const tickEvery = Math.max(TICK_EVERY, Math.ceil(rows.length / MAX_TICKS));
  const monthTicks = rows
    .filter((_, index) => (rows.length - 1 - index) % tickEvery === 0)
    .map((row) => row.ref_date);

  return (
    <ExplainedCard
      title="O dólar"
      subtitle={`PTAX do fim de cada mês · ${formatMonthRange(first.ref_date, last.ref_date)}${forecastEnd ? ` e a previsão até ${formatMonth(forecastEnd.ref_date)}` : ""}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead dollar={dollar} />,
      }}
    >
      <div className="flex flex-col gap-2">
        {forecastEnd && (
          <ChartLegend
            entries={[
              {
                key: "value",
                label: "Dólar, fim do mês",
                color: "var(--foreground)",
                shape: "line",
              },
              forecastLegendEntry("Dólar esperado"),
            ]}
          />
        )}
        <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
          <LineChart data={rows} margin={{ left: 0, right: 40, top: 28, bottom: 4 }}>
            <CartesianGrid vertical={false} />
            {dollar.forecast && forecastEnd && (
              <ForecastSpan
                from={last.ref_date}
                to={forecastEnd.ref_date}
                surveyDate={dollar.forecast.survey_date}
              />
            )}
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
                  formatter={(value, name) => (
                    <span className="flex w-full items-center justify-between gap-4">
                      {name === "forecast" ? "Previsão do Focus" : "Dólar, fim do mês"}
                      <span className="tabular-nums">
                        {typeof value === "number" ? formatMoney(value) : ""}
                      </span>
                    </span>
                  )}
                  filterNull
                />
              }
            />
            <Line
              dataKey="forecast"
              stroke="var(--color-forecast)"
              strokeWidth={2.5}
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive={false}
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
      </div>
    </ExplainedCard>
  );
}
