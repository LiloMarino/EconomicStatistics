import { caseColor, scenarioColor } from "@/features/simulator/identity";
import type { DebtCase, DebtCaseId, Simulation } from "@/features/simulator/use-simulator";
import { ColorSwatch } from "@/shared/components/color-swatch";
import { formatPercent, formatPoints } from "@/shared/lib/format";

const COLUMNS = "grid grid-cols-[minmax(160px,1.4fr)_repeat(3,minmax(100px,1fr))] gap-x-2";

interface Row {
  key: string;
  label: string;
  color: string;
  start: number;
  end: number;
  rateMinusGrowth: number;
}

/** O cenário e cada comparação ligada, com a dívida de hoje, a de daqui a `years` anos e o
r − g de cada um. */
export function SideBySideTable({
  simulation,
  scenarioDebt,
  cases,
  compared,
}: {
  simulation: Simulation;
  scenarioDebt: number;
  cases: DebtCase[];
  compared: DebtCaseId[];
}) {
  const rows: Row[] = [
    {
      key: "me",
      label: "Seu cenário",
      color: scenarioColor,
      start: scenarioDebt,
      end: simulation.end,
      rateMinusGrowth: simulation.rate_minus_growth,
    },
    ...cases
      .filter((item) => compared.includes(item.id))
      .map((item) => ({
        key: item.id,
        label: item.label,
        color: caseColor[item.id],
        start: item.debt,
        end: item.end,
        rateMinusGrowth: item.rate_minus_growth,
      })),
  ];

  return (
    <section aria-label="Lado a lado" className="flex flex-col gap-2 border-t pt-4">
      <p className="text-eyebrow text-muted-foreground">LADO A LADO</p>
      <div className="overflow-x-auto">
        <div role="table" aria-label="Resultado de cada cenário no gráfico" className="min-w-120">
          <div role="row" className={`${COLUMNS} text-eyebrow text-muted-foreground border-b py-2`}>
            <span role="columnheader">CENÁRIO</span>
            <span role="columnheader" className="text-right">
              HOJE
            </span>
            <span role="columnheader" className="text-right">
              EM {simulation.years} ANOS
            </span>
            <span role="columnheader" className="text-right">
              R − G
            </span>
          </div>
          {rows.map((row) => (
            <div
              key={row.key}
              role="row"
              className={`${COLUMNS} text-table items-center border-b py-2.5 last:border-b-0`}
            >
              <span role="rowheader" className="flex items-center gap-2 font-semibold">
                <ColorSwatch color={row.color} shape="line" />
                {row.label}
              </span>
              <span role="cell" className="text-right tabular-nums">
                {formatPercent(row.start)}
              </span>
              <strong role="cell" className="text-right tabular-nums">
                {formatPercent(row.end)}
              </strong>
              <span role="cell" className="text-right tabular-nums">
                {formatPoints(row.rateMinusGrowth)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
