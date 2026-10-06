const percent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const signedPercent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "exceptZero",
});

const month = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** A taxa chega em fração: 0.0579 vira "5,79%". */
export function formatPercent(rate: number): string {
  return percent.format(rate);
}

export function formatSignedPercent(rate: number): string {
  return signedPercent.format(rate);
}

// A data chega como "AAAA-MM-DD", que o Date lê em UTC
export function formatMonth(value: string): string {
  return month.format(new Date(value)).replace(". de ", "/").replace(" de ", "/");
}
