import type { DiagramSpec } from "@/features/explainers/diagram-spec";
import { EdgeList } from "@/features/explainers/edge-list";
import { ExplainerDiagram } from "@/features/explainers/explainer-diagram";

/** O diagrama de um conceito: o mesmo desenho dos explicadores, sem seletor de passo,
com o texto de cada seta numerado embaixo. */
export function ConceptDiagram({ spec }: { spec: DiagramSpec }) {
  const edges = spec.edges.map((edge, index) => ({ edge, number: index + 1 }));
  return (
    <div className="flex flex-col gap-3">
      <ExplainerDiagram spec={spec} step={spec.steps[0]} />
      <div className="max-w-prose">
        <EdgeList edges={edges} groupColors={spec.groupColors} />
      </div>
    </div>
  );
}
