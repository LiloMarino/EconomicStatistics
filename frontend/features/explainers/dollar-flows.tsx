import { ExplainerCards } from "@/features/explainers/explainer-cards";
import { type TodayValues, useTodayValues } from "@/features/explainers/explainer-values";
import { SteppedDiagram } from "@/features/explainers/stepped-diagram";
import type { DiagramSpec } from "@/shared/components/diagram/diagram-spec";

// A etiqueta diz se o dólar entra ou sai; o efeito no preço aparece no triângulo ao lado
// do valor do dólar, com o mouse na seta. Dólar entrando é mais oferta, e o preço cai
const IN = { direction: "in", label: "entra" } as const;
const OUT = { direction: "out", label: "sai" } as const;
const PRICE_DOWN = { direction: "down", on: "market" } as const;
const PRICE_UP = { direction: "up", on: "market" } as const;

function buildSpec(values: TodayValues): DiagramSpec {
  return {
    height: 540,
    label:
      "Diagrama de por onde os dólares entram e saem do Brasil: transações correntes, conta financeira e as reservas do Banco Central",
    groupColors: {
      current: "var(--bridge-fx)",
      financial: "var(--bridge-rate)",
      central: "var(--loop-debt)",
    },
    nodes: [
      {
        id: "exports",
        title: "Exportações",
        subtitle: "estrangeiro compra soja, petróleo, minério",
        x: 20,
        y: 30,
      },
      {
        id: "income-in",
        title: "Serviços e renda recebidos",
        subtitle: "turista de fora aqui, lucro de empresa brasileira lá fora",
        x: 20,
        y: 190,
        height: 80,
      },
      {
        id: "capital-in",
        title: "Investimento de fora",
        subtitle: "fábrica, ações, títulos e empréstimos",
        concept: "fdi",
        x: 20,
        y: 360,
      },
      {
        id: "market",
        title: "Dólares no país",
        value: values.dollar,
        subtitle: "o câmbio: quem tem dólar vende, quem precisa compra",
        concept: "exchange-rate",
        accent: "var(--bridge-fx)",
        x: 415,
        y: 190,
        height: 96,
      },
      {
        id: "imports",
        title: "Importações",
        subtitle: "celular, remédio, combustível",
        x: 810,
        y: 30,
      },
      {
        id: "income-out",
        title: "Serviços e renda pagos",
        subtitle: "viagem lá fora, frete, lucro de multinacional para a matriz",
        x: 810,
        y: 190,
        height: 80,
      },
      {
        id: "capital-out",
        title: "Dinheiro que vai embora",
        subtitle: "investidor vende a aplicação daqui e leva o dólar",
        x: 810,
        y: 360,
      },
      {
        id: "reserves",
        title: "Reservas do BC",
        value: values.reserves,
        subtitle: "compra quando sobra, vende quando falta",
        concept: "international-reserves",
        accent: "var(--loop-debt)",
        x: 415,
        y: 420,
      },
    ],
    edges: [
      {
        from: "exports",
        to: "market",
        group: "current",
        flow: IN,
        effect: PRICE_DOWN,
        text: "Quando um estrangeiro compra soja, paga em dólar, e o exportador troca esses dólares por reais aqui.",
        bend: 0,
      },
      {
        from: "income-in",
        to: "market",
        group: "current",
        flow: IN,
        effect: PRICE_DOWN,
        text: "Turista estrangeiro gastando aqui e lucro de empresa brasileira lá fora também trazem dólar.",
        bend: 0,
      },
      {
        from: "market",
        to: "imports",
        group: "current",
        flow: OUT,
        effect: PRICE_UP,
        text: "Para importar, o comprador troca reais por dólares e paga lá fora.",
        bend: 0,
      },
      {
        from: "market",
        to: "income-out",
        group: "current",
        flow: OUT,
        effect: PRICE_UP,
        text: "Viagem, frete e o lucro que a filial de uma multinacional manda para a matriz levam dólar. Somando as quatro setas azuis, sai o saldo das transações correntes.",
        bend: 0,
      },
      {
        from: "capital-in",
        to: "market",
        group: "financial",
        flow: IN,
        effect: PRICE_DOWN,
        text: "Investimento e empréstimo de fora trazem dólar sem nada sair do país em troca: é a conta financeira, que cobre o buraco das transações correntes.",
        bend: 0,
      },
      {
        from: "market",
        to: "capital-out",
        group: "financial",
        flow: OUT,
        effect: PRICE_UP,
        text: "Numa crise, investidor vende a aplicação daqui e leva o dólar embora.",
        bend: 0,
      },
      {
        from: "market",
        to: "reserves",
        group: "central",
        flow: { direction: "out", label: "BC compra" },
        effect: PRICE_UP,
        text: "Quando sobra dólar, o Banco Central pode comprar e guardar nas reservas. Tirar dólar do mercado segura a queda do preço.",
        bend: 180,
      },
      {
        from: "reserves",
        to: "market",
        group: "central",
        flow: { direction: "in", label: "BC vende" },
        effect: PRICE_DOWN,
        text: "Quando falta, ele vende parte das reservas. Pôr dólar no mercado segura a alta do preço.",
        bend: 180,
      },
    ],
    steps: [
      {
        id: "all",
        label: "Tudo",
        groups: [],
        title: "Por onde o dólar entra e sai",
        intro:
          "À esquerda, o que traz dólar; à direita, o que leva. No meio, o mercado de câmbio, onde o preço do dólar se forma. A etiqueta diz se o dólar entra ou sai. Passe o mouse numa seta: o triângulo ao lado do preço do dólar mostra se ele sobe ou cai.",
      },
      {
        id: "current",
        label: "Transações correntes",
        groups: ["current"],
        title: "As transações correntes",
        intro:
          "O que o país compra e vende com o mundo: mercadorias, serviços e renda. O Brasil vende mais mercadorias do que compra, e paga mais serviços e renda do que recebe.",
      },
      {
        id: "financial",
        label: "Conta financeira",
        groups: ["financial"],
        title: "A conta financeira",
        intro:
          "O dinheiro que vem ou vai como investimento e empréstimo. É ela que cobre o saldo negativo das transações correntes.",
      },
      {
        id: "central",
        label: "O Banco Central",
        groups: ["central"],
        title: "O Banco Central",
        intro: "As reservas são o estoque de segurança: entram quando sobra e saem quando falta.",
      },
    ],
  };
}

/** Por onde os dólares entram e saem do Brasil, e quem cobre a diferença. */
export function DollarFlows() {
  const spec = buildSpec(useTodayValues());
  return (
    <>
      <p className="max-w-prose text-lg leading-relaxed">
        "Entrou dólar", "saiu dólar": a frase aparece em toda notícia de câmbio, e é fácil confundir
        quem traz e quem leva. A regra é uma só: entra dólar quando alguém de fora paga ao Brasil, e
        sai quando o Brasil paga a alguém de fora. O desenho separa cada caminho.
      </p>
      <SteppedDiagram spec={spec} />
      <ExplainerCards
        title="Perguntas que confundem"
        cards={[
          {
            title: "Entra dólar, o preço sobe?",
            text: "Não, é o contrário. Dólar entrando é mais gente querendo vender dólar aqui, e o preço cai. Dólar saindo é mais gente querendo comprar, e o preço sobe. Por isso, com o mouse numa seta que entra, o triângulo ao lado do preço aponta para baixo.",
          },
          {
            title: "Brasileiro comprando dólar: entra ou sai?",
            text: "Nenhum dos dois, por enquanto: ele só troca reais por dólares com alguém daqui. O dólar sai quando ele usa esse dinheiro lá fora, numa viagem ou numa compra.",
          },
          {
            title: "Saldo negativo todo ano esgota os dólares?",
            text: "Não, se a conta financeira cobrir. O gráfico do setor externo mostra, mês a mês, se o investimento direto sozinho cobre o déficit das transações correntes.",
            to: "/external-sector",
            link: "Ver as duas linhas no setor externo →",
          },
          {
            title: "E quando o Banco Central entra?",
            text: "Ele faz o contrário do mercado para segurar o preço: compra quando sobra dólar e vende quando falta. É o seguro das reservas.",
            to: "/learn/explainers/reserves-and-fx",
            link: "Reservas, câmbio e dívida →",
          },
        ]}
      />
    </>
  );
}
