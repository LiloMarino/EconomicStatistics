import type { ReactNode } from "react";

import { referenceRanges } from "@/features/economy-health/reference-ranges";
import type { EconomyHealth } from "@/features/economy-health/use-economy-health";
import { ConceptHint } from "@/shared/components/concept-hint";
import type { ConceptId } from "@/shared/concepts/concept";
import {
  formatMoney,
  formatPercent,
  formatSignedPercent,
  formatUsdBillions,
} from "@/shared/lib/format";

type References = EconomyHealth["references"];

interface Row {
  name: string;
  what: ReactNode;
  concept: ConceptId;
  value: string;
  reference: ReactNode;
  source: string;
}

function rows({
  expected_inflation: expected,
  real_rate: real,
  unemployment,
  reserves,
  gross_debt: debt,
  dollar,
}: References): Row[] {
  return [
    {
      name: "Inflação esperada",
      what: expected ? `Focus, para ${expected.year}` : "Focus",
      concept: "focus-survey",
      value: expected ? formatPercent(expected.median) : "sem pesquisa",
      reference: referenceRanges.expectedInflation.text(expected?.target ?? null),
      source: referenceRanges.expectedInflation.source,
    },
    {
      name: "Juro real",
      what: "Selic descontada da inflação esperada",
      concept: "real-rate",
      value: real ? formatPercent(real.rate) : "sem pesquisa",
      reference: referenceRanges.neutralRate.text,
      source: referenceRanges.neutralRate.source,
    },
    {
      name: "Desemprego",
      what: "PNAD Contínua",
      concept: "nairu",
      value: formatPercent(unemployment.value),
      reference: referenceRanges.unemployment.text,
      source: referenceRanges.unemployment.source,
    },
    {
      name: "Reservas internacionais",
      what: reserves.gdp_share
        ? `${formatPercent(reserves.gdp_share.share)} do PIB, contra a métrica ARA do FMI`
        : "contra a métrica ARA do FMI",
      concept: "reserve-adequacy",
      value: formatUsdBillions(reserves.value),
      reference: referenceRanges.reserves.text,
      source: referenceRanges.reserves.source,
    },
    {
      name: "Dívida bruta",
      what: "% do PIB",
      concept: "gross-debt",
      value: formatPercent(debt.value),
      reference: referenceRanges.grossDebt.text,
      source: referenceRanges.grossDebt.source,
    },
    {
      name: "Dólar",
      what: "no fim do mês",
      concept: "exchange-rate",
      value: formatMoney(dollar.value),
      reference: (
        <>
          {referenceRanges.dollar.text}
          {dollar.change_12m !== null && (
            <> Contra o mesmo mês do ano anterior: {formatSignedPercent(dollar.change_12m)}.</>
          )}
        </>
      ),
      source: referenceRanges.dollar.source,
    },
  ];
}

/** Os sinais sem faixa oficial: o número de hoje e, ao lado, o que a fonte da referência
diz, sem cor. */
export function ReferenceTable({ data }: { data: References }) {
  return (
    <div className="bg-card overflow-x-auto rounded-2xl px-5 pt-1 pb-2">
      <ul className="min-w-160">
        <li
          aria-hidden="true"
          className="text-label text-muted-foreground grid grid-cols-[minmax(200px,1.3fr)_minmax(110px,0.6fr)_minmax(240px,1.6fr)] gap-4 border-b py-3.5"
        >
          <span>Sinal</span>
          <span>Agora</span>
          <span>Referência</span>
        </li>
        {rows(data).map((row) => (
          <li
            key={row.name}
            className="grid grid-cols-[minmax(200px,1.3fr)_minmax(110px,0.6fr)_minmax(240px,1.6fr)] items-center gap-4 border-b py-3.5 last:border-b-0"
          >
            <div className="flex items-start gap-2.5">
              <ConceptHint id={row.concept} />
              <div className="flex flex-col gap-0.5">
                <strong>{row.name}</strong>
                <span className="text-caption text-muted-foreground">{row.what}</span>
              </div>
            </div>
            <strong className="font-heading text-kpi-sm">{row.value}</strong>
            <div className="text-caption flex flex-col gap-0.5">
              <span>{row.reference}</span>
              <span className="text-muted-foreground">{row.source}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
