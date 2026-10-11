/** Uma tabela de meses: o rótulo, a variação e, quando vem, o fator (1 + r). */
export function MonthsTable({
  rows,
}: {
  rows: { label: string; rate: string; factor?: string }[];
}) {
  return (
    <div className="bg-card grid grid-cols-6 gap-x-2 gap-y-3 rounded-xl px-4.5 py-4">
      {rows.map((row) => (
        <div key={row.label} className="text-caption flex flex-col items-center tabular-nums">
          <span className="text-muted-foreground">{row.label}</span>
          <strong>{row.rate}</strong>
          {row.factor && <span className="text-muted-foreground">{row.factor}</span>}
        </div>
      ))}
    </div>
  );
}
