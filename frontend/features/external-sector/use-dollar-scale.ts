import { useSearchParams } from "react-router-dom";

export const dollarScales = ["months", "days"] as const;

export type DollarScale = (typeof dollarScales)[number];

/** A escala do gráfico do dólar mora na URL: `?scale=days` mostra cada dia útil; sem o
parâmetro, o fim de cada mês, com a previsão do Focus. */
export function useDollarScale() {
  const [searchParams, setSearchParams] = useSearchParams();
  const scale: DollarScale = searchParams.get("scale") === "days" ? "days" : "months";
  return {
    scale,
    setScale: (value: DollarScale) =>
      setSearchParams(
        (params) => {
          params.set("scale", value);
          return params;
        },
        { preventScrollReset: true },
      ),
  };
}
