import { BookOpen } from "lucide-react";

import type { ExternalSector } from "@/features/external-sector/use-external-sector";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { formatPercent, formatQuarter } from "@/shared/lib/format";

type PositionPoint = ExternalSector["position"][number];

/** O ano fechado aparece pelo ano; o corrente, pelo trimestre mais recente. */
function pointLabel(point: PositionPoint, last: PositionPoint): string {
  return point === last && point.ref_date.slice(5, 7) !== "10"
    ? formatQuarter(point.ref_date)
    : point.ref_date.slice(0, 4);
}

function HowToRead() {
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="Ativos" color="var(--ok)">
        <p>
          O que o Brasil tem lá fora: as reservas do Banco Central, as fábricas e as ações que
          empresas e pessoas daqui compraram no exterior, e o que emprestaram para estrangeiros.
        </p>
      </TrayItem>
      <TrayItem title="Passivos" color="var(--trend-up)">
        <p>
          O que estrangeiros têm aqui: as fábricas e as participações em empresas brasileiras, as
          ações e os títulos que compraram, e o que emprestaram para governo e empresas daqui.
        </p>
      </TrayItem>
      <TrayItem title="Saldo" concept="international-investment-position">
        <p>
          Ativos menos passivos. Negativo é o normal de país emergente: estrangeiros investem aqui
          mais do que os brasileiros investem lá fora.
        </p>
      </TrayItem>
      <TrayItem title="O que pesa é do que o passivo é feito">
        <p>
          Fábrica e ação em reais é bem diferente de dívida em dólar de prazo curto. A fábrica não
          vai embora numa crise, e a ação perde valor junto com o real; a dívida em dólar fica mais
          cara justamente quando o dólar sobe.
        </p>
      </TrayItem>
    </div>
  );
}

/** Ativos e passivos externos em % do PIB, um ponto por ano nos últimos 6 anos, e o
saldo do mais recente. */
export function PositionChart({ position }: { position: PositionPoint[] }) {
  const last = position.at(-1);
  if (!last) return null;
  const top = Math.max(...position.flatMap((point) => [point.assets, point.liabilities]));
  const width = (share: number) => `${(share / top) * 100}%`;

  return (
    <ExplainedCard
      title="O balanço com o mundo"
      subtitle="Posição internacional de investimento, % do PIB"
      explain={{ label: "Como ler", icon: BookOpen, heading: "COMO LER", content: <HowToRead /> }}
    >
      <div className="flex flex-col gap-3">
        <ChartLegend
          entries={[
            { key: "assets", label: "Ativos", color: "var(--ok)", shape: "square" },
            { key: "liabilities", label: "Passivos", color: "var(--trend-up)", shape: "square" },
          ]}
        />
        <div className="text-caption text-muted-foreground grid grid-cols-[5.5rem_1fr_5.5rem] gap-2.5">
          <span />
          <span />
          <span className="text-right">Saldo</span>
        </div>
        <ul className="flex flex-col gap-2.5">
          {position.map((point) => (
            <li
              key={point.ref_date}
              className="text-small grid grid-cols-[5.5rem_1fr_5.5rem] items-center gap-2.5"
            >
              <span className="text-muted-foreground">{pointLabel(point, last)}</span>
              <span className="flex flex-col gap-1">
                {[
                  { key: "assets", share: point.assets, color: "var(--ok)" },
                  { key: "liabilities", share: point.liabilities, color: "var(--trend-up)" },
                ].map((bar) => (
                  <span
                    key={bar.key}
                    className="flex items-center gap-2"
                    style={{ "--bar": bar.color, "--width": width(bar.share) }}
                  >
                    <span className="flex-1">
                      <span className="block h-2.5 w-(--width) rounded-xs bg-(--bar)" />
                    </span>
                    <span className="w-16 text-right tabular-nums">{formatPercent(bar.share)}</span>
                  </span>
                ))}
              </span>
              <span
                className="text-right font-bold tabular-nums"
                aria-label={`Saldo: ${formatPercent(point.net)} do PIB`}
              >
                {formatPercent(point.net)}
              </span>
            </li>
          ))}
        </ul>
        <p>
          Saldo em {formatQuarter(last.ref_date)}: <strong>{formatPercent(last.net)} do PIB</strong>
          , ativos menos passivos
        </p>
      </div>
    </ExplainedCard>
  );
}
