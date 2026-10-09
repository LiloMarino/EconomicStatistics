import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { Link } from "react-router-dom";

import type { DiagramNode } from "@/shared/components/diagram/diagram-spec";
import { NODE_MIN_HEIGHT } from "@/shared/components/diagram/diagram-spec";

export type ConceptFlowNode = Node<
  Omit<DiagramNode, "id" | "x" | "y"> & { dimmed: boolean },
  "concept"
>;

// A largura de 170px é a `NODE_WIDTH` do `numbered-edge`, que traça as setas até a borda
const nodeClass =
  "bg-muted text-foreground box-border flex min-h-(--node-height) w-42.5 flex-col gap-0.5 rounded-xl border-2 border-(--accent) px-3 py-2.5 transition-opacity";

/** Um conceito do mecanismo. Com `concept`, o nó leva à página dele em Aprender; com
`value`, mostra o número de hoje. As setas se prendem em alças invisíveis: quem as
desenha é o `NumberedEdge`, a partir da posição dos nós. */
export function ConceptNode({ data }: NodeProps<ConceptFlowNode>) {
  const { title, value, subtitle, concept, accent, height, dimmed } = data;
  const style = {
    "--accent": accent ?? "var(--border)",
    "--node-height": `${height ?? NODE_MIN_HEIGHT}px`,
  };
  const className = `${nodeClass} ${dimmed ? "opacity-30" : "opacity-100"}`;
  const content = (
    <>
      <strong className="text-body font-semibold">{title}</strong>
      {value && <span className="font-heading text-kpi-sm">{value}</span>}
      <span className="text-small text-muted-foreground">{subtitle}</span>
    </>
  );

  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={false} className="opacity-0" />
      {concept ? (
        <Link
          to={`/learn/${concept}`}
          className={`${className} hover:ring-border hover:ring-2`}
          style={style}
        >
          {content}
        </Link>
      ) : (
        <div className={className} style={style}>
          {content}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        className="opacity-0"
      />
    </>
  );
}
