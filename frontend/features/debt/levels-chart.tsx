import { BookOpen } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { DebtOverview } from "@/features/debt/use-debt";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { formatMonth, formatMonthRange, formatPercent } from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

type Level = DebtOverview["levels"][number];

const chartConfig = {
  net: { label: "Dívida líquida", color: "var(--debt-net)" },
  gross: { label: "Dívida bruta", color: "var(--debt-gross)" },
} satisfies ChartConfig;

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

// Rótulo do eixo x em janeiro, a cada 3 anos
const YEARS_BETWEEN_TICKS = 3;

function HowToRead() {
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="O que cada uma conta" concept="gross-debt">
        <p>
          A bruta soma tudo o que os governos federal, estaduais e municipais devem, sem descontar
          nada. A líquida inclui o Banco Central e as estatais e desconta o que o setor público tem
          a receber, como as reservas internacionais.
        </p>
      </TrayItem>
      <TrayItem title="Por que a distância entre elas muda" concept="net-debt">
        <p>
          Quando o Banco Central compra dólares para as reservas, a bruta sobe e a líquida não: o
          setor público passa a dever mais e a ter mais a receber.
        </p>
      </TrayItem>
    </div>
  );
}

/** As duas dívidas em % do PIB, mês a mês, desde dez/2006, quando a dívida bruta começa
na metodologia de hoje. */
export function LevelsChart({ levels }: { levels: Level[] }) {
  const first = levels.at(0);
  const last = levels.at(-1);
  if (!first || !last) return null;
  const values = levels.flatMap((point) => [point.net, point.gross]);
  const ticks = niceTicks(Math.min(...values), Math.max(...values), 4);
  const lastYear = Number(last.ref_date.slice(0, 4));
  const yearTicks = levels
    .filter(
      (point) =>
        point.ref_date.slice(5, 7) === "01" &&
        (lastYear - Number(point.ref_date.slice(0, 4))) % YEARS_BETWEEN_TICKS === 0,
    )
    .map((point) => point.ref_date);

  return (
    <ExplainedCard
      title="Dívida líquida e dívida bruta"
      subtitle={`% do PIB · ${formatMonthRange(first.ref_date, last.ref_date)}`}
      explain={{ label: "Como ler", icon: BookOpen, heading: "COMO LER", content: <HowToRead /> }}
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
          ]}
        />
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <LineChart data={levels} margin={{ left: 0, right: 16, top: 16, bottom: 4 }}>
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
                  formatter={(value, name) => (
                    <span className="flex w-full items-center justify-between gap-4">
                      {name === "net" ? "Dívida líquida" : "Dívida bruta"}
                      <span className="tabular-nums">
                        {typeof value === "number" ? formatPercent(value) : ""}
                      </span>
                    </span>
                  )}
                />
              }
            />
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
