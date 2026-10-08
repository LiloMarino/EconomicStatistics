import { Sigma } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import type { Deficit } from "@/features/deficit/use-deficit";
import { type DeficitScale, deficitScales } from "@/features/deficit/use-deficit-view";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";
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
import { formatDay, formatMonth, formatMonthRange, formatPercent } from "@/shared/lib/format";
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

/** Dezembro aparece pelo ano; o último mês, quando não é dezembro, pelo mês. */
function pointLabel(refDate: string): string {
  return refDate.slice(5, 7) === "12" ? refDate.slice(0, 4) : formatMonth(refDate);
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
      <TrayItem title="Primário" concept="primary-balance" color="var(--fiscal-primary)">
        <p>
          Arrecadação menos gastos, sem os juros. Mostra se o governo cabe no próprio orçamento.
          Abaixo de zero foi superávit e abateu o déficit, como em todos os anos de 2002 a 2013 e em
          2021 e 2022.
        </p>
      </TrayItem>
      <TrayItem title="Juros" concept="nominal-interest" color="var(--fiscal-interest)">
        <p>
          O custo da dívida no período. Cresce com a Selic e com o tamanho da dívida, e é a maior
          parte do déficit brasileiro em quase todos os anos desde 2002.
        </p>
      </TrayItem>
      <TrayItem title="Nominal" concept="nominal-balance" color="var(--foreground)">
        <p>
          O déficit completo: primário mais juros. No ano a ano, é a coluna clara ao lado de cada
          par, do tamanho da soma das outras duas; no mês a mês, a linha clara. Quando o primário é
          superávit, ele desce do zero e abate os juros, e o nominal fica menor que os juros.
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

const scaleLabels: Record<DeficitScale, string> = { years: "Ano a ano", months: "Mês a mês" };

// Rótulo do eixo x em janeiro, a cada 4 anos, na escala mês a mês
const YEARS_BETWEEN_TICKS = 4;

const tooltip = (format: (month: string) => string | null) => (
  <ChartTooltip
    content={
      <ChartTooltipContent
        labelFormatter={(_, payload) => {
          const month: unknown = payload[0]?.payload?.ref_date;
          return typeof month === "string" ? format(month) : null;
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
);

const percentAxis = (ticks: number[]) => (
  <YAxis
    domain={[ticks.at(0) ?? 0, ticks.at(-1) ?? 0.1]}
    ticks={ticks}
    tickLine={false}
    axisLine={false}
    width={44}
    tickFormatter={(value: number) => axisPercent.format(value).replace("-", "−")}
  />
);

/** Ano a ano: primário e juros empilhados no fim de cada ano, desde 2002, e o último mês,
com o nominal numa coluna própria ao lado, do tamanho da soma. Primário negativo
(superávit) desce do zero. */
function YearsChart({ years, forecast }: { years: Point[]; forecast: Forecast }) {
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
  const bottoms = all.map((point) => Math.min(point.primary, 0, point.nominal));
  const ticks = niceTicks(Math.min(0, ...bottoms), Math.max(...tops), 5);

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
      <ComposedChart
        data={rows}
        stackOffset="sign"
        barGap={2}
        barCategoryGap="18%"
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
        {percentAxis(ticks)}
        <ReferenceLine y={0} stroke="var(--ink-2)" />
        {tooltip(pointLabel)}
        <Bar
          dataKey="primary"
          stackId="parts"
          fill="var(--color-primary)"
          maxBarSize={16}
          isAnimationActive={false}
        />
        <Bar
          dataKey="interest"
          stackId="parts"
          fill="var(--color-interest)"
          radius={[2, 2, 0, 0]}
          maxBarSize={16}
          isAnimationActive={false}
        />
        {(["forecastPrimary", "forecastInterest"] as const).map((key) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="parts"
            fill={`var(--color-${key})`}
            fillOpacity={0.35}
            stroke={`var(--color-${key})`}
            strokeDasharray="3 2"
            maxBarSize={16}
            isAnimationActive={false}
          />
        ))}
        <Bar
          dataKey="nominal"
          stackId="sum"
          fill="var(--color-nominal)"
          fillOpacity={0.85}
          radius={[2, 2, 0, 0]}
          maxBarSize={16}
          isAnimationActive={false}
          label={(props) => {
            const { x, y, width, index } = props;
            if (
              index !== years.length - 1 ||
              typeof x !== "number" ||
              typeof y !== "number" ||
              typeof width !== "number"
            )
              return null;
            return (
              <text
                x={x + width / 2}
                y={y - 8}
                textAnchor="middle"
                fontSize={13}
                fontWeight={700}
                fill="var(--foreground)"
              >
                {formatPercent(last.nominal)}
              </text>
            );
          }}
        />
        <Bar
          dataKey="forecastNominal"
          stackId="sum"
          fill="var(--color-forecastNominal)"
          fillOpacity={0.25}
          stroke="var(--color-forecastNominal)"
          strokeDasharray="3 2"
          maxBarSize={16}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ChartContainer>
  );
}

/** Mês a mês: as três linhas de 12 meses, um ponto por mês, para ver as viradas dentro
do ano que o fim de dezembro esconde. */
function MonthsChart({ months }: { months: Point[] }) {
  const last = months.at(-1);
  if (!last) return null;
  const values = months.flatMap((point) => [point.nominal, point.primary, point.interest]);
  const ticks = niceTicks(Math.min(0, ...values), Math.max(...values), 5);
  const lastYear = Number(last.ref_date.slice(0, 4));
  const yearTicks = months
    .filter(
      (point) =>
        point.ref_date.slice(5, 7) === "01" &&
        (lastYear - Number(point.ref_date.slice(0, 4))) % YEARS_BETWEEN_TICKS === 0,
    )
    .map((point) => point.ref_date);
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
      <LineChart data={months} margin={{ left: 0, right: 16, top: 24, bottom: 4 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="ref_date"
          ticks={yearTicks}
          interval={0}
          tickLine={false}
          axisLine={false}
          tickFormatter={(month: string) => month.slice(0, 4)}
        />
        {percentAxis(ticks)}
        <ReferenceLine y={0} stroke="var(--ink-2)" />
        {tooltip(formatMonth)}
        {(["primary", "interest", "nominal"] as const).map((key) => (
          <Line
            key={key}
            dataKey={key}
            stroke={`var(--color-${key})`}
            strokeWidth={key === "nominal" ? 2.5 : 2}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

interface DeficitChartProps {
  years: Point[];
  months: Point[];
  forecast: Forecast;
  scale: DeficitScale;
  onScaleChange: (scale: DeficitScale) => void;
}

/** O déficit e as duas partes dele, ano a ano ou mês a mês. */
export function DeficitChart({ years, months, forecast, scale, onScaleChange }: DeficitChartProps) {
  const last = years.at(-1);
  const first = months.at(0);
  if (!last || !first) return null;
  const forecastEnd = forecast?.years.at(-1);
  const byYear = scale === "years";

  return (
    <ExplainedCard
      title="De onde vem o déficit"
      subtitle={
        byYear
          ? "% do PIB em 12 meses, no fim de cada ano · acima de zero é déficit"
          : `% do PIB em 12 meses, mês a mês · ${formatMonthRange(first.ref_date, last.ref_date)} · acima de zero é déficit`
      }
      actions={
        <ToggleGroup
          variant="segmented"
          size="sm"
          aria-label="Escala"
          value={[scale]}
          onValueChange={([next]) => {
            const chosen = deficitScales.find((item) => item === next);
            if (chosen) onScaleChange(chosen);
          }}
        >
          {deficitScales.map((item) => (
            <ToggleGroupItem key={item} value={item}>
              {scaleLabels[item]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      }
      explain={{
        label: "Como ler e a conta",
        icon: Sigma,
        heading: "COMO LER E A CONTA",
        content: <HowToRead last={last} forecast={byYear ? forecast : null} />,
      }}
    >
      <div className="flex flex-col gap-2">
        <ChartLegend
          entries={[
            {
              key: "primary",
              label: "Primário",
              color: "var(--fiscal-primary)",
              shape: byYear ? "square" : "line",
            },
            {
              key: "interest",
              label: "Juros",
              color: "var(--fiscal-interest)",
              shape: byYear ? "square" : "line",
            },
            {
              key: "nominal",
              label: "Nominal (a soma)",
              color: "var(--foreground)",
              shape: byYear ? "square" : "line",
            },
            ...(byYear && forecastEnd ? [forecastLegendEntry("Previsão de mercado")] : []),
          ]}
        />
        {byYear ? (
          <YearsChart years={years} forecast={forecast} />
        ) : (
          <MonthsChart months={months} />
        )}
      </div>
    </ExplainedCard>
  );
}
