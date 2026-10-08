import { BookOpen } from "lucide-react";
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";
import { Link } from "react-router-dom";

import type { Activity } from "@/features/activity/use-activity";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
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
  formatMonthRange,
  formatPercent,
  formatQuarter,
  formatShortMonth,
} from "@/shared/lib/format";
import { monthsBetween } from "@/shared/lib/months";
import { niceTicks } from "@/shared/lib/nice-scale";

type Gdp = Activity["gdp"];
type Ibc = Activity["ibc"];

const chartConfig = {
  ibc: { label: "IBC-Br em 12 meses", color: "var(--activity-ibc)" },
  gdp: { label: "PIB em 4 trimestres", color: "var(--foreground)" },
  gdpForecast: { label: "PIB esperado pelo Focus", color: "var(--forecast)" },
} satisfies ChartConfig;

const seriesNames = new Map<string, string>(
  Object.entries(chartConfig).map(([key, item]) => [key, item.label]),
);

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
});

const FOCUS_COLOR = "var(--forecast)";

function HowToRead({ gdp, ibc }: { gdp: Gdp; ibc: Ibc }) {
  const lastGdp = gdp.quarters.at(-1);
  const lastIbc = ibc.months.at(-1);
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="Qual é qual">
        <p>
          O PIB do IBGE é o número oficial e sai por trimestre. O IBC-Br é o indicador mensal do
          Banco Central que acompanha o PIB: serve para ver antes, mas não é o PIB, e por isso os
          dois às vezes divergem.
        </p>
        {lastGdp && lastIbc && (
          <p>
            Hoje: PIB de {formatPercent(lastGdp.value)} em 4 trimestres até o{" "}
            {formatQuarter(lastGdp.ref_date)}, e IBC-Br de {formatPercent(lastIbc.value)} em 12
            meses até {formatMonth(lastIbc.ref_date)}.
          </p>
        )}
      </TrayItem>
      <TrayItem title="PIB, do IBGE" concept="gdp" color="var(--foreground)">
        <p>
          Cada ponto é um trimestre e mostra quanto o país produziu nos últimos 4 trimestres a mais
          (ou a menos) que nos 4 anteriores. Sai uns dois meses depois do fim do trimestre.
        </p>
      </TrayItem>
      <TrayItem title="IBC-Br, do Banco Central" concept="ibc-br" color="var(--activity-ibc)">
        <p>
          A linha mostra a mesma conta mês a mês: a média dos últimos 12 meses do índice contra a
          dos 12 anteriores. Como sai todo mês, a linha vira antes que o PIB do trimestre apareça.
        </p>
      </TrayItem>
      <TrayItem title="Real ou nominal" concept="real-growth">
        <p>
          Aqui o crescimento é real, descontada a inflação. Na conta da dívida (r − g), o g é
          nominal, com a inflação dentro.
        </p>
        <Link to="/debt" className="text-caption self-start font-semibold">
          Ver na tela de dívida →
        </Link>
      </TrayItem>
      {gdp.forecast && (
        <TrayItem title="A previsão" concept="focus-survey" color={FOCUS_COLOR}>
          <p>
            Os pontos cinza são o PIB que o mercado espera para{" "}
            {gdp.forecast.months.map((point) => point.ref_date.slice(0, 4)).join(" e ")}, na
            pesquisa Focus de {formatDay(gdp.forecast.survey_date)}. Em dezembro, o acumulado de 4
            trimestres é o próprio crescimento do ano, e é por isso que o Focus cabe no gráfico. O
            Focus não prevê o IBC-Br.
          </p>
        </TrayItem>
      )}
    </div>
  );
}

/** O PIB em 4 trimestres, um ponto por trimestre, e o IBC-Br em 12 meses, mês a mês,
seguidos do PIB que o Focus espera para dezembro. */
export function GrowthChart({ gdp, ibc }: { gdp: Gdp; ibc: Ibc }) {
  const firstGdp = gdp.quarters.at(0);
  const lastGdp = gdp.quarters.at(-1);
  const firstIbc = ibc.months.at(0);
  const lastIbc = ibc.months.at(-1);
  if (!firstGdp || !lastGdp || !firstIbc || !lastIbc) return null;
  const first = firstGdp.ref_date < firstIbc.ref_date ? firstGdp.ref_date : firstIbc.ref_date;
  const lastReal = lastGdp.ref_date > lastIbc.ref_date ? lastGdp.ref_date : lastIbc.ref_date;
  const expected = gdp.forecast?.months ?? [];
  const forecastEnd = expected.at(-1);

  // Todos os meses entram no eixo, com os trimestres e as previsões nos seus meses e o
  // resto vazio, para a distância entre os pontos seguir o tempo
  const gdpByMonth = new Map(gdp.quarters.map((point) => [point.ref_date, point.value]));
  const ibcByMonth = new Map(ibc.months.map((point) => [point.ref_date, point.value]));
  const expectedByMonth = new Map(expected.map((point) => [point.ref_date, point.value]));
  const rows = monthsBetween(first, forecastEnd?.ref_date ?? lastReal).map((month) => ({
    ref_date: month,
    ibc: ibcByMonth.get(month) ?? null,
    gdp: gdpByMonth.get(month) ?? null,
    gdpForecast: expectedByMonth.get(month) ?? null,
  }));

  const values = [...gdp.quarters, ...ibc.months, ...expected].map((point) => point.value);
  const ticks = niceTicks(Math.min(0, ...values), Math.max(...values), 4);
  const yearTicks = rows
    .filter((row) => row.ref_date.slice(5, 7) === "01")
    .map((row) => row.ref_date);

  return (
    <ExplainedCard
      title="A economia cresce ou encolhe?"
      subtitle={`PIB em 4 trimestres e IBC-Br em 12 meses, % · ${formatMonthRange(first, lastReal)}${forecastEnd ? ` e a previsão do Focus para dezembro de ${expected.map((point) => point.ref_date.slice(0, 4)).join(" e ")}` : ""}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead gdp={gdp} ibc={ibc} />,
      }}
    >
      <div className="flex flex-col gap-2">
        <ChartLegend
          entries={[
            {
              key: "ibc",
              label: "IBC-Br, mensal",
              color: "var(--activity-ibc)",
              shape: "line",
            },
            {
              key: "gdp",
              label: "PIB, trimestral",
              color: "var(--foreground)",
              shape: "dot",
            },
            ...(forecastEnd
              ? [
                  {
                    key: "forecast",
                    label: "Focus para o ano",
                    color: FOCUS_COLOR,
                    shape: "dot" as const,
                  },
                ]
              : []),
          ]}
        />
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <LineChart data={rows} margin={{ left: 0, right: 24, top: 24, bottom: 4 }}>
            <CartesianGrid vertical={false} />
            {gdp.forecast && forecastEnd && (
              <ForecastSpan
                from={lastReal}
                to={forecastEnd.ref_date}
                surveyDate={gdp.forecast.survey_date}
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
                        {typeof value === "number" ? formatPercent(value) : ""}
                      </span>
                    </span>
                  )}
                  filterNull
                />
              }
            />
            <Line
              dataKey="ibc"
              stroke="var(--color-ibc)"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="gdp"
              stroke="none"
              dot={{ r: 5, fill: "var(--color-gdp)", stroke: "var(--card)", strokeWidth: 1.5 }}
              activeDot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="gdpForecast"
              stroke="none"
              dot={{
                r: 6,
                fill: "var(--color-gdpForecast)",
                stroke: "var(--card)",
                strokeWidth: 1.5,
              }}
              activeDot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </ExplainedCard>
  );
}
