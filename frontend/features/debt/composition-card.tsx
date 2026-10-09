import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

import { indexerIdentity } from "@/features/debt/indexers";
import type { FederalDebt } from "@/features/debt/use-debt";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ConceptHint } from "@/shared/components/concept-hint";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { StatCard } from "@/shared/components/stat-card";
import { formatMonth, formatPercent, formatWholePercent } from "@/shared/lib/format";

// Abaixo disso o pedaço da barra é estreito demais para o rótulo
const LABEL_MIN_SHARE = 0.08;

const years = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Dezembro aparece pelo ano; o último mês, quando não é dezembro, pelo mês. */
function rowLabel(refDate: string): string {
  return refDate.slice(5, 7) === "12" ? refDate.slice(0, 4) : formatMonth(refDate);
}

function HowToRead() {
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="Por que o indexador importa" concept="indexer">
        <p>
          Título atrelado à Selic fica mais caro na hora em que o juro sobe. Prefixado trava o custo
          no dia da venda. Atrelado ao IPCA sobe com a inflação. Quanto mais Selic, mais a decisão
          do Banco Central bate direto no custo da dívida.
        </p>
      </TrayItem>
      <TrayItem title="Só a dívida em mercado" concept="federal-debt">
        <p>
          A composição conta os títulos com bancos, fundos, previdência e estrangeiros, como o
          Tesouro publica. Os títulos na carteira do Banco Central ficam de fora: ele os usa para
          controlar o dinheiro em circulação.
        </p>
      </TrayItem>
    </div>
  );
}

/** A dívida federal em mercado por indexador, em dezembro de cada ano e no último mês,
com o prazo médio, o que vence em 12 meses e a parte na carteira do Banco Central. */
export function CompositionCard({ data }: { data: FederalDebt }) {
  const maturity = data.average_maturity;

  return (
    <ExplainedCard
      title="De que é feita a dívida federal"
      subtitle="% da dívida em mercado por indexador, em dezembro de cada ano · Tesouro Nacional"
      explain={{ label: "Como ler", icon: BookOpen, heading: "COMO LER", content: <HowToRead /> }}
    >
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <ChartLegend
            entries={Object.entries(indexerIdentity).map(([key, identity]) => ({
              key,
              label: identity.label,
              color: identity.color,
              shape: "square",
            }))}
          />
          <ul className="flex flex-col gap-2">
            {data.composition.map((row) => (
              <li
                key={row.ref_date}
                className="text-small grid grid-cols-[4.5rem_1fr] items-center gap-3"
              >
                <span className="text-muted-foreground">{rowLabel(row.ref_date)}</span>
                <span className="flex h-6 overflow-hidden rounded-sm">
                  {row.shares
                    .filter((part) => part.share > 0)
                    .map((part) => (
                      <span
                        key={part.indexer}
                        title={`${indexerIdentity[part.indexer].label}: ${formatPercent(part.share)}`}
                        className="text-indexer-ink flex w-(--width) items-center justify-center bg-(--part) text-xs font-bold"
                        style={{
                          "--width": `${part.share * 100}%`,
                          "--part": indexerIdentity[part.indexer].color,
                        }}
                      >
                        {part.share >= LABEL_MIN_SHARE && formatWholePercent(part.share)}
                      </span>
                    ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex shrink-0 flex-col gap-3 lg:w-64">
          <StatCard
            size="compact"
            label="Prazo médio"
            hint={<ConceptHint id="average-maturity" />}
            value={maturity ? `${years.format(maturity.years)} anos` : "—"}
          >
            <span className="text-caption text-muted-foreground">
              {maturity
                ? `da dívida interna, em ${formatMonth(maturity.ref_date)}`
                : "a série do Banco Central ainda não chegou"}
            </span>
          </StatCard>
          <StatCard
            size="compact"
            label="Vence em 12 meses"
            hint={<ConceptHint id="rollover" />}
            value={formatPercent(data.maturing_12m)}
          >
            <span className="text-caption text-muted-foreground">
              do principal em mercado, a rolar até {formatMonth(addYear(data.stock_month))}
            </span>
          </StatCard>
          <StatCard
            size="compact"
            label="Na carteira do BC"
            hint={<ConceptHint id="central-bank-portfolio" />}
            value={formatPercent(data.central_bank_share)}
          >
            <span className="text-caption text-muted-foreground">
              de todos os títulos federais emitidos, em {formatMonth(data.stock_month)}
            </span>
            <Link to="/deficit#financing" className="text-caption self-start font-semibold">
              Como o déficit é pago →
            </Link>
          </StatCard>
        </div>
      </div>
    </ExplainedCard>
  );
}

/** O mesmo mês, um ano depois: "2026-07-01" vira "2027-07-01". */
function addYear(refDate: string): string {
  return `${Number(refDate.slice(0, 4)) + 1}${refDate.slice(4)}`;
}
