import type { RaiseReference } from "@/features/purchasing-power/use-purchasing-power";
import type { ConceptId } from "@/shared/concepts/concept";

export const referenceLabels: Record<RaiseReference, string> = {
  ipca: "IPCA geral",
  inpc: "INPC",
  minimum_wage: "Salário mínimo",
  custom: "Meu reajuste",
};

export const referenceDescriptions: Record<RaiseReference, string> = {
  ipca: "Reajuste igual à inflação média. Mostra quais gastos subiram acima dela.",
  minimum_wage: "O reajuste do mínimo no período: o valor do fim sobre o de antes do início.",
  inpc: "Inflação das famílias que ganham de 1 a 5 mínimos, base de muitos reajustes.",
  custom: "O reajuste que você teve no período, em %.",
};

/** O conceito que explica cada referência; o reajuste digitado é explicado pelo próprio
poder de compra. */
export const referenceConcepts: Record<RaiseReference, ConceptId> = {
  ipca: "ipca",
  inpc: "inpc",
  minimum_wage: "minimum-wage",
  custom: "purchasing-power",
};
