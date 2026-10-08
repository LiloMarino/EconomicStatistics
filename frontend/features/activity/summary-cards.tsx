import type { Activity } from "@/features/activity/use-activity";
import { ConceptHint } from "@/shared/components/concept-hint";
import { StatCard } from "@/shared/components/stat-card";
import {
  formatMonth,
  formatPercent,
  formatPoints,
  formatQuarter,
  formatSignedPercent,
} from "@/shared/lib/format";

/** O último número de cada gráfico: PIB, IBC-Br e desemprego. */
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
