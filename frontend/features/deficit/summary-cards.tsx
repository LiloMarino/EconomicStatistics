import type { Deficit } from "@/features/deficit/use-deficit";
import { ConceptHint } from "@/shared/components/concept-hint";
import { StatCard } from "@/shared/components/stat-card";
import { formatMonth, formatPercent, formatWholePercent } from "@/shared/lib/format";

/** O resultado dos 12 meses até o último mês publicado: o nominal e as duas partes
dele. Na convenção da NFSP, positivo é déficit. */
export function SummaryCards({ data }: { data: Deficit }) {
  const { last, interest_share } = data;
  const nominalDeficit = last.nominal > 0;
  const primaryDeficit = last.primary > 0;

  return (
    <section
      aria-label="Resumo"
      className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3"
    >
      <StatCard
        label={nominalDeficit ? "Déficit nominal" : "Superávit nominal"}
        hint={<ConceptHint id="nominal-balance" />}
        value={formatPercent(Math.abs(last.nominal))}
      >
        <span className="text-caption text-muted-foreground">
          do PIB em 12 meses, até {formatMonth(last.ref_date)}
        </span>
      </StatCard>
      <StatCard
        label="Primário"
        hint={<ConceptHint id="primary-balance" />}
        value={formatPercent(Math.abs(last.primary))}
        tone="fiscal-primary"
      >
        <span className="text-caption text-muted-foreground">
          de {primaryDeficit ? "déficit" : "superávit"}, sem contar os juros
        </span>
      </StatCard>
      <StatCard
        label="Juros da dívida"
        hint={<ConceptHint id="nominal-interest" />}
        value={formatPercent(last.interest)}
        tone="fiscal-interest"
      >
        <span className="text-caption text-muted-foreground">
          {interest_share === null
            ? "do PIB em 12 meses"
            : `${formatWholePercent(interest_share)} do déficit é juro`}
        </span>
      </StatCard>
    </section>
  );
}
