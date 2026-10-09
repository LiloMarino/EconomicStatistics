import { useSearchParams } from "react-router-dom";

import type { Country, DebtCase, DebtCaseId, Scenario } from "@/features/simulator/use-simulator";

export const scenarioKeys = ["debt", "rate", "growth", "primary"] as const;

export type ScenarioKey = (typeof scenarioKeys)[number];

// O cenário mora na URL em % do PIB e % ao ano, como o usuário lê
const urlKey: Record<ScenarioKey, string> = { debt: "d", rate: "r", growth: "g", primary: "p" };

// Comparações ligadas quando a URL não diz quais
const defaultCompared: DebtCaseId[] = ["japan", "greece"];

// Os números da URL têm 2 casas: abaixo disso o cenário ainda é o do caso
const SAME_AS_CASE = 5e-5;

function fromUrl(value: string | null): number | undefined {
  if (value === null || value === "") return undefined;
  const percent = Number(value);
  return Number.isFinite(percent) ? percent / 100 : undefined;
}

function toUrl(fraction: number): string {
  return String(Number((fraction * 100).toFixed(2)));
}

/** O cenário do simulador mora na URL: `?d=80&r=10&g=7&p=2.24` são os quatro números em %,
`base` é o caso de onde ele partiu e `compare` as comparações ligadas, separadas por vírgula.
Número que a URL não traz é o do caso de partida, que sem `base` é o Brasil de hoje. */
export function useSimulatorView(cases: readonly [DebtCase, ...DebtCase[]]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const base = cases.find((item) => item.id === searchParams.get("base")) ?? cases[0];
  const scenario: Scenario = {
    debt: fromUrl(searchParams.get(urlKey.debt)) ?? base.debt,
    rate: fromUrl(searchParams.get(urlKey.rate)) ?? base.rate,
    growth: fromUrl(searchParams.get(urlKey.growth)) ?? base.growth,
    primary: fromUrl(searchParams.get(urlKey.primary)) ?? base.primary,
  };
  const touched = scenarioKeys.some((key) => Math.abs(scenario[key] - base[key]) > SAME_AS_CASE);

  const requested = searchParams.get("compare");
  const compared: DebtCaseId[] =
    requested === null
      ? defaultCompared
      : cases.filter((item) => requested.split(",").includes(item.id)).map((item) => item.id);

  const update = (change: (params: URLSearchParams) => void, replace: boolean) =>
    setSearchParams(
      (params) => {
        change(params);
        return params;
      },
      { replace, preventScrollReset: true },
    );

  return {
    base,
    scenario,
    touched,
    compared,
    /** Mexe num número e fixa os outros três na URL, para o link repetir o cenário. */
    setValue: (key: ScenarioKey, percent: number) =>
      update((params) => {
        for (const item of scenarioKeys) {
          params.set(urlKey[item], item === key ? String(percent) : toUrl(scenario[item]));
        }
      }, true),
    /** O cenário passa a ser o do caso, com os números dele. */
    copyCase: (id: DebtCaseId) =>
      update((params) => {
        params.set("base", id);
        for (const item of scenarioKeys) params.delete(urlKey[item]);
      }, false),
    toggleCompared: (id: DebtCaseId) =>
      update((params) => {
        const next = compared.includes(id)
          ? compared.filter((item) => item !== id)
          : [...compared, id];
        params.set("compare", next.join(","));
      }, true),
  };
}

/** Os países ligados na seção histórica moram na URL: `?countries=JPN,GRC`, sem o parâmetro
são todos. */
export function useHistoryCountries(available: readonly Country[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("countries");
  const shown =
    requested === null
      ? [...available]
      : available.filter((item) => requested.split(",").includes(item));
  return {
    shown,
    toggle: (country: Country) =>
      setSearchParams(
        (params) => {
          const next = shown.includes(country)
            ? shown.filter((item) => item !== country)
            : available.filter((item) => item === country || shown.includes(item));
          params.set("countries", next.join(","));
          return params;
        },
        { replace: true, preventScrollReset: true },
      ),
  };
}
