import { Link } from "react-router-dom";

import { useDebt, useFederalDebt } from "@/features/debt/use-debt";
import type { DiagramSpec } from "@/features/explainers/diagram-spec";
import { SteppedDiagram } from "@/features/explainers/stepped-diagram";
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
    height: 380,
    label: "Diagrama de como se passa da dívida federal à bruta e da bruta à líquida",
    groupColors: { gross: "var(--bridge-fx)", net: "var(--bridge-rate)" },
    nodes: [
      {
        id: "federal",
        title: "DPF",
        value: values.federal,
        subtitle: values.federalMonth
          ? `títulos do Tesouro em mercado, ${values.federalMonth}`
          : "títulos do Tesouro em mercado",
        concept: "federal-debt",
        x: 20,
        y: 150,
      },
      {
        id: "gross",
        title: "DBGG · bruta",
        value: values.gross && `${values.gross} do PIB`,
        subtitle: "União, estados e municípios",
        concept: "gross-debt",
        accent: "var(--bridge-fx)",
        x: 260,
        y: 150,
      },
      {
        id: "added",
        title: "+ Banco Central e estatais",
        subtitle: "entram no setor público",
        x: 500,
        y: 30,
      },
      {
        id: "discounted",
        title: "− o que tem a receber",
        subtitle: "reservas internacionais e outros créditos",
        concept: "international-reserves",
        x: 500,
        y: 270,
      },
      {
        id: "net",
        title: "DLSP · líquida",
        value: values.net && `${values.net} do PIB`,
        subtitle: "setor público consolidado",
        concept: "net-debt",
        accent: "var(--bridge-rate)",
        x: 780,
        y: 150,
      },
    ],
    edges: [
      {
        from: "federal",
        to: "gross",
        group: "gross",
        text: "Os títulos do Tesouro (DPF) são o maior item da bruta, que soma também a dívida de estados e municípios e as operações compromissadas do Banco Central.",
        bend: 0,
      },
      {
        from: "gross",
        to: "added",
        group: "net",
        text: "Para chegar à líquida, entram o Banco Central e as estatais (menos os grupos Petrobras e Eletrobras).",
        bend: 0,
      },
      {
        from: "gross",
        to: "discounted",
        group: "net",
        text: "E se desconta o que o setor público tem a receber, entre eles as reservas internacionais.",
        bend: 0,
      },
      {
        from: "added",
        to: "net",
        group: "net",
        text: "O resultado é a dívida líquida (DLSP), a que a tela Dívida usa na conta do juro implícito e do primário que estabiliza.",
        bend: 0,
      },
      {
        from: "discounted",
        to: "net",
        group: "net",
        text:
          values.gross && values.net && values.month
            ? `Por isso a líquida fica abaixo da bruta: em ${values.month}, ${values.net} contra ${values.gross} do PIB.`
            : "Por isso a líquida costuma ficar abaixo da bruta.",
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
