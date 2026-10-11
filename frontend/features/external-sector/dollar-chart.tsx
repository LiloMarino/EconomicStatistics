import { BookOpen } from "lucide-react";
import { CartesianGrid, Line, LineChart, ReferenceDot, XAxis, YAxis } from "recharts";

import { type DollarScale, dollarScales } from "@/features/external-sector/use-dollar-scale";
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
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";
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
// No dia a dia, um rótulo no primeiro dia útil de cada 2 meses
const MONTHS_BETWEEN_DAY_TICKS = 2;

const scaleLabels: Record<DollarScale, string> = { months: "Mês a mês", days: "Dia a dia" };

function HowToRead({ dollar, scale }: { dollar: Dollar; scale: DollarScale }) {
  const last = dollar.months.at(-1);
  const yearBefore = dollar.months.at(-13);
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="O que cada ponto é" concept="ptax">
        <p>
          {scale === "days"
            ? "A PTAX de cada dia útil: quantos reais compravam um dólar, pela taxa de referência que o Banco Central calcula todo dia. O dia a dia mostra o sobe e desce que o fim do mês esconde."
            : "A PTAX do último dia útil do mês: quantos reais compravam um dólar, pela taxa de referência que o Banco Central calcula todo dia."}
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
      {dollar.forecast && scale === "months" && (
        <TrayItem title="A previsão" concept="focus-survey">
          <p>
            A linha tracejada é o dólar de fim de mês que o mercado espera, na pesquisa Focus de{" "}
            {formatDay(dollar.forecast.survey_date)}. É a mesma medida da linha real: a PTAX do
            último dia útil de cada mês.
          </p>
        </TrayItem>
      )}
      <TrayItem title="O que mexe no dólar" concept="exchange-rate" explainer="reserves-and-fx">
        <p>
          Os juros daqui contra os de fora, o risco do país, o preço das commodities que o Brasil
          exporta e o humor do mundo. Quando a dívida pública preocupa, o dólar costuma ser o
          primeiro a subir.
        </p>
      </TrayItem>
    </div>
  );
}

interface DollarChartProps {
  dollar: Dollar;
  scale: DollarScale;
  onScaleChange: (scale: DollarScale) => void;
}

/** A PTAX do fim de cada mês nos 24 meses até o último dado, seguida do câmbio que o
Focus espera; ou, no dia a dia, a PTAX de cada dia útil dos últimos 12 meses. */
export function DollarChart({ dollar, scale, onScaleChange }: DollarChartProps) {
  const byDay = scale === "days";
  const points = byDay ? dollar.days : dollar.months;
  const first = points.at(0);
  const last = points.at(-1);
  if (!first || !last) return null;
  const expected = byDay ? [] : (dollar.forecast?.months ?? []);
  const forecastEnd = expected.at(-1);
  // O último mês real abre também a linha da previsão, para as duas se emendarem
  const rows = [
    ...points.map((point, index) => ({
      ref_date: point.ref_date,
      value: point.value,
      forecast: index === points.length - 1 && forecastEnd ? point.value : null,
    })),
    ...expected.map((month) => ({ ref_date: month.ref_date, value: null, forecast: month.value })),
  ];
  const values = [...points, ...expected].map((point) => point.value);
  const ticks = niceTicks(Math.min(...values), Math.max(...values), 4);
  const tickEvery = Math.max(TICK_EVERY, Math.ceil(rows.length / MAX_TICKS));
  const firstDays = rows
    .map((row) => row.ref_date)
    .filter((day, index, days) => day.slice(0, 7) !== days[index - 1]?.slice(0, 7));
  const xTicks = byDay
    ? firstDays.filter(
        (_, index) => (firstDays.length - 1 - index) % MONTHS_BETWEEN_DAY_TICKS === 0,
      )
    : rows
        .filter((_, index) => (rows.length - 1 - index) % tickEvery === 0)
        .map((row) => row.ref_date);
  const pointLabel = byDay ? "Dólar no dia" : "Dólar, fim do mês";

  return (
    <ExplainedCard
      title="O dólar"
      subtitle={
        byDay
          ? `PTAX de cada dia útil · ${formatDay(first.ref_date)} a ${formatDay(last.ref_date)}`
          : `PTAX do fim de cada mês · ${formatMonthRange(first.ref_date, last.ref_date)}${forecastEnd ? ` e a previsão até ${formatMonth(forecastEnd.ref_date)}` : ""}`
      }
      actions={
        <ToggleGroup
          variant="segmented"
          size="sm"
          aria-label="Escala"
          value={[scale]}
          onValueChange={([next]) => {
            const chosen = dollarScales.find((item) => item === next);
            if (chosen) onScaleChange(chosen);
          }}
        >
          {dollarScales.map((item) => (
            <ToggleGroupItem key={item} value={item}>
              {scaleLabels[item]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      }
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead dollar={dollar} scale={scale} />,
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
              ticks={xTicks}
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
                    const day: unknown = payload[0]?.payload?.ref_date;
                    if (typeof day !== "string") return null;
                    return byDay ? formatDay(day) : formatMonth(day);
                  }}
                  formatter={(value, name) => (
                    <span className="flex w-full items-center justify-between gap-4">
                      {name === "forecast" ? "Previsão do Focus" : pointLabel}
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
