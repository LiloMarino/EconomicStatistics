// Mês no app é a data do dia 1 em "AAAA-MM-DD", como a API devolve; na URL vai "AAAA-MM"

export function toUrlMonth(month: string): string {
  return month.slice(0, 7);
}

export function fromUrlMonth(value: string | null): string | undefined {
  return value && /^\d{4}-\d{2}$/.test(value) ? `${value}-01` : undefined;
}

export function addMonths(month: string, count: number): string {
  const [year, monthIndex] = [Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1 + count];
  const target = new Date(Date.UTC(year, monthIndex, 1));
  return target.toISOString().slice(0, 10);
}

/** Todos os meses de `first` a `last`, inclusive. */
export function monthsBetween(first: string, last: string): string[] {
  const months: string[] = [];
  for (let month = first; month <= last; month = addMonths(month, 1)) {
    months.push(month);
  }
  return months;
}
