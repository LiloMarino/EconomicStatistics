import type { Concept, ConceptId } from "@/shared/concepts/concept";
import { Formula, FormulaBox } from "@/shared/components/formula";
import { IpcaGroupList } from "@/shared/concepts/ipca-group-list";
import { MonthsTable } from "@/shared/concepts/months-table";

const inflationScreen = { to: "/inflation", label: "Inflação por categoria" };
const purchasingPowerScreen = { to: "/purchasing-power", label: "Poder de compra" };
const externalScreen = { to: "/external-sector", label: "Setor externo" };

const ipcaFrequency = "Mensal, por volta do dia 10 do mês seguinte";
const externalNoteFrequency = "Mensal, perto do fim do mês seguinte";

// As fontes que mais de um conceito cita; cada conceito diz o que ela comprova nele
const booklet = {
  name: "IBGE, fascículo do IPCA e do INPC de dezembro de 2025",
  url: "https://ftp.ibge.gov.br/Precos_Indices_de_Precos_ao_Consumidor/IPCA/Fasciculo_Indicadores_IBGE/2025/ipca-inpc_202512caderno.pdf",
};
const sidra7060 = {
  name: "IBGE, tabela 7060 do SIDRA (IPCA por grupo)",
  url: "https://sidra.ibge.gov.br/tabela/7060",
};
const bcbTarget = {
  name: "Banco Central, página da meta de inflação",
  url: "https://www.bcb.gov.br/controleinflacao/metainflacao",
};
const sgs = { name: "Banco Central, SGS", url: "https://www3.bcb.gov.br/sgspub/" };
const sgs3698 = { ...sgs, name: "Banco Central, série 3698 do SGS (dólar, média mensal)" };
const bcbDollarBulletins = {
  name: "Banco Central, cotações diárias do dólar no portal de dados abertos",
  url: "https://dadosabertos.bcb.gov.br/dataset/dolar-americano-usd-todos-os-boletins-diarios",
};
const dataset23079 = {
  name: "Banco Central, série 23079 no portal de dados abertos",
  url: "https://dadosabertos.bcb.gov.br/dataset/23079-transacoes-correntes-acumulado-em-12-meses-em-relacao-ao-pib---mensal",
};
const minimumWageLaw = {
  name: "Lei 14.663/2023",
  url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14663.htm",
};

const ipcaGroupNames = [
  "Alimentação e bebidas",
  "Habitação",
  "Artigos de residência",
  "Vestuário",
  "Transportes",
  "Saúde e cuidados pessoais",
  "Despesas pessoais",
  "Educação",
  "Comunicação",
];

// Os números dos exemplos saem do banco do app (IPCA até ago/2026, setor externo até
// set/2026) e foram conferidos contra as telas e o SGS; os fatos institucionais, contra
// o IBGE, o Banco Central e a lei.
export const concepts: Record<ConceptId, Concept> = {
  ipca: {
    title: "IPCA",
    abbr: "IBGE",
    topic: "inflation",
    summary: "A inflação oficial: quanto subiram os preços do que as famílias compram.",
    lead: (
      <>
        O <strong>IPCA</strong> é a inflação oficial do Brasil: quanto subiram, no mês, os preços do
        que as famílias com renda de 1 a 40 salários mínimos compram. O IBGE publica todo mês.
      </>
    ),
    keywords: ["inflação oficial", "índice de preços", "ibge"],
    measures: (
      <>
        <p>
          A variação média dos preços de uma cesta de produtos e serviços (comida, aluguel, ônibus,
          remédio, mensalidade), em que cada item pesa o quanto pesa no orçamento das famílias.
        </p>
        <p>
          A pesquisa cobre famílias com renda de 1 a 40 salários mínimos em 16 áreas: 10 regiões
          metropolitanas, o Distrito Federal e os municípios de Goiânia, Campo Grande, Rio Branco,
          São Luís e Aracaju.
        </p>
      </>
    ),
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <p>
          Em agosto de 2026, o IPCA foi de <strong>−0,32%</strong>: na média, os preços caíram um
          pouco no mês. De janeiro a agosto, os meses multiplicados dão 3,11%; nos 12 meses até
          agosto, 4,22%.
        </p>
      ),
    },
    reading: (
      <p>
        O número de um mês sozinho diz pouco, porque oscila com a época do ano. O que se compara com
        a meta do Banco Central é o acumulado em 12 meses: a meta é 3%, com tolerância até 4,5%.
        Abaixo de zero é deflação: os preços caíram.
      </p>
    ),
    cautions: [
      {
        title: "É uma média.",
        text: (
          <>
            A sua inflação pode ser outra. Quem gasta muito com escola sentiu a alta de Educação
            (5,76% de janeiro a agosto de 2026) mais do que o índice geral (3,11%).
          </>
        ),
      },
    ],
    related: ["rolling-12m", "ipca-group", "inflation-target", "inpc", "accumulated"],
    sources: [
      {
        ...booklet,
        backs: "Quem o IPCA cobre: famílias com renda de 1 a 40 salários mínimos, em 16 áreas.",
      },
      { ...sidra7060, backs: "As variações de 2026 usadas no exemplo." },
    ],
    frequency: ipcaFrequency,
    screens: [inflationScreen, purchasingPowerScreen],
  },

  inpc: {
    title: "INPC",
    abbr: "IBGE",
    topic: "inflation",
    summary:
      "A inflação das famílias com renda de 1 a 5 salários mínimos. Base de muitos reajustes.",
    lead: (
      <>
        O <strong>INPC</strong> mede a inflação das famílias com renda de 1 a 5 salários mínimos em
        que a pessoa de referência é assalariada. É o índice que corrige o salário mínimo e muitos
        reajustes.
      </>
    ),
    keywords: ["reajuste", "baixa renda", "ibge"],
    measures: (
      <p>
        Usa a mesma coleta de preços do IPCA, nas mesmas 16 áreas, mas com os pesos do orçamento das
        famílias de renda mais baixa. Por isso os dois índices andam perto e se afastam quando um
        grupo que pesa diferente nas duas cestas, como a comida, sobe ou cai mais que o resto.
      </p>
    ),
    example: {
      title: "Com os números de janeiro a agosto de 2026",
      content: (
        <p>
          De janeiro a agosto de 2026, o INPC subiu <strong>3,17%</strong>, contra 3,11% do IPCA.
        </p>
      ),
    },
    reading: (
      <p>
        Serve para saber se um reajuste repôs a inflação de quem ganha menos. Reajuste igual ao INPC
        mantém, na média, o poder de compra dessas famílias; acima dele é ganho real.
      </p>
    ),
    related: ["ipca", "minimum-wage", "purchasing-power"],
    sources: [
      {
        ...booklet,
        backs:
          "Quem o INPC cobre: famílias com renda de 1 a 5 salários mínimos e pessoa de referência assalariada.",
      },
      {
        name: "Banco Central, série 188 do SGS (INPC)",
        url: "https://www3.bcb.gov.br/sgspub/",
        backs: "O INPC de janeiro a agosto de 2026.",
      },
      { ...minimumWageLaw, backs: "O INPC é a inflação que corrige o salário mínimo." },
    ],
    frequency: "Mensal, junto com o IPCA",
    screens: [purchasingPowerScreen],
  },

  "ipca-group": {
    title: "Grupo do IPCA",
    topic: "inflation",
    summary:
      "As 9 categorias de gasto em que o IBGE separa os preços: alimentação, habitação, transportes…",
    lead: (
      <>
        O IPCA se divide em 9 grupos de gasto, de Alimentação e bebidas a Comunicação. Cada grupo
        tem a própria inflação, e o índice geral é a média deles, pesada pelo quanto cada um pesa no
        orçamento.
      </>
    ),
    keywords: ["categoria", "categorias", ...ipcaGroupNames],
    measures: (
      <p>
        Cada grupo junta itens parecidos, em subgrupos. O IBGE pesquisa o preço de cerca de 380
        produtos e serviços, e cada um entra no grupo dele com o peso que tem no orçamento das
        famílias.
      </p>
    ),
    details: { title: "O que entra em cada grupo", content: <IpcaGroupList /> },
    example: {
      title: "Com os números de janeiro a agosto de 2026",
      content: (
        <p>
          O índice geral subiu 3,11%. Educação subiu <strong>5,76%</strong>, puxada pelas
          mensalidades de fevereiro, e Vestuário subiu <strong>1,14%</strong>.
        </p>
      ),
    },
    reading: (
      <p>
        Grupo acima do índice geral pesou mais no bolso de quem gasta muito com ele. Com um reajuste
        igual ao IPCA, o dinheiro passa a comprar menos dos grupos que subiram mais que o índice e
        mais dos que subiram menos.
      </p>
    ),
    cautions: [
      {
        title: "Os pesos mudam.",
        text: (
          <>
            O peso de cada grupo vem da Pesquisa de Orçamentos Familiares (POF) e muda quando ela é
            refeita. Comparar grupos de anos distantes mistura cestas diferentes.
          </>
        ),
      },
    ],
    related: ["ipca", "purchasing-power", "seasonality"],
    sources: [
      {
        ...sidra7060,
        backs:
          "Os 9 grupos, os subgrupos, os itens pesquisados e o peso de cada grupo em agosto de 2026 (variável 66).",
      },
      {
        ...booklet,
        backs: "Os pesos vêm da Pesquisa de Orçamentos Familiares de 2017 e 2018.",
      },
    ],
    frequency: "Mensal, junto com o IPCA",
    screens: [inflationScreen, purchasingPowerScreen],
  },

  accumulated: {
    title: "Acumulado",
    abbr: "composição",
    topic: "inflation",
    summary: "Como juntar a inflação de vários meses: multiplicando, e não somando.",
    lead: (
      <>
        Para juntar a inflação de vários meses, os meses se multiplicam: cada alta incide sobre um
        preço que já tinha subido. Por isso 1% num mês e 2% no seguinte dão 3,02%, e não 3%.
      </>
    ),
    keywords: ["acumulada", "juntar meses", "multiplicar", "juros compostos", "soma"],
    measures: (
      <p>
        Quanto os preços subiram num período inteiro. Um produto de R$ 100 que sobe 1% passa a R$
        101; se no mês seguinte sobe 2%, a alta é sobre os R$ 101, e ele vai a R$ 103,02.
      </p>
    ),
    formula: {
      tex: "\\text{acumulado} = \\prod_{i=1}^{n} (1 + r_i) - 1",
      legend: [
        { symbol: "r_i", text: <>variação do mês i, em fração: 0,33% vira 0,0033</> },
        { symbol: "n", text: <>quantos meses tem o período</> },
        { symbol: "\\prod", text: <>multiplica todos os termos, do mês 1 ao mês n</> },
      ],
    },
    example: {
      title: "Com os números de janeiro a agosto de 2026",
      content: (
        <>
          <MonthsTable
            rows={[
              { label: "jan", rate: "0,33%", factor: "1,0033" },
              { label: "fev", rate: "0,70%", factor: "1,0070" },
              { label: "mar", rate: "0,88%", factor: "1,0088" },
              { label: "abr", rate: "0,67%", factor: "1,0067" },
              { label: "mai", rate: "0,58%", factor: "1,0058" },
              { label: "jun", rate: "0,16%", factor: "1,0016" },
              { label: "jul", rate: "0,07%", factor: "1,0007" },
              { label: "ago", rate: "−0,32%", factor: "0,9968" },
            ]}
          />
          <FormulaBox>
            <Formula flushLeft tex="= 1{,}0033 \times 1{,}0070 \times \cdots \times 0{,}9968 - 1" />
            <Formula flushLeft tex="= 1{,}03106 - 1 = \mathbf{3{,}11\%}" />
          </FormulaBox>
          <p>
            Somando os 8 meses, daria 3,07%. A diferença é pequena com inflação baixa e cresce com
            ela.
          </p>
        </>
      ),
    },
    reading: (
      <p>
        Não é bom nem ruim: é a forma certa de juntar taxas. A soma simples quase acerta com
        inflação baixa e erra cada vez mais quando ela sobe. Com 10% ao mês por 12 meses, somar dá
        120%, e multiplicar dá 213,8%.
      </p>
    ),
    cautions: [
      {
        title: "Pode diferir do oficial.",
        text: (
          <>
            A conta do app usa as variações mensais com 2 casas, como o IBGE publica. O acumulado
            oficial sai do índice sem arredondar e pode diferir em até 0,02 p.p.
          </>
        ),
      },
    ],
    related: ["rolling-12m", "purchasing-power", "percentage-point"],
    sources: [
      {
        ...booklet,
        backs:
          "O IBGE acumula os meses multiplicando: 0,16% em janeiro e 1,31% em fevereiro de 2025 dão 1,47%.",
      },
      { ...sidra7060, backs: "As variações de janeiro a agosto de 2026 do exemplo." },
    ],
    frequency: ipcaFrequency,
    screens: [inflationScreen],
  },

  "rolling-12m": {
    title: "Acumulado em 12 meses",
    topic: "inflation",
    summary: "A inflação dos 12 meses que terminam num mês. O número que se compara com a meta.",
    lead: (
      <>
        A inflação acumulada, do jeito certo, nos 12 meses que terminam num mês. É o número que sai
        no noticiário e o que se compara com a meta.
      </>
    ),
    keywords: ["ipca", "12 meses", "doze meses", "anual", "inflação anual"],
    measures: (
      <>
        <p>
          Quanto os preços subiram no último ano, contado a partir de qualquer mês. Em agosto de
          2026, ele junta de setembro de 2025 a agosto de 2026.
        </p>
        <p>
          Por ter sempre um mês de cada, ele não é enganado pela época do ano: a alta das
          mensalidades em fevereiro entra uma vez em toda janela.
        </p>
      </>
    ),
    formula: {
      tex: "A_t = \\prod_{k=t-11}^{t} (1 + m_k) - 1",
      legend: [
        { symbol: "A_t", text: <>acumulado em 12 meses no mês t</> },
        { symbol: "m_k", text: <>inflação do mês k, em fração: 0,33% vira 0,0033</> },
        { symbol: "\\prod", text: <>multiplica os 12 termos, do mês t − 11 até o mês t</> },
      ],
    },
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <>
          <MonthsTable
            rows={[
              { label: "set/25", rate: "0,48%", factor: "1,0048" },
              { label: "out/25", rate: "0,09%", factor: "1,0009" },
              { label: "nov/25", rate: "0,18%", factor: "1,0018" },
              { label: "dez/25", rate: "0,33%", factor: "1,0033" },
              { label: "jan/26", rate: "0,33%", factor: "1,0033" },
              { label: "fev/26", rate: "0,70%", factor: "1,0070" },
              { label: "mar/26", rate: "0,88%", factor: "1,0088" },
              { label: "abr/26", rate: "0,67%", factor: "1,0067" },
              { label: "mai/26", rate: "0,58%", factor: "1,0058" },
              { label: "jun/26", rate: "0,16%", factor: "1,0016" },
              { label: "jul/26", rate: "0,07%", factor: "1,0007" },
              { label: "ago/26", rate: "−0,32%", factor: "0,9968" },
            ]}
          />
          <FormulaBox>
            <Formula
              flushLeft
              tex="A_{\text{ago/26}} = 1{,}0048 \times 1{,}0009 \times \cdots \times 1{,}0007 \times 0{,}9968 - 1"
            />
            <Formula flushLeft tex="= 1{,}04223 - 1 = 0{,}04223 = \mathbf{4{,}22\%}" />
          </FormulaBox>
          <p>
            Se os 12 meses fossem somados, daria 4,15%. A diferença é pequena com inflação baixa e
            cresce com ela: cada alta incide sobre um preço que já tinha subido.
          </p>
        </>
      ),
    },
    reading: (
      <p>
        Compare com a meta do Banco Central: 3% em 12 meses, com tolerância de 1,5 p.p. para cima ou
        para baixo. Em agosto de 2026, os 4,22% estavam dentro do intervalo, abaixo do teto de 4,5%.
      </p>
    ),
    cautions: [
      {
        title: "Efeito base.",
        text: (
          <>
            A linha muda pelo mês que entra e pelo que sai. Um mês fora da curva há um ano mexe no
            número de hoje.
          </>
        ),
      },
      {
        title: "Não é o acumulado no ano.",
        text: (
          <>O acumulado no ano começa em janeiro; o de 12 meses sempre olha um ano para trás.</>
        ),
      },
    ],
    related: ["accumulated", "base-effect", "seasonality", "inflation-target", "percentage-point"],
    sources: [
      {
        ...sidra7060,
        backs: "O IBGE publica o acumulado em 12 meses (variável 2265), e as variações do exemplo.",
      },
      { ...bcbTarget, backs: "A meta de 3%, com tolerância de 1,5 p.p." },
    ],
    frequency: ipcaFrequency,
    screens: [inflationScreen],
  },

  "base-effect": {
    title: "Efeito base",
    topic: "inflation",
    summary:
      "Quando a linha de 12 meses mexe por causa do mês que saiu da conta, não do que entrou.",
    lead: (
      <>
        A cada mês, o acumulado em 12 meses ganha o mês novo e perde o mesmo mês do ano anterior. Se
        o mês que saiu foi fora da curva, a linha mexe sem nada ter mudado hoje: é o efeito base.
      </>
    ),
    keywords: ["base de comparação", "mês que saiu", "12 meses"],
    measures: (
      <p>
        Por que o 12 meses pode subir com meses calmos, ou cair com meses de alta. O que move a
        linha é a diferença entre o mês que entrou e o que saiu.
      </p>
    ),
    formula: {
      tex: "1 + A_t = (1 + A_{t-1}) \\times \\dfrac{1 + m_t}{1 + m_{t-12}}",
      legend: [
        { symbol: "A_t", text: <>acumulado de 12 meses no mês t</> },
        { symbol: "m_t", text: <>inflação do mês t, o que entrou, em fração</> },
        { symbol: "m_{t-12}", text: <>a do mesmo mês um ano antes, o que saiu</> },
      ],
    },
    example: {
      title: "Com os números de julho a setembro de 2023",
      content: (
        <>
          <div className="bg-card grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-1 rounded-xl px-4.5 py-4">
            <span className="text-muted-foreground">Mês</span>
            <span className="text-muted-foreground text-right">Entrou (2023)</span>
            <span className="text-muted-foreground text-right">Saiu (2022)</span>
            <span>jul</span>
            <span className="text-right">0,12%</span>
            <strong className="text-right">−0,68%</strong>
            <span>ago</span>
            <span className="text-right">0,23%</span>
            <strong className="text-right">−0,36%</strong>
            <span>set</span>
            <span className="text-right">0,26%</span>
            <strong className="text-right">−0,29%</strong>
          </div>
          <p>
            Entre junho e setembro de 2023, o 12 meses subiu de 3,16% para <strong>5,19%</strong>{" "}
            com meses calmos. Subiu porque saíram da conta as quedas de julho a setembro de 2022,
            quando o imposto sobre combustível e energia caiu.
          </p>
        </>
      ),
    },
    reading: (
      <p>
        Não é bom nem ruim: é um aviso para não ler a linha de 12 meses sozinha. Antes de concluir
        que a inflação acelerou, olhe o mês que entrou. Se ele foi normal, a subida veio do mês que
        saiu.
      </p>
    ),
    related: ["rolling-12m", "seasonality", "percentage-point"],
    sources: [
      { ...sidra7060, backs: "As variações de julho a setembro de 2022 e de 2023." },
      {
        name: "Lei Complementar 194/2022",
        url: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp194.htm",
        backs: "O teto do ICMS sobre combustível e energia, a partir de junho de 2022.",
      },
    ],
    frequency: ipcaFrequency,
    screens: [inflationScreen],
  },

  seasonality: {
    title: "Sazonalidade",
    topic: "inflation",
    summary: "Preços que sobem sempre na mesma época do ano, como mensalidade em fevereiro.",
    lead: (
      <>
        Alguns preços sobem sempre na mesma época do ano, como a mensalidade escolar em fevereiro.
        Isso é sazonalidade, e não quer dizer que a inflação acelerou.
      </>
    ),
    keywords: ["época do ano", "mesmo mês", "sazonal", "mensalidade"],
    measures: (
      <p>
        Para saber se um mês foi alto de verdade, compare com o mesmo mês de outros anos, e não com
        o mês anterior.
      </p>
    ),
    example: {
      title: "Educação em fevereiro, de 2021 a 2026",
      content: (
        <>
          <MonthsTable
            rows={[
              { label: "2021", rate: "2,48%" },
              { label: "2022", rate: "5,61%" },
              { label: "2023", rate: "6,28%" },
              { label: "2024", rate: "4,98%" },
              { label: "2025", rate: "4,70%" },
              { label: "2026", rate: "5,21%" },
            ]}
          />
          <p>
            A média de fevereiro de 2021 a 2025 foi <strong>4,81%</strong>. Os 5,21% de 2026 ficaram
            perto do típico: é o reajuste anual das mensalidades, e não uma aceleração.
          </p>
        </>
      ),
    },
    reading: (
      <p>
        Mês acima do típico daquele mês chama atenção; mês alto que é sempre alto, não. O acumulado
        em 12 meses tem sempre um mês de cada e, por isso, não sofre com a sazonalidade.
      </p>
    ),
    related: ["rolling-12m", "base-effect", "ipca-group"],
    sources: [{ ...sidra7060, backs: "Educação em fevereiro, de 2021 a 2026." }],
    frequency: ipcaFrequency,
    screens: [inflationScreen],
  },

  "percentage-point": {
    title: "Ponto percentual",
    abbr: "p.p.",
    topic: "inflation",
    summary: "A diferença direta entre dois percentuais. De 6% para 5% é 1 p.p., e não 1%.",
    lead: (
      <>
        Ponto percentual é a diferença direta entre dois percentuais. Se a inflação vai de 4,44%
        para 4,22%, ela caiu 0,22 p.p.; dizer que caiu 0,22% seria outra conta.
      </>
    ),
    keywords: ["pp", "pontos", "diferença", "variação relativa"],
    measures: (
      <p>
        Quanto um percentual andou, em pontos. A variação relativa é outra pergunta: quanto ele
        mudou em relação a ele mesmo.
      </p>
    ),
    formula: {
      tex: "\\Delta_{\\text{p.p.}} = b - a \\qquad \\Delta_{\\%} = \\dfrac{b}{a} - 1",
      legend: [
        { symbol: "a", text: <>o percentual de antes</> },
        { symbol: "b", text: <>o percentual de depois</> },
      ],
    },
    example: {
      title: "Com os números de julho e agosto de 2026",
      content: (
        <>
          <p>O IPCA em 12 meses foi de 4,44% em julho para 4,22% em agosto.</p>
          <FormulaBox>
            <Formula
              flushLeft
              tex="\Delta_{\text{p.p.}} = 4{,}22 - 4{,}44 = \mathbf{-0{,}22\ p.p.}"
            />
            <Formula
              flushLeft
              tex="\Delta_{\%} = \dfrac{4{,}22}{4{,}44} - 1 = \mathbf{-4{,}95\%}"
            />
          </FormulaBox>
        </>
      ),
    },
    reading: (
      <p>
        Use p.p. para dizer quanto uma taxa subiu ou desceu. As duas contas estão certas, mas
        respondem a perguntas diferentes, e confundi-las faz uma mudança pequena parecer grande, ou
        o contrário.
      </p>
    ),
    related: ["rolling-12m", "accumulated"],
    sources: [
      {
        ...booklet,
        backs:
          "O IBGE compara taxas em p.p.: os 4,26% de 2025 ficaram 0,57 p.p. abaixo dos 4,83% de 2024.",
      },
      { ...sidra7060, backs: "O acumulado em 12 meses de julho e agosto de 2026." },
    ],
    screens: [inflationScreen],
  },

  "purchasing-power": {
    title: "Poder de compra",
    topic: "inflation",
    summary: "Quanto um reajuste compra a mais ou a menos depois da inflação.",
    lead: (
      <>
        Poder de compra é quanto o seu dinheiro compra depois que os preços sobem. Com reajuste
        maior que a inflação, ele compra mais; com reajuste menor, compra menos.
      </>
    ),
    keywords: ["reajuste", "salário", "ganho real", "perda"],
    measures: (
      <p>
        Compara um reajuste com a inflação do mesmo período. A conta divide, e não subtrai: o que
        importa é quanto o dinheiro novo compra dos preços novos.
      </p>
    ),
    formula: {
      tex: "\\Delta PC = \\dfrac{1 + r}{1 + \\pi} - 1",
      legend: [
        { symbol: "r", text: <>reajuste no período, em fração: 3,11% vira 0,0311</> },
        { symbol: "\\pi", text: <>inflação do que você compra, no mesmo período</> },
        { symbol: "\\Delta PC", text: <>quanto o poder de compra mudou</> },
      ],
    },
    example: {
      title: "Educação, de janeiro a agosto de 2026",
      content: (
        <>
          <p>
            Com reajuste igual ao IPCA (3,11%), o que custava R$ 100 em Educação passou a custar R$
            105,76, e os R$ 100 viraram R$ 103,11.
          </p>
          <FormulaBox>
            <Formula
              flushLeft
              tex="\Delta PC = \dfrac{1 + 0{,}0311}{1 + 0{,}0576} - 1 = 0{,}9749 - 1 = \mathbf{-2{,}51\%}"
            />
          </FormulaBox>
          <p>O dinheiro reajustado compra 2,51% a menos de Educação do que comprava.</p>
        </>
      ),
    },
    reading: (
      <p>
        Positivo é ganho e negativo é perda. Reajuste igual ao índice geral mantém o poder de compra
        na média, mas não em cada grupo: quem gasta mais com o que subiu acima da média perde.
      </p>
    ),
    cautions: [
      {
        title: "Dividir, e não subtrair.",
        text: (
          <>
            Subtrair (3,11% − 5,76% = −2,65 p.p.) quase acerta com números pequenos e erra com
            grandes. Reajuste de 50% com os preços dobrando: subtrair dá −50%, mas o dinheiro compra
            1,5 ÷ 2 = 75% do que comprava, ou seja, 25% a menos.
          </>
        ),
      },
    ],
    related: ["accumulated", "ipca-group", "minimum-wage", "inpc"],
    sources: [
      {
        ...sidra7060,
        backs: "A inflação de Educação e do índice geral de janeiro a agosto de 2026.",
      },
      { ...booklet, backs: "As taxas se juntam multiplicando, e não somando." },
    ],
    screens: [purchasingPowerScreen],
  },

  "inflation-target": {
    title: "Meta de inflação",
    topic: "inflation",
    summary:
      "O alvo que o Banco Central persegue: 3%, com tolerância de 1,5 p.p. para cima ou para baixo.",
    lead: (
      <>
        A meta de inflação é o alvo que o Banco Central tem de perseguir: 3% em 12 meses, com
        tolerância de 1,5 p.p. para cima ou para baixo. Entre 1,5% e 4,5%, a meta está cumprida.
      </>
    ),
    keywords: ["ipca", "teto da meta", "tolerância", "banco central", "cmn", "bc"],
    measures: (
      <p>
        Quem define a meta é o Conselho Monetário Nacional (CMN). Desde 2025, ela é contínua: em vez
        de olhar só dezembro, todo mês se compara o IPCA acumulado em 12 meses com o intervalo.
      </p>
    ),
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <p>
          Em agosto de 2026, o IPCA em 12 meses foi <strong>4,22%</strong>: dentro do intervalo,
          abaixo do teto de 4,5%.
        </p>
      ),
    },
    reading: (
      <p>
        Dentro do intervalo, a meta está cumprida. Ela é descumprida quando o 12 meses fica fora do
        intervalo por 6 meses seguidos; aí o Banco Central tem de explicar publicamente o motivo e o
        que vai fazer.
      </p>
    ),
    cautions: [
      {
        title: "A meta mudou com o tempo.",
        text: (
          <>
            Até 2024, a meta valia para o ano-calendário, e o centro caiu aos poucos: 4,25% em 2019,
            4% em 2020, 3,75% em 2021, 3,5% em 2022, 3,25% em 2023 e 3% desde 2024.
          </>
        ),
      },
    ],
    related: ["rolling-12m", "ipca"],
    sources: [
      {
        name: "Decreto 12.079/2024",
        url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/decreto/d12079.htm",
        backs:
          "A meta contínua e o descumprimento depois de 6 meses seguidos fora do intervalo, com a explicação pública do Banco Central.",
      },
      {
        ...bcbTarget,
        backs: "O centro de 3%, a tolerância de 1,5 p.p. e as metas dos anos anteriores.",
      },
    ],
    frequency: "Definida pelo CMN; comparada todo mês",
    screens: [inflationScreen],
  },

  "minimum-wage": {
    title: "Salário mínimo",
    topic: "inflation",
    summary: "O piso legal de salário, reajustado todo janeiro.",
    lead: (
      <>
        O salário mínimo é o menor salário mensal que a lei permite pagar. É reajustado todo 1º de
        janeiro, pela inflação do INPC mais o crescimento da economia de dois anos antes.
      </>
    ),
    keywords: ["piso", "salário", "reajuste", "lei"],
    measures: (
      <p>
        A regra da Lei 14.663/2023 junta duas partes: o INPC dos 12 meses até novembro do ano
        anterior, que repõe a inflação, e o crescimento real do PIB de dois anos antes, que dá o
        ganho real. Desde 2025, esse ganho real fica limitado a 2,5%.
      </p>
    ),
    example: {
      title: "O reajuste de 2026",
      content: (
        <>
          <p>
            O INPC de dezembro de 2024 a novembro de 2025 foi 4,18%. O PIB de 2024 cresceu acima de
            2,5%, então o ganho real ficou no limite.
          </p>
          <FormulaBox>
            <Formula flushLeft tex="1{,}0418 \times 1{,}025 = 1{,}0678" />
            <Formula
              flushLeft
              tex="\text{R\$}\ 1.518 \times 1{,}0678 \approx \mathbf{\text{R\$}\ 1.621}"
            />
          </FormulaBox>
          <p>Um reajuste de 6,79%, arredondado para o real inteiro.</p>
        </>
      ),
    },
    reading: (
      <p>
        Reajuste do mínimo acima do INPC é ganho real para quem ganha o mínimo. A tela de poder de
        compra mostra em que grupos de gasto esse ganho sobra e em quais some.
      </p>
    ),
    related: ["inpc", "purchasing-power"],
    sources: [
      {
        ...minimumWageLaw,
        backs: "A regra: o INPC mais o crescimento real do PIB de dois anos antes.",
      },
      {
        name: "Lei 15.077/2024",
        url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15077.htm",
        backs: "O limite de 2,5% para o ganho real, desde 2025.",
      },
      {
        name: "Decreto 12.797/2025",
        url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12797.htm",
        backs: "O salário mínimo de R$ 1.621 em 2026.",
      },
    ],
    frequency: "Anual, todo 1º de janeiro",
    screens: [purchasingPowerScreen],
  },

  "exchange-rate": {
    title: "Câmbio",
    topic: "external",
    summary: "O preço de uma moeda em outra: quantos reais compram um dólar.",
    lead: (
      <>
        Câmbio é o preço de uma moeda em outra. Quando se fala em dólar a R$ 5,14, é a taxa de
        câmbio: quantos reais é preciso dar por um dólar.
      </>
    ),
    keywords: ["dólar", "taxa de câmbio", "real", "moeda", "desvalorização", "valorização"],
    measures: (
      <p>
        No Brasil o câmbio é livre: o preço sai das compras e vendas de moeda entre bancos, empresas
        e investidores, e o Banco Central não fixa um valor. Dólar subindo é real perdendo valor;
        dólar caindo é real ganhando valor.
      </p>
    ),
    example: {
      title: "Com os números de setembro de 2026",
      content: (
        <>
          <p>
            Um produto de US$ 100 custava R$ 536,74 com o dólar médio de setembro de 2025 (R$
            5,3674) e R$ 514,47 com o de setembro de 2026 (R$ 5,1447).
          </p>
          <FormulaBox>
            <Formula flushLeft tex="\dfrac{5{,}1447}{5{,}3674} - 1 = \mathbf{-4{,}15\%}" />
          </FormulaBox>
          <p>Em reais, o dólar ficou 4,15% mais barato em 12 meses.</p>
        </>
      ),
    },
    reading: (
      <p>
        Dólar mais caro encarece o que vem de fora, como eletrônicos, remédios e combustível, e
        ajuda quem exporta. Dólar mais barato faz o contrário. Nenhum dos dois é bom ou ruim
        sozinho: o que pesa é a velocidade da mudança.
      </p>
    ),
    cautions: [
      {
        title: "A variação muda conforme o lado.",
        text: (
          <>
            O dólar caiu 4,15% em reais, mas o real subiu 4,33% em dólar (5,3674 ÷ 5,1447 − 1). As
            duas contas estão certas: cada uma divide pelo ponto de partida dela.
          </>
        ),
      },
    ],
    related: ["ptax", "international-reserves", "current-account"],
    sources: [
      {
        ...bcbDollarBulletins,
        backs: "O câmbio no Brasil é livre: as taxas são pactuadas no mercado desde março de 1990.",
      },
      { ...sgs3698, backs: "As médias do dólar em setembro de 2025 e de 2026." },
    ],
    screens: [externalScreen],
  },

  ptax: {
    title: "PTAX",
    abbr: "Banco Central",
    topic: "external",
    summary: "A taxa de câmbio de referência que o Banco Central calcula todo dia útil.",
    lead: (
      <>
        A PTAX é a taxa de referência do dólar que o Banco Central calcula todo dia útil, a partir
        de consultas aos bancos que operam câmbio. É ela que aparece nas estatísticas oficiais.
      </>
    ),
    keywords: ["dólar", "câmbio", "taxa de referência", "cotação", "banco central"],
    measures: (
      <p>
        Desde julho de 2011, o Banco Central consulta os dealers de câmbio em quatro janelas ao
        longo do dia, e a PTAX de fechamento é a média dessas quatro consultas. A tela usa a média
        da PTAX nos dias úteis de cada mês.
      </p>
    ),
    example: {
      title: "Com os números de setembro de 2026",
      content: (
        <p>
          A PTAX de venda teve média de <strong>R$ 5,1447</strong> em setembro de 2026, contra R$
          5,3674 em setembro de 2025.
        </p>
      ),
    },
    reading: (
      <p>
        É o número para comparar meses e anos, porque é calculado do mesmo jeito todo dia. Para a
        conta de quem viaja ou compra no exterior, o preço é outro (veja os cuidados).
      </p>
    ),
    cautions: [
      {
        title: "Não é o dólar da casa de câmbio.",
        text: (
          <>
            A PTAX é a taxa entre bancos. O dólar em espécie ou no cartão sai mais caro, com a
            margem de quem vende e os impostos.
          </>
        ),
      },
      {
        title: "A média do mês não é o dólar de hoje.",
        text: <>Num mês agitado, o dólar do último dia pode ficar longe da média.</>,
      },
    ],
    related: ["exchange-rate"],
    sources: [
      {
        ...bcbDollarBulletins,
        backs:
          "Desde 1º de julho de 2011 (Circular 3.506), a PTAX é a média das taxas de quatro consultas diárias aos dealers de câmbio.",
      },
      { ...sgs3698, backs: "As médias de setembro de 2025 e de 2026." },
    ],
    frequency: "Diária; a média do mês sai no primeiro dia útil do seguinte",
    screens: [externalScreen],
  },

  "current-account": {
    title: "Transações correntes",
    topic: "external",
    summary: "O saldo de tudo o que o país compra, vende, paga e recebe do exterior.",
    lead: (
      <>
        Transações correntes é o saldo de tudo o que o país compra e vende com o exterior:
        mercadorias, serviços, juros e lucros. Negativo é déficit: saiu mais dinheiro do que entrou.
      </>
    ),
    keywords: ["conta corrente", "balança comercial", "déficit externo", "balanço de pagamentos"],
    measures: (
      <p>
        Soma quatro contas: a balança comercial (mercadorias vendidas menos compradas), os serviços
        (como frete, viagens e aluguel de equipamento), a renda primária (juros e lucros que entram
        e saem) e a renda secundária (transferências sem contrapartida, como dinheiro mandado a
        parentes).
      </p>
    ),
    formula: {
      tex: "TC = \\text{bens} + \\text{serviços} + \\text{renda primária} + \\text{renda secundária}",
      legend: [
        { symbol: "TC", text: <>saldo das transações correntes, em dólar</> },
        { symbol: "\\text{bens}", text: <>exportações menos importações de mercadorias</> },
      ],
    },
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <>
          <p>
            Nos 12 meses até agosto de 2026, o déficit foi de US$ 63,0 bilhões, com um PIB de US$
            2.553,9 bilhões no mesmo período.
          </p>
          <FormulaBox>
            <Formula
              flushLeft
              tex="\dfrac{-63{,}0}{2.553{,}9} = \mathbf{-2{,}47\%}\ \text{do PIB}"
            />
          </FormulaBox>
        </>
      ),
    },
    reading: (
      <p>
        O Brasil costuma ter déficit, e isso sozinho não é crise: o que importa é quem cobre o
        buraco. Se o investimento direto no país for maior que o déficit, ele está coberto por
        dinheiro que veio para ficar.
      </p>
    ),
    cautions: [
      {
        title: "Em 12 meses e em % do PIB.",
        text: (
          <>
            O saldo de um mês só oscila com a época do ano. Somar 12 meses e dividir pelo PIB
            permite comparar anos e países de tamanhos diferentes.
          </>
        ),
      },
    ],
    related: ["fdi", "share-of-gdp", "exchange-rate"],
    sources: [
      {
        ...dataset23079,
        backs:
          "As quatro contas de transações correntes, e por que o saldo de 12 meses se mede em % do PIB.",
      },
      {
        ...sgs,
        name: "Banco Central, séries 23079, 24419 e 4192 do SGS",
        backs:
          "O saldo de 12 meses até agosto de 2026 em dólar (24419) e em % do PIB (23079), e o PIB de 12 meses em dólar (4192).",
      },
    ],
    frequency: externalNoteFrequency,
    screens: [externalScreen],
  },

  fdi: {
    title: "Investimento direto no país",
    abbr: "IDP",
    topic: "external",
    summary: "Dinheiro estrangeiro que entra para abrir, comprar ou financiar empresas no Brasil.",
    lead: (
      <>
        O <strong>IDP</strong> é o dinheiro estrangeiro que entra para abrir, comprar ou ampliar
        empresas no país. Costuma ficar anos, ao contrário do dinheiro que só aplica em títulos e
        ações.
      </>
    ),
    keywords: ["idp", "investimento estrangeiro", "multinacional", "capital estrangeiro"],
    measures: (
      <p>
        Conta o investimento de quem tem controle ou forte influência sobre a empresa. Tem duas
        partes: a participação no capital, que é comprar ou aumentar a fatia na empresa, e as
        operações intercompanhia, que são empréstimos entre empresas do mesmo grupo, como da matriz
        no exterior para a filial aqui.
      </p>
    ),
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <p>
          Nos 12 meses até agosto de 2026, o investimento direto no país somou{" "}
          <strong>3,39% do PIB</strong>, mais que o déficit em transações correntes, de 2,47%.
        </p>
      ),
    },
    reading: (
      <p>
        Investimento direto maior que o déficit em transações correntes é o caso confortável: o
        buraco está coberto por quem quer ficar. Se ele encolhe e o déficit cresce, o país passa a
        depender de dinheiro de curto prazo.
      </p>
    ),
    cautions: [
      {
        title: "Inclui empréstimo dentro do grupo.",
        text: (
          <>
            Parte do IDP é dívida da filial com a matriz. Ela costuma ser mais estável que o
            dinheiro de aplicação, mas não é fábrica nova.
          </>
        ),
      },
    ],
    related: ["current-account", "international-investment-position", "share-of-gdp"],
    sources: [
      {
        name: "Banco Central, série 22885 no portal de dados abertos",
        url: "https://dadosabertos.bcb.gov.br/dataset/22885-investimentos-diretos-no-pais---idp---mensal---liquido",
        backs:
          "O IDP é investimento com relação de controle ou forte influência, dividido em participação no capital e operações intercompanhia.",
      },
      {
        ...sgs,
        name: "Banco Central, séries 23079 e 23080 do SGS",
        backs: "O IDP e as transações correntes de 12 meses até agosto de 2026, em % do PIB.",
      },
    ],
    frequency: externalNoteFrequency,
    screens: [externalScreen],
  },

  "international-reserves": {
    title: "Reservas internacionais",
    topic: "external",
    summary: "Os dólares e outros ativos externos que o Banco Central guarda de colchão.",
    lead: (
      <>
        As reservas internacionais são os dólares e outros ativos externos que o Banco Central
        guarda. Servem de colchão quando o dinheiro estrangeiro foge do país.
      </>
    ),
    keywords: ["reservas", "colchão", "banco central", "dólares", "liquidez"],
    measures: (
      <p>
        São ativos no exterior prontamente disponíveis e controlados pelo Banco Central, para cobrir
        as necessidades de financiamento do país com o exterior, intervir no mercado de câmbio e
        manter a confiança na moeda. A tela usa a posição do último dia de cada mês.
      </p>
    ),
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <>
          <p>
            No fim de agosto de 2026, as reservas eram de US$ 372,6 bilhões, e o PIB de 12 meses, de
            US$ 2.553,9 bilhões.
          </p>
          <FormulaBox>
            <Formula
              flushLeft
              tex="\dfrac{372{,}6}{2.553{,}9} = \mathbf{14{,}59\%}\ \text{do PIB}"
            />
          </FormulaBox>
        </>
      ),
    },
    reading: (
      <p>
        Mais reservas é mais proteção contra uma fuga de dólares, mas guardar tem custo: o dinheiro
        aplicado lá fora costuma render menos que o juro que o governo paga aqui. Por isso o tamanho
        certo é discutido, e não há um número oficial de bom.
      </p>
    ),
    cautions: [
      {
        title: "Dois conceitos.",
        text: (
          <>
            O Banco Central publica as reservas no conceito caixa e no conceito liquidez, que conta
            também as linhas com recompra e os empréstimos em moeda estrangeira feitos por ele. A
            tela usa o de liquidez.
          </>
        ),
      },
    ],
    related: ["exchange-rate", "share-of-gdp", "international-investment-position"],
    sources: [
      {
        name: "Banco Central, série 13982 no portal de dados abertos",
        url: "https://dadosabertos.bcb.gov.br/dataset/13982-reservas-internacionais---conceito-liquidez---total---diaria",
        backs:
          "O que são as reservas no conceito liquidez, para que servem e o que esse conceito inclui.",
      },
      {
        ...sgs,
        name: "Banco Central, séries 3546 e 4192 do SGS",
        backs: "As reservas do fim de agosto de 2026 e o PIB de 12 meses em dólar.",
      },
    ],
    frequency: "Mensal, a posição do último dia do mês",
    screens: [externalScreen],
  },

  "international-investment-position": {
    title: "Posição internacional de investimento",
    abbr: "PII",
    topic: "external",
    summary: "O balanço do país com o mundo: o que tem lá fora menos o que estrangeiros têm aqui.",
    lead: (
      <>
        A posição internacional de investimento é o balanço do país com o mundo: tudo o que quem
        mora no Brasil tem no exterior, menos tudo o que estrangeiros têm aqui, sejam empresas,
        ações, títulos ou empréstimos.
      </>
    ),
    keywords: ["pii", "passivo externo", "ativo externo", "balanço", "estoque"],
    measures: (
      <p>
        É uma foto do fim de cada trimestre. Os ativos são o investimento direto no exterior, os
        investimentos em carteira, os derivativos, outros investimentos e as reservas. Os passivos
        são o investimento direto no país, os investimentos em carteira, os derivativos e outros
        investimentos.
      </p>
    ),
    formula: {
      tex: "\\text{saldo} = \\text{ativos} - \\text{passivos}",
      legend: [
        { symbol: "\\text{ativos}", text: <>o que quem mora no Brasil tem no exterior</> },
        { symbol: "\\text{passivos}", text: <>o que quem mora fora tem no Brasil</> },
      ],
    },
    example: {
      title: "Com os números do 2º trimestre de 2026",
      content: (
        <>
          <p>
            No fim de junho de 2026: ativos de US$ 1.148,7 bilhões e passivos de US$ 2.461,5
            bilhões, com um PIB de 12 meses de US$ 2.496,6 bilhões.
          </p>
          <FormulaBox>
            <Formula
              flushLeft
              tex="\dfrac{1.148{,}7 - 2.461{,}5}{2.496{,}6} = \mathbf{-52{,}58\%}\ \text{do PIB}"
            />
          </FormulaBox>
        </>
      ),
    },
    reading: (
      <p>
        Saldo negativo é comum em país emergente, que recebe mais investimento do que faz lá fora. O
        que pesa é do que o passivo é feito: fábrica e ação em reais pesam menos numa crise que
        dívida em dólar de prazo curto.
      </p>
    ),
    cautions: [
      {
        title: "O saldo mexe sem ninguém investir.",
        text: (
          <>
            Os passivos incluem ações e empresas brasileiras medidas em dólar. Quando a bolsa ou o
            real sobem, o passivo cresce, e o saldo piora sem um dólar novo entrar.
          </>
        ),
      },
    ],
    related: ["fdi", "international-reserves", "share-of-gdp"],
    sources: [
      {
        name: "Banco Central, série 24040 no portal de dados abertos",
        url: "https://dadosabertos.bcb.gov.br/dataset/24040-passivo---estoque",
        backs:
          "O que entra nos ativos e nos passivos, a metodologia do manual do FMI (BPM6) e a publicação trimestral, em até três meses.",
      },
      {
        ...sgs,
        name: "Banco Central, séries 24011, 24040 e 4192 do SGS",
        backs: "Ativos e passivos do 2º trimestre de 2026 e o PIB de 12 meses até junho.",
      },
    ],
    frequency: "Trimestral, até três meses depois do fim do trimestre",
    screens: [externalScreen],
  },

  "share-of-gdp": {
    title: "% do PIB",
    topic: "external",
    summary: "Um valor dividido por tudo o que o país produziu em 12 meses.",
    lead: (
      <>
        Medir em % do PIB é dividir um valor pelo tamanho da economia: tudo o que o país produziu em
        12 meses. Assim dá para comparar anos e países diferentes.
      </>
    ),
    keywords: ["pib", "porcentagem do pib", "tamanho da economia", "proporção"],
    measures: (
      <p>
        US$ 63 bilhões de déficit é muito ou pouco? Depende do tamanho de quem deve. Dividir pelo
        PIB responde: o mesmo valor pesa menos numa economia maior. Valor e PIB precisam estar na
        mesma moeda e no mesmo período.
      </p>
    ),
    formula: {
      tex: "\\%\\ \\text{do PIB} = \\dfrac{V}{\\text{PIB}_{12m}}",
      legend: [
        { symbol: "V", text: <>o valor medido, em dólar: um saldo de 12 meses ou um estoque</> },
        { symbol: "\\text{PIB}_{12m}", text: <>o PIB dos 12 meses até o mesmo mês, em dólar</> },
      ],
    },
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <>
          <p>Reservas de US$ 372,6 bilhões contra um PIB de 12 meses de US$ 2.553,9 bilhões:</p>
          <FormulaBox>
            <Formula flushLeft tex="\dfrac{372{,}6}{2.553{,}9} = \mathbf{14{,}59\%}" />
          </FormulaBox>
        </>
      ),
    },
    reading: (
      <p>
        Serve para comparar, e não diz sozinho se está bom: cada indicador tem a sua leitura. Um
        déficit de 2,5% do PIB e reservas de 15% do PIB são números de natureza diferente.
      </p>
    ),
    cautions: [
      {
        title: "Fluxo e estoque.",
        text: (
          <>
            Um saldo de 12 meses (o déficit) e uma foto num dia (as reservas) usam a mesma conta,
            mas respondem perguntas diferentes: quanto passou no período e quanto há naquele dia.
          </>
        ),
      },
    ],
    related: ["current-account", "international-reserves"],
    sources: [
      {
        ...dataset23079,
        backs: "Medir em % do PIB pondera o resultado pelo tamanho da economia.",
      },
      {
        ...sgs,
        name: "Banco Central, séries 3546 e 4192 do SGS",
        backs: "As reservas e o PIB de 12 meses em dólar de agosto de 2026.",
      },
    ],
    frequency: externalNoteFrequency,
    screens: [externalScreen],
  },
};
