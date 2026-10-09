import { ExplainerCards } from "@/features/explainers/explainer-cards";
import { type TodayValues, useTodayValues } from "@/features/explainers/explainer-values";
import { SteppedDiagram } from "@/features/explainers/stepped-diagram";
import type { DiagramSpec } from "@/shared/components/diagram/diagram-spec";

function buildSpec(values: TodayValues): DiagramSpec {
  return {
    height: 540,
    label:
      "Diagrama do caminho normal da alta de juros contra a inflação e do caminho da dominância fiscal",
    groupColors: {
      normal: "var(--bridge-rate)",
      dominance: "var(--bridge-money)",
    },
    nodes: [
      {
        id: "inflation",
        title: "Inflação acima da meta",
        value: values.inflation,
        subtitle: "IPCA em 12 meses",
        concept: "inflation-target",
        accent: "var(--loop-inflation)",
        x: 20,
        y: 200,
      },
      {
        id: "selic",
        title: "Selic sobe",
        value: values.selic,
        subtitle: "o remédio do Banco Central",
        concept: "selic",
        x: 260,
        y: 200,
      },
      {
        id: "strong",
        title: "Dólares entram",
        subtitle: "juro alto atrai quem aplica, e o real se valoriza",
        x: 520,
        y: 30,
        height: 80,
      },
      {
        id: "down",
        title: "Inflação cai",
        subtitle: "importados mais baratos e crédito mais caro",
        accent: "var(--bridge-rate)",
        x: 800,
        y: 30,
        height: 80,
      },
      {
        id: "cost",
        title: "Juros da dívida",
        value: values.interest && `${values.interest} do PIB`,
        subtitle: "boa parte da dívida segue a Selic",
        concept: "nominal-interest",
        x: 520,
        y: 410,
      },
      {
        id: "fear",
        title: "Medo de calote",
        subtitle: "dívida alta ficando mais cara",
        x: 800,
        y: 410,
      },
      {
        id: "up",
        title: "Dólar e inflação sobem",
        subtitle: "o dinheiro foge em vez de entrar",
        accent: "var(--bridge-money)",
        x: 800,
        y: 180,
        height: 80,
      },
    ],
    edges: [
      {
        from: "inflation",
        to: "selic",
        group: "normal",
        text: "Inflação acima da meta: o Banco Central sobe a Selic.",
        bend: 0,
      },
      {
        from: "selic",
        to: "strong",
        group: "normal",
        text: "No caminho normal, juro mais alto atrai dinheiro de fora, que quer render aqui, e o real se valoriza.",
        bend: 0,
      },
      {
        from: "strong",
        to: "down",
        group: "normal",
        text: "Importados e combustível ficam mais baratos, o crédito encarece, e a inflação cai. O remédio funciona.",
        bend: 0,
      },
      {
        from: "selic",
        to: "cost",
        group: "dominance",
        text: "Mas a Selic é também o custo de boa parte da dívida pública. Juro mais alto aumenta a conta de juros na hora.",
        bend: 0,
      },
      {
        from: "cost",
        to: "fear",
        group: "dominance",
        text: "Se a dívida já é alta e o primário não cobre, a conta maior aumenta o medo de que ela não seja paga.",
        bend: 0,
      },
      {
        from: "fear",
        to: "up",
        group: "dominance",
        text: "Aí o dinheiro foge em vez de entrar, o dólar sobe e a inflação sobe junto: o remédio piora a doença. É a dominância fiscal. Blanchard (2004) estimou que o Brasil esteve nessa situação em 2002 e 2003.",
        bend: 0,
      },
    ],
    steps: [
      {
        id: "all",
        label: "Tudo",
        groups: [],
        title: "Os dois caminhos da alta de juros",
        intro:
          "Verde: o caminho normal, em que o juro derruba a inflação. Vermelho: o da dominância fiscal, em que o juro a empurra para cima.",
      },
      {
        id: "normal",
        label: "Caminho normal",
        groups: ["normal"],
        title: "Quando o juro funciona",
        intro: "Juro alto atrai dólar, o real se valoriza e a inflação cai.",
      },
      {
        id: "dominance",
        label: "Dominância fiscal",
        groups: ["dominance"],
        title: "Quando o juro piora tudo",
        intro: "Com dívida alta, juro alto assusta em vez de atrair.",
      },
    ],
  };
}

/** A dominância fiscal: quando o juro que combate a inflação piora a dívida e a própria inflação. */
export function FiscalDominance() {
  const spec = buildSpec(useTodayValues());
  return (
    <>
      <p className="max-w-prose text-lg leading-relaxed">
        Subir a Selic é o remédio do Banco Central contra a inflação. Só que a Selic também é o juro
        de boa parte da dívida pública. Quando a dívida está alta e sem primário para segurá-la, o
        remédio pode piorar a doença. O desenho mostra os dois caminhos.
      </p>
      <SteppedDiagram spec={spec} />
      <ExplainerCards
        title="Como saber de que lado o país está"
        cards={[
          {
            title: "O primário cobre?",
            text: "Se o primário feito fica abaixo do que estabiliza a dívida, cada alta de juro pesa mais.",
            to: "/economy-health",
            link: "Ver na saúde da economia →",
          },
          {
            title: "O dólar responde ao juro?",
            text: "No caminho normal, Selic subindo e dólar caindo andam juntos. Dólar subindo junto com a Selic é sinal de alerta.",
            to: "/interest",
            link: "Ver os juros →",
          },
          {
            title: "Quanto da dívida segue a Selic",
            text: "A composição por indexador mostra o quanto a conta de juros reage à Selic.",
            to: "/debt",
            link: "Ver a dívida →",
          },
        ]}
      />
    </>
  );
}
