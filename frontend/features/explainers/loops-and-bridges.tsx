import { Link } from "react-router-dom";

import { type ExplainerCard, ExplainerCards } from "@/features/explainers/explainer-cards";
import { type TodayValues, useTodayValues } from "@/features/explainers/explainer-values";
import { SteppedDiagram } from "@/features/explainers/stepped-diagram";
import type { DiagramSpec } from "@/shared/components/diagram/diagram-spec";

function buildSpec(values: TodayValues): DiagramSpec {
  return {
    height: 700,
    label: "Diagrama dos loops da dívida e da inflação e das três pontes entre eles",
    groupColors: {
      debt: "var(--loop-debt)",
      inflation: "var(--loop-inflation)",
      fx: "var(--bridge-fx)",
      money: "var(--bridge-money)",
      rate: "var(--bridge-rate)",
    },
    nodes: [
      {
        id: "debt",
        title: "Dívida",
        value: values.gross && `${values.gross} do PIB`,
        subtitle: values.debtMonth ? `bruta, ${values.debtMonth}` : "bruta",
        concept: "gross-debt",
        accent: "var(--loop-debt)",
        x: 120,
        y: 40,
      },
      {
        id: "interest",
        title: "Juros da dívida",
        value: values.interest && `${values.interest} do PIB`,
        subtitle: "em 12 meses",
        concept: "nominal-interest",
        accent: "var(--loop-debt)",
        x: 10,
        y: 300,
      },
      {
        id: "deficit",
        title: "Déficit nominal",
        value: values.deficit && `${values.deficit} do PIB`,
        subtitle: "primário + juros",
        concept: "nominal-balance",
        accent: "var(--loop-debt)",
        x: 250,
        y: 300,
      },
      {
        id: "inflation",
        title: "Inflação",
        value: values.inflation,
        subtitle: "IPCA em 12 meses",
        concept: "ipca",
        accent: "var(--loop-inflation)",
        x: 790,
        y: 140,
      },
      {
        id: "adjustments",
        title: "Reajustes",
        subtitle: "salários, aluguéis e contratos pela inflação passada",
        accent: "var(--loop-inflation)",
        x: 830,
        y: 420,
      },
      {
        id: "expectations",
        title: "Expectativas",
        value: values.expectations,
        subtitle: values.expectationsYear ? `Focus para ${values.expectationsYear}` : "Focus",
        concept: "focus-survey",
        accent: "var(--loop-inflation)",
        x: 590,
        y: 300,
      },
      {
        id: "distrust",
        title: "Desconfiança",
        subtitle: "o mercado duvida que a dívida será paga",
        x: 330,
        y: 20,
      },
      {
        id: "dollar",
        title: "Dólar sobe",
        value: values.dollar,
        subtitle: values.dollarMonth
          ? `fim de ${values.dollarMonth} · importados e combustível`
          : "importados e combustível",
        concept: "exchange-rate",
        x: 510,
        y: 10,
      },
      {
        id: "money",
        title: "BC cria dinheiro",
        subtitle: "para cobrir o déficit (vedado pela Constituição e pela LRF)",
        x: 440,
        y: 230,
      },
      {
        id: "selic",
        title: "Selic sobe",
        value: values.selic,
        subtitle: "para conter a inflação",
        concept: "selic",
        x: 440,
        y: 580,
      },
    ],
    edges: [
      {
        from: "debt",
        to: "interest",
        group: "debt",
        text: "Quanto maior a dívida, maior a conta de juros.",
      },
      {
        from: "interest",
        to: "deficit",
        group: "debt",
        text: "Os juros entram no déficit nominal junto com o primário.",
      },
      {
        from: "deficit",
        to: "debt",
        group: "debt",
        text: "O déficit é pago com dívida nova, e a dívida cresce.",
      },
      {
        from: "inflation",
        to: "adjustments",
        group: "inflation",
        text: "Inflação alta faz reajustar salários, aluguéis e contratos pelo passado.",
      },
      {
        from: "adjustments",
        to: "expectations",
        group: "inflation",
        text: "Com tudo reajustado, todos esperam mais inflação à frente.",
      },
      {
        from: "expectations",
        to: "inflation",
        group: "inflation",
        text: "Quem espera inflação já sobe preço, e ela se confirma.",
      },
      {
        from: "debt",
        to: "distrust",
        group: "fx",
        text: "Dívida crescendo sem freio deixa o mercado desconfiado.",
        bend: 20,
      },
      {
        from: "distrust",
        to: "dollar",
        group: "fx",
        text: "Dinheiro sai do país, e o dólar sobe.",
        bend: 0,
      },
      {
        from: "dollar",
        to: "inflation",
        group: "fx",
        text: "Dólar caro encarece importados e combustível: mais inflação.",
        bend: 20,
      },
      {
        from: "deficit",
        to: "money",
        group: "money",
        text: "O atalho seria o Banco Central imprimir dinheiro para pagar o déficit. No Brasil, a Constituição e a Lei de Responsabilidade Fiscal fecham esse caminho.",
        bend: -20,
      },
      {
        from: "money",
        to: "inflation",
        group: "money",
        text: "Se o atalho fosse usado, mais dinheiro atrás dos mesmos produtos viraria inflação: é o caminho clássico da hiperinflação.",
        bend: 20,
      },
      {
        from: "inflation",
        to: "selic",
        group: "rate",
        text: "Inflação acima da meta faz o Banco Central subir a Selic.",
        bend: -150,
      },
      {
        from: "selic",
        to: "interest",
        group: "rate",
        text: "Selic mais alta encarece a dívida, que tem boa parte atrelada a ela: a carga volta para o loop da dívida.",
        bend: -60,
      },
    ],
    steps: [
      {
        id: "all",
        label: "Tudo",
        groups: [],
        title: "O desenho inteiro",
        intro: (
          <>
            Esta tela junta os outros explicadores num desenho só: roxo é o loop da dívida, laranja
            o da inflação, e azul, vermelho e verde são as pontes. Cada pedaço tem uma página
            própria; escolha um acima para ver só ele e o link para o explicador dele. Passe o mouse
            num número ou num bloco para acender só o que ele toca.
          </>
        ),
      },
      {
        id: "debt",
        label: "Loop da dívida",
        groups: ["debt"],
        title: "O loop da dívida",
        intro: (
          <>
            Dívida gera juro, juro vira déficit, déficit vira dívida. O loop acelera quando o juro
            da dívida (r) passa do crescimento da economia (g) e o primário não cobre a diferença: é
            a conta de r − g.{" "}
            <Link to="/learn/explainers/why-r-minus-g">Por que r − g decide a dívida →</Link>
          </>
        ),
      },
      {
        id: "inflation",
        label: "Loop da inflação",
        groups: ["inflation"],
        title: "O loop da inflação",
        intro: (
          <>
            É a inércia: a inflação de ontem vira reajuste hoje e expectativa amanhã.{" "}
            <Link to="/learn/explainers/inertia-and-real">A inércia e o Plano Real →</Link>
          </>
        ),
      },
      {
        id: "fx",
        label: "Ponte do câmbio",
        groups: ["fx"],
        title: "A ponte do câmbio",
        intro: (
          <>
            Leva carga da dívida para a inflação pelo dólar. As reservas são o amortecedor dessa
            ponte. <Link to="/learn/explainers/reserves-and-fx">Reservas, câmbio e dívida →</Link>
          </>
        ),
      },
      {
        id: "money",
        label: "Ponte da emissão",
        groups: ["money"],
        title: "A ponte da emissão de moeda",
        intro: (
          <>
            O caminho clássico da hiperinflação. Hoje ele está fechado por lei, mas explica o
            passado do Brasil.{" "}
            <Link to="/learn/explainers/money-printing">Emitir moeda gera inflação? →</Link>
          </>
        ),
      },
      {
        id: "rate",
        label: "Ponte dos juros",
        groups: ["rate"],
        title: "A ponte dos juros",
        intro: (
          <>
            Leva carga da inflação para a dívida: o remédio de uma piora a outra. Quando isso
            domina, é a dominância fiscal.{" "}
            <Link to="/learn/explainers/fiscal-dominance">Dominância fiscal →</Link>
          </>
        ),
      },
    ],
  };
}

const brakes: ExplainerCard[] = [
  {
    title: "Superávit primário",
    text: "Freia o loop da dívida: sobra dinheiro para pagar juro sem pedir emprestado.",
    to: "/deficit",
    link: "Ver o primário de hoje →",
  },
  {
    title: "Crescimento acima do juro",
    text: "Freia o loop da dívida: o PIB cresce mais rápido que a conta de juros (g maior que r).",
    to: "/simulator",
    link: "Testar no simulador →",
  },
  {
    title: "Credibilidade do Banco Central",
    text: "Freia o loop da inflação: se todos acreditam na meta, as expectativas não sobem junto.",
    to: "/focus",
    link: "Ver as expectativas →",
  },
  {
    title: "Lei de Responsabilidade Fiscal",
    text: "Fecha a ponte da emissão: o Banco Central não pode financiar o Tesouro diretamente.",
    to: "/deficit",
    link: "Ver como o déficit é pago →",
  },
];

/** Os dois loops, as três pontes e o que freia cada loop. */
export function LoopsAndBridges() {
  const spec = buildSpec(useTodayValues());

  return (
    <>
      <p className="max-w-prose text-lg leading-relaxed">
        Dívida e inflação são dois ciclos que se alimentam sozinhos. E não ficam isolados: três
        pontes levam a "carga" de um para o outro. Escolha um pedaço para ver só as setas dele; cada
        seta é explicada embaixo do desenho.
      </p>

      <SteppedDiagram spec={spec} />

      <ExplainerCards title="O que freia cada loop" cards={brakes} />
    </>
  );
}
