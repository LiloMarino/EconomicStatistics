import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { Triangle } from "lucide-react";
import { Link } from "react-router-dom";

import {
  type DiagramEffect,
  type DiagramNode,
  effectColor,
} from "@/shared/components/diagram/diagram-spec";
import { NODE_MIN_HEIGHT } from "@/shared/components/diagram/diagram-spec";

export type ConceptFlowNode = Node<
  Omit<DiagramNode, "id" | "x" | "y"> & {
    dimmed: boolean;
    /** Em destaque pelo mouse, num nó ou numa seta que toca nele. */
    highlighted: boolean;
    /** O sentido do efeito da seta sob o mouse, quando é este o nó afetado. */
    effect?: DiagramEffect["direction"];
    onHover: (hovering: boolean) => void;
  },
  "concept"
>;

// A largura de 170px é a `NODE_WIDTH` do `numbered-edge`, que traça as setas até a borda
const nodeClass =
  "bg-muted text-foreground box-border flex min-h-(--node-height) w-42.5 flex-col gap-0.5 rounded-xl border-2 border-(--accent) px-3 py-2.5 transition-opacity";

/** Um conceito do mecanismo. Com `concept`, o nó leva à página dele em Aprender; com
`value`, mostra o número de hoje. As setas se prendem em alças invisíveis: quem as
desenha é o `NumberedEdge`, a partir da posição dos nós. */
export function ConceptNode({ data }: NodeProps<ConceptFlowNode>) {
  const { title, value, subtitle, concept, accent, height, dimmed, highlighted, effect, onHover } =
    data;
  const style = {
    "--accent": accent ?? "var(--border)",
    "--node-height": `${height ?? NODE_MIN_HEIGHT}px`,
  };
  const className = `${nodeClass} ${dimmed ? "opacity-30" : "opacity-100"} ${highlighted ? "ring-foreground/40 ring-2" : ""}`;
  // O triângulo do efeito fica ao lado do número; sem número, ao lado do título
  const triangle = effect && (
    <Triangle
      aria-hidden
      className={`size-4 shrink-0 fill-current ${effectColor[effect]} ${effect === "down" ? "rotate-180" : ""}`}
    />
  );
  const content = (
    <>
      <strong className="text-body flex items-center gap-1.5 font-semibold">
        {title}
        {!value && triangle}
      </strong>
      {value && (
        <span className="font-heading text-kpi-sm flex items-center gap-1.5">
          {value}
          {triangle}
        </span>
      )}
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
          onMouseEnter={() => onHover(true)}
          onMouseLeave={() => onHover(false)}
        >
          {content}
        </Link>
      ) : (
        <div
          className={className}
          style={style}
          onMouseEnter={() => onHover(true)}
          onMouseLeave={() => onHover(false)}
        >
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
