import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

import { LampLabel } from "@/features/economy-health/lamp";
import type { EconomyHealth } from "@/features/economy-health/use-economy-health";
import { ConceptHint } from "@/shared/components/concept-hint";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { formatMonth, formatPercent, formatRateNumber } from "@/shared/lib/format";

type Signal = EconomyHealth["primary"];

/** O primário feito contra o que estabiliza a dívida/PIB, com quanto falta ou sobra. */
export function PrimarySignalCard({ data }: { data: Signal }) {
  const covered = data.gap <= 0;

  return (
    <ExplainedCard
      title="Primário contra o que estabiliza a dívida"
      subtitle={`% do PIB em 12 meses, até ${formatMonth(data.ref_date)} · superávit é positivo`}
      actions={
        <>
          <LampLabel lamp={data.lamp}>{covered ? "Cobre" : "Não cobre"}</LampLabel>
          <ConceptHint id="stabilizing-primary" />
        </>
      }
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "Como ler",
        content: (
          <>
            <TrayItem title="As cores" concept="primary-balance">
              <p>
                Verde se o primário feito cobre o necessário, vermelho se não. A régua vem da
                própria conta da dívida, não de opinião.
              </p>
            </TrayItem>
            <TrayItem title="O necessário" concept="stabilizing-primary">
              <p>
                É o primário que deixa a dívida/PIB parada com o juro e o crescimento de hoje: d ×
                (r − g) ÷ (1 + g).
              </p>
            </TrayItem>
            <div className="text-caption flex flex-col items-start gap-1 font-semibold">
              <Link to="/debt">Ver a conta na tela de dívida →</Link>
              <Link to="/simulator">Testar no simulador →</Link>
            </div>
          </>
        ),
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <strong className="font-heading text-kpi">{formatPercent(data.surplus)}</strong>
          <span className="text-muted-foreground">
            feito · preciso{" "}
            <strong className="text-foreground">{formatPercent(data.stabilizing)}</strong> do PIB
          </span>
        </div>
        <p>
          {covered ? (
            <>
              Sobram <strong>{formatRateNumber(-data.gap)} p.p. do PIB</strong> por ano: a
              dívida/PIB deixa de subir.
            </>
          ) : (
            <>
              Faltam <strong>{formatRateNumber(data.gap)} p.p. do PIB</strong> por ano para a
              dívida/PIB parar de subir.
            </>
          )}
        </p>
      </div>
    </ExplainedCard>
  );
}
