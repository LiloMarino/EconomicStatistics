import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";

import { caseColor, countryIdentity } from "@/features/simulator/identity";
import type {
  Country,
  CountryHistories,
  CountryHistory,
  DebtCase,
} from "@/features/simulator/use-simulator";
import { useHistoryCountries } from "@/features/simulator/use-simulator-view";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ColorSwatch } from "@/shared/components/color-swatch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { Toggle } from "@/shared/components/ui/toggle";
import { formatPercent } from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

// O gráfico começa aqui: antes de 2005 o FMI não tem a dívida do Brasil nem da Argentina
const FIRST_YEAR = 2005;

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

// Os acontecimentos que explicam as curvas, marcados no ano em que ocorreram
const events = [
  { year: 2010, label: "resgate da Grécia" },
  { year: 2012, label: "reestruturação" },
  { year: 2020, label: "pandemia" },
];

// Como o juro andou contra o crescimento em cada país
const rateAgainstGrowth: Record<Country, string> = {
  JPN: "Juro perto de zero por décadas",
  GRC: "Juro disparou na crise de 2010",
  ARG: "Crises de câmbio e calotes em 2001 e 2020",
  BRA: "Juro alto, acima do crescimento",
};

const chartConfig = Object.fromEntries(
  Object.entries(countryIdentity).map(([country, item]) => [
    country,
    { label: item.label, color: caseColor[item.caseId] },
  ]),
) satisfies ChartConfig;

function InflationCell({ history }: { history: CountryHistory }) {
  const { inflation } = history;
  return inflation ? `${formatPercent(inflation.value)} (${inflation.year})` : "Sem dado";
}

function CountryTable({ histories, cases }: { histories: CountryHistory[]; cases: DebtCase[] }) {
  const columns = histories.map((history) => ({
    history,
    context: cases.find((item) => item.id === countryIdentity[history.country].caseId)?.context,
  }));
  const rows = [
    {
      label: "Moeda da dívida",
      cell: (column: (typeof columns)[number]) => column.context?.currency,
    },
    { label: "Quem empresta", cell: (column: (typeof columns)[number]) => column.context?.lender },
    {
      label: "Juro contra crescimento",
      cell: (column: (typeof columns)[number]) => rateAgainstGrowth[column.history.country],
    },
    { label: "O que aconteceu", cell: (column: (typeof columns)[number]) => column.context?.story },
    {
      label: "Inflação no último ano",
      cell: (column: (typeof columns)[number]) => <InflationCell history={column.history} />,
    },
  ];
  return (
    <div className="overflow-x-auto">
      <div
        role="table"
        aria-label="O que separa os países"
        className="text-caption grid min-w-190 grid-cols-[minmax(150px,0.9fr)_repeat(4,minmax(150px,1fr))]"
      >
        <span role="columnheader" />
        {columns.map(({ history }) => (
          <span
            key={history.country}
            role="columnheader"
            className="flex items-center gap-2 border-b px-2.5 py-3 font-bold"
          >
            <ColorSwatch color={caseColor[countryIdentity[history.country].caseId]} shape="line" />
            {countryIdentity[history.country].label}
          </span>
        ))}
        {rows.map((row) => (
          <div key={row.label} role="row" className="col-span-full grid grid-cols-subgrid">
            <span
              role="rowheader"
              className="text-muted-foreground border-b px-2.5 py-3 font-semibold"
            >
              {row.label}
            </span>
            {columns.map((column) => (
              <span key={column.history.country} role="cell" className="border-b px-2.5 py-3">
                {row.cell(column)}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** A dívida bruta do governo geral de Japão, Grécia, Argentina e Brasil, ano a ano, e o que
separa os quatro países. Fonte: FMI. */
export function HistorySection({ data, cases }: { data: CountryHistories; cases: DebtCase[] }) {
  const available = data.countries.map((item) => item.country);
  const { shown, toggle } = useHistoryCountries(available);
  const visible = data.countries.filter((item) => shown.includes(item.country));
  const lastYear = Math.max(
    ...data.countries.flatMap((item) => item.debt.map((point) => point.year)),
  );
  const rows = Array.from({ length: lastYear - FIRST_YEAR + 1 }, (_, index) => {
    const year = FIRST_YEAR + index;
    return {
      year,
      ...Object.fromEntries(
        data.countries.map((item) => [
          item.country,
          item.debt.find((point) => point.year === year)?.value ?? null,
        ]),
      ),
    };
  });
  const values = visible.flatMap((item) => item.debt.map((point) => point.value));
  const ticks = niceTicks(0, Math.max(0, ...values), 5);

  return (
    <Card variant="sheet">
      <CardHeader>
        <CardTitle>
          <h2>O que aconteceu de verdade</h2>
        </CardTitle>
        <CardDescription>
          Dívida bruta do governo em % do PIB, {FIRST_YEAR} a {lastYear} · as mesmas cores do
          simulador
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div role="group" aria-label="Países" className="flex flex-wrap gap-2">
          {data.countries.map((item) => (
            <Toggle
              key={item.country}
              variant="chip"
              pressed={shown.includes(item.country)}
              onPressedChange={() => toggle(item.country)}
            >
              <ColorSwatch color={caseColor[countryIdentity[item.country].caseId]} shape="line" />
              {countryIdentity[item.country].label}
            </Toggle>
          ))}
        </div>
        <ChartLegend
          entries={visible.map((item) => ({
            key: item.country,
            label: countryIdentity[item.country].label,
            color: caseColor[countryIdentity[item.country].caseId],
            shape: "line" as const,
          }))}
        />
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <LineChart data={rows} margin={{ left: 0, right: 24, top: 16, bottom: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              interval={0}
              ticks={rows.map((row) => row.year).filter((year) => year % 5 === 0)}
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
            {events
              .filter((event) => event.year >= FIRST_YEAR && event.year <= lastYear)
              .map((event) => (
                <ReferenceLine
                  key={event.year}
                  x={event.year}
                  stroke="var(--border)"
                  strokeDasharray="3 4"
                  label={{
                    value: event.label,
                    position: "insideTopRight",
                    fill: "var(--muted-foreground)",
                    fontSize: 12,
                  }}
                />
              ))}
            {visible.map((item) => (
              <Line
                key={item.country}
                dataKey={item.country}
                stroke={`var(--color-${item.country})`}
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
        <CountryTable histories={data.countries} cases={cases} />
      </CardContent>
    </Card>
  );
}
