import { useState } from "react";

import { referenceLabels } from "@/features/purchasing-power/reference-labels";
import type { RaiseReference } from "@/features/purchasing-power/use-purchasing-power";
import { raiseReferences } from "@/features/purchasing-power/use-purchasing-power";
import { Input } from "@/shared/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";

interface ReferenceSelectProps {
  reference: RaiseReference;
  raiseText: string;
  onReferenceChange: (reference: RaiseReference) => void;
  onRaiseChange: (text: string) => void;
}

/** A referência de reajuste e, quando ela é o reajuste digitado, o campo dele. */
export function ReferenceSelect({
  reference,
  raiseText,
  onReferenceChange,
  onRaiseChange,
}: ReferenceSelectProps) {
  // O campo guarda o que está sendo digitado; a URL recebe uma cópia a cada tecla
  const [text, setText] = useState(raiseText);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ToggleGroup
        variant="segmented"
        size="sm"
        aria-label="Reajuste comparado"
        value={[reference]}
        onValueChange={([next]) => {
          const chosen = raiseReferences.find((option) => option === next);
          if (chosen) onReferenceChange(chosen);
        }}
      >
        {raiseReferences.map((option) => (
          <ToggleGroupItem key={option} value={option}>
            {referenceLabels[option]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {reference === "custom" && (
        <label className="text-caption text-muted-foreground flex items-center gap-1.5">
          Reajuste de
          <Input
            inputMode="decimal"
            value={text}
            placeholder="6,5"
            aria-label="Reajuste no período, em %"
            className="w-20"
            onChange={(event) => {
              setText(event.target.value);
              onRaiseChange(event.target.value);
            }}
          />
          %
        </label>
      )}
    </div>
  );
}
