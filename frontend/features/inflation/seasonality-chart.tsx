import { BookOpen } from "lucide-react";
import { Area, CartesianGrid, ComposedChart, Line, ReferenceDot, XAxis, YAxis } from "recharts";

import type { Seasonality } from "@/features/inflation/use-seasonality";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { GroupChip } from "@/shared/components/group-chip";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";
import { formatPercent, formatPoints, formatShortMonth } from "@/shared/lib/format";
import { groupIdentity, type IpcaSeriesId, ipcaSeriesIds } from "@/shared/lib/group-identity";
import { niceTicks } from "@/shared/lib/nice-scale";
import { cn } from "@/shared/lib/utils";

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 2,
});

const monthNames = Array.from({ length: 12 }, (_, index) =>
  formatShortMonth(`2000-${String(index + 1).padStart(2, "0")}-01`),
);

function MiniStat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="bg-muted flex flex-col gap-0.5 rounded-lg px-3.5 py-3">
      <span className="text-small text-muted-foreground">{label}</span>
      <strong className={cn("text-kpi-sm", tone)}>{value}</strong>
    </div>
  );
}

interface SeasonalityChartProps {
  data: Seasonality;
  seriesId: IpcaSeriesId;
  onSelect: (seriesId: IpcaSeriesId) => void;
}

/** Os meses do ano de um grupo contra a faixa e a média do mesmo mês nos anos
anteriores. */
export function SeasonalityChart({ data, seriesId, onSelect }: SeasonalityChartProps) {
  const group = data.groups.find((item) => item.series_id === seriesId);
  if (!group) return null;
  const color = groupIdentity[seriesId].color;
  const current = new Map(
    group.months.map((item) => [Number(item.ref_date.slice(5, 7)), item.rate]),
  );
  const rows = group.bands.map((band) => ({
    month: monthNames[band.month - 1],
    band: [band.low, band.high],
    mean: band.mean,
    current: current.get(band.month) ?? null,
  }));
  const values = group.bands.flatMap((band) => [band.low, band.high]);
  values.push(...group.months.map((item) => item.rate), 0);
  const ticks = niceTicks(Math.min(...values), Math.max(...values), 5);
  const deviation = group.largest_deviation;
  const years = data.years_compared;
  const yearsLabel = `${years.at(0)} a ${years.at(-1)}`;
  const chartConfig = {
    current: { label: String(data.year), color },
    mean: { label: `Média de ${yearsLabel}`, color: "var(--muted-foreground)" },
    band: { label: `Faixa de ${yearsLabel}`, color: "var(--chart-band)" },
  } satisfies ChartConfig;

  return (
    <ExplainedCard
      id="seasonality"
      title="Comparado com o mesmo mês de outros anos"
      subtitle={`${data.year} contra o que foi típico de ${yearsLabel} (${years.length} anos)`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: (
          <>
            <TrayItem title="Sazonalidade" concept="seasonality">
              <p>
                Alguns preços sobem sempre na mesma época: mensalidade em fevereiro, matrícula do
                segundo semestre em agosto. Uma alta dessas só é notícia se fugir do padrão. Fora da
                faixa cinza, fugiu.
              </p>
            </TrayItem>
            <TrayItem title="O 12 meses já tira a sazonalidade">
              <p>
                Toda janela de 12 meses tem exatamente um fevereiro. Por isso o salto das
                mensalidades não faz o acumulado de 12 meses pular: ele entra e sai no mesmo mês.
              </p>
            </TrayItem>
            <TrayItem title="Por que não dessazonalizar">
              <p>
                Métodos como o X-13, que o IBGE usa em outras pesquisas, estimam o padrão de cada
                mês e o descontam. Eles precisam de muitos anos com a mesma cesta, e a cesta do IPCA
                muda a cada Pesquisa de Orçamentos Familiares; comparar direto com os anos
                anteriores é mais simples e mais honesto.
              </p>
            </TrayItem>
          </>
        ),
      }}
    >
      <div className="flex flex-col gap-4">
        <ToggleGroup
          variant="chip"
          aria-label="Grupo"
          value={[seriesId]}
          className="flex-wrap"
          onValueChange={([next]) => {
            const chosen = ipcaSeriesIds.find((id) => id === next);
            if (chosen) onSelect(chosen);
          }}
        >
          {ipcaSeriesIds.map((id) => (
            <ToggleGroupItem key={id} value={id}>
              <GroupChip seriesId={id} size="sm" />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {deviation && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
            <MiniStat
              label={`Maior desvio em ${data.year}`}
              value={`${formatShortMonth(deviation.ref_date)}: ${formatPercent(deviation.rate)}`}
            />
            <MiniStat label="Típico desse mês" value={formatPercent(deviation.typical)} />
            <MiniStat
              label="Diferença"
              value={`${formatPoints(deviation.difference)} ${deviation.difference > 0 ? "acima" : "abaixo"}`}
              tone={deviation.difference > 0 ? "text-trend-up" : "text-trend-down"}
            />
          </div>
        )}

        <ChartLegend
          entries={[
            {
              key: "band",
              label: `faixa de ${yearsLabel} (menor ao maior)`,
              color: "var(--chart-band)",
              shape: "square",
            },
            {
              key: "mean",
              label: `média de ${yearsLabel}`,
              color: "var(--muted-foreground)",
              shape: "dashed",
            },
            { key: "current", label: String(data.year), color, shape: "line" },
          ]}
        />
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <ComposedChart data={rows} margin={{ left: 0, right: 16, top: 8, bottom: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} interval={0} />
            <YAxis
              domain={[ticks.at(0) ?? 0, ticks.at(-1) ?? 0.01]}
              ticks={ticks}
              tickLine={false}
              axisLine={false}
              width={52}
              tickFormatter={(value: number) => axisPercent.format(value).replace("-", "−")}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <span className="flex w-full items-center justify-between gap-4">
                      {name === "band"
                        ? `Faixa de ${yearsLabel}`
                        : name === "mean"
                          ? `Média de ${yearsLabel}`
                          : String(data.year)}
                      <span className="tabular-nums">
                        {Array.isArray(value)
                          ? value
                              .map((item) => (typeof item === "number" ? formatPercent(item) : ""))
                              .join(" a ")
                          : typeof value === "number"
                            ? formatPercent(value)
                            : ""}
                      </span>
                    </span>
                  )}
                />
              }
            />
            <Area
              dataKey="band"
              stroke="none"
              fill="var(--color-band)"
              fillOpacity={1}
              isAnimationActive={false}
            />
            <Line
              dataKey="mean"
              stroke="var(--color-mean)"
              strokeWidth={2}
              strokeDasharray="6 5"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="current"
              stroke="var(--color-current)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--color-current)", strokeWidth: 0 }}
              isAnimationActive={false}
            />
            {deviation && (
              <ReferenceDot
                x={monthNames[Number(deviation.ref_date.slice(5, 7)) - 1]}
                y={deviation.rate}
                r={9}
                fill="none"
                stroke="var(--foreground)"
                strokeWidth={2}
              />
            )}
          </ComposedChart>
        </ChartContainer>
      </div>
    </ExplainedCard>
  );
}
