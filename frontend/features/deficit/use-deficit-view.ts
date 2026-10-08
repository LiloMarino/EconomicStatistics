import { useSearchParams } from "react-router-dom";

export const deficitScales = ["years", "months"] as const;

export type DeficitScale = (typeof deficitScales)[number];

/** A escala do gráfico do déficit mora na URL: `?scale=months` mostra mês a mês; sem o
parâmetro, um ponto por ano. */
export function useDeficitView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const scale: DeficitScale = searchParams.get("scale") === "months" ? "months" : "years";
  return {
    scale,
    setScale: (value: DeficitScale) =>
      setSearchParams(
        (params) => {
          params.set("scale", value);
          return params;
        },
        { preventScrollReset: true },
      ),
  };
}
