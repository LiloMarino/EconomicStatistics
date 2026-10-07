import type { IpcaSeriesId } from "@/shared/lib/group-identity";

/** O motivo conhecido de uma alta que se repete no mesmo mês todo ano, por grupo e mês
do calendário (1 a 12). */
export const seasonalCauses: Partial<Record<IpcaSeriesId, Partial<Record<number, string>>>> = {
  ipca_education: { 2: "é o reajuste anual das mensalidades" },
};
