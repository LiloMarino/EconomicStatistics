import { BookOpen } from "lucide-react";
import { CartesianGrid, Line, LineChart, ReferenceDot, XAxis, YAxis } from "recharts";

import { verdictLook } from "@/features/inflation/pace-verdict";
import type { InflationPace } from "@/features/inflation/use-inflation-pace";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { Formula, FormulaBox } from "@/shared/components/formula";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import {
  formatMonth,
  formatMonthRange,
  formatPercent,
  formatPoints,
  formatShortMonth,
} from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";
import { texDecimal } from "@/shared/lib/tex";

const chartConfig = {
  rate: { label: "IPCA em 12 meses", color: "var(--foreground)" },
  ceiling: { label: "Teto da meta", color: "var(--trend-up)" },
  recent: { label: "Últimos 3 meses", color: "var(--trend-down)" },
} satisfies ChartConfig;

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
});

// O trecho destacado são os 3 últimos meses: 4 pontos, do mês de comparação ao fim
const RECENT_POINTS = 4;
// Rótulo do eixo x a cada 4 meses
const TICK_EVERY = 4;

/** O que é a linha, por que ela sobe ou desce e a conta do ritmo com os números do fim
do período. */
function HowToRead({ pace }: { pace: InflationPace }) {
  const previous = pace.general_12m.at(-2);
  const current = pace.general_12m.at(-1);
  const threeBefore = pace.general_12m.at(-4);
  const lastMonth = pace.last_months.at(-1);
  if (!previous || !current || !threeBefore || !lastMonth) return null;
  const endYear = Number(pace.end.slice(0, 4));
  const yearBefore = `${formatShortMonth(pace.end)}/${endYear - 1}`;
  const label = `${formatShortMonth(pace.end)}/${String(endYear).slice(2)}`;
  const enteredBigger = lastMonth.rate > lastMonth.year_before;
  const band = formatPoints(pace.steady_band).replace("+", "");

  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="O que cada ponto é" concept="rolling-12m">
        <p>
          A inflação acumulada nos 12 meses que terminam naquele mês. É o número que sai no
          noticiário e o que se compara com a meta.
        </p>
      </TrayItem>
      <TrayItem title="Acelerando ou freando">
        <p>
          Pense no nível de preços como posição: a inflação é a velocidade, e o 12 meses é a
          velocidade média do último ano. A inclinação desta linha é a aceleração. Linha descendo: a
          inflação está freando; subindo: acelerando.
        </p>
      </TrayItem>
      <TrayItem title="Por que a linha sobe ou desce">
        <p>A cada mês a conta ganha o mês novo e perde o mesmo mês do ano anterior.</p>
        <div className="text-caption grid grid-cols-[auto_auto_1fr] gap-x-3 gap-y-1">
          <span className="text-muted-foreground">Entrou</span>
          <span>{formatMonth(pace.end)}</span>
          <strong className="text-right">{formatPercent(lastMonth.rate)}</strong>
          <span className="text-muted-foreground">Saiu</span>
          <span>{yearBefore}</span>
          <strong className="text-right">{formatPercent(lastMonth.year_before)}</strong>
          <span className="col-span-3 mt-0.5 border-t pt-1.5">
            Entrou {enteredBigger ? "maior" : "menor"} que saiu: a linha{" "}
            {enteredBigger ? "subiu" : "caiu"} de {formatPercent(previous.rate)} para{" "}
            <strong>{formatPercent(current.rate)}</strong>.
          </span>
        </div>
      </TrayItem>
      <TrayItem title="A conta de 1 mês">
        <p className="text-muted-foreground">
          O 12 meses ganha o mês novo e perde o mesmo mês do ano passado:
        </p>
        <FormulaBox
          legend={[
            { symbol: "A_t", text: <>acumulado de 12 meses no mês t</> },
            { symbol: "m_t", text: <>inflação do mês t, em fração</> },
            { symbol: "m_{t-12}", text: <>a do mesmo mês, um ano antes</> },
          ]}
        >
          <Formula tex="1 + A_t = (1 + A_{t-1}) \times \dfrac{1 + m_t}{1 + m_{t-12}}" />
        </FormulaBox>
        <FormulaBox>
          <Formula
            flushLeft
            tex={`1 + A_{\\text{${label}}} = ${texDecimal(1 + previous.rate, 4)} \\times \\dfrac{${texDecimal(1 + lastMonth.rate, 4)}}{${texDecimal(1 + lastMonth.year_before, 4)}} = ${texDecimal(1 + current.rate, 4)}`}
          />
          <Formula
            flushLeft
            tex={`\\text{inclinação} = ${texDecimal(current.rate * 100, 2)} - ${texDecimal(previous.rate * 100, 2)} = \\mathbf{${texDecimal(pace.change_1m * 100, 2)}}\\ \\text{p.p.}`}
          />
        </FormulaBox>
      </TrayItem>
      <TrayItem title="A conta de 3 meses">
        <p className="text-muted-foreground">
          É o mesmo passo três vezes: os últimos 3 meses deste ano contra os mesmos 3 do ano
          passado.
        </p>
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 gap-y-1">
          <span className="text-muted-foreground">Mês</span>
          <span className="text-muted-foreground text-right">{endYear}</span>
          <span className="text-muted-foreground text-right">{endYear - 1}</span>
          <span className="text-muted-foreground text-right">Diferença</span>
          {pace.last_months.map((month) => (
            <div key={month.ref_date} className="contents">
              <span>{formatShortMonth(month.ref_date)}</span>
              <span className="text-right">{formatPercent(month.rate)}</span>
              <span className="text-right">{formatPercent(month.year_before)}</span>
              <strong className="text-right">
                {formatPoints(month.difference).replace(" p.p.", "")}
              </strong>
            </div>
          ))}
          <span className="col-span-4 border-t pt-1.5">
            Soma: {formatPoints(pace.last_months_difference)} Pela linha:{" "}
            {formatPercent(threeBefore.rate)} → {formatPercent(current.rate)} ={" "}
            <strong>{formatPoints(pace.change_3m)}</strong> A diferença entre as duas é a
            composição.
          </span>
        </div>
      </TrayItem>
      <TrayItem title="Quando cada veredito aparece">
        <span className="grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-0.5">
          <strong className="text-trend-up">Acelerando</strong>
          <span>subiu mais de {band} em 3 meses</span>
          <strong>Estável</strong>
          <span>
            entre −{band.replace(" p.p.", "")} e +{band}
          </span>
          <strong className="text-trend-down">Freando</strong>
          <span>caiu mais de {band}</span>
        </span>
        <p className="text-muted-foreground">
          Um mês só também vale, mas oscila com o efeito base: se o mês de um ano atrás foi fora da
          curva, a linha pula sem nada ter mudado hoje. Três meses diluem isso.
        </p>
      </TrayItem>
      <TrayItem title="Efeito base" concept="base-effect">
        <p>
          Um mês fora da curva há um ano mexe na linha hoje. Em jul a set/2023 ela subiu de 3,16%
          para 5,19% com meses calmos, só porque saíram da conta as quedas de 2022, quando o imposto
          sobre combustível e energia caiu.
        </p>
      </TrayItem>
    </div>
  );
}

/** O IPCA em 12 meses dos 24 meses até o fim do período, com o teto da meta e o trecho
dos 3 últimos meses na cor do veredito. */
interface Rolling12mChartProps {
  pace: InflationPace;
  /** A bandeja abre também pelo "?" do ritmo, no resumo. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Rolling12mChart({ pace, open, onOpenChange }: Rolling12mChartProps) {
  const look = verdictLook[pace.verdict];
  const points = pace.general_12m;
  const first = points.at(0);
  const last = points.at(-1);
  if (!first || !last) return null;
  const rows = points.map((point, index) => ({
    month: point.ref_date,
    rate: point.rate,
    ceiling: point.ceiling,
    recent: index >= points.length - RECENT_POINTS ? point.rate : null,
  }));
  const peak = points.reduce((best, point) => (point.rate > best.rate ? point : best), first);
  const recentStart = points.at(-RECENT_POINTS);
  const values = points.flatMap((point) =>
    point.ceiling === null ? [point.rate] : [point.rate, point.ceiling],
  );
  const ticks = niceTicks(Math.min(...values), Math.max(...values), 3);
  const monthTicks = points
    .filter((_, index) => index % TICK_EVERY === 0 || index === points.length - 1)
    .map((point) => point.ref_date);

  return (
    <ExplainedCard
      id="rolling-12m"
      title="IPCA em 12 meses e o teto da meta"
      subtitle={formatMonthRange(first.ref_date, last.ref_date)}
      open={open}
      onOpenChange={onOpenChange}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead pace={pace} />,
      }}
    >
      <div className="flex flex-col gap-2">
        <ChartLegend
          entries={[
            {
              key: "rate",
              label: "IPCA em 12 meses",
              color: "var(--foreground)",
              shape: "line",
            },
            ...(pace.ceiling === null
              ? []
              : [
                  {
                    key: "ceiling",
                    label: `Teto da meta de inflação (${formatPercent(pace.ceiling)})`,
                    color: "var(--trend-up)",
                    shape: "dashed" as const,
                  },
                ]),
            {
              key: "recent",
              label: `últimos 3 meses: ${look.label.toLowerCase()}`,
              color: look.color,
              shape: "line",
            },
          ]}
        />
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <LineChart data={rows} margin={{ left: 0, right: 56, top: 28, bottom: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              ticks={monthTicks}
              tickLine={false}
              axisLine={false}
              interval={0}
              tickFormatter={(month: string) => formatMonth(month)}
            />
            <YAxis
              domain={[ticks.at(0) ?? 0, ticks.at(-1) ?? 0.01]}
              ticks={ticks}
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(value: number) => axisPercent.format(value).replace("-", "−")}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const month: unknown = payload[0]?.payload?.month;
                    return typeof month === "string" ? formatMonth(month) : null;
                  }}
                  formatter={(value, name) => (
                    <span className="flex w-full items-center justify-between gap-4">
                      {name === "ceiling" ? "Teto da meta" : "IPCA em 12 meses"}
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
              dataKey="ceiling"
              type="stepAfter"
              stroke="var(--color-ceiling)"
              strokeWidth={2}
              strokeDasharray="6 5"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="recent"
              stroke={look.color}
              strokeWidth={7}
              strokeOpacity={0.85}
              strokeLinecap="round"
              dot={false}
              activeDot={false}
              tooltipType="none"
              isAnimationActive={false}
            />
            <Line
              dataKey="rate"
              stroke="var(--color-rate)"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
            <ReferenceDot
              x={peak.ref_date}
              y={peak.rate}
              r={4.5}
              fill="var(--foreground)"
              stroke="none"
              label={{
                value: `pico: ${formatPercent(peak.rate)} em ${formatMonth(peak.ref_date)}`,
                position: "top",
                fill: "var(--muted-foreground)",
                fontSize: 13,
              }}
            />
            {recentStart && (
              <ReferenceDot
                x={recentStart.ref_date}
                y={recentStart.rate}
                r={0}
                label={{
                  value: `${formatPoints(pace.change_3m)} em 3 meses`,
                  position: "top",
                  offset: 18,
                  fill: look.color,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              />
            )}
            <ReferenceDot
              x={last.ref_date}
              y={last.rate}
              r={6}
              fill="var(--highlight)"
              stroke="var(--foreground)"
              strokeWidth={2.5}
              label={{
                value: formatPercent(last.rate),
                position: "bottom",
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
