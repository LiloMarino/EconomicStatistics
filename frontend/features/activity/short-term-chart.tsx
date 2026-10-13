import { BookOpen } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";

import type { Activity } from "@/features/activity/use-activity";
import { type ShortTermStep, shortTermSteps } from "@/features/activity/use-short-term-view";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";
import {
  formatMonth,
  formatMonthRange,
  formatQuarter,
  formatSignedPercent,
} from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

type Change = Activity["ibc"]["month_on_month"][number];

const chartConfig = {
  grew: { label: "Cresceu", color: "var(--color-activity-grew)" },
  shrank: { label: "Encolheu", color: "var(--color-activity-shrank)" },
} satisfies ChartConfig;

const seriesNames = new Map<string, string>(
  Object.entries(chartConfig).map(([key, item]) => [key, item.label]),
);

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
});

const stepLabels: Record<ShortTermStep, string> = {
  months: "Mês a mês",
  quarters: "Trimestre a trimestre",
};

/** O que muda entre o IBC-Br mês a mês e o PIB trimestre a trimestre. */
const stepTexts: Record<
  ShortTermStep,
  {
    title: string;
    source: string;
    period: string;
    periods: string;
    format: (refDate: string) => string;
    range: (first: string, last: string) => string;
  }
> = {
  months: {
    title: "Cresceu ou encolheu no último mês?",
    source: "IBC-Br com ajuste sazonal, % contra o mês anterior",
    period: "mês",
    periods: "meses",
    format: formatMonth,
    range: formatMonthRange,
  },
  quarters: {
    title: "Cresceu ou encolheu no último trimestre?",
    source: "PIB com ajuste sazonal, % contra o trimestre anterior",
    period: "trimestre",
    periods: "trimestres",
    format: formatQuarter,
    range: (first, last) => `${formatQuarter(first)} a ${formatQuarter(last)}`,
  },
};

/** Quantos períodos seguidos, terminando no último, andaram na mesma direção que ele. */
function trailingStreak(changes: Change[]): number {
  const last = changes.at(-1);
  if (!last) return 0;
  const shrank = last.value < 0;
  let streak = 0;
  for (const change of changes.toReversed()) {
    if (change.value < 0 !== shrank) break;
    streak += 1;
  }
  return streak;
}

function HowToRead({ step }: { step: ShortTermStep }) {
  const byMonth = step === "months";
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="O que cada barra é">
        {byMonth ? (
          <p>
            Quanto a economia produziu a mais ou a menos que no mês anterior, pelo IBC-Br com ajuste
            sazonal. Barra acima de zero, cresceu; abaixo, encolheu.
          </p>
        ) : (
          <p>
            Quanto o país produziu a mais ou a menos que no trimestre anterior, pelo PIB do IBGE com
            ajuste sazonal. É o número da manchete do IBGE a cada trimestre.
          </p>
        )}
      </TrayItem>
      <TrayItem title="Por que com ajuste sazonal" concept="seasonal-adjustment">
        <p>
          Todo março produz mais que fevereiro: tem mais dias úteis e é o pico da safra de soja. Sem
          o ajuste, o IBC-Br subiu 10,5% de fevereiro para março de 2026; com ele, caiu 0,13%. O
          ajuste tira o vaivém típico de cada época, e sobra o que mudou de verdade.
        </p>
      </TrayItem>
      <TrayItem title="E o 12 meses?" concept="rolling-12m">
        <p>
          O gráfico de cima é a média de um ano inteiro; este é o passo de cada{" "}
          {stepTexts[step].period}. Passos fracos puxam o 12 meses para baixo aos poucos, e ele só
          fica negativo depois de vários. Por isso o 12 meses pode estar acima de zero com a
          economia já encolhendo.
        </p>
      </TrayItem>
      {byMonth ? (
        <TrayItem title="Um mês só engana" concept="ibc-br">
          <p>
            O IBC-Br oscila de um mês para o outro, e um mês fraco seguido de um forte é comum. Vale
            mais a sequência que o mês isolado: três meses seguidos na mesma direção dizem mais que
            um.
          </p>
        </TrayItem>
      ) : (
        <TrayItem title="Recessão técnica" concept="gdp">
          <p>
            Dois trimestres seguidos de queda do PIB contra o trimestre anterior é o que o
            noticiário chama de recessão técnica. É uma regra de bolso: a datação oficial das
            recessões no Brasil é do Codace, da FGV, que olha também o emprego e a renda.
          </p>
        </TrayItem>
      )}
      <TrayItem title="As barras antigas mudam">
        <p>
          A cada divulgação, a fonte refaz o ajuste sazonal da série inteira, e os{" "}
          {byMonth ? "meses" : "trimestres"} passados podem mudar um pouco. O app busca a série toda
          de novo a cada {stepTexts[step].period} publicado.
        </p>
      </TrayItem>
    </div>
  );
}

interface ShortTermChartProps {
  gdp: Activity["gdp"];
  ibc: Activity["ibc"];
  step: ShortTermStep;
  onStepChange: (step: ShortTermStep) => void;
}

/** Cada mês do IBC-Br contra o anterior, ou cada trimestre do PIB contra o anterior, as
duas séries com ajuste sazonal: o passo curto que a média de 12 meses esconde. */
export function ShortTermChart({ gdp, ibc, step, onStepChange }: ShortTermChartProps) {
  const changes = step === "months" ? ibc.month_on_month : gdp.quarter_on_quarter;
  const first = changes.at(0);
  const last = changes.at(-1);
  if (!first || !last) return null;
  const texts = stepTexts[step];
  const streak = trailingStreak(changes);
  const direction = last.value < 0 ? "queda" : "alta";
  // A sequência só enxerga a janela do gráfico: quando ela cobre tudo, a frase diz isso
  const streakText =
    streak === changes.length
      ? `${direction} em todos os ${streak} ${texts.periods} do gráfico`
      : `${streak}º ${texts.period} seguido de ${direction}`;

  const rows = changes.map((change) => ({
    ref_date: change.ref_date,
    grew: change.value >= 0 ? change.value : null,
    shrank: change.value < 0 ? change.value : null,
  }));
  const values = changes.map((change) => change.value);
  const ticks = niceTicks(Math.min(0, ...values), Math.max(0, ...values), 4);
  // Um rótulo por ano, no primeiro período dele
  const firstPeriod = step === "months" ? "01" : "03";
  const yearTicks = changes
    .filter((change) => change.ref_date.slice(5, 7) === firstPeriod)
    .map((change) => change.ref_date);

  return (
    <ExplainedCard
      title={texts.title}
      subtitle={`${texts.source} · ${texts.range(first.ref_date, last.ref_date)}`}
      actions={
        <ToggleGroup
          variant="segmented"
          size="sm"
          aria-label="Passo"
          value={[step]}
          onValueChange={([next]) => {
            const chosen = shortTermSteps.find((item) => item === next);
            if (chosen) onStepChange(chosen);
          }}
        >
          {shortTermSteps.map((item) => (
            <ToggleGroupItem key={item} value={item}>
              {stepLabels[item]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      }
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead step={step} />,
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <ChartLegend
            entries={[
              {
                key: "grew",
                label: "Cresceu",
                color: "var(--color-activity-grew)",
                shape: "square",
              },
              {
                key: "shrank",
                label: "Encolheu",
                color: "var(--color-activity-shrank)",
                shape: "square",
              },
            ]}
          />
          <span className="text-caption text-muted-foreground">
            {texts.format(last.ref_date)}:{" "}
            <strong className="text-foreground">{formatSignedPercent(last.value)}</strong>
            {streak > 1 && ` · ${streakText}`}
          </span>
        </div>
        <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
          <BarChart
            data={rows}
            barCategoryGap="20%"
            margin={{ left: 0, right: 8, top: 16, bottom: 4 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="ref_date"
              ticks={yearTicks}
              interval={0}
              tickLine={false}
              axisLine={false}
              tickFormatter={(refDate: string) => refDate.slice(0, 4)}
            />
            <YAxis
              domain={[ticks.at(0) ?? 0, ticks.at(-1) ?? 1]}
              ticks={ticks}
              tickLine={false}
              axisLine={false}
              width={52}
              tickFormatter={(value: number) => axisPercent.format(value).replace("-", "−")}
            />
            <ReferenceLine y={0} stroke="var(--ink-2)" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const refDate: unknown = payload[0]?.payload?.ref_date;
                    return typeof refDate === "string" ? texts.format(refDate) : null;
                  }}
                  formatter={(value, name) => (
                    <span className="flex w-full items-center justify-between gap-4">
                      {seriesNames.get(String(name))}
                      <span className="tabular-nums">
                        {typeof value === "number" ? formatSignedPercent(value) : ""}
                      </span>
                    </span>
                  )}
                  filterNull
                />
              }
            />
            {(["grew", "shrank"] as const).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="change"
                fill={`var(--color-${key})`}
                maxBarSize={18}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </div>
    </ExplainedCard>
  );
}
