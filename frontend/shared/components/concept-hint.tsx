import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { HintButton } from "@/shared/components/hint-button";
import type { ConceptId } from "@/shared/concepts/concept";
import { concepts } from "@/shared/concepts/concepts";

/** O "?" de um conceito do catálogo: o mesmo texto que abre a página dele em Aprender,
com o atalho até ela. */
export function ConceptHint({ id }: { id: ConceptId }) {
  const navigate = useNavigate();
  const concept = concepts[id];
  return (
    <HintButton
      label={`O que é ${concept.title}`}
      action={{
        label: "Ver em Aprender",
        icon: ArrowRight,
        onSelect: () => void navigate(`/learn/${id}`),
      }}
    >
      <p>{concept.lead}</p>
    </HintButton>
  );
}
