import { Sigma } from "lucide-react";
import { useState } from "react";

import type { InflationGroups } from "@/features/inflation/use-inflation-groups";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { Formula, FormulaBox } from "@/shared/components/formula";
import { GroupChip } from "@/shared/components/group-chip";
import { formatMonthRange, formatPercent } from "@/shared/lib/format";
import { groupIdentity, type IpcaSeriesId, isIpcaSeries } from "@/shared/lib/group-identity";
import { niceTicks } from "@/shared/lib/nice-scale";
import { seriesLabels } from "@/shared/lib/series-labels";
import { texDecimal } from "@/shared/lib/tex";
import { cn } from "@/shared/lib/utils";

// Com mais meses que isto, a conta mostra os 3 primeiros e os 2 últimos fatores
const MAX_TERMS = 12;
const TERMS_PER_LINE = 3;

/** O termo (1 ± r) de cada mês, em TeX. */
function term(rate: number): string {
  const sign = rate < 0 ? "-" : "+";
  return `(1 ${sign} ${texDecimal(Math.abs(rate), 4)})`;
}

function chunks<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  );
}

/** A conta do acumulado de um grupo com os números de cada mês. */
function Calculation({ data, seriesId }: { data: InflationGroups; seriesId: IpcaSeriesId }) {
  const accumulated = data.accumulated.find((item) => item.series_id === seriesId);
  const rates = data.monthly.filter((item) => item.series_id === seriesId).map((item) => item.rate);
  if (!accumulated) return null;
  const shown = rates.length > MAX_TERMS ? [...rates.slice(0, 3), null, ...rates.slice(-2)] : rates;
  const terms = shown.map((rate) => (rate === null ? "\\cdots" : term(rate)));
  const factors = shown.map((rate) => (rate === null ? "\\cdots" : texDecimal(1 + rate, 4)));
  const label = seriesLabels[seriesId];
  const period = formatMonthRange(data.period.start, data.period.end);

  return (
    <>
      <p className="col-span-full">
        Os meses se multiplicam: a alta de cada mês incide sobre um preço que já tinha subido. Toque
        em outro grupo para refazer a conta com os números dele.
      </p>
      <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
        <TrayItem title="A fórmula">
          <FormulaBox
            legend={[
              {
                symbol: "r_i",
                text: <>variação do mês i, em fração: 0,52% vira 0,0052</>,
              },
              { symbol: "n", text: <>quantos meses tem o período ({rates.length} aqui)</> },
              { symbol: "\\prod", text: <>multiplica todos os termos, do mês 1 ao mês n</> },
            ]}
          >
            <Formula tex="\text{acumulado} = \prod_{i=1}^{n} (1 + r_i) - 1" />
          </FormulaBox>
        </TrayItem>
        <TrayItem title={`Com os números de ${label}, ${period}`}>
          <FormulaBox>
            {[...chunks(terms, TERMS_PER_LINE), ...chunks(factors, TERMS_PER_LINE + 1)].map(
              (line, index, lines) => {
                const termLines = Math.ceil(terms.length / TERMS_PER_LINE);
                const opensBlock = index === 0 || index === termLines;
                const closesBlock = index === termLines - 1 || index === lines.length - 1;
                return (
                  <Formula
                    key={`line-${index}`}
                    flushLeft
                    tex={`${opensBlock ? "=" : "\\quad\\times"} ${line.join(" \\times ")}${closesBlock ? " - 1" : ""}`}
                  />
                );
              },
            )}
            <Formula
              flushLeft
              tex={`= ${texDecimal(1 + accumulated.rate, 5)} - 1 = ${texDecimal(accumulated.rate, 5)} = \\mathbf{${texDecimal(accumulated.rate * 100, 2)}\\%}`}
            />
          </FormulaBox>
        </TrayItem>
      </div>
      <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-8 gap-y-4">
        <p>
          Somando os meses, daria <strong>{formatPercent(accumulated.simple_sum)}</strong>, e não{" "}
          {formatPercent(accumulated.rate)}. É o mesmo motivo de 1% num mês e 2% no outro darem
          3,02%, e não 3%.
        </p>
        <p className="text-caption text-muted-foreground">
          A conta usa as variações mensais com 2 casas, como o IBGE publica. O número oficial sai do
          índice sem arredondar e pode diferir em até 0,02 p.p.
        </p>
      </div>
    </>
  );
}

interface AccumulatedChartProps {
  data: InflationGroups;
  selected: IpcaSeriesId | undefined;
  onSelect: (seriesId: IpcaSeriesId) => void;
}

/** Uma barra por grupo, na cor do grupo, do maior ao menor acumulado, com o índice geral
tracejado. Tocar num grupo abre a conta dele. */
export function AccumulatedChart({ data, selected, onSelect }: AccumulatedChartProps) {
  const [open, setOpen] = useState(false);
  const general = data.accumulated.find((item) => item.series_id === "ipca_general");
  const rows = data.accumulated
    .filter((item) => item.series_id !== "ipca_general")
    .toSorted((a, b) => b.rate - a.rate);
  const first = rows.at(0);
  const chosen = selected ?? (first && isIpcaSeries(first.series_id) ? first.series_id : undefined);
  const rates = data.accumulated.map((item) => item.rate);
  const ticks = niceTicks(Math.min(0, ...rates), Math.max(...rates), 4);
  const top = ticks.at(-1) ?? 0.01;
  const share = (rate: number) => `${(Math.max(rate, 0) / top) * 100}%`;

  return (
    <ExplainedCard
      title="Acumulado no período"
      subtitle={`${formatMonthRange(data.period.start, data.period.end)} · a linha tracejada é o índice geral`}
      open={open}
      onOpenChange={setOpen}
      explain={{
        label: "Ver a conta",
        icon: Sigma,
        heading: chosen ? `A CONTA DE ${seriesLabels[chosen].toUpperCase()}` : "A CONTA",
        content: chosen && <Calculation data={data} seriesId={chosen} />,
      }}
    >
      <div className="flex flex-col">
        {rows.map(
          (row) =>
            isIpcaSeries(row.series_id) && (
              <button
                key={row.series_id}
                type="button"
                aria-pressed={row.series_id === chosen}
                onClick={() => {
                  if (isIpcaSeries(row.series_id)) onSelect(row.series_id);
                  setOpen(true);
                }}
                className="aria-pressed:bg-muted flex min-h-11 w-full cursor-pointer items-center gap-4 rounded-lg px-2 text-left"
                style={{ "--bar": groupIdentity[row.series_id].color, "--width": share(row.rate) }}
              >
                <span className="w-57 shrink-0">
                  <GroupChip seriesId={row.series_id} size="sm" />
                </span>
                <span className="relative flex h-11 flex-1 items-center">
                  <span className="h-5.5 w-(--width) rounded-r-md bg-(--bar)" />
                  <span className="ml-2.5 font-bold">{formatPercent(row.rate)}</span>
                  {general && (
                    <span
                      className="border-ink-2 absolute inset-y-0 left-(--general) border-l-2 border-dashed"
                      style={{ "--general": share(general.rate) }}
                    />
                  )}
                </span>
              </button>
            ),
        )}
        {general && (
          <div className="text-small flex gap-4 px-2 pt-2">
            <span className="w-57 shrink-0" />
            <span className="relative h-4.5 flex-1">
              <span
                className={cn(
                  "text-foreground absolute left-(--general) -translate-x-1/2 font-semibold whitespace-nowrap",
                )}
                style={{ "--general": share(general.rate) }}
              >
                Índice geral {formatPercent(general.rate)}
              </span>
            </span>
          </div>
        )}
      </div>
    </ExplainedCard>
  );
}
