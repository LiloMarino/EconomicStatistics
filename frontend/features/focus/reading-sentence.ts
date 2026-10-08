import { focusIndicatorLabels, formatFocusValue } from "@/features/focus/focus-labels";
import type { FocusHistory } from "@/features/focus/use-focus";

/** A frase da manchete do relatório Focus: para onde a previsão andou e há quantas
semanas. */
export function readingSentence(history: FocusHistory): string | null {
  const last = history.points.at(-1);
  if (!last || history.direction === null || history.streak_weeks === null) return null;
  const subject = `A previsão do ${focusIndicatorLabels[history.indicator]} para ${history.year}`;
  const weeks =
    history.streak_weeks === 1 ? "na última semana" : `nas últimas ${history.streak_weeks} semanas`;
  const value = formatFocusValue(last.value, history.unit);
  if (history.direction === "stable") {
    return history.streak_weeks === 1
      ? `${subject} ficou em ${value} na última semana.`
      : `${subject} está parada em ${value} há ${history.streak_weeks} semanas.`;
  }
  const verb = history.direction === "up" ? "subiu" : "caiu";
  const start =
    history.streak_start === null
      ? ""
      : `, de ${formatFocusValue(history.streak_start, history.unit)}`;
  return `${subject} ${verb} ${weeks}${start} para ${value}.`;
}
