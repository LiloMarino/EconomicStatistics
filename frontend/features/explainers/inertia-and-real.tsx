import { ExplainerCards } from "@/features/explainers/explainer-cards";
import { type TodayValues, useTodayValues } from "@/features/explainers/explainer-values";
import type { DiagramSpec } from "@/features/explainers/diagram-spec";
import { SteppedDiagram } from "@/features/explainers/stepped-diagram";

function buildSpec(values: TodayValues): DiagramSpec {
  return {
    height: 640,
    label:
      "Diagrama do ciclo da inflação inercial, de como a URV e o Real o quebraram e de onde a inércia ainda mora",
    groupColors: {
      inertia: "var(--loop-inflation)",
      real: "var(--bridge-rate)",
      today: "var(--bridge-fx)",
    },
    nodes: [
      {
        id: "inflation",
        title: "Inflação de hoje",
        value: values.inflation,
        subtitle: values.inflationMonth
          ? `IPCA em 12 meses, ${values.inflationMonth}`
          : "IPCA em 12 meses",
        concept: "ipca",
        accent: "var(--loop-inflation)",
        x: 400,
        y: 110,
      },
      {
        id: "indexation",
        title: "Contratos indexados",
        subtitle: "salário, aluguel e preço corrigidos pela inflação passada",
        x: 790,
        y: 110,
        height: 80,
      },
      {
        id: "tomorrow",
        title: "Inflação de amanhã",
        subtitle: "repete a de ontem, mesmo sem pressão nova",
        x: 790,
        y: 300,
      },
      {
        id: "urv",
        title: "URV · mar/1994",
        subtitle: "todos os preços numa mesma régua, corrigida todo dia",
        x: 20,
        y: 110,
        height: 80,
      },
      {
        id: "real",
        title: "Real · jul/1994",
        subtitle: "1 URV virou R$ 1, que valia CR$ 2.750",
        x: 20,
        y: 300,
      },
      {
        id: "memory",
        title: "A memória quebra",
        subtitle: "IPCA de 2.477% em 1993 a 22,41% em 1995",
        x: 20,
        y: 490,
      },
      {
        id: "services",
        title: "Serviços",
        value: values.services,
        subtitle: "IPCA de serviços em 12 meses: salário pesa no preço",
        concept: "services-inflation",
        accent: "var(--bridge-fx)",
        x: 400,
        y: 490,
        height: 80,
      },
      {
        id: "expectations",
        title: "Expectativas",
        value: values.expectations,
        subtitle: values.expectationsYear ? `Focus para ${values.expectationsYear}` : "Focus",
        concept: "unanchored-expectations",
        accent: "var(--bridge-fx)",
        x: 790,
        y: 490,
      },
    ],
    edges: [
      {
        from: "inflation",
        to: "indexation",
        group: "inertia",
        text: "Com inflação alta e duradoura, todo contrato passa a ter correção automática pelo índice do período anterior: salário, aluguel, poupança, tarifa.",
        bend: 0,
      },
      {
        from: "indexation",
        to: "tomorrow",
        group: "inertia",
        text: "Cada correção vira preço novo, que entra no índice do mês seguinte.",
        bend: 0,
      },
      {
        from: "tomorrow",
        to: "inflation",
        group: "inertia",
        text: "E a inflação de amanhã repete a de hoje. É a inércia: ninguém precisa causar a alta, ela se reproduz sozinha. Por isso planos que só congelavam preços não duravam.",
        bend: -40,
      },
      {
        from: "urv",
        to: "indexation",
        group: "real",
        text: "Em março de 1994 a URV passou a valer como régua de preços e salários, ao lado do cruzeiro real. Com tudo convertido na mesma unidade corrigida todo dia, os reajustes pararam de correr atrás uns dos outros.",
        bend: -130,
      },
      {
        from: "urv",
        to: "real",
        group: "real",
        text: "Em 1º de julho de 1994 a URV virou dinheiro (Lei 8.880/1994): o Real, com R$ 1 valendo uma URV, ou CR$ 2.750.",
        bend: 0,
      },
      {
        from: "real",
        to: "memory",
        group: "real",
        text: "Sem a memória do índice passado embutida nos preços, a inflação despencou: o IPCA foi de 2.477,15% em 1993 a 22,41% em 1995.",
        bend: 0,
      },
      {
        from: "services",
        to: "inflation",
        group: "today",
        text:
          values.services && values.inflation
            ? `A inércia não morreu com o Real. Serviços dependem de salário, e salário ainda olha a inflação passada: em 12 meses, serviços sobem ${values.services}, contra ${values.inflation} do IPCA inteiro.`
            : "A inércia não morreu com o Real. Serviços dependem de salário, e salário ainda olha a inflação passada.",
        bend: 30,
      },
      {
        from: "expectations",
        to: "services",
        group: "today",
        text: "E quem espera inflação acima da meta já reajusta pensando nela. A inércia de hoje mora nas expectativas.",
        bend: 0,
      },
    ],
    steps: [
      {
        id: "all",
        label: "Tudo",
        groups: [],
        title: "A inércia, o Real e o que sobrou",
        intro:
          "Laranja: o ciclo da inércia. Verde: como a URV e o Real quebraram o ciclo. Azul: onde a inércia ainda mora.",
      },
      {
        id: "inertia",
        label: "O ciclo",
        groups: ["inertia"],
        title: "A inflação que se repete sozinha",
        intro: "Com tudo indexado, a inflação de ontem vira a de amanhã.",
      },
      {
        id: "real",
        label: "URV e Real",
        groups: ["real"],
        title: "Como o Plano Real quebrou o ciclo",
        intro: "Primeiro uma régua comum, depois a moeda nova.",
      },
      {
        id: "today",
        label: "Hoje",
        groups: ["today"],
        title: "Por que a inércia não morreu",
        intro: "Serviços e expectativas carregam um pouco do passado.",
      },
    ],
  };
}

/** A inflação inercial, como a URV e o Real a quebraram e onde ela ainda mora. */
export function InertiaAndReal() {
  const spec = buildSpec(useTodayValues());
  return (
    <>
      <p className="max-w-prose text-lg leading-relaxed">
        Antes de 1994, a inflação brasileira se alimentava da própria memória: cada preço era
        corrigido pela inflação passada, e a correção virava a inflação seguinte. O Plano Real
        quebrou esse ciclo em duas etapas. O desenho mostra o ciclo, a quebra e o pedaço que sobrou.
      </p>
      <SteppedDiagram spec={spec} />
      <ExplainerCards
        title="Onde ver isso no app"
        cards={[
          {
            title: "Livres, administrados e serviços",
            text: "A inflação de serviços, a que mais carrega inércia, separada do resto do IPCA.",
            to: "/inflation",
            link: "Ver na tela de inflação →",
          },
          {
            title: "O que o mercado espera",
            text: "Expectativa acima da meta é a inércia de hoje: o reajuste já embute a inflação esperada.",
            to: "/focus",
            link: "Ver no Focus →",
          },
          {
            title: "Indexação que ainda existe",
            text: "O salário mínimo é corrigido pela inflação passada (INPC), e contratos de aluguel costumam seguir um índice.",
            to: "/purchasing-power",
            link: "Ver no poder de compra →",
          },
        ]}
      />
    </>
  );
}
