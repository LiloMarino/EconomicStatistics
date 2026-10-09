import { ExplainerCards } from "@/features/explainers/explainer-cards";
import { type TodayValues, useTodayValues } from "@/features/explainers/explainer-values";
import { SteppedDiagram } from "@/features/explainers/stepped-diagram";
import type { DiagramSpec } from "@/shared/components/diagram/diagram-spec";

function buildSpec(values: TodayValues): DiagramSpec {
  return {
    height: 580,
    label:
      "Diagrama das reservas internacionais como seguro, do efeito do câmbio nas duas dívidas e do custo de carregar as reservas",
    groupColors: {
      insurance: "var(--bridge-fx)",
      debt: "var(--loop-debt)",
      cost: "var(--bridge-money)",
    },
    nodes: [
      {
        id: "flight",
        title: "Fuga de dólares",
        subtitle: "crise lá fora ou medo aqui dentro",
        x: 20,
        y: 30,
      },
      {
        id: "dollar",
        title: "Dólar",
        value: values.dollar,
        subtitle: values.dollarMonth ? `fim de ${values.dollarMonth}` : "fim do mês",
        concept: "exchange-rate",
        accent: "var(--bridge-fx)",
        x: 400,
        y: 30,
      },
      {
        id: "sell",
        title: "BC vende dólares",
        subtitle: "aumenta a oferta e segura o preço",
        x: 20,
        y: 230,
      },
      {
        id: "reserves",
        title: "Reservas",
        value: values.reserves,
        subtitle: values.reservesMonth ? `fim de ${values.reservesMonth}` : "no Banco Central",
        concept: "international-reserves",
        accent: "var(--bridge-fx)",
        x: 400,
        y: 230,
      },
      {
        id: "gross",
        title: "Dívida bruta",
        value: values.gross && `${values.gross} do PIB`,
        subtitle: "não desconta as reservas",
        concept: "gross-debt",
        x: 790,
        y: 30,
      },
      {
        id: "net",
        title: "Dívida líquida",
        value: values.net && `${values.net} do PIB`,
        subtitle: "desconta as reservas",
        concept: "net-debt",
        accent: "var(--loop-debt)",
        x: 790,
        y: 230,
      },
      {
        id: "yield",
        title: "O que as reservas rendem",
        subtitle: "juro de fora, em dólar: 5,26% em 2025",
        x: 400,
        y: 420,
      },
      {
        id: "selic",
        title: "O que o dinheiro custou",
        value: values.selic,
        subtitle: "Selic: o juro das compromissadas que bancam as reservas",
        concept: "selic",
        accent: "var(--bridge-money)",
        x: 790,
        y: 420,
      },
    ],
    edges: [
      {
        from: "flight",
        to: "dollar",
        group: "insurance",
        text: "Numa crise, investidores vendem reais para comprar dólares e levar embora, e o dólar dispara.",
        bend: 0,
      },
      {
        from: "reserves",
        to: "sell",
        group: "insurance",
        text: "O Banco Central pode vender parte das reservas no mercado.",
        bend: 0,
      },
      {
        from: "sell",
        to: "dollar",
        group: "insurance",
        text: "Com mais dólar à venda, o preço sobe menos. É um seguro: o objetivo que o Banco Central declara é dar confiança de que o país honra os compromissos externos.",
        bend: 0,
      },
      {
        from: "dollar",
        to: "reserves",
        group: "debt",
        text: "O contrário também vale: com o dólar mais caro, as reservas passam a valer mais reais.",
        bend: 30,
      },
      {
        from: "reserves",
        to: "net",
        group: "debt",
        text: "E descontam mais da dívida líquida. Em 2024, com o dólar 27,9% mais caro, esse efeito tirou 2,9 pontos do PIB da líquida.",
        bend: 0,
      },
      {
        from: "dollar",
        to: "gross",
        group: "debt",
        text: "A bruta não desconta as reservas, e o câmbio mexe pouco nela: no mesmo 2024, +1,0 ponto. Por isso as duas podem andar em direções opostas.",
        bend: 0,
      },
      {
        from: "reserves",
        to: "yield",
        group: "cost",
        text: "O seguro tem preço. As reservas ficam em títulos seguros lá fora, que rendem juro de lá: em 2025, 5,26% em juros, em dólar.",
        bend: 0,
      },
      {
        from: "selic",
        to: "yield",
        group: "cost",
        text: "Os reais que compraram esses dólares saíram de operações compromissadas, que pagam a Selic. A diferença entre os dois juros é o custo de carregar as reservas, o preço da proteção. O câmbio mexe na conta: com o dólar subindo, as reservas ganham em reais, e entre meados de 2011 e 2019 esse ganho mais que pagou o custo na maior parte do tempo, nas contas da IFI. Em 2025, com o real mais forte, as reservas renderam −2,97% em reais.",
        bend: 0,
      },
    ],
    steps: [
      {
        id: "all",
        label: "Tudo",
        groups: [],
        title: "Reservas, câmbio e dívida",
        intro:
          "Azul: as reservas como seguro. Roxo: o câmbio nas duas dívidas. Vermelho: o custo de ter o seguro.",
      },
      {
        id: "insurance",
        label: "O seguro",
        groups: ["insurance"],
        title: "Para que servem as reservas",
        intro: "Dólar guardado para a hora da fuga.",
      },
      {
        id: "debt",
        label: "Câmbio e dívida",
        groups: ["debt"],
        title: "Por que o dólar mexe na dívida líquida",
        intro: "Reservas em dólar valem mais reais quando o dólar sobe.",
      },
      {
        id: "cost",
        label: "O custo",
        groups: ["cost"],
        title: "Quanto custa o seguro",
        intro: "Rendem juro de fora; o dinheiro que as comprou paga juro daqui.",
      },
    ],
  };
}

/** As reservas como seguro, o efeito do câmbio nas dívidas e o custo de carregá-las. */
export function ReservesAndFx() {
  const spec = buildSpec(useTodayValues());
  return (
    <>
      <p className="max-w-prose text-lg leading-relaxed">
        O Brasil guarda centenas de bilhões de dólares no Banco Central. Esse dinheiro funciona como
        seguro contra a fuga de dólares, mexe na dívida líquida toda vez que o câmbio muda e tem um
        custo. O desenho mostra as três coisas.
      </p>
      <SteppedDiagram spec={spec} />
      <ExplainerCards
        title="Onde ver isso no app"
        cards={[
          {
            title: "O tamanho do colchão",
            text: "As reservas mês a mês e em % do PIB.",
            to: "/external-sector",
            link: "Ver no setor externo →",
          },
          {
            title: "As três dívidas",
            text: "O passo a passo de como as reservas entram na líquida e ficam de fora da bruta.",
            to: "/learn/explainers/three-debts",
            link: "Ver o explicador →",
          },
          {
            title: "A dívida líquida e a bruta",
            text: "As duas linhas no mesmo gráfico, com a distância entre elas.",
            to: "/debt",
            link: "Ver a dívida →",
          },
        ]}
      />
    </>
  );
}
