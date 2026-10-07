import { BookOpen, TrendingDown, TrendingUp } from "lucide-react";

import type { InflationPace } from "@/features/inflation/use-inflation-pace";
import { type PaceWindow, paceWindows } from "@/features/inflation/use-inflation-view";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { GroupChip } from "@/shared/components/group-chip";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";
import {
  formatMonth,
  formatPercent,
  formatPoints,
  formatShortMonth,
  formatWholePercent,
} from "@/shared/lib/format";
import { isIpcaSeries } from "@/shared/lib/group-identity";
import { addMonths } from "@/shared/lib/months";
import { seriesLabels } from "@/shared/lib/series-labels";
import { cn } from "@/shared/lib/utils";

const windowLabels: Record<PaceWindow, string> = { 1: "1 mês", 3: "3 meses", 6: "6 meses" };

// A barra cheia (metade do trilho) vale 0,8 p.p. na janela de 1 mês e 2 p.p. nas outras
function barScale(window: PaceWindow): number {
  return window === 1 ? 0.008 : 0.02;
}

const COLUMNS = "grid grid-cols-[minmax(220px,1.6fr)_96px_96px_minmax(180px,1.4fr)] gap-4";

interface PaceTableProps {
  pace: InflationPace;
  window: PaceWindow;
  onWindowChange: (window: PaceWindow) => void;
}

/** O 12 meses de cada grupo no fim e N meses antes, com a inclinação em p.p.: quem
acelerou e quem freou. O índice geral fica na primeira linha. */
export function PaceTable({ pace, window, onWindowChange }: PaceTableProps) {
  const from = addMonths(pace.end, -window);
  const rows = pace.groups
    .map((group) => ({
      seriesId: group.series_id,
      to: group.rolling_12m,
      step: group.windows.find((item) => item.months === window),
    }))
    .filter((row) => row.step !== undefined);
  const general = rows.filter((row) => row.seriesId === "ipca_general");
  const groups = rows
    .filter((row) => row.seriesId !== "ipca_general")
    .toSorted((a, b) => (b.step?.change ?? 0) - (a.step?.change ?? 0));
  const biggest = groups.toSorted(
    (a, b) => Math.abs(b.step?.change ?? 0) - Math.abs(a.step?.change ?? 0),
  )[0];

  return (
    <ExplainedCard
      title="Quem acelerou e quem freou"
      subtitle={`Inclinação da linha de 12 meses de cada grupo, ${formatMonth(from)} contra ${formatMonth(pace.end)}`}
      actions={
        <ToggleGroup
          variant="segmented"
          size="sm"
          aria-label="Comparar com"
          value={[String(window)]}
          onValueChange={([next]) => {
            const chosen = paceWindows.find((item) => String(item) === next);
            if (chosen) onWindowChange(chosen);
          }}
        >
          {paceWindows.map((item) => (
            <ToggleGroupItem key={item} value={String(item)}>
              {windowLabels[item]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      }
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: (
          <>
            <TrayItem title="A tabela">
              <p>
                Cada linha é a inflação de 12 meses do grupo em dois momentos. A barra vai para a
                direita, em vermelho, quando o grupo acelerou, e para a esquerda, em azul, quando
                freou.
              </p>
            </TrayItem>
            {biggest?.step && isIpcaSeries(biggest.seriesId) && (
              <TrayItem title="p.p. não é %">
                <p>
                  Ponto percentual (p.p.) é a diferença direta entre dois percentuais.{" "}
                  {seriesLabels[biggest.seriesId]} ir de{" "}
                  {formatPercent(biggest.step.rolling_12m_before)} para {formatPercent(biggest.to)}{" "}
                  é {biggest.step.change < 0 ? "cair" : "subir"}{" "}
                  <strong>{formatPoints(Math.abs(biggest.step.change)).replace("+", "")}</strong>.
                  Dizer que {biggest.step.change < 0 ? "caiu" : "subiu"}{" "}
                  {formatWholePercent(Math.abs(biggest.step.relative_change))} seria outra conta: a
                  diferença sobre o valor de antes.
                </p>
              </TrayItem>
            )}
            <TrayItem title="1 mês ou 3 meses?">
              <p>
                As janelas medem a mesma coisa, a inclinação. A de 1 mês reage mais rápido, mas
                oscila: a linha de 12 meses muda conforme o mês que entra e o mesmo mês do ano
                passado, que sai. Se aquele mês antigo foi fora da curva, a linha pula sem nada ter
                mudado hoje. A de 3 meses dilui isso e mostra a direção.
              </p>
            </TrayItem>
          </>
        ),
      }}
    >
      <div className="overflow-x-auto">
        <div role="table" aria-label="Inflação em 12 meses por grupo" className="min-w-160">
          <div
            role="row"
            className={cn(
              COLUMNS,
              "text-small text-muted-foreground items-end border-b px-2 pb-2.5",
            )}
          >
            <span role="columnheader" className="font-semibold">
              Grupo
            </span>
            <span role="columnheader" className="text-right font-semibold">
              12m até {formatShortMonth(from)}
            </span>
            <span role="columnheader" className="text-right font-semibold">
              12m até {formatShortMonth(pace.end)}
            </span>
            <span role="columnheader" className="font-semibold">
              Inclinação
            </span>
          </div>
          {[...general, ...groups].map((row) => {
            const change = row.step?.change ?? 0;
            const up = change > 0;
            const width = Math.min(Math.abs(change) / barScale(window), 1) * 50;
            const isGeneral = row.seriesId === "ipca_general";
            return (
              isIpcaSeries(row.seriesId) &&
              row.step && (
                <div
                  key={row.seriesId}
                  role="row"
                  className={cn(
                    COLUMNS,
                    "min-h-11.5 items-center px-2",
                    isGeneral ? "border-b font-semibold" : "border-border-subtle border-b",
                  )}
                >
                  <span role="cell">
                    <GroupChip seriesId={row.seriesId} size="sm" />
                  </span>
                  <span role="cell" className="text-muted-foreground text-right">
                    {formatPercent(row.step.rolling_12m_before)}
                  </span>
                  <span role="cell" className="text-right font-bold">
                    {formatPercent(row.to)}
                  </span>
                  <span
                    role="cell"
                    className={cn(
                      "flex items-center gap-3",
                      up ? "text-trend-up" : "text-trend-down",
                    )}
                  >
                    <span className="relative h-5 w-30 shrink-0">
                      <span className="border-ink-2 absolute inset-y-0 left-1/2 border-l" />
                      <span
                        className="absolute top-1.25 left-(--bar-left) h-2.5 w-(--bar-width) rounded-xs bg-current"
                        style={{
                          "--bar-width": `${width}%`,
                          "--bar-left": up ? "50%" : `${50 - width}%`,
                        }}
                      />
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold whitespace-nowrap">
                      {up ? (
                        <TrendingUp className="size-4" aria-label="acelerou" />
                      ) : (
                        <TrendingDown className="size-4" aria-label="freou" />
                      )}
                      {formatPoints(change)}
                    </span>
                  </span>
                </div>
              )
            );
          })}
        </div>
      </div>
    </ExplainedCard>
  );
}
