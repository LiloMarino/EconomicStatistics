import type { Concept, ConceptId } from "@/shared/concepts/concept";
import { Formula, FormulaBox } from "@/shared/components/formula";
import { MonthsTable } from "@/shared/concepts/months-table";

const inflationScreen = { to: "/inflation", label: "Inflação por categoria" };
const purchasingPowerScreen = { to: "/purchasing-power", label: "Poder de compra" };

const ibgeIpca = {
  name: "IBGE, divulgação mensal do IPCA",
  frequency: "Mensal, por volta do dia 10 do mês seguinte",
  url: "https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9256-indice-nacional-de-precos-ao-consumidor-amplo.html",
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

// Os números dos exemplos saem do banco do app (IPCA até ago/2026) e foram conferidos
// contra as telas; os fatos institucionais, contra o IBGE, o Banco Central e a lei.
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
    source: ibgeIpca,
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
    source: {
      name: "IBGE, divulgação mensal do INPC",
      frequency: "Mensal, junto com o IPCA",
      url: "https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9258-indice-nacional-de-precos-ao-consumidor.html",
    },
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
      <>
        <p>Os 9 grupos são: {ipcaGroupNames.join(", ")}.</p>
        <p>
          Cada grupo junta itens parecidos. Habitação, por exemplo, tem aluguel, condomínio, energia
          elétrica, água e gás; Transportes tem combustível, passagem e carro.
        </p>
      </>
    ),
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
    source: {
      name: "IBGE, tabela 7060 do SIDRA (IPCA por grupo)",
      frequency: "Mensal, junto com o IPCA",
      url: "https://sidra.ibge.gov.br/tabela/7060",
    },
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
    source: ibgeIpca,
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
    source: ibgeIpca,
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
    source: ibgeIpca,
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
    source: {
      name: "IBGE, tabela 7060 do SIDRA (IPCA por grupo)",
      frequency: "Mensal, junto com o IPCA",
      url: "https://sidra.ibge.gov.br/tabela/7060",
    },
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
    source: {
      name: "Banco Central, página da meta de inflação",
      frequency: "Definida pelo CMN; comparada todo mês",
      url: "https://www.bcb.gov.br/controleinflacao/metainflacao",
    },
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
    source: {
      name: "Lei 14.663/2023, no Planalto",
      frequency: "Anual, todo 1º de janeiro",
      url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14663.htm",
    },
    screens: [purchasingPowerScreen],
  },
};
