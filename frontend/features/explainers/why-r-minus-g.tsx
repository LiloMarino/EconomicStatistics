import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Link } from "react-router-dom";

import { useDebt } from "@/features/debt/use-debt";
import { type DebtCase, useDebtCases } from "@/features/simulator/use-simulator";
import { ChartLegend } from "@/shared/components/chart-legend";
import { Formula, FormulaBox } from "@/shared/components/formula";
import { Button } from "@/shared/components/ui/button";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import {
  formatMonth,
  formatPercent,
  formatPoints,
  formatShortPercent,
  formatWholePercent,
} from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";

const chartConfig = {
  a: { label: "País A", color: "var(--sim-country-a)" },
  b: { label: "País B", color: "var(--sim-country-b)" },
} satisfies ChartConfig;

// Os anos que a tabela de cada país mostra: hoje, o primeiro, o quinto e o último
const TABLE_YEARS = [0, 1, 5, 10];

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

/** "Dívida de 120%, juro de 2%, crescimento de 6%, primário zero" */
function describe(debtCase: DebtCase): string {
  const primary = formatShortPercent(Math.abs(debtCase.primary));
  const primaryText =
    debtCase.primary === 0
      ? "primário zero"
      : `${debtCase.primary > 0 ? "superávit" : "déficit"} primário de ${primary}`;
  return `Dívida de ${formatWholePercent(debtCase.debt)}, juro de ${formatShortPercent(debtCase.rate)}, crescimento de ${formatShortPercent(debtCase.growth)}, ${primaryText}`;
}

function year(t: number): string {
  return t === 0 ? "hoje" : `+${t}`;
}

function CountryCard({
  name,
  debtCase,
  color,
}: {
  name: string;
  debtCase: DebtCase;
  color: string;
}) {
  const start = debtCase.path[0] ?? debtCase.debt;
  return (
    <div
      className="bg-card flex flex-col gap-2.5 rounded-xl border-t-4 border-(--country) p-4"
      style={{ "--country": color }}
    >
      <strong className="text-lg">{name}</strong>
      <span className="text-caption text-muted-foreground">{describe(debtCase)}</span>
      <table className="text-caption w-full">
        <thead className="text-muted-foreground">
          <tr>
            <th scope="col" className="text-left font-normal">
              Ano
            </th>
            <th scope="col" className="text-right font-normal">
              Dívida
            </th>
            <th scope="col" className="text-right font-normal">
              Mudança
            </th>
          </tr>
        </thead>
        <tbody>
          {TABLE_YEARS.map((t) => {
            const value = debtCase.path[t];
            if (value === undefined) return null;
            return (
              <tr key={t}>
                <td>{year(t)}</td>
                <td className="text-right font-bold">{formatShortPercent(value)}</td>
                <td className="text-muted-foreground text-right">
                  {t === 0 ? "" : formatPoints(value - start)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** A trajetória dos dois países ano a ano. */
function PathChart({ a, b }: { a: DebtCase; b: DebtCase }) {
  const data = a.path.map((value, t) => ({ t, a: value, b: b.path[t] }));
  const ticks = niceTicks(0, Math.max(...a.path, ...b.path), 4);

  return (
    <div className="bg-card flex flex-col gap-2 rounded-xl p-4">
      <ChartLegend
        entries={[
          {
            key: "a",
            label: `País A: ${formatShortPercent(a.end)} em ${a.path.length - 1} anos`,
            color: "var(--sim-country-a)",
            shape: "line",
          },
          {
            key: "b",
            label: `País B: ${formatShortPercent(b.end)} em ${b.path.length - 1} anos`,
            color: "var(--sim-country-b)",
            shape: "line",
          },
        ]}
      />
      <div
        role="img"
        aria-label={`País A vai de ${formatShortPercent(a.debt)} a ${formatShortPercent(a.end)} e País B vai de ${formatShortPercent(b.debt)} a ${formatShortPercent(b.end)}`}
      >
        <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
          <LineChart data={data} margin={{ left: 0, right: 16, top: 16, bottom: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="t"
              tickLine={false}
              axisLine={false}
              tickFormatter={(t: number) => year(t)}
            />
            <YAxis
              domain={[ticks.at(0) ?? 0, ticks.at(-1) ?? 1]}
              ticks={ticks}
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(value: number) => axisPercent.format(value)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const t: unknown = payload[0]?.payload?.t;
                    return typeof t === "number" ? year(t) : null;
                  }}
                  formatter={(value, name) => (
                    <span className="flex w-full items-center justify-between gap-4">
                      {name === "a" ? "País A" : "País B"}
                      <span className="tabular-nums">
                        {typeof value === "number" ? formatShortPercent(value) : ""}
                      </span>
                    </span>
                  )}
                />
              }
            />
            <Line
              dataKey="a"
              stroke="var(--color-a)"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="b"
              stroke="var(--color-b)"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}

/** r − g: a corrida entre o juro que a dívida paga e o crescimento da economia, com dois
países de exemplo vindos do simulador e o Brasil de hoje. */
export function WhyRMinusG() {
  const cases = useDebtCases().data?.cases;
  const brazil = useDebt().data?.stabilization;
  const countryA = cases?.find((item) => item.id === "country_a");
  const countryB = cases?.find((item) => item.id === "country_b");

  return (
    <>
      <div className="flex max-w-prose flex-col gap-4 text-lg leading-relaxed">
        <p>
          Olhar só o tamanho da dívida engana. Um país com dívida de 120% do PIB pode ver ela cair
          sozinha, enquanto outro, com metade disso, vê a dele dobrar. O que decide é uma corrida
          entre duas taxas.
        </p>
        <p>
          A dívida cresce todo ano pelo juro que paga, o <strong>r</strong>. A economia cresce pelo
          seu ritmo nominal, o <strong>g</strong>. Como o que importa é a dívida em relação ao PIB,
          quem corre mais rápido ganha.
        </p>
      </div>

      {/* A conta de um ano */}
      <section className="flex flex-col gap-3.5">
        <h2 className="font-heading text-section-title">A conta de um ano</h2>
        <div className="max-w-2xl">
          <FormulaBox
            legend={[
              { symbol: "d", text: "dívida em % do PIB" },
              { symbol: "r", text: "juro médio que a dívida paga" },
              { symbol: "g", text: "crescimento do PIB nominal: real mais inflação" },
              { symbol: "p", text: "primário: o que sobra das contas antes dos juros" },
            ]}
          >
            <Formula tex="d_{t+1} = d_t \times \frac{1+r}{1+g} - p" />
          </FormulaBox>
        </div>
        <p className="max-w-prose text-lg leading-relaxed">
          Se r é maior que g, a fração passa de 1 e a dívida/PIB cresce mesmo com primário zero. Se
          r é menor que g, ela encolhe sozinha. O primário só acelera ou freia a corrida.
        </p>
      </section>

      {/* Dois países, dez anos */}
      {countryA && countryB && (
        <section className="flex flex-col gap-3.5">
          <h2 className="font-heading text-section-title">Dois países, dez anos</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3.5">
            <CountryCard name="País A" debtCase={countryA} color="var(--sim-country-a)" />
            <CountryCard name="País B" debtCase={countryB} color="var(--sim-country-b)" />
          </div>
          <PathChart a={countryA} b={countryB} />
          <p className="max-w-prose text-lg leading-relaxed">
            Em dez anos as posições se invertem: o país que começa com o dobro da dívida termina com{" "}
            {formatShortPercent(countryA.end)}, e o outro, com {formatShortPercent(countryB.end)}.
            Não houve mágica fiscal no País A, só um juro menor que o crescimento.
          </p>
          <Button
            variant="outline"
            className="self-start"
            render={<Link to="/simulator?base=country_a&compare=country_b" />}
            nativeButton={false}
          >
            Mexer nesses números no simulador →
          </Button>
        </section>
      )}

      {/* O Brasil */}
      <section className="flex flex-col gap-3.5">
        <h2 className="font-heading text-section-title">E o Brasil?</h2>
        <div className="flex max-w-prose flex-col gap-4 text-lg leading-relaxed">
          {brazil && (
            <p>
              Em {formatMonth(brazil.ref_date)}, o juro implícito da dívida (r) é{" "}
              {formatPercent(brazil.implicit_rate)} em 12 meses e o crescimento do PIB nominal (g) é{" "}
              {formatPercent(brazil.nominal_growth)}.{" "}
              {brazil.implicit_rate > brazil.nominal_growth
                ? "Com r acima de g, o país precisa de superávit primário só para a dívida/PIB ficar parada, e um déficit pequeno já faz ela subir."
                : "Com g acima de r, a dívida/PIB encolhe sozinha."}
            </p>
          )}
          <p>
            A exceção recente foi 2021: a inflação alta inflou o PIB nominal, g passou r, e a dívida
            líquida caiu de 61,4% do PIB em dezembro de 2020 para 55,1% em dezembro de 2021. É o
            efeito que costuma enganar quem lê só o número da dívida.
          </p>
        </div>
        <Link to="/debt" className="text-caption self-start font-semibold">
          Ver r, g e o primário que estabiliza na tela Dívida →
        </Link>
      </section>
    </>
  );
}
