import { growthPaceLook } from "@/features/activity/growth-pace";
import type { Activity } from "@/features/activity/use-activity";
import { ConceptHint } from "@/shared/components/concept-hint";
import { HintButton } from "@/shared/components/hint-button";
import { StatCard } from "@/shared/components/stat-card";
import {
  formatMonth,
  formatPercent,
  formatPoints,
  formatQuarter,
  formatSignedPercent,
} from "@/shared/lib/format";

function PaceCard({ ibc }: { ibc: Activity["ibc"] }) {
  const look = growthPaceLook[ibc.verdict];
  const Icon = look.icon;
  const band = formatPoints(ibc.steady_band).replace("+", "").replace(" p.p.", "");
  return (
    <StatCard
      label="Ritmo da economia"
      hint={
        <HintButton label="O que é o ritmo da economia">
          <p>
            Quanto a linha do IBC-Br em 12 meses subiu ou desceu nos últimos 3 meses:{" "}
            <strong>{formatPoints(ibc.change_3m)}</strong>
          </p>
          <p className="text-muted-foreground">
            Desceu mais de {band} p.p.: freando, o país cresce cada vez menos. Subiu mais de {band}:
            acelerando. Entre os dois: estável. Encolher é outra coisa: é a linha abaixo de zero.
          </p>
        </HintButton>
      }
      tone={look.tone}
      value={
        <>
          <Icon className="size-7.5" />
          {look.label}
        </>
      }
    >
      <span className="text-caption text-muted-foreground grid grid-cols-[1fr_auto] gap-x-2">
        <span>12 meses, no último mês</span>
        <strong className="text-foreground">{formatPoints(ibc.change_1m)}</strong>
        <span>12 meses, em 3 meses</span>
        <strong className="text-foreground">{formatPoints(ibc.change_3m)}</strong>
      </span>
    </StatCard>
  );
}

/** O último número de cada gráfico: PIB, IBC-Br, o ritmo do IBC-Br e o desemprego. */
export function SummaryCards({ data }: { data: Activity }) {
  const gdp = data.gdp.quarters.at(-1);
  const ibc = data.ibc.months.at(-1);
  const unemployment = data.unemployment.months.at(-1);
  const change = data.unemployment.change_12m;

  return (
    <section
      aria-label="Resumo"
      className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3"
    >
      <StatCard
        label="PIB"
        hint={<ConceptHint id="gdp" />}
        value={gdp && formatSignedPercent(gdp.value)}
      >
        {gdp && (
          <span className="text-caption text-muted-foreground">
            em 4 trimestres, até o {formatQuarter(gdp.ref_date)}
          </span>
        )}
      </StatCard>
      <StatCard
        label="IBC-Br"
        hint={<ConceptHint id="ibc-br" />}
        value={ibc && formatSignedPercent(ibc.value)}
      >
        {ibc && (
          <span className="text-caption text-muted-foreground">
            em 12 meses, até {formatMonth(ibc.ref_date)}
          </span>
        )}
      </StatCard>
      <PaceCard ibc={data.ibc} />
      <StatCard
        label="Desemprego"
        hint={<ConceptHint id="unemployment-rate" />}
        value={unemployment && formatPercent(unemployment.value)}
      >
        {unemployment && (
          <span className="text-caption text-muted-foreground">
            trimestre móvel até {formatMonth(unemployment.ref_date)}
            {change !== null && ` · ${formatPoints(change)} em 12 meses`}
          </span>
        )}
      </StatCard>
    </section>
  );
}
