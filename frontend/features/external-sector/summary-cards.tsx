import type { ExternalSector } from "@/features/external-sector/use-external-sector";
import { ConceptHint } from "@/shared/components/concept-hint";
import { StatCard } from "@/shared/components/stat-card";
import {
  formatMoney,
  formatMonth,
  formatMonthName,
  formatPercent,
  formatSignedPercent,
  formatUsdBillions,
} from "@/shared/lib/format";

/** O último número de cada gráfico: dólar, transações correntes, investimento direto e
reservas. */
export function SummaryCards({ data }: { data: ExternalSector }) {
  const dollar = data.dollar.months.at(-1);
  const flow = data.flows.at(-1);
  const reserves = data.reserves.months.at(-1);
  const share = data.reserves.gdp_share;

  return (
    <section
      aria-label="Resumo"
      className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3"
    >
      <StatCard
        label="Dólar"
        hint={<ConceptHint id="ptax" />}
        value={dollar && formatMoney(dollar.value)}
      >
        {dollar && (
          <span className="text-caption text-muted-foreground">
            média de {formatMonthName(dollar.ref_date)}
            {data.dollar.change_12m !== null &&
              ` · ${formatSignedPercent(data.dollar.change_12m)} em 12 meses`}
          </span>
        )}
      </StatCard>
      <StatCard
        label="Transações correntes"
        hint={<ConceptHint id="current-account" />}
        value={flow && formatPercent(flow.current_account)}
      >
        {flow && (
          <span className="text-caption text-muted-foreground">
            do PIB em 12 meses até {formatMonth(flow.ref_date)}:{" "}
            {flow.current_account < 0
              ? "o país pagou ao exterior mais do que recebeu"
              : "o país recebeu do exterior mais do que pagou"}
          </span>
        )}
      </StatCard>
      <StatCard
        label="Investimento direto"
        hint={<ConceptHint id="fdi" />}
        value={flow && formatSignedPercent(flow.fdi)}
      >
        {flow && (
          <span className="text-caption text-muted-foreground">
            do PIB em 12 meses até {formatMonth(flow.ref_date)}: dinheiro que veio para ficar
          </span>
        )}
      </StatCard>
      <StatCard
        label="Reservas"
        hint={<ConceptHint id="international-reserves" />}
        value={reserves && formatUsdBillions(reserves.value)}
      >
        {reserves && (
          <span className="text-caption text-muted-foreground">
            fim de {formatMonth(reserves.ref_date)}
            {share && ` · ${formatPercent(share.share)} do PIB em ${formatMonth(share.ref_date)}`}
          </span>
        )}
      </StatCard>
    </section>
  );
}
