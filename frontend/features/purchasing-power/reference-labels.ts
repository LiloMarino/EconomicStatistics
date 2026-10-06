import type { RaiseReference } from "@/features/purchasing-power/use-purchasing-power";

export const referenceLabels: Record<RaiseReference, string> = {
  ipca: "IPCA geral",
  inpc: "INPC",
  minimum_wage: "Salário mínimo",
  custom: "Digitado",
};

export const referenceDescriptions: Record<RaiseReference, string> = {
  ipca: "Um reajuste igual à inflação média do IPCA: mostra onde quem só repõe a inflação passa a comprar mais ou menos.",
  inpc: "O INPC é a inflação das famílias que ganham até 5 salários mínimos, e é a parte de reposição do reajuste do mínimo, sem o ganho real.",
  minimum_wage:
    "O valor do salário mínimo no fim do período sobre o do mês anterior ao início: é o reajuste que quem ganha o mínimo teve de fato.",
  custom: "O reajuste que você teve no período, em %. Use vírgula para decimais (6,5).",
};
