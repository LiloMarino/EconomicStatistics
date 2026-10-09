import { BookOpen } from "lucide-react";
import { Area, CartesianGrid, ComposedChart, Line, ReferenceDot, XAxis, YAxis } from "recharts";

import type { Interest } from "@/features/interest/use-interest";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { forecastLegendEntry } from "@/shared/components/forecast-legend";
import { ForecastSpan } from "@/shared/components/forecast-span";
import { Formula, FormulaBox } from "@/shared/components/formula";
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
  formatShortMonth,
} from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";
import { texDecimal } from "@/shared/lib/tex";

type MonthRate = Interest["selic"]["months"][number];

const chartConfig = {
  selic: { label: "Selic meta", color: "var(--indexer-selic)" },
  ipca: { label: "IPCA em 12 meses", color: "var(--foreground)" },
  selicForecast: { label: "Selic esperada", color: "var(--forecast)" },
  ipcaForecast: { label: "IPCA esperado", color: "var(--forecast)" },
} satisfies ChartConfig;

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

// Até 8 rótulos no eixo x, a cada 4 meses ou mais
const MAX_TICKS = 8;
const TICK_EVERY = 4;

function seriesLabel(name: unknown): string {
  return Object.entries(chartConfig).find(([key]) => key === name)?.[1].label ?? "";
}

function HowToRead({ data }: { data: Interest }) {
  const real = data.real_rate;
  const forecast = data.selic.forecast ?? data.inflation.forecast;
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="Selic meta" concept="selic" color="var(--indexer-selic)">
        <p>
          A taxa básica de juros, que o Copom fixa a cada reunião. A linha anda em degraus, porque
          só muda nas reuniões, e mostra a meta em vigor no fim de cada mês.
        </p>
      </TrayItem>
      <TrayItem title="IPCA em 12 meses" concept="rolling-12m" color="var(--foreground)">
        <p>
          A inflação acumulada nos 12 meses que terminam em cada mês, o número que o Banco Central
          compara com a meta. O gráfico termina no último IPCA publicado.
        </p>
      </TrayItem>
      <TrayItem title="O juro real é a distância" concept="real-rate">
        <p>
          A faixa sombreada entre as duas linhas é o juro real: quanto a Selic rende acima da
          inflação. Quanto mais larga a faixa, mais o juro aperta a economia.
        </p>
        {real && (
          <>
            <p className="text-muted-foreground">
              No resumo, a inflação é a esperada para os próximos 12 meses, e a conta divide:
            </p>
            <FormulaBox>
              <Formula
                flushLeft
                tex={`\\dfrac{1 + ${texDecimal(real.selic, 4)}}{1 + ${texDecimal(real.expected_inflation, 4)}} - 1 = \\mathbf{${texDecimal(real.rate * 100, 2)}\\%}`}
              />
            </FormulaBox>
          </>
        )}
      </TrayItem>
      <TrayItem title="Por que o BC sobe o juro" explainer="fiscal-dominance">
        <p>
          Quando a inflação passa da meta, o Banco Central sobe a Selic. O crédito encarece, as
          pessoas e as empresas gastam menos, e os preços sobem mais devagar.
        </p>
      </TrayItem>
      <TrayItem title="Por que o efeito demora">
        <p>
          A Selic de hoje leva de vários meses a mais de um ano para chegar aos preços. Por isso o
          Banco Central olha a inflação esperada, e não só a de agora.
        </p>
      </TrayItem>
      {forecast && (
        <TrayItem title="A previsão" concept="focus-survey">
          <p>
            As linhas tracejadas vêm da pesquisa Focus de {formatDay(forecast.survey_date)}. A Selic
            muda de degrau em cada reunião do Copom que o Banco Central já datou, com a mediana do
            mercado para ela, a partir do dia seguinte à decisão. O IPCA em 12 meses compõe os meses
            reais com o IPCA mensal esperado.
          </p>
        </TrayItem>
      )}
    </div>
  );
}

interface Row {
  ref_date: string;
  selic: number | null;
  ipca: number | null;
  gapFloor: number | null;
  gapSize: number | null;
  selicForecast: number | null;
  ipcaForecast: number | null;
}

/** Uma linha por mês, juntando as quatro séries pela data. O último mês real de cada
linha abre também a previsão dela, para as duas se emendarem. */
function buildRows(data: Interest): Row[] {
  const selic = new Map(data.selic.months.map((month) => [month.ref_date, month.rate]));
  const ipca = new Map(data.inflation.months.map((month) => [month.ref_date, month.rate]));
  const selicForecast = new Map<string, number>(
    (data.selic.forecast?.months ?? []).map((month) => [month.ref_date, month.rate]),
  );
  const ipcaForecast = new Map<string, number>(
    (data.inflation.forecast?.months ?? []).map((month) => [month.ref_date, month.rate]),
  );
  const lastSelic = data.selic.months.at(-1);
  const lastIpca = data.inflation.months.at(-1);
  if (lastSelic && selicForecast.size > 0) selicForecast.set(lastSelic.ref_date, lastSelic.rate);
  if (lastIpca && ipcaForecast.size > 0) ipcaForecast.set(lastIpca.ref_date, lastIpca.rate);

  const dates = [
    ...new Set([...selic.keys(), ...ipca.keys(), ...selicForecast.keys(), ...ipcaForecast.keys()]),
  ].toSorted();
  return dates.map((date) => {
    const selicRate = selic.get(date) ?? null;
    const ipcaRate = ipca.get(date) ?? null;
    return {
      ref_date: date,
      selic: selicRate,
      ipca: ipcaRate,
      gapFloor: selicRate !== null && ipcaRate !== null ? Math.min(selicRate, ipcaRate) : null,
      gapSize: selicRate !== null && ipcaRate !== null ? Math.abs(selicRate - ipcaRate) : null,
      selicForecast: selicForecast.get(date) ?? null,
      ipcaForecast: ipcaForecast.get(date) ?? null,
    };
  });
}

function valueLabel(rate: MonthRate, position: "top" | "bottom") {
  return {
    value: formatPercent(rate.rate),
    position,
    offset: 12,
    fill: "var(--foreground)",
    fontSize: 15,
    fontWeight: 700,
  };
}

/** A Selic meta em degraus e o IPCA em 12 meses nos últimos 24 meses, com a distância
entre as duas e a previsão do Focus. */
export function SelicChart({ data }: { data: Interest }) {
  const rows = buildRows(data);
  const firstRow = rows.at(0);
  const lastRow = rows.at(-1);
  const lastSelic = data.selic.months.at(-1);
  const lastIpca = data.inflation.months.at(-1);
  if (!firstRow || !lastRow || !lastSelic || !lastIpca) return null;
  const forecast = data.selic.forecast ?? data.inflation.forecast;
  const values = rows.flatMap((row) =>
    [row.selic, row.ipca, row.selicForecast, row.ipcaForecast].filter(
      (value): value is number => value !== null,
    ),
  );
  const ticks = niceTicks(0, Math.max(...values), 4);
  const tickEvery = Math.max(TICK_EVERY, Math.ceil(rows.length / MAX_TICKS));
  const monthTicks = rows
    .filter((_, index) => (rows.length - 1 - index) % tickEvery === 0)
    .map((row) => row.ref_date);

  return (
    <ExplainedCard
      title="A Selic e a inflação"
      subtitle={`Selic meta e IPCA em 12 meses · a distância entre as duas é o juro real · ${formatMonthRange(firstRow.ref_date, lastSelic.ref_date)}${forecast ? ` e a previsão até ${formatMonth(lastRow.ref_date)}` : ""}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead data={data} />,
      }}
    >
      <div className="flex flex-col gap-2">
        <ChartLegend
          entries={[
            { key: "selic", label: "Selic meta", color: "var(--indexer-selic)", shape: "line" },
            {
              key: "ipca",
              label: "IPCA em 12 meses",
              color: "var(--foreground)",
              shape: "line",
            },
            {
              key: "gap",
              label: "Juro real: a distância",
              color: "var(--ink-2)",
              shape: "square",
            },
            ...(forecast ? [forecastLegendEntry("Previsão do Focus")] : []),
          ]}
        />
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <ComposedChart data={rows} margin={{ left: 0, right: 40, top: 28, bottom: 4 }}>
            <CartesianGrid vertical={false} />
            {forecast && (
              <ForecastSpan
                from={lastIpca.ref_date}
                to={lastRow.ref_date}
                surveyDate={forecast.survey_date}
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
              width={48}
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
                      {seriesLabel(name)}
                      <span className="tabular-nums">
                        {typeof value === "number" ? formatPercent(value) : ""}
                      </span>
                    </span>
                  )}
                  filterNull
                />
              }
            />
            <Area
              dataKey="gapFloor"
              stackId="gap"
              type="stepAfter"
              stroke="none"
              fill="none"
              tooltipType="none"
              isAnimationActive={false}
            />
            <Area
              dataKey="gapSize"
              stackId="gap"
              type="stepAfter"
              stroke="none"
              fill="var(--ink-2)"
              fillOpacity={0.14}
              tooltipType="none"
              isAnimationActive={false}
            />
            <Line
              dataKey="selicForecast"
              type="stepAfter"
              stroke="var(--color-selicForecast)"
              strokeWidth={2.5}
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="ipcaForecast"
              stroke="var(--color-ipcaForecast)"
              strokeWidth={2.5}
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="ipca"
              stroke="var(--color-ipca)"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="selic"
              type="stepAfter"
              stroke="var(--color-selic)"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
            <ReferenceDot
              x={lastSelic.ref_date}
              y={lastSelic.rate}
              r={6}
              fill="var(--highlight)"
              stroke="var(--indexer-selic)"
              strokeWidth={2.5}
              label={valueLabel(lastSelic, "top")}
            />
            <ReferenceDot
              x={lastIpca.ref_date}
              y={lastIpca.rate}
              r={6}
              fill="var(--highlight)"
              stroke="var(--foreground)"
              strokeWidth={2.5}
              label={valueLabel(lastIpca, "bottom")}
            />
          </ComposedChart>
        </ChartContainer>
      </div>
    </ExplainedCard>
  );
}
