import { Eye, EyeOff } from "lucide-react";

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

interface ScenarioListProps {
  scenario: Scenario;
  cases: DebtCase[];
  compared: DebtCaseId[];
  onToggle: (id: DebtCaseId) => void;
  onCopy: (id: DebtCaseId) => void;
}

/** O cenário do usuário e, abaixo, cada ponto de partida: o olho põe a linha dele no
gráfico e "Copiar" leva os números dele para o cenário. */
export function ScenarioList({ scenario, cases, compared, onToggle, onCopy }: ScenarioListProps) {
  return (
    <aside aria-label="Cenários no gráfico" className="flex flex-col gap-2.5">
      <p className="text-eyebrow text-muted-foreground">SEU CENÁRIO</p>
      <div className="bg-muted flex overflow-hidden rounded-xl">
        <ColorBar color={scenarioColor} />
        <div className="min-w-0 flex-1 px-3 py-2.5">
          <strong className="text-body">Seu cenário</strong>
          <ScenarioValues values={scenario} />
          <p className="text-small text-muted-foreground mt-1">
            Ajuste nos controles abaixo do gráfico
          </p>
        </div>
      </div>

      <p className="text-eyebrow text-muted-foreground mt-2.5">COMPARAR COM</p>
      {cases.map((item) => {
        const on = compared.includes(item.id);
        return (
          <div key={item.id} className="bg-muted flex overflow-hidden rounded-xl">
            <ColorBar color={caseColor[item.id]} dimmed={!on} />
            <div className="min-w-0 flex-1 px-3 py-2.5">
              <strong className={on ? "text-body" : "text-body text-muted-foreground"}>
                {item.label}
              </strong>
              <ScenarioValues values={item} />
              <Button
                variant="link"
                size="sm"
                className="mt-0.5 self-start px-0"
                onClick={() => onCopy(item.id)}
              >
                Copiar para o meu cenário
              </Button>
            </div>
            <div className="flex items-center pr-2">
              <Toggle
                variant="outline"
                size="lg"
                pressed={on}
                onPressedChange={() => onToggle(item.id)}
                aria-label={`${on ? "Esconder" : "Mostrar"} ${item.label} no gráfico`}
              >
                {on ? <Eye /> : <EyeOff />}
              </Toggle>
            </div>
          </div>
        );
      })}
      <p className="text-small text-muted-foreground">
        O olho põe ou tira a linha do gráfico. Os casos reais usam números do FMI e do Banco
        Central; País A e País B são exemplos para entender a conta. "Copiar para o meu cenário"
        mostra o contexto do caso acima do gráfico.
      </p>
    </aside>
  );
}
