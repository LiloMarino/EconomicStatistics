/** Uma tabela de meses: o rótulo, a variação e, quando vem, o fator (1 + r). */
export function MonthsTable({
  rows,
}: {
  rows: { label: string; rate: string; factor?: string }[];
}) {
  const withFactor = rows.some((row) => row.factor);
  return (
    <div className="bg-card overflow-x-auto rounded-xl px-4.5 py-4">
      <table className="text-caption w-full min-w-max text-center">
        <tbody>
          <tr className="text-muted-foreground">
            {rows.map((row) => (
              <td key={row.label} className="px-1.5 py-0.5">
                {row.label}
              </td>
            ))}
          </tr>
          <tr className="font-bold">
            {rows.map((row) => (
              <td key={row.label} className="px-1.5 py-0.5">
                {row.rate}
              </td>
            ))}
          </tr>
          {withFactor && (
            <tr className="text-muted-foreground">
              {rows.map((row) => (
                <td key={row.label} className="px-1.5 py-0.5">
                  {row.factor}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
