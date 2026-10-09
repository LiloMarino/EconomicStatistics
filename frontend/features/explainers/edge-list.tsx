import type { DiagramEdge, DiagramSpec } from "@/features/explainers/diagram-spec";

/** O texto de cada seta, com o número que ela leva no desenho e a cor do grupo dela. */
export function EdgeList({
  edges,
  groupColors,
}: {
  edges: { edge: DiagramEdge; number: number }[];
  groupColors: DiagramSpec["groupColors"];
}) {
  return (
    <ol className="flex flex-col gap-2.5">
      {edges.map(({ edge, number }) => (
        <li key={`${edge.from}-${edge.to}`} className="flex items-start gap-3.5">
          <span
            className="text-small text-background inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-(--edge) font-bold"
            style={{ "--edge": groupColors[edge.group] }}
          >
            {number}
          </span>
          <span>{edge.text}</span>
        </li>
      ))}
    </ol>
  );
}
