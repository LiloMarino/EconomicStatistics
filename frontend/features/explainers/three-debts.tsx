import { Link } from "react-router-dom";

import { useDebt, useFederalDebt } from "@/features/debt/use-debt";
import { SteppedDiagram } from "@/features/explainers/stepped-diagram";
import type { DiagramSpec } from "@/shared/components/diagram/diagram-spec";
import { formatBrlTrillions, formatMonth, formatShortPercent } from "@/shared/lib/format";

interface DebtValues {
  month?: string;
  gross?: string;
  net?: string;
  federal?: string;
  federalMonth?: string;
}

/** O número de hoje de cada nó: a bruta e a líquida em % do PIB, a federal em reais. */
function useDebtValues(): DebtValues {
  const level = useDebt().data?.levels.at(-1);
  const federal = useFederalDebt().data;
  return {
    month: level && formatMonth(level.ref_date),
    gross: level && formatShortPercent(level.gross),
    net: level && formatShortPercent(level.net),
    federal: federal && formatBrlTrillions(federal.stock_total),
    federalMonth: federal && formatMonth(federal.stock_month),
  };
}

function buildSpec(values: DebtValues): DiagramSpec {
  return {
    height: 260,
    label:
      "Diagrama de como se passa, num caminho só, da dívida federal à bruta e da bruta à líquida",
    groupColors: { gross: "var(--bridge-fx)", net: "var(--bridge-rate)" },
    nodes: [
      {
        id: "federal",
        title: "DPF · federal",
        value: values.federal,
        subtitle: values.federalMonth
          ? `só os títulos do Tesouro, ${values.federalMonth}`
          : "só os títulos do Tesouro",
        concept: "federal-debt",
        x: 10,
        y: 70,
        height: 104,
      },
      {
        id: "rest",
        title: "+ o resto do governo",
        subtitle: "estados, municípios e as compromissadas do Banco Central",
        x: 212,
        y: 70,
        height: 104,
      },
      {
        id: "gross",
        title: "DBGG · bruta",
        value: values.gross && `${values.gross} do PIB`,
        subtitle: "tudo o que o governo deve",
        concept: "gross-debt",
        accent: "var(--bridge-fx)",
        x: 414,
        y: 70,
        height: 104,
      },
      {
        id: "adjust",
        title: "+ BC e estatais − o que tem a receber",
        subtitle: "reservas internacionais e outros créditos",
        concept: "international-reserves",
        x: 616,
        y: 70,
        height: 104,
      },
      {
        id: "net",
        title: "DLSP · líquida",
        value: values.net && `${values.net} do PIB`,
        subtitle: "o setor público inteiro",
        concept: "net-debt",
        accent: "var(--bridge-rate)",
        x: 818,
        y: 70,
        height: 104,
      },
    ],
    edges: [
      {
        from: "federal",
        to: "rest",
        group: "gross",
        text: "A DPF não é a bruta: é só a parte do Tesouro, os títulos federais em mercado. É o maior pedaço da bruta, mas não o único.",
        bend: 0,
      },
      {
        from: "rest",
        to: "gross",
        group: "gross",
        text: "Somando a dívida de estados e municípios e as operações compromissadas do Banco Central, chega-se à bruta (DBGG).",
        bend: 0,
      },
      {
        from: "gross",
        to: "adjust",
        group: "net",
        text: "Da bruta para a líquida há um caminho só, com dois ajustes ao mesmo tempo: entram o Banco Central e as estatais (menos Petrobras e Eletrobras), e sai o que o setor público tem a receber, como as reservas.",
        bend: 0,
      },
      {
        from: "adjust",
        to: "net",
        group: "net",
        text:
          values.gross && values.net && values.month
            ? `O resultado é a líquida (DLSP), a que a tela Dívida usa na conta do primário que estabiliza. Em ${values.month}, ${values.net} contra ${values.gross} do PIB da bruta.`
            : "O resultado é a líquida (DLSP), a que a tela Dívida usa na conta do primário que estabiliza.",
        bend: 0,
      },
    ],
    steps: [
      {
        id: "all",
        label: "Tudo",
        groups: [],
        title: "Da bruta à líquida",
        intro: "Azul: de onde vem a bruta. Verde: o caminho até a líquida.",
      },
      {
        id: "federal",
        label: "DPF e bruta",
        groups: ["gross"],
        title: "A dívida federal dentro da bruta",
        intro:
          "A DPF é o recorte do Relatório Mensal da Dívida do Tesouro: prazo, indexador e vencimentos.",
      },
      {
        id: "net",
        label: "Bruta e líquida",
        groups: ["net"],
        title: "Da bruta à líquida",
        intro: "Soma o que falta no setor público e desconta os ativos.",
      },
    ],
  };
}

const questions = [
  {
    title: "Qual aparece na notícia?",
    text: "Depende de quem fala. A bruta (DBGG) é a que se compara entre países, porque segue o conceito internacional de governo geral. A líquida (DLSP) também sai nas notas de estatísticas fiscais do Banco Central.",
  },
  {
    title: "O Focus pergunta as duas",
    text: "Os economistas preveem a líquida e a bruta separadas, para o fim de cada ano.",
    to: "/focus",
    link: "Ver no Focus →",
  },
  {
    title: "Por que o dólar subir faz a líquida cair",
    text: "As reservas estão em dólar. Com o dólar mais caro, elas valem mais reais e descontam mais da dívida líquida. A bruta não desconta as reservas, então não cai: o câmbio mexe pouco nela, e até para o outro lado. Em 2024, com o dólar 27,9% mais caro, o efeito foi de −2,9 pontos do PIB na líquida e de +1,0 na bruta.",
    to: "/external-sector",
    link: "Ver as reservas →",
  },
];

/** DPF, DBGG e DLSP: o que cada uma conta e como se passa de uma para a outra. */
export function ThreeDebts() {
  const spec = buildSpec(useDebtValues());

  return (
    <>
      <p className="max-w-prose text-lg leading-relaxed">
        "A dívida do Brasil" pode ser três números diferentes. Eles medem coisas diferentes, e a
        notícia nem sempre diz qual está usando. O desenho mostra como se passa de uma para a outra.
      </p>

      <SteppedDiagram spec={spec} />

      {/* Perguntas que a página responde */}
      <section className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3">
        {questions.map((question) => (
          <div key={question.title} className="bg-card flex flex-col gap-1.5 rounded-xl p-4">
            <strong className="text-lg">{question.title}</strong>
            <span className="text-caption text-muted-foreground">{question.text}</span>
            {question.to && (
              <Link to={question.to} className="text-caption font-semibold">
                {question.link}
              </Link>
            )}
          </div>
        ))}
      </section>
    </>
  );
}
