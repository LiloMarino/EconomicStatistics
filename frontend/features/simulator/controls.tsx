import { useId } from "react";

import type { Scenario } from "@/features/simulator/use-simulator";
import type { ScenarioKey } from "@/features/simulator/use-simulator-view";
import { Slider } from "@/shared/components/ui/slider";
import { formatPercent, formatSignedPercent } from "@/shared/lib/format";

interface Control {
  key: ScenarioKey;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  format: (fraction: number) => string;
}

// Faixas e passos em % do PIB ou % ao ano, como o slider os mostra
const controls: Control[] = [
  {
    key: "debt",
    label: "Dívida hoje",
    unit: "% do PIB",
    min: 20,
    max: 250,
    step: 0.1,
    format: formatPercent,
  },
  {
    key: "rate",
    label: "Juro (r)",
    unit: "% ao ano, nominal",
    min: 0,
    max: 60,
    step: 0.5,
    format: formatPercent,
  },
  {
    key: "growth",
    label: "Crescimento (g)",
    unit: "PIB nominal, % ao ano",
    min: -10,
    max: 160,
    step: 0.5,
    format: formatPercent,
  },
  {
    key: "primary",
    label: "Primário",
    unit: "% do PIB · positivo é superávit",
    min: -6,
    max: 5,
    step: 0.1,
    format: formatSignedPercent,
  },
];

function ScenarioSlider({
  control,
  value,
  onChange,
}: {
  control: Control;
  value: number;
  onChange: (percent: number) => void;
}) {
  const labelId = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span id={labelId} className="text-caption">
          {control.label}
        </span>
        <output className="font-heading text-kpi-sm tabular-nums">{control.format(value)}</output>
      </div>
      <Slider
        aria-labelledby={labelId}
        min={control.min}
        max={control.max}
        step={control.step}
        value={value * 100}
        onValueChange={(next) => onChange(typeof next === "number" ? next : (next[0] ?? 0))}
      />
      <small className="text-small text-muted-foreground">{control.unit}</small>
    </div>
  );
}

/** Os quatro números do cenário, cada um num controle deslizante. */
export function Controls({
  scenario,
  onChange,
}: {
  scenario: Scenario;
  onChange: (key: ScenarioKey, percent: number) => void;
}) {
  return (
    <section aria-label="Os números do seu cenário" className="flex flex-col gap-3 border-t pt-4">
      <p className="text-eyebrow text-muted-foreground">OS NÚMEROS DO SEU CENÁRIO</p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-x-5 gap-y-4">
        {controls.map((control) => (
          <ScenarioSlider
            key={control.key}
            control={control}
            value={scenario[control.key]}
            onChange={(percent) => onChange(control.key, percent)}
          />
        ))}
      </div>
    </section>
  );
}
