import { useDiagramStep } from "@/features/explainers/use-diagram-step";
import { type DiagramSpec, isGroupActive } from "@/shared/components/diagram/diagram-spec";
import { EdgeList } from "@/shared/components/diagram/edge-list";
import { FlowDiagram } from "@/shared/components/diagram/flow-diagram";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";

/** O diagrama com o seletor de passo em cima e, embaixo, o texto de cada seta acesa, com
o número que a seta leva no desenho. */
export function SteppedDiagram({ spec }: { spec: DiagramSpec }) {
  const { step, choose } = useDiagramStep(spec.steps);
  // A numeração é a do desenho inteiro, e o texto lista só as setas acesas
  const lit = spec.edges
    .map((edge, index) => ({ edge, number: index + 1 }))
    .filter(({ edge }) => isGroupActive(step, edge.group));

  return (
    <div className="flex flex-col gap-3.5">
      <ToggleGroup
        variant="pill"
        aria-label="Mostrar no diagrama"
        value={[step.id]}
        className="flex-wrap"
        onValueChange={([next]) => {
          if (next) choose(next);
        }}
      >
        {spec.steps.map((item) => (
          <ToggleGroupItem key={item.id} value={item.id}>
            {item.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <FlowDiagram spec={spec} step={step} />

      {/* O texto do passo e de cada seta acesa */}
      <section aria-live="polite" className="bg-card flex flex-col gap-3 rounded-2xl px-6 py-5">
        <h2 className="text-lg font-bold">{step.title}</h2>
        <p className="text-muted-foreground">{step.intro}</p>
        <EdgeList edges={lit} groupColors={spec.groupColors} />
      </section>
    </div>
  );
}
