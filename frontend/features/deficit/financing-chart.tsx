import { BookOpen } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { DeficitFinancing } from "@/features/deficit/use-deficit-financing";
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
  formatShortPercent,
} from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";
import { texDecimal } from "@/shared/lib/tex";

const chartConfig = {
  central_bank_portfolio: { label: "Carteira do BC", color: "var(--financing-portfolio)" },
  repo_operations: { label: "Compromissadas", color: "var(--financing-repo)" },
  monetary_base: { label: "Base monetária", color: "var(--financing-base)" },
} satisfies ChartConfig;

const seriesKeys = ["central_bank_portfolio", "repo_operations", "monetary_base"] as const;

const seriesNames = new Map<string, string>(
  Object.entries(chartConfig).map(([key, item]) => [key, item.label]),
);

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

// Os estoques chegam em R$ milhões
const MILLION = 1e6;

/** Dezembro aparece pelo ano; o último mês, quando não é dezembro, pelo mês. */
function pointLabel(refDate: string): string {
  return refDate.slice(5, 7) === "12" ? refDate.slice(0, 4) : formatMonth(refDate);
}

function HowToRead({ data }: { data: DeficitFinancing }) {
  const { last, amounts } = data;
  const first = data.years.at(0) ?? last;
  const bases = data.years.map((point) => point.monetary_base);
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem
        title="Carteira do BC"
        concept="central-bank-portfolio"
        color="var(--financing-portfolio)"
      >
        <p>
          Os títulos do Tesouro que estão com o Banco Central. O Tesouro os entrega sem receber
          dinheiro em troca, para o Banco Central ter com que controlar o dinheiro entre os bancos.
        </p>
      </TrayItem>
      <TrayItem title="Compromissadas" concept="repo-operations" color="var(--financing-repo)">
        <p>
          A parte da carteira que o Banco Central emprestou aos bancos, com promessa de recompra,
          para recolher o dinheiro que sobra e manter a Selic na meta. É gestão de liquidez, e não
          dinheiro para o governo.
        </p>
      </TrayItem>
      <TrayItem title="Base monetária" concept="monetary-base" color="var(--financing-base)">
        <p>
          Todo o dinheiro que o Banco Central criou: cédulas e moedas em circulação e as reservas
          dos bancos nele. Em reais, ela cresce com a economia; em % do PIB, só sobe se o dinheiro
          crescer mais rápido que ela.
        </p>
      </TrayItem>
      <TrayItem title="O que seria financiar o governo" explainer="money-printing">
        <p>
          A base subindo em % do PIB junto com o déficit, e a carteira do Banco Central crescendo
          sem ir para as compromissadas. No fim de cada ano desde {first.ref_date.slice(0, 4)}, a
          base ficou entre {formatShortPercent(Math.min(...bases))} e{" "}
          {formatShortPercent(Math.max(...bases))} do PIB.
        </p>
      </TrayItem>
      <div className="flex flex-col gap-2.5 lg:col-span-2">
        <h3 className="font-bold">A conta de {formatMonth(last.ref_date)}</h3>
        <FormulaBox>
          <Formula
            flushLeft
            tex="\text{parte da carteira} = \frac{\text{compromissadas}}{\text{carteira do BC}}"
          />
          <Formula
            flushLeft
            tex={`= \\frac{${texDecimal(amounts.repo_operations / MILLION, 2)}}{${texDecimal(amounts.central_bank_portfolio / MILLION, 2)}} = \\mathbf{${texDecimal(data.repo_share * 100, 1)}\\%}`}
          />
        </FormulaBox>
        <p className="text-caption text-muted-foreground">
          As duas em R$ trilhões, no fim do mesmo mês. No gráfico, cada linha é o estoque dividido
          pelo PIB de 12 meses.
        </p>
      </div>
    </div>
  );
}

/** A frase que fecha a seção: quem fica com os títulos, quanto da carteira do Banco Central
volta aos bancos e onde está a base. O estoque do Tesouro fecha um mês antes das séries do
SGS, e cada número leva o seu mês. */
function Conclusion({ data }: { data: DeficitFinancing }) {
  const { holders, last } = data;
  const first = data.years.at(0) ?? last;
  return (
    <p className="max-w-prose">
      O déficit é pago com títulos vendidos ao mercado.{" "}
      {holders &&
        `${formatShortPercent(holders.central_bank_share)} de todos os títulos federais emitidos estão na carteira do Banco Central (${formatMonth(holders.stock_month)}). `}
      {formatShortPercent(data.repo_share)} dessa carteira voltam aos bancos nas compromissadas (
      {formatMonth(last.ref_date)}). A base monetária, que subiria se o Banco Central imprimisse
      dinheiro para o governo, é {formatShortPercent(last.monetary_base)} do PIB, contra{" "}
      {formatShortPercent(first.monetary_base)} em {formatMonth(first.ref_date)}.
    </p>
  );
}

/** A carteira do Banco Central, as compromissadas e a base monetária em % do PIB, no fim
de cada ano desde 2002 e no último mês. */
export function FinancingChart({ data }: { data: DeficitFinancing }) {
  const first = data.years.at(0);
  if (!first) return null;
  const values = data.years.flatMap((point) => seriesKeys.map((key) => point[key]));
  const ticks = niceTicks(0, Math.max(...values), 4);

  return (
    <ExplainedCard
      title="O Banco Central está imprimindo dinheiro para o governo?"
      subtitle={`% do PIB, no fim de cada ano · ${formatMonthRange(first.ref_date, data.last.ref_date)}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead data={data} />,
      }}
    >
      <div className="flex flex-col gap-3">
        <ChartLegend
          entries={seriesKeys.map((key) => ({
            key,
            label: chartConfig[key].label,
            color: chartConfig[key].color,
            shape: "line",
          }))}
        />
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <LineChart data={data.years} margin={{ left: 0, right: 24, top: 16, bottom: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="ref_date"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
              tickFormatter={pointLabel}
            />
            <YAxis
              domain={[ticks.at(0) ?? 0, ticks.at(-1) ?? 0.3]}
              ticks={ticks}
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(value: number) => axisPercent.format(value)}
            />
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
                />
              }
            />
            {seriesKeys.map((key) => (
              <Line
                key={key}
                dataKey={key}
                stroke={`var(--color-${key})`}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
        <Conclusion data={data} />
      </div>
    </ExplainedCard>
  );
}
