import { formatFocusValue, focusIndicatorLabels } from "@/features/focus/focus-labels";
import type { FocusHistory } from "@/features/focus/use-focus";
import { ConceptHint } from "@/shared/components/concept-hint";
import { StatCard } from "@/shared/components/stat-card";
import { formatDay } from "@/shared/lib/format";

// O relatório compara com a pesquisa de 4 semanas antes
const WEEKS_BEFORE = 4;

/** A previsão de hoje, a de 4 semanas atrás e quantas instituições responderam. */
export function SummaryCards({ history }: { history: FocusHistory }) {
  const last = history.points.at(-1);
  const before = history.points.at(-1 - WEEKS_BEFORE);
  if (!last) return null;

  return (
    <section
      aria-label="Resumo"
      className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3"
    >
      <StatCard
        label={`${focusIndicatorLabels[history.indicator]} esperado para ${history.year}`}
        hint={<ConceptHint id="focus-survey" />}
        value={formatFocusValue(last.value, history.unit)}
      >
        <span className="text-caption text-muted-foreground">
          mediana da pesquisa de {formatDay(last.survey_date)}
        </span>
      </StatCard>
      <StatCard
        label="Há 4 semanas"
        hint={<ConceptHint id="median" />}
        value={before && formatFocusValue(before.value, history.unit)}
      >
        {before && (
          <span className="text-caption text-muted-foreground">
            pesquisa de {formatDay(before.survey_date)}
          </span>
        )}
      </StatCard>
      <StatCard label="Instituições que responderam" value={last.respondents}>
        <span className="text-caption text-muted-foreground">nos 30 dias até a pesquisa</span>
      </StatCard>
    </section>
  );
}
