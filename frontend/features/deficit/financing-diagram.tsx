import type { Deficit } from "@/features/deficit/use-deficit";
import type { DeficitFinancing } from "@/features/deficit/use-deficit-financing";
import type { DiagramSpec } from "@/shared/components/diagram/diagram-spec";
import { StaticDiagram } from "@/shared/components/diagram/static-diagram";
import { formatMonth, formatPercent, formatShortPercent } from "@/shared/lib/format";

interface FinancingDiagramProps {
  deficit: Deficit["last"];
  financing: DeficitFinancing;
}

function buildSpec({ deficit, financing }: FinancingDiagramProps): DiagramSpec {
  const { holders, last, years } = financing;
  const first = years.at(0) ?? last;
  return {
    height: 420,
    label:
      "Diagrama de como o déficit é pago: o Tesouro vende títulos ao mercado, entrega parte deles ao Banco Central, que os empresta aos bancos nas compromissadas, e o caminho do Banco Central para o Tesouro é vedado",
    groupColors: {
      market: "var(--bridge-fx)",
      liquidity: "var(--bridge-rate)",
      money: "var(--bridge-money)",
    },
    nodes: [
      {
        id: "deficit",
        title: "Déficit nominal",
        value: `${formatPercent(deficit.nominal)} do PIB`,
        subtitle: "o que falta para pagar as contas em 12 meses",
        concept: "nominal-balance",
        x: 20,
        y: 160,
      },
      {
        id: "treasury",
        title: "Tesouro vende títulos",
        subtitle: "a dívida federal cresce",
        concept: "federal-debt",
        x: 280,
        y: 160,
      },
      {
        id: "market",
        title: "Mercado",
        value: holders ? formatShortPercent(holders.market_share) : undefined,
        subtitle: holders
          ? "dos títulos: bancos, fundos, pessoas e estrangeiros"
          : "bancos, fundos, pessoas e estrangeiros",
        accent: "var(--bridge-fx)",
        x: 560,
        y: 20,
        height: 80,
      },
      {
        id: "portfolio",
        title: "Carteira do BC",
        value: holders
          ? formatShortPercent(holders.central_bank_share)
          : `${formatShortPercent(last.central_bank_portfolio)} do PIB`,
        subtitle: holders
          ? "dos títulos federais, entregues pelo Tesouro"
          : "títulos que o Tesouro entregou ao Banco Central",
        concept: "central-bank-portfolio",
        accent: "var(--financing-portfolio)",
        x: 560,
        y: 290,
        height: 80,
      },
      {
        id: "repo",
        title: "Compromissadas",
        value: formatShortPercent(financing.repo_share),
        subtitle: "da carteira volta aos bancos, com promessa de recompra",
        concept: "repo-operations",
        accent: "var(--financing-repo)",
        x: 820,
        y: 290,
        height: 80,
      },
      {
        id: "base",
        title: "Base monetária",
        value: `${formatShortPercent(last.monetary_base)} do PIB`,
        subtitle: "todo o dinheiro que o Banco Central criou",
        concept: "monetary-base",
        accent: "var(--financing-base)",
        x: 820,
        y: 110,
        height: 80,
      },
    ],
    edges: [
      {
        from: "deficit",
        to: "treasury",
        group: "market",
        text: "O déficit é coberto com dívida: o Tesouro vende títulos e usa o dinheiro para pagar as contas.",
        bend: 0,
      },
      {
        from: "treasury",
        to: "market",
        group: "market",
        text: "A maior parte dos títulos fica com quem quis emprestar ao governo. O dinheiro só troca de mão: sai de quem comprou o título e volta à economia quando o governo paga as contas.",
        bend: 0,
      },
      {
        from: "treasury",
        to: "portfolio",
        group: "liquidity",
        text: "Outra parte o Tesouro entrega ao Banco Central sem receber dinheiro em troca (Lei 10.179/2001), para ele ter títulos com que controlar o dinheiro entre os bancos. Nada entra no caixa do governo.",
        bend: 60,
      },
      {
        from: "portfolio",
        to: "treasury",
        group: "money",
        text: "O caminho de volta, o Banco Central pagar as contas do Tesouro, é fechado: a Constituição proíbe o empréstimo (art. 164, § 1º), e a Lei de Responsabilidade Fiscal só deixa o Banco Central comprar título novo para trocar o que vence na carteira dele (art. 39).",
        bend: 60,
      },
      {
        from: "portfolio",
        to: "repo",
        group: "liquidity",
        text: `${formatShortPercent(financing.repo_share)} da carteira estava com os bancos em ${formatMonth(last.ref_date)}: nas compromissadas, o Banco Central vende o título com promessa de recompra e recolhe o dinheiro que sobra, para a Selic ficar na meta.`,
        bend: 0,
      },
      {
        from: "portfolio",
        to: "base",
        group: "money",
        text: `Se o Banco Central pagasse as contas do governo com dinheiro novo, a base monetária cresceria mais rápido que a economia. Ela foi de ${formatShortPercent(first.monetary_base)} do PIB em ${formatMonth(first.ref_date)} para ${formatShortPercent(last.monetary_base)} em ${formatMonth(last.ref_date)}.`,
        bend: 0,
      },
    ],
    steps: [{ id: "all", label: "Tudo", groups: [], title: "Como o déficit é pago", intro: "" }],
  };
}

/** O caminho do déficit até quem fica com os títulos, com o número de hoje em cada nó. */
export function FinancingDiagram(props: FinancingDiagramProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="max-w-prose">
        Azul: o caminho da dívida. Verde: o que o Banco Central faz com os títulos que recebe.
        Vermelho: o atalho da emissão de moeda, fechado por lei.
      </p>
      <StaticDiagram spec={buildSpec(props)} />
    </div>
  );
}
