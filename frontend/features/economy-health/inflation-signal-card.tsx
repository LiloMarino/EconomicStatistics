import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

import { LampLabel } from "@/features/economy-health/lamp";
import { lampFill } from "@/features/economy-health/lamp-styles";
import type { EconomyHealth } from "@/features/economy-health/use-economy-health";
import { ConceptHint } from "@/shared/components/concept-hint";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { formatMonth, formatPercent, formatShortPercent } from "@/shared/lib/format";

type Signal = EconomyHealth["inflation"];

function lampName({ lamp, months_out }: Signal) {
  if (lamp === "yellow" || lamp === "red") return `Fora há ${months_out} meses`;
  return "Dentro";
}

/** O texto da faixa para leitor de tela: a cor em palavras, mês a mês. */
function stripLabel({ strip }: Signal) {
  const count = (lamp: "green" | "yellow" | "red") =>
    strip.filter((cell) => cell.lamp === lamp).length;
  return `Inflação em 12 meses nos últimos ${strip.length} meses: ${count("green")} dentro da faixa, ${count("yellow")} fora há menos de 6 meses seguidos e ${count("red")} fora há 6 meses seguidos ou mais`;
}

/** O IPCA em 12 meses contra a faixa da meta, com a cor de cada um dos últimos 24
meses. */
export function InflationSignalCard({ data }: { data: Signal }) {
  const first = data.strip.at(0);

  return (
    <ExplainedCard
      title="Inflação contra a meta"
      subtitle={`IPCA em 12 meses de ${formatMonth(data.ref_date)}`}
      actions={
        <>
          {data.lamp && <LampLabel lamp={data.lamp}>{lampName(data)}</LampLabel>}
          <ConceptHint id="inflation-target" />
        </>
      }
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "Como ler",
        content: (
          <>
            <TrayItem title="As cores" concept="inflation-target">
              <p>
                Verde dentro da faixa. Amarelo fora há menos de 6 meses. Vermelho fora por 6 meses
                seguidos, quando o Banco Central tem de escrever carta aberta explicando o motivo
                (meta contínua, regra do CMN desde 2025).
              </p>
            </TrayItem>
            <TrayItem title="Por que 12 meses" concept="rolling-12m">
              <p>
                A meta é anual; o acumulado de 12 meses é o número que se compara com ela a cada
                mês.
              </p>
            </TrayItem>
            <Link to="/inflation" className="text-caption self-start font-semibold">
              Ver a inflação por categoria →
            </Link>
          </>
        ),
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <strong className="font-heading text-kpi">{formatPercent(data.rate)}</strong>
          {data.band && (
            <span className="text-muted-foreground">
              em 12 meses · faixa de {formatShortPercent(data.band.floor)} a{" "}
              {formatShortPercent(data.band.ceiling)}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-caption text-muted-foreground">
            Últimos {data.strip.length} meses
          </span>
          <div
            role="img"
            aria-label={stripLabel(data)}
            className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-0.5"
          >
            {data.strip.map((cell) => (
              <span
                key={cell.ref_date}
                title={`${formatMonth(cell.ref_date)}: ${formatPercent(cell.rate)}`}
                className={`h-5.5 rounded-xs ${lampFill({ lamp: cell.lamp ?? "none" })}`}
              />
            ))}
          </div>
          <div className="text-caption text-muted-foreground flex justify-between">
            <span>{first && formatMonth(first.ref_date)}</span>
            <span>{formatMonth(data.ref_date)}</span>
          </div>
        </div>
      </div>
    </ExplainedCard>
  );
}
