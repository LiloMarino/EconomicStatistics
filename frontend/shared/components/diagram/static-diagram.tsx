import type { DiagramSpec } from "@/shared/components/diagram/diagram-spec";
import { EdgeList } from "@/shared/components/diagram/edge-list";
import { FlowDiagram } from "@/shared/components/diagram/flow-diagram";

/** O desenho dos explicadores sem seletor de passo, com o texto de cada seta numerado
embaixo: é o diagrama das páginas de conceito e das telas. */
export function StaticDiagram({ spec }: { spec: DiagramSpec }) {
  const edges = spec.edges.map((edge, index) => ({ edge, number: index + 1 }));
  return (
    <div className="flex flex-col gap-3">
      <FlowDiagram spec={spec} step={spec.steps[0]} />
      <div className="max-w-prose">
        <EdgeList edges={edges} groupColors={spec.groupColors} />
      </div>
    </div>
  );
}
