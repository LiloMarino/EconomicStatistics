import { BookOpen, Sigma } from "lucide-react";
import { useState } from "react";

import { CaseContext } from "@/features/simulator/case-context";
import { Controls } from "@/features/simulator/controls";
import { ResultCards } from "@/features/simulator/result-cards";
import { ScenarioList } from "@/features/simulator/scenario-list";
import { SideBySideTable } from "@/features/simulator/side-by-side-table";
import { TrajectoryChart } from "@/features/simulator/trajectory-chart";
import { Calculation, HowItWorks } from "@/features/simulator/trays";
import {
  type DebtCase,
  type DebtCaseId,
  useDebtSimulation,
} from "@/features/simulator/use-simulator";
import { useSimulatorView } from "@/features/simulator/use-simulator-view";
import { ExplainedCard } from "@/shared/components/explained-card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getApiErrorMessage } from "@/shared/lib/api";

/** O cenário do usuário contra os pontos de partida que ele ligar: os quatro números, a
trajetória da dívida/PIB e o que ela diz. */
export function Simulator({ cases, years }: { cases: [DebtCase, ...DebtCase[]]; years: number }) {
  const view = useSimulatorView(cases);
  const { scenario } = view;
  const simulation = useDebtSimulation(scenario, years);
  const result = simulation.data;
  // O caso sob o mouse na lista: o contexto acima do gráfico mostra o dele enquanto isso
  const [previewId, setPreviewId] = useState<DebtCaseId | null>(null);
  const preview = cases.find((item) => item.id === previewId);

  return (
    <ExplainedCard
      title={`Dívida em % do PIB nos próximos ${years} anos`}
      subtitle={`Juro, crescimento e primário ficam fixos nos ${years} anos`}
      explain={[
        {
          label: "Como funciona",
          icon: BookOpen,
          heading: "COMO FUNCIONA",
          content: <HowItWorks />,
        },
        {
          label: "Ver a conta",
          icon: Sigma,
          heading: "VER A CONTA",
          content: result && (
            <Calculation
              simulation={result}
              debt={scenario.debt}
              rate={scenario.rate}
              growth={scenario.growth}
              primary={scenario.primary}
            />
          ),
        },
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="order-2 xl:order-1">
          <ScenarioList
            scenario={scenario}
            showScenario={view.showScenario}
            onToggleScenario={view.toggleScenario}
            onPreview={setPreviewId}
            cases={cases}
            compared={view.compared}
            onToggle={view.toggleCompared}
            onCopy={view.copyCase}
          />
        </div>
        <div className="order-1 flex min-w-0 flex-col gap-4 xl:order-2">
          <CaseContext
            base={preview ?? view.base}
            touched={view.touched}
            previewing={preview !== undefined && preview.id !== view.base.id}
          />
          {simulation.error && !result ? (
            <p className="text-caption text-muted-foreground">
              {getApiErrorMessage(simulation.error)}
            </p>
          ) : result ? (
            <>
              <ResultCards simulation={result} />
              <TrajectoryChart
                simulation={result}
                cases={cases}
                compared={view.compared}
                showScenario={view.showScenario}
              />
            </>
          ) : (
            <Skeleton className="h-96 w-full" />
          )}
          <Controls scenario={scenario} onChange={view.setValue} />
          {result && (
            <SideBySideTable
              simulation={result}
              scenarioDebt={scenario.debt}
              cases={cases}
              compared={view.compared}
            />
          )}
        </div>
      </div>
    </ExplainedCard>
  );
}
