import { Sigma } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  type DotItemDotProps,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import type { Deficit } from "@/features/deficit/use-deficit";
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
import { formatDay, formatMonth, formatPercent } from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";
import { texDecimal } from "@/shared/lib/tex";

type Point = Deficit["years"][number];
type Forecast = Deficit["forecast"];

const chartConfig = {
  primary: { label: "Primário", color: "var(--fiscal-primary)" },
  interest: { label: "Juros", color: "var(--fiscal-interest)" },
  nominal: { label: "Nominal", color: "var(--foreground)" },
  forecastPrimary: { label: "Primário esperado", color: "var(--fiscal-primary)" },
  forecastInterest: { label: "Juros esperados", color: "var(--fiscal-interest)" },
  forecastNominal: { label: "Nominal esperado", color: "var(--foreground)" },
} satisfies ChartConfig;

const seriesNames = new Map<string, string>(
  Object.entries(chartConfig).map(([key, item]) => [key, item.label]),
);

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

// Meia largura do traço do nominal, em px, sobre a barra
const MARK_HALF_WIDTH = 11;

/** Dezembro aparece pelo ano; o último mês, quando não é dezembro, pelo mês. */
function pointLabel(refDate: string): string {
  return refDate.slice(5, 7) === "12" ? refDate.slice(0, 4) : formatMonth(refDate);
}

interface MarkProps {
  cx?: number;
  cy?: number;
  index?: number;
  count: number;
  label: string;
  dashed?: boolean;
}

/** O nominal é a soma das duas barras: um traço sobre a pilha, com o valor no último. */
function NominalMark({ cx, cy, index, count, label, dashed = false }: MarkProps) {
  if (cx === undefined || cy === undefined) return <g />;
  return (
    <g>
      <line
        x1={cx - MARK_HALF_WIDTH}
        x2={cx + MARK_HALF_WIDTH}
        y1={cy}
        y2={cy}
        stroke="var(--foreground)"
        strokeWidth={3}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      {index === count - 1 && (
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fontSize={13}
          fontWeight={700}
          fill="var(--foreground)"
        >
          {label}
        </text>
      )}
    </g>
  );
}

function ForecastTray({ surveyDate }: { surveyDate: string }) {
  return (
    <TrayItem title="A previsão" concept="focus-survey">
      <p>
        As colunas claras, com contorno tracejado, são o que o mercado espera para dezembro na
        pesquisa Focus de {formatDay(surveyDate)}. O Focus pergunta o resultado do governo, em que
        negativo é déficit; aqui o sinal está trocado, como no resto do gráfico. Os juros esperados
        são o nominal menos o primário.
      </p>
    </TrayItem>
  );
}

function HowToRead({ last, forecast }: { last: Point; forecast: Forecast }) {
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="Primário" concept="primary-balance">
        <p>
          Arrecadação menos gastos, sem os juros. Mostra se o governo cabe no próprio orçamento.
          Abaixo de zero foi superávit e abateu o déficit, como em todos os anos de 2002 a 2013 e em
          2021 e 2022.
        </p>
      </TrayItem>
      <TrayItem title="Juros" concept="nominal-interest">
        <p>
          O custo da dívida no período. Cresce com a Selic e com o tamanho da dívida, e é a maior
          parte do déficit brasileiro em quase todos os anos desde 2002.
        </p>
      </TrayItem>
      <div className="flex flex-col gap-2.5">
        <h3 className="font-bold">A conta de {formatMonth(last.ref_date)}</h3>
        <FormulaBox>
          <Formula flushLeft tex="\text{nominal} = \text{primário} + \text{juros}" />
          <Formula
            flushLeft
            tex={`= ${texDecimal(last.primary * 100, 2)} + ${texDecimal(last.interest * 100, 2)} = \\mathbf{${texDecimal(last.nominal * 100, 2)}\\%}\\ \\text{do PIB}`}
          />
        </FormulaBox>
        <p className="text-caption text-muted-foreground">
          Aqui é soma mesmo: as três partes estão em % do PIB do mesmo período, e não são taxas de
          crescimento.
        </p>
      </div>
      {forecast && <ForecastTray surveyDate={forecast.survey_date} />}
    </div>
  );
}

/** Primário e juros empilhados no fim de cada ano, desde 2002, e o último mês; o traço
marca o nominal, que é a soma dos dois. Primário negativo (superávit) desce do zero. */
export function DeficitChart({ years, forecast }: { years: Point[]; forecast: Forecast }) {
  const last = years.at(-1);
  if (!last) return null;
  const expected = forecast?.years ?? [];
  const forecastEnd = expected.at(-1);
  const rows = [
    ...years.map((point) => ({
      ...point,
      forecastPrimary: null,
      forecastInterest: null,
      forecastNominal: null,
    })),
    ...expected.map((point) => ({
      ref_date: point.ref_date,
      primary: null,
      interest: null,
      nominal: null,
      forecastPrimary: point.primary,
      forecastInterest: point.interest,
      forecastNominal: point.nominal,
    })),
  ];
  const all = [...years, ...expected];
  const tops = all.map((point) =>
    Math.max(point.nominal, point.interest + Math.max(point.primary, 0)),
  );
  const bottoms = all.map((point) => Math.min(point.primary, 0));
  const ticks = niceTicks(Math.min(0, ...bottoms), Math.max(...tops), 5);

  return (
    <ExplainedCard
      title="De onde vem o déficit"
      subtitle="% do PIB em 12 meses, no fim de cada ano · acima de zero é déficit"
      explain={{
        label: "Como ler e a conta",
        icon: Sigma,
        heading: "COMO LER E A CONTA",
        content: <HowToRead last={last} forecast={forecast} />,
      }}
    >
      <div className="flex flex-col gap-2">
        <ChartLegend
          entries={[
            { key: "primary", label: "Primário", color: "var(--fiscal-primary)", shape: "square" },
            { key: "interest", label: "Juros", color: "var(--fiscal-interest)", shape: "square" },
            {
              key: "nominal",
              label: "Nominal (a soma)",
              color: "var(--foreground)",
              shape: "line",
            },
            ...(forecastEnd ? [forecastLegendEntry("Previsão de mercado")] : []),
          ]}
        />
        <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
          <ComposedChart
            data={rows}
            stackOffset="sign"
            margin={{ left: 0, right: 8, top: 24, bottom: 4 }}
          >
            <CartesianGrid vertical={false} />
            {forecast && forecastEnd && (
              <ForecastSpan
                from={last.ref_date}
                to={forecastEnd.ref_date}
                surveyDate={forecast.survey_date}
              />
            )}
            <XAxis
              dataKey="ref_date"
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              minTickGap={12}
              tickFormatter={pointLabel}
            />
            <YAxis
              domain={[ticks.at(0) ?? 0, ticks.at(-1) ?? 0.1]}
              ticks={ticks}
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(value: number) => axisPercent.format(value).replace("-", "−")}
            />
            <ReferenceLine y={0} stroke="var(--ink-2)" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const month: unknown = payload[0]?.payload?.ref_date;
                    return typeof month === "string" ? pointLabel(month) : null;
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
            <Bar
              dataKey="primary"
              stackId="deficit"
              fill="var(--color-primary)"
              maxBarSize={28}
              isAnimationActive={false}
            />
            <Bar
              dataKey="interest"
              stackId="deficit"
              fill="var(--color-interest)"
              radius={[2, 2, 0, 0]}
              maxBarSize={28}
              isAnimationActive={false}
            />
            {(["forecastPrimary", "forecastInterest"] as const).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="deficit"
                fill={`var(--color-${key})`}
                fillOpacity={0.35}
                stroke={`var(--color-${key})`}
                strokeDasharray="3 2"
                maxBarSize={28}
                isAnimationActive={false}
              />
            ))}
            <Line
              dataKey="forecastNominal"
              stroke="none"
              isAnimationActive={false}
              activeDot={false}
              dot={(props: DotItemDotProps) => (
                <NominalMark
                  key={props.index}
                  cx={props.cx}
                  cy={props.cy}
                  index={props.index}
                  count={rows.length}
                  label=""
                  dashed
                />
              )}
            />
            <Line
              dataKey="nominal"
              stroke="none"
              isAnimationActive={false}
              activeDot={false}
              dot={(props: DotItemDotProps) => (
                <NominalMark
                  key={props.index}
                  cx={props.cx}
                  cy={props.cy}
                  index={props.index}
                  count={years.length}
                  label={formatPercent(last.nominal)}
                />
              )}
            />
          </ComposedChart>
        </ChartContainer>
      </div>
    </ExplainedCard>
  );
}
