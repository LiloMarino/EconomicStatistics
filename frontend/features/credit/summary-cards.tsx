import type { Credit } from "@/features/credit/use-credit";
import { ConceptHint } from "@/shared/components/concept-hint";
import { StatCard } from "@/shared/components/stat-card";
import { formatMonth, formatPercent, formatPoints, formatSignedPercent } from "@/shared/lib/format";

/** O último número de cada gráfico: custo do crédito, spread e concessões às famílias. */
export function SummaryCards({ data }: { data: Credit }) {
  const cost = data.cost.months.at(-1);
  const households = data.concessions.households.at(-1);

  return (
    <section
      aria-label="Resumo"
      className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3"
    >
      <StatCard
        label="Custo do crédito"
        hint={<ConceptHint id="credit-cost" />}
        value={cost && formatPercent(cost.cost)}
      >
        {cost && (
          <span className="text-caption text-muted-foreground">
            ao ano, média de todas as operações, em {formatMonth(cost.ref_date)}
          </span>
        )}
      </StatCard>
      <StatCard
        label="Spread"
        hint={<ConceptHint id="credit-spread" />}
        value={formatPoints(data.cost.spread)}
      >
        <span className="text-caption text-muted-foreground">acima da Selic de fim de mês</span>
      </StatCard>
      <StatCard
        label="Concessões a famílias"
        hint={<ConceptHint id="credit-concessions" />}
        value={households && formatSignedPercent(households.value)}
      >
        {households && (
          <span className="text-caption text-muted-foreground">
            em 12 meses até {formatMonth(households.ref_date)}, recursos livres, sem rotativo
          </span>
        )}
      </StatCard>
    </section>
  );
}
