import { BookOpen } from "lucide-react";
import { CartesianGrid, Line, LineChart, ReferenceDot, XAxis, YAxis } from "recharts";

import type { Credit } from "@/features/credit/use-credit";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { formatMoney, formatMonth, formatMonthRange, formatPercent } from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

type Delinquency = Credit["delinquency"];

const chartConfig = {
  value: { label: "Inadimplência", color: "var(--trend-up)" },
} satisfies ChartConfig;

const axisPercent = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 0 });

// O exemplo da bandeja escala a fração da API a R$ 100 emprestados
const EXAMPLE_LOAN = 100;

// O eixo x leva um rótulo a cada 2 anos, em janeiro, contados do último ano
const YEARS_PER_TICK = 2;

/** O calote acontecendo: a parte do crédito com atraso de mais de 90 dias. É o par do
índice de Basileia, que diz quanto calote os bancos aguentam. */
export function DelinquencyCard({ delinquency }: { delinquency: Delinquency }) {
  const first = delinquency.at(0);
  const last = delinquency.at(-1);
  if (!first || !last) return null;

  const ticks = niceTicks(0, Math.max(...delinquency.map((point) => point.value)), 4);
  const januaries = delinquency
    .map((point) => point.ref_date)
    .filter((month) => month.slice(5, 7) === "01");
  const yearTicks = januaries.filter(
    (_, index) => (januaries.length - 1 - index) % YEARS_PER_TICK === 0,
  );

  return (
    <ExplainedCard
      title="Quanto não está sendo pago"
      subtitle={`Inadimplência: crédito com atraso de mais de 90 dias, % da carteira · ${formatMonthRange(first.ref_date, last.ref_date)}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: (
          <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-start gap-x-8 gap-y-5">
            <TrayItem title="O calote acontecendo" concept="delinquency">
              <p>
                De cada {formatMoney(EXAMPLE_LOAN)} emprestados,{" "}
                {formatMoney(EXAMPLE_LOAN * last.value)} estavam com mais de 90 dias de atraso em{" "}
                {formatMonth(last.ref_date)}. É o número que mostra o calote; o índice de Basileia,
                no cartão de cima, mostra quanto dele os bancos aguentam.
              </p>
            </TrayItem>
            <TrayItem title="Atraso não é perda inteira">
              <p>
                Parte do atrasado ainda volta, renegociada ou cobrada. Os bancos guardam uma reserva
                para o que esperam perder (a provisão), e o capital fica para o que vier além disso.
              </p>
            </TrayItem>
            <TrayItem title="Lendo os dois juntos">
              <p>
                Inadimplência subindo com a Basileia parada é uma economia mais apertada, mas com
                bancos firmes. As duas piorando ao mesmo tempo é o sinal de alerta: mais calote com
                menos colchão.
              </p>
            </TrayItem>
          </div>
        ),
      }}
    >
      <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
        <LineChart data={delinquency} margin={{ left: 0, right: 40, top: 16, bottom: 4 }}>
          <CartesianGrid vertical={false} />
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
                formatter={(value) => (
                  <span className="flex w-full items-center justify-between gap-4">
                    Inadimplência
                    <span className="tabular-nums">
                      {typeof value === "number" ? formatPercent(value) : ""}
                    </span>
                  </span>
                )}
              />
            }
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
            stroke="var(--trend-up)"
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
    </ExplainedCard>
  );
}
