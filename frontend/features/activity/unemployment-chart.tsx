import { BookOpen } from "lucide-react";
import { CartesianGrid, Line, LineChart, ReferenceDot, XAxis, YAxis } from "recharts";

import type { Activity } from "@/features/activity/use-activity";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { forecastLegendEntry } from "@/shared/components/forecast-legend";
import { ForecastSpan } from "@/shared/components/forecast-span";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import {
  formatDay,
  formatMonth,
  formatMonthName,
  formatMonthRange,
  formatPercent,
  formatShortMonth,
} from "@/shared/lib/format";
import { addMonths } from "@/shared/lib/months";
import { niceTicks } from "@/shared/lib/nice-scale";

type Unemployment = Activity["unemployment"];

const chartConfig = {
  value: { label: "Taxa de desocupação", color: "var(--foreground)" },
  forecast: { label: "Previsão do Focus", color: "var(--forecast)" },
} satisfies ChartConfig;

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
});

function HowToRead({ unemployment }: { unemployment: Unemployment }) {
  const last = unemployment.months.at(-1);
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="Trimestre móvel" concept="moving-quarter">
        <p>
          Cada ponto é a média de três meses
          {last &&
            `: o de ${formatMonthName(last.ref_date)} junta ${formatMonthName(addMonths(last.ref_date, -2))}, ${formatMonthName(addMonths(last.ref_date, -1))} e ${formatMonthName(last.ref_date)}`}
          . Por isso a linha é suave e reage com atraso.
        </p>
      </TrayItem>
      <TrayItem title="É o mesmo número do IBGE?" concept="unemployment-rate">
        <p>
          É. A taxa vem da PNAD Contínua do IBGE, e o Banco Central republica o mesmo número no SGS.
        </p>
      </TrayItem>
      <TrayItem title="Desemprego baixo é bom?">
        <p>
          Para quem trabalha, sim. Mas muito baixo pressiona salários e o preço dos serviços, e o
          Banco Central olha isso ao decidir a Selic.
        </p>
      </TrayItem>
      {unemployment.forecast && (
        <TrayItem title="A previsão" concept="focus-survey">
          <p>
            A linha tracejada é a taxa que o mercado espera para cada mês, na pesquisa Focus de{" "}
            {formatDay(unemployment.forecast.survey_date)}.
          </p>
        </TrayItem>
      )}
    </div>
  );
}

/** A taxa de desocupação do trimestre móvel nos últimos 4 anos, seguida da taxa que o
Focus espera mês a mês. */
export function UnemploymentChart({ unemployment }: { unemployment: Unemployment }) {
  const months = unemployment.months;
  const first = months.at(0);
  const last = months.at(-1);
  if (!first || !last) return null;
  const expected = unemployment.forecast?.months ?? [];
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
  const yearTicks = rows
    .filter((row) => row.ref_date.slice(5, 7) === "01")
    .map((row) => row.ref_date);

  return (
    <ExplainedCard
      title="Desemprego"
      subtitle={`Taxa de desocupação, trimestre móvel · ${formatMonthRange(first.ref_date, last.ref_date)}${forecastEnd ? ` e a previsão até ${formatMonth(forecastEnd.ref_date)}` : ""}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead unemployment={unemployment} />,
      }}
    >
      <div className="flex flex-col gap-2">
        {forecastEnd && (
          <ChartLegend
            entries={[
              {
                key: "value",
                label: "Taxa de desocupação",
                color: "var(--foreground)",
                shape: "line",
              },
              forecastLegendEntry("Taxa esperada"),
            ]}
          />
        )}
        <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
          <LineChart data={rows} margin={{ left: 0, right: 40, top: 28, bottom: 4 }}>
            <CartesianGrid vertical={false} />
            {unemployment.forecast && forecastEnd && (
              <ForecastSpan
                from={last.ref_date}
                to={forecastEnd.ref_date}
                surveyDate={unemployment.forecast.survey_date}
              />
            )}
            <XAxis
              dataKey="ref_date"
              ticks={yearTicks}
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
                      {name === "forecast" ? "Previsão do Focus" : "Taxa de desocupação"}
                      <span className="tabular-nums">
                        {typeof value === "number" ? formatPercent(value) : ""}
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
                value: formatPercent(last.value),
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
