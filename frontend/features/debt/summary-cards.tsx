import type { DebtOverview } from "@/features/debt/use-debt";
import { ConceptHint } from "@/shared/components/concept-hint";
import { StatCard } from "@/shared/components/stat-card";
import { formatMonth, formatPercent, formatPoints } from "@/shared/lib/format";

/** Quanto o setor público deve, se a dívida cresce sozinha e quanto falta de primário
para ela parar de subir. */
export function SummaryCards({ data }: { data: DebtOverview }) {
  const level = data.levels.at(-1);
  const { stabilization } = data;
  const rateGap = stabilization.implicit_rate - stabilization.nominal_growth;
  const covered = stabilization.primary_gap <= 0;

  return (
    <section
      aria-label="Resumo"
      className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3"
    >
      <StatCard
        label="Dívida líquida"
        hint={<ConceptHint id="net-debt" />}
        value={level && formatPercent(level.net)}
      >
        {level && (
          <span className="text-caption text-muted-foreground">
            do PIB · {formatMonth(level.ref_date)}
          </span>
        )}
      </StatCard>
      <StatCard
        label="Dívida bruta"
        hint={<ConceptHint id="gross-debt" />}
        value={level && formatPercent(level.gross)}
      >
        {level && (
          <span className="text-caption text-muted-foreground">
            do PIB · {formatMonth(level.ref_date)}
          </span>
        )}
      </StatCard>
      <StatCard
        label="r − g"
        hint={<ConceptHint id="r-minus-g" />}
        value={formatPoints(rateGap)}
        tone={rateGap > 0 ? "up" : "down"}
      >
        <span className="text-caption text-muted-foreground">
          {rateGap > 0
            ? "juro maior que o crescimento: a dívida cresce sozinha"
            : "crescimento maior que o juro: a dívida encolhe sozinha"}
        </span>
      </StatCard>
      <StatCard
        label="Primário que falta"
        hint={<ConceptHint id="stabilizing-primary" />}
        value={covered ? "nenhum" : formatPoints(stabilization.primary_gap)}
        tone={covered ? "down" : "up"}
      >
        <span className="text-caption text-muted-foreground">
          {covered
            ? "o primário feito já segura a dívida/PIB"
            : "do PIB por ano para a dívida/PIB parar de subir"}
        </span>
      </StatCard>
    </section>
  );
}
