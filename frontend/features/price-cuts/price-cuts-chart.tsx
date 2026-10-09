import { BookOpen } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { PriceCuts } from "@/features/price-cuts/use-price-cuts";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ColorSwatch } from "@/shared/components/color-swatch";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { forecastLegendEntry } from "@/shared/components/forecast-legend";
import { ForecastSpan } from "@/shared/components/forecast-span";
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
  formatShortMonth,
} from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

const CUTS = [
  { key: "free", label: "Livres", color: "var(--price-free)" },
  { key: "administered", label: "Administrados", color: "var(--price-administered)" },
  { key: "services", label: "Serviços", color: "var(--price-services)" },
] as const satisfies { key: keyof PriceCuts; label: string; color: string }[];

const chartConfig = {
  free: { label: "Livres", color: "var(--price-free)" },
  administered: { label: "Administrados", color: "var(--price-administered)" },
  services: { label: "Serviços", color: "var(--price-services)" },
  freeForecast: { label: "Livres (Focus)", color: "var(--forecast)" },
  administeredForecast: { label: "Administrados (Focus)", color: "var(--forecast)" },
  servicesForecast: { label: "Serviços (Focus)", color: "var(--forecast)" },
} satisfies ChartConfig;

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
});

function HowToRead({ surveyDate }: { surveyDate: string | undefined }) {
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="Livres" concept="free-prices" color="var(--price-free)">
        <p>
          O mercado forma o preço, pela oferta e pela demanda. São a maior parte da cesta do IPCA, e
          os serviços estão dentro deles.
        </p>
      </TrayItem>
      <TrayItem
        title="Administrados"
        concept="administered-prices"
        color="var(--price-administered)"
      >
        <p>
          Preços sob a influência de governo ou de agência reguladora, como a tarifa de energia, o
          transporte público e o plano de saúde. Mudam por reajuste e por decisão, e o juro do Banco
          Central pouco mexe com eles.
        </p>
      </TrayItem>
      <TrayItem title="Serviços" concept="services-inflation" color="var(--price-services)">
        <p>
          O que é intangível, como aluguel e manutenção. O preço de um serviço segue em boa parte o
          salário de quem o presta, por isso ele carrega a inflação de ontem, e o Banco Central olha
          para ele ao decidir a Selic.
        </p>
      </TrayItem>
      {surveyDate && (
        <TrayItem title="A previsão" concept="focus-survey" color="var(--forecast)">
          <p>
            A linha tracejada compõe os meses reais com a inflação de cada corte que o mercado
            espera, mês a mês, na pesquisa Focus de {formatDay(surveyDate)}.
          </p>
        </TrayItem>
      )}
    </div>
  );
}

/** O IPCA em 12 meses de livres, administrados e serviços, seguido da previsão do Focus
para cada um. */
export function PriceCutsChart({ data }: { data: PriceCuts }) {
  const lines = CUTS.map((cut) => {
    const { months, forecast } = data[cut.key];
    return {
      ...cut,
      real: new Map(months.map((month) => [month.ref_date, month.value])),
      expected: new Map((forecast?.months ?? []).map((month) => [month.ref_date, month.value])),
      last: months.at(-1),
      surveyDate: forecast?.survey_date,
    };
  });
  const dates = [
    ...new Set(lines.flatMap((line) => [...line.real.keys(), ...line.expected.keys()])),
  ].toSorted();
  const first = dates.at(0);
  const lastReal = lines
    .flatMap((line) => (line.last ? [line.last.ref_date] : []))
    .toSorted()
    .at(-1);
  const forecastEnd = lines
    .flatMap((line) => [...line.expected.keys()])
    .toSorted()
    .at(-1);
  if (!first || !lastReal) return null;
  const surveyDate = lines.find((line) => line.surveyDate)?.surveyDate;

  // O último mês real de cada corte abre também a linha dele da previsão, para as duas
  // se emendarem
  const rows = dates.map((ref_date) => {
    const row: Record<string, string | number | null> = { ref_date };
    for (const line of lines) {
      row[line.key] = line.real.get(ref_date) ?? null;
      row[`${line.key}Forecast`] =
        line.expected.get(ref_date) ??
        (line.expected.size > 0 && line.last?.ref_date === ref_date ? line.last.value : null);
    }
    return row;
  });
  const values = rows.flatMap((row) =>
    Object.entries(row).flatMap(([key, value]) =>
      key !== "ref_date" && typeof value === "number" ? [value] : [],
    ),
  );
  const ticks = niceTicks(Math.min(...values), Math.max(...values), 4);
  const yearTicks = dates.filter((date) => date.slice(5, 7) === "01");

  return (
    <ExplainedCard
      title="Livres, administrados e serviços"
      subtitle={`IPCA em 12 meses por forma de formação do preço · ${formatMonthRange(first, lastReal)}${forecastEnd ? ` e a previsão até ${formatMonth(forecastEnd)}` : ""}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead surveyDate={surveyDate} />,
      }}
    >
      <div className="flex flex-col gap-2">
        <ChartLegend
          entries={[
            ...lines.map((line) => ({
              key: line.key,
              label: line.last ? `${line.label} · ${formatPercent(line.last.value)}` : line.label,
              color: line.color,
              shape: "line" as const,
            })),
            ...(forecastEnd ? [forecastLegendEntry("Focus")] : []),
          ]}
        />
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <LineChart data={rows} margin={{ left: 0, right: 40, top: 28, bottom: 4 }}>
            <CartesianGrid vertical={false} />
            {surveyDate && forecastEnd && (
              <ForecastSpan from={lastReal} to={forecastEnd} surveyDate={surveyDate} />
            )}
            <XAxis
              dataKey="ref_date"
              ticks={yearTicks}
              tickLine={false}
              axisLine={false}
              interval={0}
              tickFormatter={(month: string) => `${formatShortMonth(month)}/${month.slice(2, 4)}`}
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
                  formatter={(value, name) => {
                    const line = lines.find((item) => item.key === name);
                    return (
                      <span className="flex w-full items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-1.5">
                          <ColorSwatch
                            color={line?.color ?? "var(--forecast)"}
                            shape={line ? "line" : "dashed"}
                          />
                          {chartConfig[name as keyof typeof chartConfig].label}
                        </span>
                        <span className="tabular-nums">
                          {typeof value === "number" ? formatPercent(value) : ""}
                        </span>
                      </span>
                    );
                  }}
                  filterNull
                />
              }
            />
            {lines.map((line) => (
              <Line
                key={`${line.key}Forecast`}
                dataKey={`${line.key}Forecast`}
                stroke="var(--forecast)"
                strokeWidth={2.5}
                strokeDasharray="5 4"
                dot={false}
                isAnimationActive={false}
              />
            ))}
            {lines.map((line) => (
              <Line
                key={line.key}
                dataKey={line.key}
                stroke={line.color}
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </div>
    </ExplainedCard>
  );
}
