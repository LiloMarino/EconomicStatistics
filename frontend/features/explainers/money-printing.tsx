import { ExplainerCards } from "@/features/explainers/explainer-cards";
import { type TodayValues, useTodayValues } from "@/features/explainers/explainer-values";
import { SteppedDiagram } from "@/features/explainers/stepped-diagram";
import type { DiagramSpec } from "@/shared/components/diagram/diagram-spec";

function buildSpec(values: TodayValues): DiagramSpec {
  return {
    height: 480,
    label:
      "Diagrama de como o déficit é pago hoje, do atalho da emissão de moeda e de por que o Banco Central mexe em títulos",
    groupColors: {
      market: "var(--bridge-fx)",
      money: "var(--bridge-money)",
      liquidity: "var(--bridge-rate)",
    },
    nodes: [
      {
        id: "deficit",
        title: "Déficit nominal",
        value: values.deficit && `${values.deficit} do PIB`,
        subtitle: "o que falta para pagar as contas",
        concept: "nominal-balance",
        x: 20,
        y: 190,
      },
      {
        id: "bonds",
        title: "Títulos no mercado",
        subtitle: "o Tesouro pega emprestado de bancos, fundos e pessoas",
        concept: "federal-debt",
        accent: "var(--bridge-fx)",
        x: 290,
        y: 30,
        height: 80,
      },
      {
        id: "debt",
        title: "Dívida",
        value: values.gross && `${values.gross} do PIB`,
        subtitle: "bruta: cresce, mas não cria moeda",
        concept: "gross-debt",
        x: 560,
        y: 30,
      },
      {
        id: "bc",
        title: "Banco Central imprime",
        subtitle: "vedado: o BC não empresta ao Tesouro",
        x: 290,
        y: 340,
      },
      {
        id: "money",
        title: "Moeda nova",
        subtitle: "senhoriagem: o ganho de quem emite",
        x: 560,
        y: 340,
      },
      {
        id: "inflation",
        title: "Inflação",
        value: values.inflation,
        subtitle: "IPCA em 12 meses",
        concept: "ipca",
        accent: "var(--bridge-money)",
        x: 820,
        y: 340,
      },
      {
        id: "repo",
        title: "Compromissadas",
        subtitle: "o BC recolhe o dinheiro que sobra nos bancos",
        x: 560,
        y: 190,
      },
      {
        id: "selic",
        title: "Selic na meta",
        value: values.selic,
        subtitle: "o juro de um dia fica onde o Copom decidiu",
        concept: "selic",
        accent: "var(--bridge-rate)",
        x: 820,
        y: 190,
        height: 80,
      },
    ],
    edges: [
      {
        from: "deficit",
        to: "bonds",
        group: "market",
        text: "Hoje o déficit é coberto assim: o Tesouro vende títulos a quem quer emprestar para o governo.",
        bend: 0,
      },
      {
        from: "bonds",
        to: "debt",
        group: "market",
        text: "A dívida cresce, mas o dinheiro só troca de mão: sai de quem comprou o título e volta para a economia quando o governo paga as contas. Não aparece dinheiro novo.",
        bend: 0,
      },
      {
        from: "deficit",
        to: "bc",
        group: "money",
        text: "O atalho seria o Banco Central criar dinheiro e entregar ao Tesouro. A Constituição (art. 164, § 1º) proíbe: o BC não concede empréstimo ao Tesouro.",
        bend: 0,
      },
      {
        from: "bc",
        to: "money",
        group: "money",
        text: "O ganho de quem emite moeda tem nome: senhoriagem. Em pequena dose existe em todo país, porque a economia que cresce precisa de mais dinheiro em circulação.",
        bend: 0,
      },
      {
        from: "money",
        to: "inflation",
        group: "money",
        text: "Em dose grande, para pagar déficit, é mais dinheiro atrás dos mesmos produtos, e os preços sobem. Foi parte da história da inflação alta no Brasil antes do Real.",
        bend: 0,
      },
      {
        from: "bc",
        to: "repo",
        group: "liquidity",
        text: "O Banco Central compra e vende títulos o tempo todo, mas para outra coisa: controlar a liquidez. A Lei de Responsabilidade Fiscal (art. 39) só deixa ele comprar título do Tesouro no lançamento para refinanciar o que vence na carteira dele.",
        bend: 0,
      },
      {
        from: "repo",
        to: "selic",
        group: "liquidity",
        text: "Quando sobra dinheiro nos bancos, o juro de um dia cairia abaixo da meta. As compromissadas recolhem essa sobra, e a Selic fica onde o Copom decidiu.",
        bend: 0,
      },
    ],
    steps: [
      {
        id: "all",
        label: "Tudo",
        groups: [],
        title: "Quem paga o déficit",
        intro:
          "Azul: o caminho de hoje, por dívida. Vermelho: o atalho da emissão, fechado por lei. Verde: o que o Banco Central faz com títulos.",
      },
      {
        id: "market",
        label: "Por dívida",
        groups: ["market"],
        title: "O caminho de hoje",
        intro: "O déficit vira dívida, não moeda.",
      },
      {
        id: "money",
        label: "Por emissão",
        groups: ["money"],
        title: "O atalho fechado",
        intro: "Imprimir para pagar conta gera inflação. Está proibido.",
      },
      {
        id: "liquidity",
        label: "Compromissadas",
        groups: ["liquidity"],
        title: "Por que o BC mexe em títulos",
        intro: "Para segurar a Selic, não para financiar o governo.",
      },
    ],
  };
}

/** Emitir moeda gera inflação? Por que o déficit vira dívida e não moeda. */
export function MoneyPrinting() {
  const spec = buildSpec(useTodayValues());
  return (
    <>
      <p className="max-w-prose text-lg leading-relaxed">
        "O governo imprime dinheiro para pagar as contas" é uma frase comum, e no Brasil de hoje não
        é o que acontece. O desenho mostra o caminho que o déficit faz, o atalho que a lei fechou e
        por que o Banco Central mexe em títulos mesmo assim.
      </p>
      <SteppedDiagram spec={spec} />
      <ExplainerCards
        title="Perguntas que ficam"
        cards={[
          {
            title: "Então déficit não gera inflação?",
            text: "Não direto. Mas déficit grande faz a dívida crescer, e dívida que preocupa sobe o dólar e as expectativas: é a ponte do câmbio, nos dois loops.",
            to: "/learn/explainers/loops-and-bridges",
            link: "Ver os dois loops →",
          },
          {
            title: "Como medir se o BC está financiando o governo",
            text: "Separando a carteira do Banco Central em compromissadas, que são gestão de liquidez, e o resto, e vendo se a base monetária cresce mais rápido que a economia.",
            to: "/deficit#financing",
            link: "Ver como o déficit é pago →",
          },
          {
            title: "O tamanho do déficit hoje",
            text: "Quanto do déficit é juro e quanto é primário, e quem faz cada parte.",
            to: "/deficit",
            link: "Ver o déficit →",
          },
        ]}
      />
    </>
  );
}
