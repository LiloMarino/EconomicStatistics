import { useState } from "react";

import {
  referenceDescriptions,
  referenceLabels,
} from "@/features/purchasing-power/reference-labels";
import type {
  PurchasingPower,
  RaiseReference,
} from "@/features/purchasing-power/use-purchasing-power";
import { Input } from "@/shared/components/ui/input";
import { formatPercent } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

interface ReferenceCardsProps {
  reference: RaiseReference;
  /** O reajuste de cada referência publicada; some enquanto a primeira consulta não volta. */
  references: PurchasingPower["references"] | undefined;
  raiseText: string;
  onReferenceChange: (reference: RaiseReference) => void;
  onRaiseChange: (text: string) => void;
}

const cardClass =
  "bg-card flex min-h-11 flex-col gap-1.5 rounded-xl border-2 border-transparent px-4.5 py-4 text-left";

/** Um cartão por referência de reajuste, com o reajuste dela no período, e o cartão do
reajuste digitado. */
export function ReferenceCards({
  reference,
  references,
  raiseText,
  onReferenceChange,
  onRaiseChange,
}: ReferenceCardsProps) {
  // O campo guarda o que está sendo digitado; a URL recebe uma cópia a cada tecla
  const [text, setText] = useState(raiseText);
  const published = references ?? [];

  return (
    <section className="flex flex-col gap-3.5">
      <h2 className="text-section-title">Comparar com qual reajuste?</h2>
      <div
        role="group"
        aria-label="Reajuste comparado"
        className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3"
      >
        {published.map((item) => (
          <button
            key={item.reference}
            type="button"
            aria-pressed={reference === item.reference}
            onClick={() => onReferenceChange(item.reference)}
            className={cn(cardClass, "aria-pressed:border-foreground cursor-pointer")}
          >
            <span className="flex w-full items-baseline justify-between gap-2 text-lg font-bold">
              <span>{referenceLabels[item.reference]}</span>
              <span>{item.rate === null ? "—" : formatPercent(item.rate)}</span>
            </span>
            <span className="text-muted-foreground">
              {item.rate === null
                ? "Sem dado no cache para este período."
                : referenceDescriptions[item.reference]}
            </span>
          </button>
        ))}
        <div className={cn(cardClass, reference === "custom" && "border-foreground")}>
          <button
            type="button"
            aria-pressed={reference === "custom"}
            onClick={() => onReferenceChange("custom")}
            className="cursor-pointer text-left text-lg font-bold"
          >
            {referenceLabels.custom}
          </button>
          <label className="text-muted-foreground flex items-center gap-2">
            <Input
              inputMode="decimal"
              value={text}
              placeholder="5"
              aria-label="Reajuste no período, em %"
              className="w-20"
              onFocus={() => onReferenceChange("custom")}
              onChange={(event) => {
                setText(event.target.value);
                onRaiseChange(event.target.value);
              }}
            />
            % no período
          </label>
        </div>
      </div>
    </section>
  );
}
