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

import type { Credit } from "@/features/credit/use-credit";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { MoneyExample } from "@/shared/components/money-example";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { formatMoney, formatPercent, formatQuarter, formatShortPercent } from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

type Basel = Credit["basel"];

const chartConfig = {
  value: { label: "Índice de Basileia", color: "var(--credit-basel)" },
} satisfies ChartConfig;

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

// O exemplo da bandeja escala as frações da API a R$ 100 emprestados
const EXAMPLE_LOAN = 100;

// O eixo x leva um rótulo a cada 2 anos, no 4º trimestre, contados do último ano
const YEARS_PER_TICK = 2;

function HowToRead({ basel }: { basel: Basel }) {
  const last = basel.quarters.at(-1);
  if (!last) return null;
  const minimum = formatShortPercent(basel.minimum);
  const withBuffer = formatShortPercent(basel.minimum_with_buffer);
  const { example } = basel;
  const money = (share: number) => formatMoney(EXAMPLE_LOAN * share);

  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="Capital para cada real em risco" concept="basel-ratio">
        <p>
          A linha é o capital próprio dos bancos dividido pelo que eles emprestaram e investiram,
          com o empréstimo mais arriscado pesando mais. 17% quer dizer R$ 17 de capital para cada R$
          100 em risco: é o colchão que absorve calote antes de o banco quebrar.
        </p>
      </TrayItem>
      <TrayItem title="O mínimo da regra">
        <p>
          O Conselho Monetário Nacional exige {minimum} de capital sobre o risco, mais 2,5 pontos de
          colchão de conservação: {withBuffer} no total. Abaixo do colchão, o banco tem limite para
          pagar dividendos e bônus até se recompor. Quanto mais longe das linhas, mais folga.
        </p>
      </TrayItem>
      <TrayItem title="Com dinheiro na mão: de onde vêm R$ 100 emprestados">
        <MoneyExample
          rows={[
            {
              label: "Dos clientes: depósitos e aplicações, que o banco tem de devolver",
              value: money(example.clients),
            },
            {
              label: `Dos donos do banco: o capital próprio (${formatShortPercent(last.value)})`,
              value: money(last.value),
            },
            { label: "Emprestado", value: money(1), total: true },
          ]}
        >
          O índice não sai dos R$ 100 nem soma a eles: diz que, de cada R$ 100 emprestados,{" "}
          {money(last.value)} vieram dos donos. Para simplificar, todo empréstimo aqui tem o mesmo
          risco.
        </MoneyExample>
      </TrayItem>
      <TrayItem title={`E se ${money(example.loss)} não forem pagos?`}>
        <MoneyExample
          rows={[
            { label: "Emprestado que ainda volta", value: money(example.repaid) },
            { label: "O que o banco ainda deve aos clientes", value: money(example.clients) },
            {
              label: `Sobra para os donos: o capital (${formatShortPercent(example.ratio_after_loss)})`,
              value: money(example.capital_after_loss),
              total: true,
            },
          ]}
        >
          O calote não diminui o que o banco deve aos clientes, então a perda sai inteira do
          capital, e o índice cai de {formatShortPercent(last.value)} para{" "}
          {formatShortPercent(example.ratio_after_loss)}. É por isso que o capital é o colchão: os
          depósitos ficam protegidos enquanto ele aguenta.
        </MoneyExample>
      </TrayItem>
      <TrayItem title="Quanto calote cabe">
        <p>
          O banco pode perder até <strong>{money(example.loss_to_minimum)}</strong> de cada R$ 100
          emprestados antes de o índice chegar ao mínimo com o colchão, de {withBuffer}. Abaixo
          dele, já não pode pagar dividendos e bônus à vontade; abaixo de {minimum}, descumpre a
          regra e o Banco Central exige que recomponha o capital.
        </p>
      </TrayItem>
      <TrayItem title="Para que serve olhar, se existe um mínimo?">
        <p>
          A linha mostra a folga do sistema, e não só se a regra é cumprida. Quando ela desce em
          direção ao mínimo, os bancos param de emprestar para não furar a regra, e o crédito
          encolhe. E mais não é sempre melhor: o capital é o dinheiro mais caro do banco, porque os
          donos querem ganhar mais que o juro de um depósito. Capital demais deixa o crédito mais
          caro. O número diz quanto calote cabe; quanto calote está acontecendo está no cartão de
          inadimplência, logo abaixo.
        </p>
      </TrayItem>
      <TrayItem title="Por que difere um pouco do relatório do BC">
        <p>
          O app soma o capital e o risco de todas as instituições que o Banco Central publica no
          IF.data, trimestre a trimestre. O Relatório de Estabilidade Financeira faz a conta dele, e
          os dois ficam a menos de 0,1 ponto: 17,33% aqui contra 17,24% lá em dezembro de 2025.
        </p>
      </TrayItem>
    </div>
  );
}

/** O índice de Basileia do sistema a cada trimestre, com os dois mínimos da regra. */
export function BaselChart({ basel }: { basel: Basel }) {
  const first = basel.quarters.at(0);
  const last = basel.quarters.at(-1);
  if (!first || !last) return null;

  const values = basel.quarters.map((point) => point.value);
  const ticks = niceTicks(0, Math.max(...values), 4);
  const yearEnds = basel.quarters
    .map((point) => point.ref_date)
    .filter((month) => month.slice(5, 7) === "12");
  const yearTicks = yearEnds.filter(
    (_, index) => (yearEnds.length - 1 - index) % YEARS_PER_TICK === 0,
  );

  return (
    <ExplainedCard
      title="Os bancos aguentam?"
      subtitle={`Índice de Basileia do sistema, capital sobre ativos ponderados pelo risco · ${formatQuarter(first.ref_date)} a ${formatQuarter(last.ref_date)}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead basel={basel} />,
      }}
    >
      <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
        <LineChart data={basel.quarters} margin={{ left: 0, right: 40, top: 28, bottom: 4 }}>
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
          <ReferenceLine
            y={basel.minimum}
            stroke="var(--ink-2)"
            strokeDasharray="4 4"
            label={{
              value: `mínimo: ${formatShortPercent(basel.minimum)}`,
              position: "insideTopLeft",
              fill: "var(--muted-foreground)",
              fontSize: 12,
            }}
          />
          <ReferenceLine
            y={basel.minimum_with_buffer}
            stroke="var(--ink-2)"
            strokeDasharray="4 4"
            label={{
              value: `com o colchão: ${formatShortPercent(basel.minimum_with_buffer)}`,
              position: "insideBottomLeft",
              fill: "var(--muted-foreground)",
              fontSize: 12,
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const month: unknown = payload[0]?.payload?.ref_date;
                  return typeof month === "string" ? formatQuarter(month) : null;
                }}
                formatter={(value) => (
                  <span className="flex w-full items-center justify-between gap-4">
                    Índice de Basileia
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
            stroke="var(--credit-basel)"
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
