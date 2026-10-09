import { useDebt } from "@/features/debt/use-debt";
import { useDeficit } from "@/features/deficit/use-deficit";
import { useExternalSector } from "@/features/external-sector/use-external-sector";
import { formatFocusValue } from "@/features/focus/focus-labels";
import { useFocusReport } from "@/features/focus/use-focus";
import { useInterest } from "@/features/interest/use-interest";
import { usePriceCuts } from "@/features/price-cuts/use-price-cuts";
import {
  formatMoney,
  formatMonth,
  formatPercent,
  formatShortPercent,
  formatUsdBillions,
} from "@/shared/lib/format";

/** Os números de hoje que os nós dos explicadores mostram, lidos das mesmas consultas
das telas. Enquanto uma consulta não chega, o valor fica indefinido e o nó aparece sem
número. */
export interface TodayValues {
  inflation?: string;
  inflationMonth?: string;
  services?: string;
  expectations?: string;
  expectationsYear?: number;
  selic?: string;
  deficit?: string;
  interest?: string;
  dollar?: string;
  dollarMonth?: string;
  reserves?: string;
  reservesMonth?: string;
  net?: string;
  gross?: string;
  debtMonth?: string;
}

export function useTodayValues(): TodayValues {
  const interest = useInterest().data;
  const inflation = interest?.inflation.months.at(-1);
  const services = usePriceCuts().data?.services.months.at(-1);
  const focus = useFocusReport().data;
  // O Focus pergunta o IPCA de vários anos: vale o mais próximo
  const expectation = focus?.rows
    .filter((row) => row.indicator === "ipca")
    .sort((a, b) => a.year - b.year)
    .at(0);
  const deficit = useDeficit().data?.last;
  const external = useExternalSector().data;
  const dollar = external?.dollar.months.at(-1);
  const reserves = external?.reserves.months.at(-1);
  const debt = useDebt().data?.levels.at(-1);

  return {
    inflation: inflation && formatPercent(inflation.rate),
    inflationMonth: inflation && formatMonth(inflation.ref_date),
    services: services && formatPercent(services.value),
    expectations: expectation && formatFocusValue(expectation.today, expectation.unit),
    expectationsYear: expectation?.year,
    selic: interest && formatPercent(interest.selic.current),
    deficit: deficit && formatPercent(deficit.nominal),
    interest: deficit && formatPercent(deficit.interest),
    dollar: dollar && formatMoney(dollar.value),
    dollarMonth: dollar && formatMonth(dollar.ref_date),
    reserves: reserves && formatUsdBillions(reserves.value),
    reservesMonth: reserves && formatMonth(reserves.ref_date),
    net: debt && formatShortPercent(debt.net),
    gross: debt && formatShortPercent(debt.gross),
    debtMonth: debt && formatMonth(debt.ref_date),
  };
}
