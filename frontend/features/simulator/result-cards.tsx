import type { Simulation } from "@/features/simulator/use-simulator";
import { ConceptHint } from "@/shared/components/concept-hint";
import { HintButton } from "@/shared/components/hint-button";
import { StatCard, type StatTone } from "@/shared/components/stat-card";
import { formatPercent, formatPoints, formatSignedPercent } from "@/shared/lib/format";

// Abaixo disso o primário escolhido conta como o que estabiliza
const SAME_PRIMARY = 0.0005;

const trendTone: Record<Simulation["trend"], StatTone> = {
  rising: "up",
  falling: "down",
  stable: "default",
};

function endSentence({ trend, still_rising: stillRising, change }: Simulation): string {
  const points = formatPoints(change);
  if (trend === "stable") return `A dívida fica praticamente parada: ${points}`;
  if (trend === "falling") return `A dívida cai: ${points}`;
  return `A dívida sobe${stillRising ? ", e continua subindo depois" : ""}: ${points}`;
}

function gapSentence(gap: number): string {
  if (Math.abs(gap) < SAME_PRIMARY) return "É o primário do seu cenário";
  const points = formatPoints(Math.abs(gap)).replace("+", "");
  return gap > 0 ? `Faltam ${points} por ano` : `Sobram ${points} por ano`;
}

/** Os dois números que respondem ao cenário: onde a dívida chega e o primário que a
deixaria parada. */
export function ResultCards({ simulation }: { simulation: Simulation }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
      <StatCard
        size="compact"
        label={`Seu cenário em ${simulation.years} anos`}
        hint={
          <HintButton label="O que é este número">
            A dívida em relação ao PIB depois de {simulation.years} anos com os números do seu
            cenário. Subir não é crise por si só; o que preocupa é subir sem parar.
          </HintButton>
        }
        value={formatPercent(simulation.end)}
        tone={trendTone[simulation.trend]}
      >
        <span className="text-caption">{endSentence(simulation)}</span>
      </StatCard>
      <StatCard
        size="compact"
        label="Primário que estabiliza"
        hint={<ConceptHint id="stabilizing-primary" />}
        value={formatSignedPercent(simulation.stabilizing_primary)}
      >
        <span className="text-caption">{gapSentence(simulation.primary_gap)}</span>
      </StatCard>
    </div>
  );
}
