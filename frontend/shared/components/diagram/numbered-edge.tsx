import { type Edge, type EdgeProps, useInternalNode } from "@xyflow/react";

import { NODE_MIN_HEIGHT, NODE_WIDTH } from "@/shared/components/diagram/diagram-spec";

export type NumberedFlowEdge = Edge<
  { color: string; number: number; active: boolean; bend: number },
  "numbered"
>;

/** A folga entre a ponta da seta e a borda do nó. */
const GAP = 6;
const BADGE_RADIUS = 11;

interface Point {
  x: number;
  y: number;
}

interface Box {
  center: Point;
  halfWidth: number;
  halfHeight: number;
}

/** O ponto em que a reta do centro de `from` ao centro de `to` sai da borda de `from`. */
function edgeExit(from: Box, to: Box): Point {
  const dx = to.center.x - from.center.x;
  const dy = to.center.y - from.center.y;
  const reachX = dx === 0 ? Infinity : (from.halfWidth + GAP) / Math.abs(dx);
  const reachY = dy === 0 ? Infinity : (from.halfHeight + GAP) / Math.abs(dy);
  const t = Math.min(reachX, reachY);
  return { x: from.center.x + dx * t, y: from.center.y + dy * t };
}

/** Uma seta curva entre dois nós, com a bolinha numerada no meio. O traço sai e chega
na borda dos nós, em linha com os centros; o número liga a seta ao texto que a explica
abaixo do diagrama. */
export function NumberedEdge({ id, source, target, data }: EdgeProps<NumberedFlowEdge>) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  if (!sourceNode || !targetNode || !data) return null;

  const box = (node: typeof sourceNode): Box => {
    const width = node.measured.width ?? NODE_WIDTH;
    const height = node.measured.height ?? NODE_MIN_HEIGHT;
    return {
      center: {
        x: node.internals.positionAbsolute.x + width / 2,
        y: node.internals.positionAbsolute.y + height / 2,
      },
      halfWidth: width / 2,
      halfHeight: height / 2,
    };
  };
  const from = box(sourceNode);
  const to = box(targetNode);
  const start = edgeExit(from, to);
  const end = edgeExit(to, from);

  // O ponto de controle da curva: o meio da reta, empurrado para o lado pela dobra
  const normalX = -(end.y - start.y);
  const normalY = end.x - start.x;
  const length = Math.hypot(normalX, normalY) || 1;
  const control = {
    x: (start.x + end.x) / 2 + (normalX / length) * data.bend,
    y: (start.y + end.y) / 2 + (normalY / length) * data.bend,
  };
  const badge = {
    x: 0.25 * start.x + 0.5 * control.x + 0.25 * end.x,
    y: 0.25 * start.y + 0.5 * control.y + 0.25 * end.y,
  };
  const markerId = `arrow-${id}`;

  return (
    <g className={data.active ? "opacity-100" : "opacity-12"} style={{ "--edge": data.color }}>
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX={9}
          refY={5}
          markerWidth={7}
          markerHeight={7}
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-(--edge)" />
        </marker>
      </defs>
      <path
        d={`M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`}
        fill="none"
        strokeWidth={data.active ? 2.5 : 2}
        markerEnd={`url(#${markerId})`}
        className="stroke-(--edge)"
      />
      <circle cx={badge.x} cy={badge.y} r={BADGE_RADIUS} className="fill-(--edge)" />
      <text
        x={badge.x}
        y={badge.y}
        dy={4}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        className="fill-background"
      >
        {data.number}
      </text>
    </g>
  );
}
