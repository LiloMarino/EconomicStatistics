import type { InflationGroups } from "@/features/inflation/use-inflation-groups";
import { ChartLegend, type LegendEntry } from "@/shared/components/chart-legend";
import { formatMonth } from "@/shared/lib/format";
import { monthsBetween } from "@/shared/lib/months";
import { type SeriesId, seriesLabels } from "@/shared/lib/series-labels";
import { cn } from "@/shared/lib/utils";

const cellClass = {
  "neg-3": "bg-diverging-neg-3 text-diverging-ink-3",
  "neg-2": "bg-diverging-neg-2 text-diverging-ink-2",
  "neg-1": "bg-diverging-neg-1 text-foreground",
  mid: "bg-diverging-mid text-foreground",
  "pos-1": "bg-diverging-pos-1 text-foreground",
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

const cellNumber = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Faixas da variação no mês, em pontos percentuais: até 0,1, 0,5, 1 e acima
function stepOf(rate: number): Step {
  const size = Math.abs(rate * 100);
  const negative = rate < 0;
  if (size < 0.1) return "mid";
  if (size < 0.5) return negative ? "neg-1" : "pos-1";
  if (size < 1) return negative ? "neg-2" : "pos-2";
  return negative ? "neg-3" : "pos-3";
}

/** Uma linha por grupo e uma coluna por mês: vermelho é preço subindo, azul é preço
caindo, e a intensidade acompanha o tamanho da variação. */
export function MonthlyHeatmap({ data }: { data: InflationGroups }) {
  const months = monthsBetween(data.period.start, data.period.end);
  const series = [...new Set(data.monthly.map((item) => item.series_id))];
  const rates = new Map(
    data.monthly.map((item) => [`${item.series_id}|${item.ref_date}`, item.rate]),
  );

  return (
    <div className="flex flex-col gap-3">
      <ChartLegend entries={legend} />
      <div className="overflow-x-auto">
        <table className="text-caption w-full border-separate border-spacing-0.5 tabular-nums">
          <thead>
            <tr>
              <th className="text-muted-foreground px-2 text-left font-normal">% no mês</th>
              {months.map((month) => (
                <th
                  key={month}
                  scope="col"
                  className="text-muted-foreground min-w-14 px-1 font-normal"
                >
                  {formatMonth(month)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {series.map((seriesId: SeriesId) => (
              <tr key={seriesId}>
                <th
                  scope="row"
                  className={
                    seriesId === "ipca_general"
                      ? "px-2 text-left font-semibold whitespace-nowrap"
                      : "px-2 text-left font-normal whitespace-nowrap"
                  }
                >
                  {seriesLabels[seriesId]}
                </th>
                {months.map((month) => {
                  const rate = rates.get(`${seriesId}|${month}`);
                  return rate === undefined ? (
                    <td key={month} className="text-muted-foreground text-center">
                      –
                    </td>
                  ) : (
                    <td
                      key={month}
                      title={`${seriesLabels[seriesId]}, ${formatMonth(month)}: ${cellNumber.format(rate * 100)}%`}
                      className={cn(cellClass[stepOf(rate)], "rounded-xs px-1 py-1.5 text-center")}
                    >
                      {cellNumber.format(rate * 100)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
