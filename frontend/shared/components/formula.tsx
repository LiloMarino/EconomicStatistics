import katex from "katex";
import type { ReactNode } from "react";

function render(tex: string, display: boolean, flushLeft: boolean): string {
  return katex.renderToString(tex, {
    displayMode: display,
    fleqn: flushLeft,
    throwOnError: false,
    output: "htmlAndMathml",
  });
}

interface FormulaProps {
  tex: string;
  inline?: boolean;
  /** A linha de uma conta encosta à esquerda; a fórmula de definição fica centrada. */
  flushLeft?: boolean;
}

/** Uma linha de conta renderizada pelo KaTeX. O TeX é montado pelo app, com números
que vêm da API já formatados por `texDecimal`. */
export function Formula({ tex, inline = false, flushLeft = false }: FormulaProps) {
  return (
    <span
      className={inline ? "inline-block" : "block w-max min-w-full"}
      dangerouslySetInnerHTML={{ __html: render(tex, !inline, flushLeft) }}
    />
  );
}

interface FormulaBoxProps {
  children: ReactNode;
  /** O símbolo de cada variável, em TeX, e o que ela é. */
  legend?: { symbol: string; text: ReactNode }[];
}

/** A moldura de uma fórmula ou de uma conta, com a legenda das variáveis embaixo. */
export function FormulaBox({ children, legend }: FormulaBoxProps) {
  return (
    <div className="bg-card flex flex-col gap-3 overflow-x-auto rounded-xl border px-5 py-4">
      {children}
      {legend && (
        <dl className="text-caption text-muted-foreground grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-1.5 border-t pt-3">
          {legend.map((item) => (
            <div key={item.symbol} className="contents">
              <dt>
                <Formula tex={item.symbol} inline />
              </dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
