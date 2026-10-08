import { ReferenceArea, ReferenceLine } from "recharts";

import { formatDay } from "@/shared/lib/format";

interface ForecastSpanProps {
  /** O último dado real: a linha que separa o que aconteceu do que se espera. */
  from: string;
  /** O último período previsto. */
  to: string;
  surveyDate: string;
}

/** O trecho do gráfico que é previsão do mercado: uma faixa clara do último dado real
ao fim, com a pesquisa Focus de onde ela saiu. */
export function ForecastSpan({ from, to, surveyDate }: ForecastSpanProps) {
  return (
    <>
      <ReferenceArea
        x1={from}
        x2={to}
        fill="var(--forecast-band)"
        fillOpacity={1}
        label={{
          value: `previsão (Focus de ${formatDay(surveyDate)})`,
          position: "insideTopRight",
          fill: "var(--muted-foreground)",
          fontSize: 12,
        }}
      />
      <ReferenceLine x={from} stroke="var(--ink-2)" strokeDasharray="2 3" />
    </>
  );
}
