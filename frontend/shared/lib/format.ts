const percent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const wholePercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

const shortPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
});

const signedPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "exceptZero",
});

const signedNumber = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "exceptZero",
});

const decimal = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const billions = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const month = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const day = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const monthName = new Intl.DateTimeFormat("pt-BR", { month: "long", timeZone: "UTC" });

const shortMonthName = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" });

/** A taxa chega em fração: 0.0579 vira "5,79%". */
export function formatPercent(rate: number): string {
  return percent.format(rate).replace("-", "−");
}

/** Percentual sem casas: 0.213 vira "21%". */
export function formatWholePercent(rate: number): string {
  return wholePercent.format(rate);
}

/** Percentual com até 1 casa, para espaço curto: 0.693 vira "69,3%" e 0.2 vira "20%". */
export function formatShortPercent(rate: number): string {
  return shortPercent.format(rate).replace("-", "−");
}

export function formatSignedPercent(rate: number): string {
  return signedPercent.format(rate).replace("-", "−");
}

/** Variação mensal publicada, sem o "%": 0.0052 vira "0,52" e -0.0032 vira "−0,32". */
export function formatRateNumber(rate: number): string {
  return decimal.format(rate * 100).replace("-", "−");
}

/** Diferença entre duas taxas em pontos percentuais: -0.005 vira "−0,50 p.p.". */
export function formatPoints(difference: number): string {
  return `${signedNumber.format(difference * 100).replace("-", "−")} p.p.`;
}

/** Fator de uma taxa com 4 casas: 1.04441 vira "1,0444". */
export function formatFactor(factor: number, digits = 4): string {
  return factor.toFixed(digits).replace(".", ",").replace("-", "−");
}

export function formatMoney(value: number): string {
  return money.format(value);
}

/** Estoque em US$ milhões, como o Banco Central publica: 362821 vira "US$ 362,8 bi". */
export function formatUsdBillions(millions: number): string {
  return `US$ ${billions.format(millions / 1000)} bi`.replace("-", "−");
}

// A data chega como "AAAA-MM-DD", que o Date lê em UTC
export function formatMonth(value: string): string {
  return month.format(new Date(value)).replace(". de ", "/").replace(" de ", "/");
}

/** "02/10/2026" */
export function formatDay(value: string): string {
  return day.format(new Date(value));
}

/** O trimestre chega datado num mês dele, o 1º ou o último: "2026-04-01" e "2026-06-01"
viram "2º tri/2026". */
export function formatQuarter(value: string): string {
  const quarter = Math.floor((Number(value.slice(5, 7)) - 1) / 3) + 1;
  return `${quarter}º tri/${value.slice(0, 4)}`;
}

/** "fevereiro" */
export function formatMonthName(value: string): string {
  return monthName.format(new Date(value));
}

/** "fev" */
export function formatShortMonth(value: string): string {
  return shortMonthName.format(new Date(value)).replace(".", "");
}

/** "ago/2026", "jan a ago/2026" ou "set/2025 a ago/2026". */
export function formatMonthRange(start: string, end: string, separator = " a "): string {
  if (start === end) return formatMonth(start);
  if (start.slice(0, 4) === end.slice(0, 4)) {
    return `${formatShortMonth(start)}${separator}${formatMonth(end)}`;
  }
  return `${formatMonth(start)}${separator}${formatMonth(end)}`;
}

/** Os dois dias de uma reunião: "2026-11-03" e "2026-11-04" viram "3 e 4/nov". */
export function formatDays(first: string, second: string): string {
  const firstDay = Number(first.slice(8, 10));
  const secondDay = Number(second.slice(8, 10));
  if (first.slice(0, 7) === second.slice(0, 7)) {
    return `${firstDay} e ${secondDay}/${formatShortMonth(second)}`;
  }
  return `${firstDay}/${formatShortMonth(first)} e ${secondDay}/${formatShortMonth(second)}`;
}
