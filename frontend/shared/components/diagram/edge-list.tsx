import {
  type DiagramEdge,
  type DiagramHover,
  type DiagramSpec,
  isEdgeHighlighted,
} from "@/shared/components/diagram/diagram-spec";
import { EdgeTags } from "@/shared/components/diagram/effect-tag";
import { cn } from "@/shared/lib/utils";

/** O texto de cada seta, com o número que ela leva no desenho e a cor do grupo dela.
Passar o mouse num item acende a seta no desenho, e a seta sob o mouse acende o item. */
export function EdgeList({
  edges,
  groupColors,
  hover,
  onHover,
  columns = 1,
}: {
  edges: { edge: DiagramEdge; number: number }[];
  groupColors: DiagramSpec["groupColors"];
  hover?: DiagramHover;
  onHover?: (hover: DiagramHover) => void;
  /** Em duas colunas, a lista ocupa a largura do desenho em vez de uma coluna estreita. */
  columns?: 1 | 2;
}) {
  return (
    <ol className={cn("grid gap-1", columns === 2 && "gap-x-8 md:grid-cols-2")}>
      {edges.map(({ edge, number }) => (
        <li
          key={`${edge.from}-${edge.to}`}
          className={cn(
            "-mx-2 flex items-start gap-3.5 rounded-lg px-2 py-1 transition-colors",
            isEdgeHighlighted(hover ?? null, edge, number) && "bg-muted",
          )}
          onMouseEnter={() => onHover?.({ edge: number })}
          onMouseLeave={() => onHover?.(null)}
        >
          <span
            className="text-small text-background inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-(--edge) font-bold"
            style={{ "--edge": groupColors[edge.group] }}
          >
            {number}
          </span>
          <span>
            <EdgeTags flow={edge.flow} effect={edge.effect} /> {edge.text}
          </span>
        </li>
      ))}
    </ol>
  );
}
