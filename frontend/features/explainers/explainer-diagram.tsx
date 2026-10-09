import "@xyflow/react/dist/base.css";

import { ReactFlow } from "@xyflow/react";
import { useMemo } from "react";

import { ConceptNode, type ConceptFlowNode } from "@/features/explainers/concept-node";
import {
  type DiagramSpec,
  type DiagramStep,
  isGroupActive,
} from "@/features/explainers/diagram-spec";
import { NumberedEdge, type NumberedFlowEdge } from "@/features/explainers/numbered-edge";

const nodeTypes = { concept: ConceptNode };
const edgeTypes = { numbered: NumberedEdge };

/** O desenho do mecanismo: nós nas posições do `spec`, setas numeradas, tudo parado. O
passo escolhido acende as setas dos grupos dele e apaga o resto. */
export function ExplainerDiagram({ spec, step }: { spec: DiagramSpec; step: DiagramStep }) {
  const { nodes, edges } = useMemo(() => {
    const flowEdges: NumberedFlowEdge[] = spec.edges.map((edge, index) => ({
      id: `${edge.from}-${edge.to}`,
      source: edge.from,
      target: edge.to,
      type: "numbered",
      data: {
        color: spec.groupColors[edge.group] ?? "var(--border-strong)",
        number: index + 1,
        active: isGroupActive(step, edge.group),
        bend: edge.bend ?? 30,
      },
    }));
    const lit = new Set(
      flowEdges.filter((edge) => edge.data?.active).flatMap((edge) => [edge.source, edge.target]),
    );
    const flowNodes: ConceptFlowNode[] = spec.nodes.map(({ id, x, y, ...data }) => ({
      id,
      type: "concept",
      position: { x, y },
      data: { ...data, dimmed: !lit.has(id) },
    }));
    return { nodes: flowNodes, edges: flowEdges };
  }, [spec, step]);

  return (
    <div className="bg-card overflow-x-auto rounded-2xl p-4">
      <div
        role="group"
        aria-label={spec.label}
        className="mx-auto h-(--diagram-height) w-250"
        style={{ "--diagram-height": `${spec.height}px` }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={1}
          maxZoom={1}
          panOnDrag={false}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
        />
      </div>
    </div>
  );
}
