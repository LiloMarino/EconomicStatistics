import { Sigma } from "lucide-react";

import type { DebtOverview } from "@/features/debt/use-debt";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { Formula, FormulaBox } from "@/shared/components/formula";
import { formatMonth, formatPercent, formatPoints } from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";
import { texDecimal } from "@/shared/lib/tex";
import { cn } from "@/shared/lib/utils";

type Stabilization = DebtOverview["stabilization"];

function Calculation({ data }: { data: Stabilization }) {
  const { debt, implicit_rate: rate, nominal_growth: growth } = data;
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-x-10 gap-y-6">
      <TrayItem title="A fórmula" concept="stabilizing-primary">
        <FormulaBox
          legend={[
            { symbol: "p^*", text: <>primário que estabiliza, em fração do PIB</> },
            { symbol: "d", text: <>dívida líquida em fração do PIB: 69,26% vira 0,6926</> },
            { symbol: "r", text: <>juro implícito: juros de 12 meses ÷ dívida média</> },
            { symbol: "g", text: <>crescimento do PIB nominal em 12 meses</> },
          ]}
        >
          <Formula tex="p^* = d \times \dfrac{r - g}{1 + g}" />
        </FormulaBox>
      </TrayItem>
      <TrayItem title={`Com os números de ${formatMonth(data.ref_date)}`}>
        <FormulaBox>
          <Formula
            flushLeft
            tex={`p^* = ${texDecimal(debt, 4)} \\times \\dfrac{${texDecimal(rate, 4)} - ${texDecimal(growth, 4)}}{1 + ${texDecimal(growth, 4)}} = ${texDecimal(debt, 4)} \\times \\dfrac{${texDecimal(rate - growth, 4)}}{${texDecimal(1 + growth, 4)}}`}
          />
          <Formula
            flushLeft
            tex={`= ${texDecimal(data.stabilizing_primary, 4)} = \\mathbf{${texDecimal(data.stabilizing_primary * 100, 2)}\\%}\\ \\text{do PIB}`}
          />
        </FormulaBox>
        <p className="text-caption text-muted-foreground">
          A conta usa o juro e o crescimento observados nos últimos 12 meses. As projeções oficiais
          usam o juro e o crescimento esperados para os próximos anos, e por isso chegam a outros
          números.
        </p>
      </TrayItem>
    </div>
  );
}

/** O superávit primário feito contra o que deixaria a dívida/PIB parada, na mesma
régua em % do PIB. Enquanto o feito fica à esquerda do preciso, a dívida/PIB sobe. */
export function StabilizationCard({ data }: { data: Stabilization }) {
  const done = data.primary_surplus;
  const needed = data.stabilizing_primary;
  const ticks = niceTicks(Math.min(0, done, needed), Math.max(0, done, needed), 5);
  const low = ticks.at(0) ?? 0;
  const span = (ticks.at(-1) ?? 1) - low || 1;
  const position = (value: number) => `${((value - low) / span) * 100}%`;
  const width = (value: number) => `${(Math.abs(value) / span) * 100}%`;
  const covered = done >= needed;

  return (
    <ExplainedCard
      title="A dívida sobe ou desce?"
      subtitle="O primário que o governo faz contra o que seria preciso para a dívida/PIB ficar parada"
      explain={{
        label: "Ver a conta",
        icon: Sigma,
        heading: "VER A CONTA",
        content: <Calculation data={data} />,
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[10rem_1fr] items-center gap-x-4 gap-y-3">
          <span className="flex flex-col">
            <strong>Feito: {formatPercent(done)}</strong>
            <span className="text-caption text-muted-foreground">{formatMonth(data.ref_date)}</span>
          </span>
          <span
            className="relative h-8"
            style={{
              "--start": position(Math.min(0, done)),
              "--width": width(done),
              "--zero": position(0),
            }}
          >
            <span
              className={cn(
                "absolute inset-y-0 left-(--start) w-(--width) rounded-sm",
                covered ? "bg-ok" : "bg-trend-up",
              )}
            />
            <span className="bg-ink-2 absolute -inset-y-1 left-(--zero) w-px" />
          </span>
          <span className="flex flex-col">
            <strong>Preciso: {formatPercent(needed)}</strong>
            <span className="text-caption text-muted-foreground">para estabilizar</span>
          </span>
          <span
            className="relative h-8"
            style={{
              "--start": position(Math.min(0, needed)),
              "--width": width(needed),
              "--zero": position(0),
            }}
          >
            <span className="border-ok absolute inset-y-0 left-(--start) w-(--width) rounded-sm border-2 border-dashed" />
            <span className="bg-ink-2 absolute -inset-y-1 left-(--zero) w-px" />
          </span>
          {!covered && (
            <>
              <span className="flex flex-col">
                <strong>Falta</strong>
                <span className="text-caption text-muted-foreground">do feito ao preciso</span>
              </span>
              <span
                className="relative h-8"
                style={{
                  "--start": position(done),
                  "--width": width(needed - done),
                  "--zero": position(0),
                }}
              >
                <span className="bg-trend-up/25 border-trend-up text-small absolute inset-y-0 left-(--start) flex w-(--width) items-center justify-center rounded-sm border-2 font-bold tabular-nums">
                  {formatPoints(needed - done).replace("+", "")}
                </span>
                <span className="bg-ink-2 absolute -inset-y-1 left-(--zero) w-px" />
              </span>
            </>
          )}
          <span />
          <span className="text-small text-muted-foreground relative h-5">
            {ticks.map((tick) => (
              <span
                key={tick}
                className="absolute left-(--at) -translate-x-1/2 tabular-nums"
                style={{ "--at": position(tick) }}
              >
                {formatPercent(tick).replace(",00", "")}
              </span>
            ))}
          </span>
        </div>
        <p>
          Feito: <strong>{formatPercent(done)}</strong> do PIB · preciso:{" "}
          <strong>{formatPercent(needed)}</strong> ·{" "}
          {covered ? (
            "o primário feito já segura a dívida/PIB."
          ) : (
            <>
              distância de <strong>{formatPoints(needed - done).replace("+", "")}</strong> do PIB.
              Enquanto o feito ficar à esquerda do preciso, a dívida/PIB sobe.
            </>
          )}
        </p>
        <p className="text-caption text-muted-foreground">
          % do PIB em 12 meses · positivo é superávit, negativo é déficit
        </p>
      </div>
    </ExplainedCard>
  );
}
