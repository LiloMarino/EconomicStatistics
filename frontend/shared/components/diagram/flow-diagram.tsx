import "@xyflow/react/dist/base.css";

import { ReactFlow } from "@xyflow/react";
import { useMemo } from "react";

import { ConceptNode, type ConceptFlowNode } from "@/shared/components/diagram/concept-node";
import {
  type DiagramHover,
  type DiagramSpec,
  type DiagramStep,
  hoveredEffect,
  isEdgeHighlighted,
  isNodeHighlighted,
  isGroupActive,
} from "@/shared/components/diagram/diagram-spec";
import { NumberedEdge, type NumberedFlowEdge } from "@/shared/components/diagram/numbered-edge";

const nodeTypes = { concept: ConceptNode };
const edgeTypes = { numbered: NumberedEdge };

// A largura da página de explicador
const DEFAULT_WIDTH = 1000;

/** O desenho do mecanismo: nós nas posições do `spec`, setas numeradas, tudo parado. O
passo escolhido acende as setas dos grupos dele e apaga o resto. */
export function FlowDiagram({
  spec,
  step,
  hover = null,
  onHover = () => {},
}: {
  spec: DiagramSpec;
  step: DiagramStep;
  /** O que está sob o mouse, no desenho ou na lista de setas embaixo dele. */
  hover?: DiagramHover;
  onHover?: (hover: DiagramHover) => void;
}) {
  const { nodes, edges } = useMemo(() => {
    const highlighted = spec.edges.map((edge, index) => isEdgeHighlighted(hover, edge, index + 1));
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
        highlighted: highlighted[index] ?? false,
        receded: hover !== null && !highlighted[index],
        text: edge.text,
        effect: edge.effect,
        flow: edge.flow,
        onHover: (number) => onHover(number === null ? null : { edge: number }),
      },
    }));
    const effect = hoveredEffect(hover, spec.edges);
    const lit = new Set(
      flowEdges.filter((edge) => edge.data?.active).flatMap((edge) => [edge.source, edge.target]),
    );
    const flowNodes: ConceptFlowNode[] = spec.nodes.map(({ id, x, y, ...data }) => ({
      id,
      type: "concept",
      position: { x, y },
      data: {
        ...data,
        dimmed: !lit.has(id),
        highlighted: isNodeHighlighted(hover, spec.edges, id),
        effect: effect?.node === id ? effect.direction : undefined,
        onHover: (hovering) => onHover(hovering ? { node: id } : null),
      },
    }));
    return { nodes: flowNodes, edges: flowEdges };
  }, [spec, step, hover, onHover]);

  return (
    <div className="bg-card overflow-x-auto rounded-2xl p-4">
      <div
        role="group"
        aria-label={spec.label}
        className="mx-auto h-(--diagram-height) w-(--diagram-width)"
        style={{
          "--diagram-height": `${spec.height}px`,
          "--diagram-width": `${spec.width ?? DEFAULT_WIDTH}px`,
        }}
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
          proOptions={{ hideAttribution: true }}
        />
      </div>
    </div>
  );
}
