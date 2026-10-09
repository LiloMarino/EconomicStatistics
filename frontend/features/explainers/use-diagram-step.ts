import { useSearchParams } from "react-router-dom";

import type { DiagramSpec } from "@/features/explainers/diagram-spec";

/** O passo do diagrama (`?parte=`) mora na URL; o primeiro passo é o padrão e não aparece. */
export function useDiagramStep(steps: DiagramSpec["steps"]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("parte");
  const [first] = steps;
  const step = steps.find((item) => item.id === requested) ?? first;

  function choose(id: string) {
    setSearchParams(
      (params) => {
        if (id === first.id) params.delete("parte");
        else params.set("parte", id);
        return params;
      },
      { replace: true, preventScrollReset: true },
    );
  }

  return { step, choose };
}
