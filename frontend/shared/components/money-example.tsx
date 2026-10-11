import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

export interface ExampleRow {
  label: ReactNode;
  value: ReactNode;
  /** A linha do resultado, separada das outras por um traço. */
  total?: boolean;
}

/** Um exemplo com dinheiro na mão: linhas de conta, com o valor à direita, e a frase
que conclui embaixo. É o molde do exemplo de Poder de compra, para os outros cartões. */
export function MoneyExample({ rows, children }: { rows: ExampleRow[]; children?: ReactNode }) {
  return (
    <>
      <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5">
        {rows.map((row, index) => (
          <div key={index} className="contents">
            <span className={cn(row.total && "border-t pt-2")}>{row.label}</span>
            <strong className={cn("text-right tabular-nums", row.total && "border-t pt-2")}>
              {row.value}
            </strong>
          </div>
        ))}
      </div>
      {children && <p>{children}</p>}
    </>
  );
}
