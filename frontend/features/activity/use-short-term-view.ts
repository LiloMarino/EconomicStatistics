import { useSearchParams } from "react-router-dom";

export const shortTermSteps = ["months", "quarters"] as const;

export type ShortTermStep = (typeof shortTermSteps)[number];

/** O passo do gráfico de curto prazo mora na URL: `?step=quarters` mostra o PIB
trimestre a trimestre; sem o parâmetro, o IBC-Br mês a mês. */
export function useShortTermView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const step: ShortTermStep = searchParams.get("step") === "quarters" ? "quarters" : "months";
  return {
    step,
    setStep: (value: ShortTermStep) =>
      setSearchParams(
        (params) => {
          params.set("step", value);
          return params;
        },
        { preventScrollReset: true },
      ),
  };
}
