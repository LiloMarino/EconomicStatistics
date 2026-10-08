import { BookOpen } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { forecastLegendEntry } from "@/shared/components/forecast-legend";
import { ForecastSpan } from "@/shared/components/forecast-span";

import type { DebtOverview } from "@/features/debt/use-debt";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { formatDay, formatMonth, formatMonthRange, formatPercent } from "@/shared/lib/format";
import { addMonths, monthsBetween } from "@/shared/lib/months";
import { niceTicks } from "@/shared/lib/nice-scale";

type Level = DebtOverview["levels"][number];
type LevelsForecast = DebtOverview["levels_forecast"];

const chartConfig = {
  net: { label: "Dívida líquida", color: "var(--debt-net)" },
  gross: { label: "Dívida bruta", color: "var(--debt-gross)" },
  netForecast: { label: "Dívida líquida esperada", color: "var(--debt-net)" },
  grossForecast: { label: "Dívida bruta esperada", color: "var(--debt-gross)" },
} satisfies ChartConfig;

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

// Rótulo do eixo x em janeiro, a cada 3 anos
const YEARS_BETWEEN_TICKS = 3;

function HowToRead({ forecast }: { forecast: LevelsForecast }) {
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="Dívida bruta (DBGG)" concept="gross-debt" color="var(--debt-gross)">
        <p>
          Tudo o que os governos federal, estaduais e municipais devem, sem descontar nada. É a
          linha vermelha, e a que mais se usa para comparar o Brasil com outros países.
        </p>
      </TrayItem>
      <TrayItem title="Dívida líquida (DLSP)" concept="net-debt" color="var(--debt-net)">
        <p>
          O que o setor público deve menos o que tem a receber, como as reservas internacionais.
          Entram também o Banco Central e as estatais. É a linha azul, e a que entra na conta de
          quando a dívida para de subir.
        </p>
      </TrayItem>
      <TrayItem title="Por que a distância entre elas muda">
        <p>
          Quando o Banco Central compra dólares para as reservas, a bruta sobe e a líquida não: o
          setor público passa a dever mais e a ter mais a receber.
        </p>
      </TrayItem>
      {forecast && (
        <TrayItem title="A previsão" concept="focus-survey">
          <p>
            Os pontos depois do último dado são as duas dívidas que o mercado espera para dezembro,
            na pesquisa Focus de {formatDay(forecast.survey_date)}. O Focus pergunta as duas,
            separadas.
          </p>
        </TrayItem>
      )}
    </div>
  );
}

/** As duas dívidas em % do PIB, mês a mês, desde dez/2006, quando a dívida bruta começa
na metodologia de hoje. */
export function LevelsChart({ levels, forecast }: { levels: Level[]; forecast: LevelsForecast }) {
  const first = levels.at(0);
  const last = levels.at(-1);
  if (!first || !last) return null;
  const expected = forecast?.years ?? [];
  const forecastEnd = expected.at(-1);
  // Os meses entre o último dado e cada dezembro previsto entram vazios: o eixo é por
  // categoria, e são eles que mantêm a distância entre os pontos proporcional ao tempo
  const futureMonths = forecastEnd
    ? monthsBetween(addMonths(last.ref_date, 1), forecastEnd.ref_date)
    : [];
  const rows = [
    ...levels.map((point) => ({ ...point, netForecast: null, grossForecast: null })),
    ...futureMonths.map((month) => {
      const point = expected.find((item) => item.ref_date === month);
      return {
        ref_date: month,
        net: null,
        gross: null,
        netForecast: point?.net ?? null,
        grossForecast: point?.gross ?? null,
      };
    }),
  ];
  const values = [...levels, ...expected].flatMap((point) => [point.net, point.gross]);
  const ticks = niceTicks(Math.min(...values), Math.max(...values), 4);
  const lastYear = Number(last.ref_date.slice(0, 4));
  const yearTicks = rows
    .filter(
      (point) =>
        point.ref_date.slice(5, 7) === "01" &&
        (lastYear - Number(point.ref_date.slice(0, 4))) % YEARS_BETWEEN_TICKS === 0,
    )
    .map((point) => point.ref_date);

  return (
    <ExplainedCard
      title="Dívida líquida e dívida bruta"
      subtitle={`% do PIB · ${formatMonthRange(first.ref_date, last.ref_date)}${expected.length > 0 ? ` e a previsão para dezembro de ${expected.map((point) => point.ref_date.slice(0, 4)).join(" e ")}` : ""}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead forecast={forecast} />,
      }}
    >
      <div className="flex flex-col gap-2">
        <ChartLegend
          entries={[
            { key: "net", label: "Dívida líquida (DLSP)", color: "var(--debt-net)", shape: "line" },
            {
              key: "gross",
              label: "Dívida bruta (DBGG)",
              color: "var(--debt-gross)",
              shape: "line",
            },
            ...(forecastEnd ? [forecastLegendEntry("Previsão de mercado para dezembro")] : []),
          ]}
        />
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <LineChart data={rows} margin={{ left: 0, right: 24, top: 16, bottom: 4 }}>
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
              ticks={yearTicks}
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
                    <span className="flex w-full items-center justify-between gap-4">
                      {Object.entries(chartConfig).find(([key]) => key === name)?.[1].label}
                      <span className="tabular-nums">
                        {typeof value === "number" ? formatPercent(value) : ""}
                      </span>
                    </span>
                  )}
                  filterNull
                />
              }
            />
            {(["netForecast", "grossForecast"] as const).map((key) => (
              <Line
                key={key}
                dataKey={key}
                stroke="none"
                dot={{
                  r: 5,
                  fill: "var(--card)",
                  stroke: `var(--color-${key})`,
                  strokeWidth: 2.5,
                  strokeDasharray: "3 2",
                }}
                activeDot={false}
                isAnimationActive={false}
              />
            ))}
            <Line
              dataKey="net"
              stroke="var(--color-net)"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="gross"
              stroke="var(--color-gross)"
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
