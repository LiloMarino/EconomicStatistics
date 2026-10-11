import { Copy, Eye, EyeOff } from "lucide-react";

import { caseColor, scenarioColor } from "@/features/simulator/identity";
import type { DebtCase, DebtCaseId, Scenario } from "@/features/simulator/use-simulator";
import { Button } from "@/shared/components/ui/button";
import { Toggle } from "@/shared/components/ui/toggle";
import { formatShortPercent, formatSignedPercent } from "@/shared/lib/format";

interface Values {
  debt: number;
  rate: number;
  growth: number;
  primary: number;
}

/** Os quatro números em grade de dois por dois, com o nome de cada um. */
function ScenarioValues({ values }: { values: Values }) {
  const entries = [
    { key: "Dívida", value: formatShortPercent(values.debt) },
    { key: "Juro", value: formatShortPercent(values.rate) },
    { key: "Crescimento", value: formatShortPercent(values.growth) },
    {
      key: "Primário",
      value: values.primary === 0 ? "0%" : formatSignedPercent(values.primary).replace(",00", ""),
    },
  ];
  return (
    <dl className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1">
      {entries.map((entry) => (
        <div key={entry.key} className="flex min-w-0 flex-col">
          <dt className="text-eyebrow text-muted-foreground uppercase">{entry.key}</dt>
          <dd className="text-label font-bold whitespace-nowrap">{entry.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ColorBar({ color, dimmed }: { color: string; dimmed?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`w-1.5 shrink-0 bg-(--swatch) ${dimmed ? "opacity-30" : ""}`}
      style={{ "--swatch": color }}
    />
  );
}

function EyeToggle({ on, label, onToggle }: { on: boolean; label: string; onToggle: () => void }) {
  return (
    <Toggle
      variant="outline"
      size="lg"
      pressed={on}
      onPressedChange={onToggle}
      aria-label={`${on ? "Esconder" : "Mostrar"} ${label} no gráfico`}
    >
      {on ? <Eye /> : <EyeOff />}
    </Toggle>
  );
}

interface ScenarioListProps {
  scenario: Scenario;
  showScenario: boolean;
  onToggleScenario: () => void;
  cases: DebtCase[];
  compared: DebtCaseId[];
  onToggle: (id: DebtCaseId) => void;
  onCopy: (id: DebtCaseId) => void;
  /** O caso sob o mouse: o contexto acima do gráfico mostra o dele. */
  onPreview: (id: DebtCaseId | null) => void;
}

/** O cenário do usuário e, abaixo, cada ponto de partida em cartão: a cor da linha do
gráfico, os quatro números, o olho e o botão de copiar. "Seu cenário" fica parado no topo
e a lista de casos rola dentro da lateral. Passar o mouse
num caso mostra o contexto dele acima do gráfico. */
export function ScenarioList({
  scenario,
  showScenario,
  onToggleScenario,
  cases,
  compared,
  onToggle,
  onCopy,
  onPreview,
}: ScenarioListProps) {
  return (
    <aside
      aria-label="Cenários no gráfico"
      className="flex flex-col gap-2.5 xl:sticky xl:top-4 xl:max-h-svh"
    >
      <p className="text-eyebrow text-muted-foreground">SEU CENÁRIO</p>
      <div className="bg-muted flex shrink-0 overflow-hidden rounded-xl">
        <ColorBar color={scenarioColor} dimmed={!showScenario} />
        <div className="min-w-0 flex-1 px-3 py-2.5">
          <strong className="text-body">Seu cenário</strong>
          <ScenarioValues values={scenario} />
          <p className="text-small text-muted-foreground mt-1">
            Ajuste nos controles abaixo do gráfico
          </p>
        </div>
        <div className="flex items-center pr-2">
          <EyeToggle on={showScenario} label="o seu cenário" onToggle={onToggleScenario} />
        </div>
      </div>

      <p className="text-eyebrow text-muted-foreground mt-2.5">COMPARAR COM</p>
      <div className="flex min-h-0 flex-col gap-2.5 overflow-y-auto pr-1">
        {cases.map((item) => {
          const on = compared.includes(item.id);
          return (
            <div
              key={item.id}
              className="bg-muted hover:ring-border flex shrink-0 overflow-hidden rounded-xl hover:ring-2"
              onMouseEnter={() => onPreview(item.id)}
              onMouseLeave={() => onPreview(null)}
            >
              <ColorBar color={caseColor[item.id]} dimmed={!on} />
              <div className="min-w-0 flex-1 px-3 py-2.5">
                <strong className={on ? "text-body" : "text-body text-muted-foreground"}>
                  {item.label}
                </strong>
                <ScenarioValues values={item} />
              </div>
              <div className="flex flex-col items-center justify-center gap-1.5 pr-2">
                <EyeToggle on={on} label={item.label} onToggle={() => onToggle(item.id)} />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Copiar ${item.label} para o meu cenário`}
                  title="Copiar para o meu cenário"
                  onClick={() => onCopy(item.id)}
                >
                  <Copy />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-small text-muted-foreground">
        O olho põe ou tira a linha do gráfico, e o botão de copiar leva os números do caso para o
        seu cenário. Passe o mouse num caso para ver o contexto dele acima do gráfico.
      </p>
    </aside>
  );
}
