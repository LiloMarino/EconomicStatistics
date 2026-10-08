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

import {
  focusIndicatorLabels,
  formatAxisValue,
  formatFocusValue,
} from "@/features/focus/focus-labels";
import { readingSentence } from "@/features/focus/reading-sentence";
import type { FocusHistory } from "@/features/focus/use-focus";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { formatDay, formatPercent } from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

const chartConfig = {
  value: { label: "Mediana", color: "var(--foreground)" },
} satisfies ChartConfig;

/** A primeira pesquisa de janeiro de cada ano: os rótulos do eixo x. */
function yearTicks(points: FocusHistory["points"]): string[] {
  return points
    .filter(
      (point, index) =>
        point.survey_date.slice(5, 7) === "01" &&
        point.survey_date.slice(0, 4) !== points[index - 1]?.survey_date.slice(0, 4),
    )
    .map((point) => point.survey_date);
}

/** A previsão de um indicador para um ano, pesquisa a pesquisa, com a meta e os
limites quando o indicador é o IPCA. */
export function HistoryChart({ history }: { history: FocusHistory }) {
  const sentence = readingSentence(history);
  const first = history.points.at(0);
  const last = history.points.at(-1);
  if (!first || !last) return null;
  const band = history.band;
  const values = [
    ...history.points.map((point) => point.value),
    ...(band ? [band.floor, band.ceiling] : []),
  ];
  const ticks = niceTicks(Math.min(...values), Math.max(...values), 4);
  const label = focusIndicatorLabels[history.indicator];

  return (
    <ExplainedCard
      title="Como a previsão mudou"
      subtitle={`${label} esperado para ${history.year}, de ${formatDay(first.survey_date)} a ${formatDay(last.survey_date)}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: (
          <>
            <TrayItem title="O que cada ponto é" concept="focus-survey">
              <p>
                A mediana das previsões das instituições na pesquisa de sexta daquela semana, para{" "}
                {history.year} inteiro. O Banco Central pergunta toda semana, e cada instituição
                pode atualizar a previsão quando quiser.
              </p>
            </TrayItem>
            <TrayItem title="Por que a linha anda">
              <p>
                O ano previsto vai acontecendo: cada IPCA, PIB ou dólar que sai muda o que falta
                prever, e as instituições refazem a conta. Perto do fim do ano a linha costuma
                parar, porque quase tudo já é dado real.
              </p>
            </TrayItem>
            {band && (
              <TrayItem title="A meta" concept="unanchored-expectations">
                <p>
                  A linha verde é a meta de {formatPercent(band.target)} para {history.year}, e as
                  tracejadas são os limites de {formatPercent(band.floor)} e{" "}
                  {formatPercent(band.ceiling)}. Previsão longe do centro, sobretudo para os anos
                  seguintes, é o que se chama de expectativa desancorada.
                </p>
              </TrayItem>
            )}
          </>
        ),
      }}
    >
      <div className="flex flex-col gap-3">
        {sentence && <p className="font-semibold">{sentence}</p>}
        <ChartLegend
          entries={[
            {
              key: "value",
              label: `Mediana do Focus para ${history.year}`,
              color: "var(--foreground)",
              shape: "line",
            },
            ...(band
              ? [
                  {
                    key: "target",
                    label: `Meta (${formatPercent(band.target)})`,
                    color: "var(--ok)",
                    shape: "line" as const,
                  },
                  {
                    key: "limits",
                    label: `Limites (${formatPercent(band.floor)} e ${formatPercent(band.ceiling)})`,
                    color: "var(--trend-up)",
                    shape: "dashed" as const,
                  },
                ]
              : []),
          ]}
        />
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <LineChart data={history.points} margin={{ left: 0, right: 72, top: 16, bottom: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="survey_date"
              ticks={yearTicks(history.points)}
              tickLine={false}
              axisLine={false}
              interval={0}
              tickFormatter={(day: string) => day.slice(0, 4)}
            />
            <YAxis
              domain={[ticks.at(0) ?? 0, ticks.at(-1) ?? 1]}
              ticks={ticks}
              tickLine={false}
              axisLine={false}
              width={72}
              tickFormatter={(value: number) => formatAxisValue(value, history.unit)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const day: unknown = payload[0]?.payload?.survey_date;
                    return typeof day === "string" ? `Pesquisa de ${formatDay(day)}` : null;
                  }}
                  formatter={(value, _, item) => {
                    const respondents: unknown = item.payload?.respondents;
                    return (
                      <span className="flex w-full flex-col gap-0.5">
                        <span className="flex items-center justify-between gap-4">
                          Mediana
                          <span className="tabular-nums">
                            {typeof value === "number" ? formatFocusValue(value, history.unit) : ""}
                          </span>
                        </span>
                        {typeof respondents === "number" && (
                          <span className="text-muted-foreground">{respondents} instituições</span>
                        )}
                      </span>
                    );
                  }}
                />
              }
            />
            {band && (
              <>
                <ReferenceLine y={band.target} stroke="var(--ok)" strokeWidth={1.5} />
                <ReferenceLine
                  y={band.floor}
                  stroke="var(--trend-up)"
                  strokeWidth={2}
                  strokeDasharray="6 5"
                />
                <ReferenceLine
                  y={band.ceiling}
                  stroke="var(--trend-up)"
                  strokeWidth={2}
                  strokeDasharray="6 5"
                />
              </>
            )}
            <Line
              dataKey="value"
              type="stepAfter"
              stroke="var(--color-value)"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            <ReferenceDot
              x={last.survey_date}
              y={last.value}
              r={6}
              fill="var(--highlight)"
              stroke="var(--foreground)"
              strokeWidth={2.5}
              label={{
                value: formatFocusValue(last.value, history.unit),
                position: "right",
                offset: 10,
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
