import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";

import type { ExternalSector } from "@/features/external-sector/use-external-sector";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { MoneyExample } from "@/shared/components/money-example";
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
  formatUsdBillions,
} from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

type Flow = ExternalSector["flows"][number];
type FlowsForecast = NonNullable<ExternalSector["flows_forecast"]>;

const chartConfig = {
  current_account: { label: "Transações correntes", color: "var(--trend-up)" },
  fdi: { label: "Investimento direto no país", color: "var(--ok)" },
} satisfies ChartConfig;

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
});

// Rótulo do eixo x em janeiro, a cada 2 anos
const YEARS_BETWEEN_TICKS = 2;

/** Um ano do Brasil em dólares, com o que o mercado espera para o ano na pesquisa Focus:
as transações correntes separadas em mercadorias e no resto, serviços e renda. */
function CurrentAccountExample({ forecast }: { forecast: FlowsForecast }) {
  const usd = (value: number) => formatUsdBillions(value * 1000);
  const tradeSurplus = forecast.trade_balance > 0;
  return (
    <TrayItem title={`Com dinheiro na mão: ${forecast.year} em dólares`}>
      <MoneyExample
        rows={[
          {
            label: tradeSurplus
              ? "Mercadorias: vende mais do que compra (balança comercial)"
              : "Mercadorias: compra mais do que vende (balança comercial)",
            value: usd(forecast.trade_balance),
          },
          {
            label: "Serviços e renda: frete, viagens, lucros e juros mandados para fora",
            value: usd(forecast.services_and_income),
          },
          { label: "Transações correntes", value: usd(forecast.current_account), total: true },
        ]}
      >
        O que o mercado espera para {forecast.year} (Focus de {formatDay(forecast.survey_date)}).
        {tradeSurplus && forecast.current_account < 0
          ? " Mesmo vendendo mais mercadorias do que compra, o Brasil paga mais do que recebe em serviços e em renda, e o saldo fica negativo."
          : ""}{" "}
        Quando o saldo é negativo, o dólar não acaba: o buraco é coberto pelo que entra como
        investimento direto e empréstimos, a linha verde do gráfico.
      </MoneyExample>
    </TrayItem>
  );
}

function HowToRead({ last, forecast }: { last: Flow; forecast: FlowsForecast | null }) {
  const deficit = -last.current_account;
  const covered = last.fdi >= deficit;
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="Transações correntes" concept="current-account" color="var(--trend-up)">
        <p>
          O saldo de tudo o que o Brasil compra e vende com o exterior num ano: mercadorias,
          serviços como frete e viagens, e os lucros e juros que vão e vêm. Acima de zero, entrou
          mais dólar do que saiu; abaixo, o país gastou mais lá fora do que recebeu e precisa que
          dinheiro de fora cubra a diferença.
        </p>
      </TrayItem>
      <TrayItem title="O que é entrar e sair dólar">
        <p>
          Entra dólar quando alguém de fora paga ao Brasil: compra soja, se hospeda num hotel daqui,
          põe dinheiro numa fábrica. Sai quando o Brasil paga lá fora: importa celular, viaja, a
          filial de uma empresa estrangeira manda lucro para a matriz.
        </p>
        <p>
          Um brasileiro trocar real por dólar no banco não muda a conta sozinho: o dólar só troca de
          mão aqui dentro. Ele sai quando é usado para pagar algo lá fora.
        </p>
        <Link to="/learn/explainers/dollar-flows" className="text-caption self-start font-semibold">
          Ver o caminho dos dólares no desenho →
        </Link>
      </TrayItem>
      <TrayItem title="Investimento direto no país" concept="fdi" color="var(--ok)">
        <p>
          O dinheiro que estrangeiros põem em empresas daqui: abrir uma fábrica, comprar uma
          participação grande numa empresa, emprestar para a filial. É o que vem para ficar, porque
          não dá para vender uma fábrica numa tarde de pânico.
        </p>
      </TrayItem>
      {forecast && <CurrentAccountExample forecast={forecast} />}
      <TrayItem title="As duas juntas">
        <p>
          A pergunta do gráfico é se a linha verde cobre o buraco da vermelha. Quando o investimento
          direto é maior que o déficit, o país está pagando o que gasta lá fora com dinheiro que
          veio para ficar.
        </p>
        {deficit > 0 && (
          <p>
            Em {formatMonth(last.ref_date)}: déficit de <strong>{formatPercent(deficit)}</strong> do
            PIB e investimento direto de <strong>{formatPercent(last.fdi)}</strong>.{" "}
            {covered
              ? "O investimento direto cobre o déficit."
              : "O investimento direto não cobre o déficit."}
          </p>
        )}
      </TrayItem>
      <TrayItem title="A previsão em dólares" concept="focus-survey">
        <p>
          O Focus prevê as transações correntes e o investimento direto do ano em US$ bilhões, e não
          em % do PIB. Por isso a previsão fica escrita em cima do gráfico, e não na linha.
        </p>
      </TrayItem>
      <TrayItem title="Quando preocupa" concept="fdi">
        <p>
          Se o déficit cresce e o investimento direto não acompanha, a diferença passa a ser coberta
          por dinheiro que só aplica em títulos e ações, que vai embora rápido numa crise.
        </p>
      </TrayItem>
    </div>
  );
}

/** Transações correntes e investimento direto no país, em % do PIB em 12 meses, nos
últimos 10 anos, no mesmo gráfico como o Banco Central publica. */
/** A previsão do Focus para o ano, em US$ bilhões. */
function ForecastSentence({ forecast }: { forecast: FlowsForecast }) {
  const balance = forecast.current_account < 0 ? "déficit" : "superávit";
  return (
    <p>
      O mercado espera, para {forecast.year}, {balance} de{" "}
      <strong>{formatUsdBillions(Math.abs(forecast.current_account) * 1000)}</strong> nas transações
      correntes e <strong>{formatUsdBillions(forecast.fdi * 1000)}</strong> de investimento direto
      no país (Focus de {formatDay(forecast.survey_date)}).
    </p>
  );
}

interface FlowsChartProps {
  flows: Flow[];
  forecast: ExternalSector["flows_forecast"];
}

export function FlowsChart({ flows, forecast }: FlowsChartProps) {
  const first = flows.at(0);
  const last = flows.at(-1);
  if (!first || !last) return null;
  const values = flows.flatMap((point) => [point.current_account, point.fdi]);
  const ticks = niceTicks(Math.min(0, ...values), Math.max(0, ...values), 4);
  const lastYear = Number(last.ref_date.slice(0, 4));
  const yearTicks = flows
    .filter(
      (point) =>
        point.ref_date.slice(5, 7) === "01" &&
        (lastYear - Number(point.ref_date.slice(0, 4))) % YEARS_BETWEEN_TICKS === 0,
    )
    .map((point) => point.ref_date);

  return (
    <ExplainedCard
      title="De onde vêm e para onde vão os dólares"
      subtitle={`% do PIB em 12 meses · ${formatMonthRange(first.ref_date, last.ref_date)}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead last={last} forecast={forecast} />,
      }}
    >
      <div className="flex flex-col gap-2">
        {forecast && <ForecastSentence forecast={forecast} />}
        <ChartLegend
          entries={[
            {
              key: "current_account",
              label: "Transações correntes: o saldo com o exterior",
              color: "var(--trend-up)",
              shape: "line",
            },
            {
              key: "fdi",
              label: "Investimento direto no país: o dinheiro que vem para ficar",
              color: "var(--ok)",
              shape: "line",
            },
          ]}
        />
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <LineChart data={flows} margin={{ left: 0, right: 16, top: 16, bottom: 4 }}>
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
              domain={[ticks.at(0) ?? -0.01, ticks.at(-1) ?? 0.01]}
              ticks={ticks}
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(value: number) => axisPercent.format(value).replace("-", "−")}
            />
            <ReferenceLine y={0} stroke="var(--ink-2)" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const month: unknown = payload[0]?.payload?.ref_date;
                    return typeof month === "string" ? formatMonth(month) : null;
                  }}
                  formatter={(value, name) => (
                    <span className="flex w-full items-center justify-between gap-4">
                      {name === "fdi" ? "Investimento direto" : "Transações correntes"}
                      <span className="tabular-nums">
                        {typeof value === "number" ? formatPercent(value) : ""}
                      </span>
                    </span>
                  )}
                />
              }
            />
            <Line
              dataKey="current_account"
              stroke="var(--color-current_account)"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="fdi"
              stroke="var(--color-fdi)"
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
