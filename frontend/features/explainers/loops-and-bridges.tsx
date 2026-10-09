import { Link } from "react-router-dom";

import { useDeficit } from "@/features/deficit/use-deficit";
import { useDebt } from "@/features/debt/use-debt";
import type { DiagramSpec } from "@/features/explainers/diagram-spec";
import { SteppedDiagram } from "@/features/explainers/stepped-diagram";
import { useExternalSector } from "@/features/external-sector/use-external-sector";
import { formatFocusValue } from "@/features/focus/focus-labels";
import { useFocusReport } from "@/features/focus/use-focus";
import { useInterest } from "@/features/interest/use-interest";
import { formatMoney, formatMonth, formatPercent, formatShortPercent } from "@/shared/lib/format";

interface LoopValues {
  debt?: string;
  debtMonth?: string;
  interest?: string;
  deficit?: string;
  inflation?: string;
  expectations?: string;
  expectationsYear?: number;
  dollar?: string;
  dollarMonth?: string;
  selic?: string;
}

/** O número de hoje de cada nó, lido das mesmas consultas das telas. Enquanto uma
consulta não chega, o nó aparece sem número. */
function useLoopValues(): LoopValues {
  const debt = useDebt().data?.levels.at(-1);
  const deficit = useDeficit().data?.last;
  const interest = useInterest().data;
  const dollar = useExternalSector().data?.dollar.months.at(-1);
  const focus = useFocusReport().data;
  // O Focus pergunta o IPCA de vários anos: vale o mais próximo
  const expectation = focus?.rows
    .filter((row) => row.indicator === "ipca")
    .sort((a, b) => a.year - b.year)
    .at(0);
  const inflation = interest?.inflation.months.at(-1);

  return {
    debt: debt && formatShortPercent(debt.gross),
    debtMonth: debt && formatMonth(debt.ref_date),
    interest: deficit && formatPercent(deficit.interest),
    deficit: deficit && formatPercent(deficit.nominal),
    inflation: inflation && formatPercent(inflation.rate),
    expectations: expectation && formatFocusValue(expectation.today, expectation.unit),
    expectationsYear: expectation?.year,
    dollar: dollar && formatMoney(dollar.value),
    dollarMonth: dollar && formatMonth(dollar.ref_date),
    selic: interest && formatPercent(interest.selic.current),
  };
}

function buildSpec(values: LoopValues): DiagramSpec {
  return {
    height: 600,
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
        value: values.debt && `${values.debt} do PIB`,
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
        x: 720,
        y: 40,
      },
      {
        id: "adjustments",
        title: "Reajustes",
        subtitle: "salários, aluguéis e contratos pela inflação passada",
        accent: "var(--loop-inflation)",
        x: 820,
        y: 300,
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
        x: 300,
        y: 10,
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
        x: 420,
        y: 200,
      },
      {
        id: "selic",
        title: "Selic sobe",
        value: values.selic,
        subtitle: "para conter a inflação",
        concept: "selic",
        x: 420,
        y: 470,
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
        text: "Se o Banco Central imprimisse dinheiro para pagar o déficit...",
        bend: -20,
      },
      {
        from: "money",
        to: "inflation",
        group: "money",
        text: "...mais dinheiro atrás dos mesmos produtos viraria inflação. No Brasil, a Constituição e a Lei de Responsabilidade Fiscal fecham esse caminho direto.",
        bend: 20,
      },
      {
        from: "inflation",
        to: "selic",
        group: "rate",
        text: "Inflação acima da meta faz o Banco Central subir a Selic.",
        bend: -60,
      },
      {
        from: "selic",
        to: "interest",
        group: "rate",
        text: "Selic mais alta encarece a dívida, que tem boa parte atrelada a ela: a carga volta para o loop da dívida.",
        bend: -40,
      },
    ],
    steps: [
      {
        id: "all",
        label: "Tudo",
        groups: [],
        title: "O desenho inteiro",
        intro:
          "Roxo é o loop da dívida, laranja o da inflação; azul, vermelho e verde são as pontes. Escolha um pedaço acima para ver só ele.",
      },
      {
        id: "debt",
        label: "Loop da dívida",
        groups: ["debt"],
        title: "O loop da dívida",
        intro:
          "Dívida gera juro, juro vira déficit, déficit vira dívida. Ele gira sozinho enquanto o primário não cobrir o juro.",
      },
      {
        id: "inflation",
        label: "Loop da inflação",
        groups: ["inflation"],
        title: "O loop da inflação",
        intro: "É a inércia: a inflação de ontem vira reajuste hoje e expectativa amanhã.",
      },
      {
        id: "fx",
        label: "Ponte do câmbio",
        groups: ["fx"],
        title: "A ponte do câmbio",
        intro: "Leva carga da dívida para a inflação pelo dólar.",
      },
      {
        id: "money",
        label: "Ponte da emissão",
        groups: ["money"],
        title: "A ponte da emissão de moeda",
        intro:
          "O caminho clássico da hiperinflação. Hoje ele está fechado por lei, mas explica o passado do Brasil.",
      },
      {
        id: "rate",
        label: "Ponte dos juros",
        groups: ["rate"],
        title: "A ponte dos juros",
        intro:
          "Leva carga da inflação para a dívida: o remédio de uma piora a outra. Quando isso domina, é a dominância fiscal.",
      },
    ],
  };
}

const brakes = [
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
  const spec = buildSpec(useLoopValues());

  return (
    <>
      <p className="max-w-prose text-lg leading-relaxed">
        Dívida e inflação são dois ciclos que se alimentam sozinhos. E não ficam isolados: três
        pontes levam a "carga" de um para o outro. Escolha um pedaço para ver só as setas dele; cada
        seta é explicada embaixo do desenho.
      </p>

      <SteppedDiagram spec={spec} />

      {/* O que freia cada loop */}
      <section className="flex flex-col gap-3.5">
        <h2 className="font-heading text-section-title">O que freia cada loop</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
          {brakes.map((brake) => (
            <div key={brake.title} className="bg-card flex flex-col gap-1.5 rounded-xl p-4">
              <strong>{brake.title}</strong>
              <span className="text-caption text-muted-foreground">{brake.text}</span>
              <Link to={brake.to} className="text-caption font-semibold">
                {brake.link}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
