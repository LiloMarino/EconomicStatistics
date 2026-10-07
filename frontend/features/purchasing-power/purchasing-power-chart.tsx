import { Sigma } from "lucide-react";
import { useState } from "react";

import type { PurchasingPower } from "@/features/purchasing-power/use-purchasing-power";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { Formula, FormulaBox } from "@/shared/components/formula";
import { GroupChip } from "@/shared/components/group-chip";
import {
  formatFactor,
  formatMonth,
  formatMoney,
  formatPercent,
  formatPoints,
  formatSignedPercent,
} from "@/shared/lib/format";
import { type IpcaSeriesId, isIpcaSeries } from "@/shared/lib/group-identity";
import { niceTicks } from "@/shared/lib/nice-scale";
import { seriesLabels } from "@/shared/lib/series-labels";
import { texDecimal } from "@/shared/lib/tex";
import { cn } from "@/shared/lib/utils";

type Group = PurchasingPower["groups"][number];

const axisPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

/** A conta do grupo escolhido: em reais, pela fórmula e com os números dele. */
function Calculation({ data, group }: { data: PurchasingPower; group: Group }) {
  if (!isIpcaSeries(group.series_id)) return null;
  const label = seriesLabels[group.series_id];
  const raise = data.reference_raise;
  const loss = group.change < 0;

  return (
    <>
      <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-x-10 gap-y-6">
        <TrayItem title="Com dinheiro na mão">
          <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5">
            <span>
              O que custava em {label} no início de {formatMonth(data.period.start)}
            </span>
            <strong className="text-right">{formatMoney(100)}</strong>
            <span>
              Passou a custar em {formatMonth(data.period.end)} (inflação do grupo:{" "}
              {formatPercent(group.inflation)})
            </span>
            <strong className="text-right">{formatMoney(100 * (1 + group.inflation))}</strong>
            <span>
              Seus {formatMoney(100)} depois do reajuste de {formatPercent(raise)}
            </span>
            <strong className="text-right">{formatMoney(100 * (1 + raise))}</strong>
            <span className="border-t pt-2">Quanto esse dinheiro compra do que comprava</span>
            <strong className="border-t pt-2 text-right">{formatPercent(1 + group.change)}</strong>
          </div>
          <p>
            Ou seja, compra{" "}
            <strong className={loss ? "text-trend-up" : "text-trend-down"}>
              {formatPercent(Math.abs(group.change))} {loss ? "a menos" : "a mais"}
            </strong>{" "}
            de {label} do que no começo do período.
          </p>
        </TrayItem>
        <TrayItem title="A fórmula">
          <FormulaBox
            legend={[
              {
                symbol: "r",
                text: <>reajuste no período, em fração: 3,11% vira 0,0311</>,
              },
              { symbol: "\\pi_g", text: <>inflação do grupo g no mesmo período</> },
              { symbol: "\\Delta PC", text: <>quanto o poder de compra mudou naquele grupo</> },
            ]}
          >
            <Formula tex="\Delta PC = \dfrac{1 + r}{1 + \pi_g} - 1" />
          </FormulaBox>
        </TrayItem>
      </div>
      <div className="col-span-full flex flex-col gap-3">
        <h3 className="font-bold">Com os números de {label}</h3>
        <FormulaBox>
          <Formula
            flushLeft
            tex={`= \\dfrac{1 + ${texDecimal(raise, 4)}}{1 + ${texDecimal(group.inflation, 4)}} - 1 = \\dfrac{${texDecimal(1 + raise, 4)}}{${texDecimal(1 + group.inflation, 4)}} - 1`}
          />
          <Formula
            flushLeft
            tex={`= ${texDecimal(1 + group.change, 4)} - 1 = \\mathbf{${group.change > 0 ? "+" : ""}${texDecimal(group.change * 100, 2)}\\%}`}
          />
        </FormulaBox>
        <p className="text-caption text-muted-foreground">
          O {formatFactor(1 + group.change)} é o mesmo {formatPercent(1 + group.change)} da conta em
          reais, acima.
        </p>
      </div>
      <div className="col-span-full flex flex-col gap-1.5 border-t pt-4">
        <h3 className="font-bold">Por que dividir e não subtrair</h3>
        <p>
          Subtrair ({formatPercent(raise)} − {formatPercent(group.inflation)} ={" "}
          {formatPoints(group.naive_change)}) quase acerta com números pequenos e erra com grandes.
          Reajuste de 50% com os preços dobrando: subtrair dá −50%, mas o dinheiro compra 1,5 ÷ 2 =
          75% do que comprava, ou seja, 25% a menos.
        </p>
      </div>
    </>
  );
}

interface PurchasingPowerChartProps {
  data: PurchasingPower;
  selected: IpcaSeriesId | undefined;
  onSelect: (seriesId: IpcaSeriesId) => void;
}

/** Uma barra por grupo, da maior perda ao maior ganho: à esquerda do zero o dinheiro
reajustado compra menos daquele grupo; à direita, mais. Tocar num grupo abre a conta. */
export function PurchasingPowerChart({ data, selected, onSelect }: PurchasingPowerChartProps) {
  const [open, setOpen] = useState(false);
  const chosen = data.groups.find((group) => group.series_id === selected) ?? data.groups.at(0);
  // Eixo simétrico em torno do zero, com folga para o rótulo da barra mais longa
  const extent = Math.max(...data.groups.map((group) => Math.abs(group.change)), 0.005) * 1.2;
  const top = niceTicks(-extent, extent).at(-1) ?? extent;
  const half = (change: number) => (Math.abs(change) / top) * 50;

  return (
    <ExplainedCard
      title="Quanto o dinheiro compra de cada grupo"
      subtitle="Toque num grupo para ver a conta dele"
      open={open}
      onOpenChange={setOpen}
      explain={{
        label: "Ver a conta",
        icon: Sigma,
        heading:
          chosen && isIpcaSeries(chosen.series_id)
            ? `A CONTA DE ${seriesLabels[chosen.series_id].toUpperCase()}`
            : "A CONTA",
        content: chosen && <Calculation data={data} group={chosen} />,
      }}
    >
      <div className="flex flex-col">
        <div className="text-label flex gap-4 px-3 pb-2.5 font-semibold">
          <span className="w-59 shrink-0" />
          <span className="flex flex-1 justify-between">
            <span className="text-trend-up">← compra menos</span>
            <span className="text-trend-down">compra mais →</span>
          </span>
        </div>
        {data.groups.map((group) => {
          if (!isIpcaSeries(group.series_id)) return null;
          const loss = group.change < 0;
          const width = half(group.change);
          return (
            <button
              key={group.series_id}
              type="button"
              aria-pressed={group.series_id === chosen?.series_id}
              onClick={() => {
                if (isIpcaSeries(group.series_id)) onSelect(group.series_id);
                setOpen(true);
              }}
              className="aria-pressed:bg-muted flex min-h-11 w-full cursor-pointer items-center gap-4 rounded-lg px-3 text-left"
              style={{
                "--width": `${width}%`,
                "--start": loss ? `${50 - width}%` : "50%",
                "--label": `calc(${50 + width}% + 8px)`,
              }}
            >
              <span className="w-59 shrink-0">
                <GroupChip seriesId={group.series_id} size="sm" />
              </span>
              <span
                className={cn(
                  "relative block h-11 flex-1",
                  loss ? "text-trend-up" : "text-trend-down",
                )}
              >
                <span className="border-ink-2 absolute inset-y-1 left-1/2 border-l-2" />
                <span
                  className={cn(
                    "absolute top-2.75 left-(--start) h-5.5 w-(--width) bg-current",
                    loss ? "rounded-l-md" : "rounded-r-md",
                  )}
                />
                <span
                  className={cn(
                    "text-foreground absolute top-3 font-bold whitespace-nowrap",
                    loss ? "right-(--label)" : "left-(--label)",
                  )}
                >
                  {formatSignedPercent(group.change)}
                </span>
              </span>
            </button>
          );
        })}
        <div className="text-small text-muted-foreground flex gap-4 px-3 pt-2">
          <span className="w-59 shrink-0" />
          <span className="flex flex-1 justify-between">
            <span>{axisPercent.format(-top).replace("-", "−")}</span>
            <span>0%</span>
            <span>{axisPercent.format(top)}</span>
          </span>
        </div>
      </div>
    </ExplainedCard>
  );
}
