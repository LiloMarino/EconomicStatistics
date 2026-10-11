import { Link } from "react-router-dom";

import { SteppedDiagram } from "@/features/explainers/stepped-diagram";
import { type DebtCase, type DebtCaseId, useDebtCases } from "@/features/simulator/use-simulator";
import type { DiagramSpec } from "@/shared/components/diagram/diagram-spec";
import { Button } from "@/shared/components/ui/button";
import { formatPoints } from "@/shared/lib/format";

const spec: DiagramSpec = {
  height: 470,
  label: "Diagrama dos quatro fatores que decidem se uma dívida é sustentável",
  groupColors: {
    factor: "var(--bridge-fx)",
    ok: "var(--ok)",
    crisis: "var(--trend-up)",
  },
  nodes: [
    {
      id: "term",
      title: "Prazo e rolagem",
      subtitle: "longa vence aos poucos; curta obriga a rolar muito de uma vez",
      concept: "average-maturity",
      height: 80,
      x: 20,
      y: 10,
    },
    {
      id: "currency",
      title: "Moeda",
      subtitle: "a própria, ou uma que o país não emite",
      height: 80,
      x: 20,
      y: 125,
    },
    {
      id: "lenders",
      title: "Credores",
      subtitle: "gente de dentro, mercado de fora ou credores oficiais",
      height: 80,
      x: 20,
      y: 240,
    },
    {
      id: "rate-growth",
      title: "r − g",
      subtitle: "juro contra crescimento",
      concept: "r-minus-g",
      height: 80,
      x: 20,
      y: 355,
    },
    {
      id: "rollover",
      title: "Na hora de rolar",
      subtitle: "o mercado aceita trocar a dívida que vence por dívida nova?",
      concept: "rollover",
      height: 80,
      x: 420,
      y: 190,
    },
    {
      id: "sustainable",
      title: "Sustentável",
      subtitle: "a dívida pode ser grande e estável",
      accent: "var(--ok)",
      x: 800,
      y: 90,
    },
    {
      id: "crisis",
      title: "Crise",
      subtitle: "juro dispara, calote ou inflação",
      accent: "var(--trend-up)",
      x: 800,
      y: 300,
    },
  ],
  edges: [
    {
      from: "term",
      to: "rollover",
      group: "factor",
      text: "Dívida curta põe muito dinheiro na mesa de uma vez: qualquer desconfiança pesa.",
      bend: 0,
    },
    {
      from: "currency",
      to: "rollover",
      group: "factor",
      text: "Em moeda própria, o país sempre consegue pagar em reais; em dólar, depende de ter dólar.",
      bend: 0,
    },
    {
      from: "lenders",
      to: "rollover",
      group: "factor",
      text: "Credores de dentro e oficiais fogem menos que o mercado de fora.",
      bend: 0,
    },
    {
      from: "rate-growth",
      to: "rollover",
      group: "factor",
      text: "Com r maior que g, a dívida cresce sozinha e a desconfiança aumenta a cada ano.",
      bend: 0,
    },
    {
      from: "rollover",
      to: "sustainable",
      group: "ok",
      text: "Se o mercado aceita rolar a juro razoável, a dívida segue grande e estável.",
      bend: 0,
    },
    {
      from: "rollover",
      to: "crisis",
      group: "crisis",
      text: "Se recusa ou cobra caro demais, vem a crise: juro dispara, o país pede resgate, dá calote ou imprime dinheiro.",
      bend: 0,
    },
  ],
  steps: [
    {
      id: "all",
      label: "Tudo",
      groups: [],
      title: "Tudo se decide na hora de rolar",
      intro:
        'Os quatro fatores da esquerda definem se o mercado aceita trocar a dívida que vence por dívida nova. "Na hora de rolar" é onde o caminho se decide: ou o tranquilo, ou o da crise, nunca os dois. Escolha um caminho para ver cada fator do lado dele.',
    },
    {
      id: "calm",
      label: "Caminho tranquilo",
      groups: ["factor", "ok"],
      title: "O caminho tranquilo",
      intro: "Prazo longo, moeda própria, credor de dentro e r perto de g: o caso do Japão.",
      nodes: {
        term: { subtitle: "longo: pouco vence de cada vez", accent: "var(--ok)" },
        currency: { subtitle: "a própria: sempre dá para pagar em reais", accent: "var(--ok)" },
        lenders: { subtitle: "gente de dentro, que foge menos", accent: "var(--ok)" },
        "rate-growth": {
          subtitle: "r perto ou abaixo de g: a dívida não cresce sozinha",
          accent: "var(--ok)",
        },
        rollover: {
          subtitle: "o mercado aceita trocar a dívida que vence, a juro razoável",
          accent: "var(--ok)",
        },
      },
      edges: {
        1: "Com prazo longo, pouco vence de cada vez: uma desconfiança passageira não trava a rolagem.",
        2: "Em moeda própria, o país sempre consegue pagar o que deve em reais.",
        3: "Credor de dentro, como os bancos e fundos do próprio país, não vende tudo ao primeiro susto.",
        4: "Com r perto de g, a dívida não cresce sozinha, e não há motivo para a desconfiança aumentar.",
      },
    },
    {
      id: "crisis",
      label: "Caminho da crise",
      groups: ["factor", "crisis"],
      title: "O caminho da crise",
      intro:
        "Prazo curto, moeda alheia ou credor que foge: o caso da Grécia em 2010 e do Brasil de Collor.",
      nodes: {
        term: { subtitle: "curto: muito vence de uma vez", accent: "var(--trend-up)" },
        currency: {
          subtitle: "uma que o país não emite: depende de ter dólar",
          accent: "var(--trend-up)",
        },
        lenders: {
          subtitle: "mercado de fora, que foge na primeira desconfiança",
          accent: "var(--trend-up)",
        },
        "rate-growth": {
          subtitle: "r bem acima de g: a dívida cresce sozinha",
          accent: "var(--trend-up)",
        },
        rollover: {
          subtitle: "o mercado recusa, ou só aceita a juro alto demais",
          accent: "var(--trend-up)",
        },
      },
      edges: {
        1: "Com prazo curto, muito dinheiro vence de uma vez: qualquer desconfiança vira uma rolagem difícil.",
        2: "Em dólar, não adianta imprimir reais: o país precisa ter dólar para pagar.",
        3: "Investidor de fora vende e vai embora ao primeiro sinal de problema.",
        4: "Com r bem acima de g, a dívida cresce sozinha todo ano, e a desconfiança cresce junto.",
      },
    },
  ],
};

type Mark = "good" | "bad" | "mixed";

const marks: Record<Mark, { symbol: string; className: string }> = {
  good: { symbol: "✓", className: "text-ok" },
  bad: { symbol: "✗", className: "text-trend-up" },
  mixed: { symbol: "~", className: "" },
};

type CaseId = Extract<DebtCaseId, "japan" | "greece" | "brazil_collor">;

/** Como cada fator pesou em cada caso: o juízo de quem lê a história do caso, que o
simulador guarda em texto. O r − g sai da conta e não passa por aqui. */
const factorMarks: Record<CaseId, { term: Mark; currency: Mark; lenders: Mark }> = {
  japan: { term: "good", currency: "good", lenders: "good" },
  greece: { term: "bad", currency: "bad", lenders: "bad" },
  brazil_collor: { term: "bad", currency: "bad", lenders: "mixed" },
};

const caseIds: CaseId[] = ["japan", "greece", "brazil_collor"];

function CaseCard({ debtCase, id }: { debtCase: DebtCase; id: CaseId }) {
  const { context } = debtCase;
  if (!context) return null;
  const rateGap = marks[debtCase.rate_minus_growth > 0 ? "bad" : "good"];
  const rows = [
    { label: "Prazo", text: context.term, mark: marks[factorMarks[id].term] },
    { label: "Moeda", text: context.currency, mark: marks[factorMarks[id].currency] },
    { label: "Credores", text: context.lender, mark: marks[factorMarks[id].lenders] },
    { label: "r − g", text: formatPoints(debtCase.rate_minus_growth), mark: rateGap },
  ];

  return (
    <article className="bg-card flex flex-col gap-2.5 rounded-xl p-4">
      <strong className="text-lg">{debtCase.label}</strong>
      <span className="text-caption text-muted-foreground">{context.story}</span>
      <dl className="text-caption grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className={`font-semibold ${row.mark.className}`}>
              {row.mark.symbol} {row.text}
            </dd>
          </div>
        ))}
      </dl>
      <Button
        variant="outline"
        className="self-start"
        render={<Link to={`/simulator?base=${id}`} />}
        nativeButton={false}
      >
        Abrir no simulador →
      </Button>
    </article>
  );
}

/** Os quatro fatores que decidem se uma dívida é sustentável e os três casos do
simulador, cada um com o que pesou nele. */
export function DebtSustainability() {
  const cases = useDebtCases().data?.cases;

  return (
    <>
      <p className="max-w-prose text-lg leading-relaxed">
        O Japão deve mais de 200% do PIB e não está em crise. O Brasil de Collor devia perto de 40%
        e estava. O que separa um do outro são quatro coisas que não aparecem no número da dívida.
      </p>

      <SteppedDiagram spec={spec} />

      {/* Os casos do simulador */}
      <section className="flex flex-col gap-3.5">
        <h2 className="font-heading text-section-title">Três casos, o que pesou em cada um</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3">
          {caseIds.map((id) => {
            const debtCase = cases?.find((item) => item.id === id);
            return debtCase && <CaseCard key={id} id={id} debtCase={debtCase} />;
          })}
        </div>
        <Link to="/debt" className="text-caption self-start font-semibold">
          Ver quanto da dívida federal vence e quando →
        </Link>
      </section>
    </>
  );
}
