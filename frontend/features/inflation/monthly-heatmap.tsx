import { BookOpen, Repeat } from "lucide-react";

import { seasonalCauses } from "@/features/inflation/seasonal-causes";
import type { InflationGroups } from "@/features/inflation/use-inflation-groups";
import type { Seasonality } from "@/features/inflation/use-seasonality";
import { ChartLegend, type LegendEntry } from "@/shared/components/chart-legend";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { GroupChip } from "@/shared/components/group-chip";
import { Button } from "@/shared/components/ui/button";
import {
  formatMonth,
  formatMonthName,
  formatMonthRange,
  formatPercent,
  formatRateNumber,
  formatShortMonth,
} from "@/shared/lib/format";
import { type IpcaSeriesId, ipcaSeriesIds } from "@/shared/lib/group-identity";
import { monthsBetween } from "@/shared/lib/months";
import { seriesLabels } from "@/shared/lib/series-labels";
import { cn } from "@/shared/lib/utils";

const cellClass = {
  "neg-3": "bg-diverging-neg-3 text-diverging-ink-3",
  "neg-2": "bg-diverging-neg-2 text-diverging-ink-2",
  "neg-1": "bg-diverging-neg-1 text-diverging-ink-1",
  mid: "bg-diverging-mid text-diverging-ink-mid",
  "pos-1": "bg-diverging-pos-1 text-diverging-ink-1",
  "pos-2": "bg-diverging-pos-2 text-diverging-ink-2",
  "pos-3": "bg-diverging-pos-3 text-diverging-ink-3",
} as const;

type Step = keyof typeof cellClass;

const legend: LegendEntry[] = [
  { key: "neg-3", label: "−1% ou menos", color: "var(--diverging-neg-3)", shape: "square" },
  { key: "neg-2", label: "−1% a −0,5%", color: "var(--diverging-neg-2)", shape: "square" },
  { key: "neg-1", label: "−0,5% a −0,1%", color: "var(--diverging-neg-1)", shape: "square" },
  { key: "mid", label: "perto de zero", color: "var(--diverging-mid)", shape: "square" },
  { key: "pos-1", label: "0,1% a 0,5%", color: "var(--diverging-pos-1)", shape: "square" },
  { key: "pos-2", label: "0,5% a 1%", color: "var(--diverging-pos-2)", shape: "square" },
  { key: "pos-3", label: "1% ou mais", color: "var(--diverging-pos-3)", shape: "square" },
];

// Faixas da variação no mês, em pontos percentuais: até 0,1, 0,5, 1 e acima
function stepOf(rate: number): Step {
  const size = Math.abs(rate * 100);
  const negative = rate < 0;
  if (size < 0.1) return "mid";
  if (size < 0.5) return negative ? "neg-1" : "pos-1";
  if (size < 1) return negative ? "neg-2" : "pos-2";
  return negative ? "neg-3" : "pos-3";
}

interface Highest {
  seriesId: IpcaSeriesId;
  month: string;
  rate: number;
}

/** A nota da maior alta: o motivo conhecido, quando há, e o valor contra o típico do mês
nos anos anteriores. */
function HighestNote({
  highest,
  seasonality,
  onCompare,
}: {
  highest: Highest;
  seasonality: Seasonality | undefined;
  onCompare: (seriesId: IpcaSeriesId) => void;
}) {
  const monthNumber = Number(highest.month.slice(5, 7));
  const cause = seasonalCauses[highest.seriesId]?.[monthNumber];
  const band =
    seasonality && Number(highest.month.slice(0, 4)) === seasonality.year
      ? seasonality.groups
          .find((group) => group.series_id === highest.seriesId)
          ?.bands.find((item) => item.month === monthNumber)
      : undefined;
  const monthName = formatMonthName(highest.month);
  const typical =
    band &&
    (highest.rate >= band.low && highest.rate <= band.high
      ? `perto do típico de ${monthName} (${formatPercent(band.mean)})`
      : `fora do que é típico de ${monthName} (${formatPercent(band.mean)})`);

  return (
    <div className="bg-muted text-caption flex items-start gap-2.5 rounded-lg px-3.5 py-3">
      <Repeat className="mt-0.5 size-4.5 shrink-0" />
      <span>
        <strong>
          {seriesLabels[highest.seriesId]} em {monthName} de {highest.month.slice(0, 4)}{" "}
          (contornado):
        </strong>{" "}
        {cause ? `${cause}, e se repete todo ano. ` : "é a maior alta do período. "}
        Foi {formatPercent(highest.rate)}
        {typical ? `, ${typical}.` : "."}{" "}
        {band && (
          <Button
            variant="link"
            size="xs"
            className="h-auto p-0 font-semibold"
            onClick={() => onCompare(highest.seriesId)}
          >
            Comparar com outros anos
          </Button>
        )}
      </span>
    </div>
  );
}

interface MonthlyHeatmapProps {
  data: InflationGroups;
  seasonality: Seasonality | undefined;
  onCompare: (seriesId: IpcaSeriesId) => void;
}

/** Uma linha por grupo e uma coluna por mês: vermelho é preço subindo, azul é preço
caindo, e a intensidade acompanha o tamanho da variação. A maior alta fica contornada. */
export function MonthlyHeatmap({ data, seasonality, onCompare }: MonthlyHeatmapProps) {
  const months = monthsBetween(data.period.start, data.period.end);
  const rates = new Map(
    data.monthly.map((item) => [`${item.series_id}|${item.ref_date}`, item.rate]),
  );
  const highest = data.monthly.reduce<Highest | undefined>((best, item) => {
    const seriesId = ipcaSeriesIds.find((id) => id === item.series_id);
    if (!seriesId || seriesId === "ipca_general") return best;
    return best && best.rate >= item.rate
      ? best
      : { seriesId, month: item.ref_date, rate: item.rate };
  }, undefined);

  return (
    <ExplainedCard
      title="Variação mês a mês"
      subtitle={`% no mês, ${formatMonthRange(data.period.start, data.period.end)}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: (
          <>
            <TrayItem title="Cada quadrado">
              <p>
                Quanto os preços do grupo mudaram naquele mês. Vermelho subiu, azul caiu; quanto
                mais forte a cor, maior a mudança.
              </p>
            </TrayItem>
            <TrayItem title="Altas que voltam">
              <p>
                Um grupo pode subir forte por alguns meses e devolver parte depois. O acumulado
                esconde esse vaivém; o mês a mês mostra.
              </p>
            </TrayItem>
          </>
        ),
      }}
    >
      <div className="flex flex-col gap-4">
        <ChartLegend entries={legend} />
        <div className="overflow-x-auto">
          <table className="text-caption w-full min-w-190 border-separate border-spacing-1.5">
            <thead>
              <tr>
                <th className="text-small text-muted-foreground w-59 text-left font-normal">
                  Grupo
                </th>
                {months.map((month) => (
                  <th
                    key={month}
                    scope="col"
                    className="text-small text-muted-foreground font-normal"
                  >
                    {months.length > 12 ? formatMonth(month) : formatShortMonth(month)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ipcaSeriesIds.map((seriesId) => (
                <tr key={seriesId}>
                  <th scope="row" className="text-left font-normal">
                    <GroupChip seriesId={seriesId} size="sm" />
                  </th>
                  {months.map((month) => {
                    const rate = rates.get(`${seriesId}|${month}`);
                    const flagged = highest?.seriesId === seriesId && highest.month === month;
                    return rate === undefined ? (
                      <td key={month} className="text-muted-foreground text-center">
                        –
                      </td>
                    ) : (
                      <td
                        key={month}
                        title={`${seriesLabels[seriesId]}, ${formatMonth(month)}: ${formatPercent(rate)}`}
                        className={cn(
                          cellClass[stepOf(rate)],
                          "h-9.5 rounded-md text-center font-medium",
                          flagged && "outline-foreground outline-2 outline-offset-2",
                        )}
                      >
                        {formatRateNumber(rate)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {highest && (
          <HighestNote highest={highest} seasonality={seasonality} onCompare={onCompare} />
        )}
      </div>
    </ExplainedCard>
  );
}
