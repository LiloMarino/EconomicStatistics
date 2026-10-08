import { ArrowDown, ArrowUp, BookOpen, Equal } from "lucide-react";

import {
  focusIndicatorLabels,
  focusIndicatorUnits,
  formatFocusCell,
} from "@/features/focus/focus-labels";
import type { FocusIndicator, FocusReport } from "@/features/focus/use-focus";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { formatDay } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

const directionLook = {
  up: { icon: ArrowUp, label: "subiu" },
  down: { icon: ArrowDown, label: "caiu" },
  stable: { icon: Equal, label: "estável" },
};

const COLUMNS = "grid grid-cols-[minmax(160px,1.6fr)_repeat(3,minmax(72px,1fr))_80px] gap-3";

interface ReportTableProps {
  report: FocusReport;
  year: number;
  indicator: FocusIndicator;
  onSelect: (indicator: FocusIndicator) => void;
}

/** A tabela do relatório Focus num ano: cada indicador há 4 semanas, há 1 semana, hoje
e a direção da última semana. Clicar numa linha leva o gráfico para o indicador. */
export function ReportTable({ report, year, indicator, onSelect }: ReportTableProps) {
  const rows = report.rows.filter((row) => row.year === year);

  return (
    <ExplainedCard
      title={`O relatório Focus para ${year}`}
      subtitle={`Mediana das previsões na pesquisa de ${formatDay(report.survey_date)}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: (
          <>
            <TrayItem title="As colunas">
              <p>
                A previsão de 4 semanas atrás, a da semana passada e a de hoje. A última coluna diz
                se a previsão subiu, caiu ou ficou parada desde a semana passada, e o número entre
                parênteses, há quantas semanas seguidas, como no relatório do Banco Central.
              </p>
            </TrayItem>
            <TrayItem title="Seta não é bom nem ruim">
              <p>
                A seta só diz se o número subiu ou caiu. PIB subindo é boa notícia; IPCA subindo,
                não. Por isso a tabela não pinta as setas.
              </p>
            </TrayItem>
            <TrayItem title="O sinal das contas públicas" concept="focus-survey">
              <p>
                O Focus pergunta o resultado do governo: negativo é déficit. Um primário de −0,41%
                do PIB é um déficit de 0,41%.
              </p>
            </TrayItem>
          </>
        ),
      }}
    >
      <div className="overflow-x-auto">
        <div role="table" aria-label={`Relatório Focus para ${year}`} className="min-w-120">
          <div
            role="row"
            className={cn(
              COLUMNS,
              "text-small text-muted-foreground items-end border-b px-2 pb-2.5 text-right",
            )}
          >
            <span role="columnheader" className="text-left font-semibold">
              Indicador
            </span>
            <span role="columnheader" className="font-semibold">
              Há 4 semanas
            </span>
            <span role="columnheader" className="font-semibold">
              Há 1 semana
            </span>
            <span role="columnheader" className="text-foreground font-semibold">
              Hoje
            </span>
            <span role="columnheader" className="font-semibold">
              Semana
            </span>
          </div>
          {rows.map((row) => {
            const look = row.direction ? directionLook[row.direction] : null;
            const Icon = look?.icon;
            return (
              <button
                key={row.indicator}
                type="button"
                role="row"
                aria-pressed={row.indicator === indicator}
                onClick={() => onSelect(row.indicator)}
                className={cn(
                  COLUMNS,
                  "border-border-subtle hover:bg-muted aria-pressed:bg-muted min-h-12 w-full items-center border-b px-2 text-right whitespace-nowrap",
                )}
              >
                <span role="cell" className="flex flex-col text-left whitespace-normal">
                  <span className="font-semibold">{focusIndicatorLabels[row.indicator]}</span>
                  <span className="text-caption text-muted-foreground">
                    {focusIndicatorUnits[row.indicator]}
                  </span>
                </span>
                <span role="cell" className="text-muted-foreground">
                  {row.weeks_before === null ? "–" : formatFocusCell(row.weeks_before, row.unit)}
                </span>
                <span role="cell" className="text-muted-foreground">
                  {row.week_before === null ? "–" : formatFocusCell(row.week_before, row.unit)}
                </span>
                <strong role="cell">{formatFocusCell(row.today, row.unit)}</strong>
                <span
                  role="cell"
                  className="text-muted-foreground inline-flex items-center justify-end gap-1"
                >
                  {Icon && <Icon className="size-4" aria-label={look.label} />}
                  {row.streak_weeks !== null && `(${row.streak_weeks})`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </ExplainedCard>
  );
}
