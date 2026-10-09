import type { Concept, ConceptId } from "@/shared/concepts/concept";
import { Formula, FormulaBox } from "@/shared/components/formula";
import { IpcaGroupList } from "@/shared/concepts/ipca-group-list";
import { MonthsTable } from "@/shared/concepts/months-table";

const inflationScreen = { to: "/inflation", label: "Inflação por categoria" };
const purchasingPowerScreen = { to: "/purchasing-power", label: "Poder de compra" };
const externalScreen = { to: "/external-sector", label: "Setor externo" };
const deficitScreen = { to: "/deficit", label: "Déficit" };
const debtScreen = { to: "/debt", label: "Dívida" };
const focusScreen = { to: "/focus", label: "Focus" };
const activityScreen = { to: "/activity", label: "Atividade" };
const interestScreen = { to: "/interest", label: "Juros" };
const creditScreen = { to: "/credit", label: "Crédito" };
const healthScreen = { to: "/economy-health", label: "Saúde da economia" };

const focusFrequency = "Semanal: as previsões da semana saem na segunda seguinte";

const focusPage = {
  name: "Banco Central, Focus – Relatório de Mercado",
  url: "https://www.bcb.gov.br/publicacoes/focus",
};
const focusReport = {
  name: "Banco Central, Focus – Relatório de Mercado de 2 de outubro de 2026",
  url: "https://www.bcb.gov.br/content/focus/focus/R20261002.pdf",
};
const focusData = {
  name: "Banco Central, dados abertos das expectativas de mercado",
  url: "https://dadosabertos.bcb.gov.br/dataset/expectativas-mercado",
};

const ipcaFrequency = "Mensal, por volta do dia 10 do mês seguinte";
const externalNoteFrequency = "Mensal, perto do fim do mês seguinte";
const fiscalNoteFrequency = "Mensal, perto do fim do mês seguinte";
const monetaryNoteFrequency = "Mensal, perto do fim do mês seguinte";
const tesouroFrequency = "Mensal, cerca de um mês e meio depois do mês do estoque";

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
const bcbNote57 = {
  name: "Banco Central, Nota Técnica 57: núcleos de inflação e outras séries analíticas derivadas do IPCA",
  url: "https://www.bcb.gov.br/content/publicacoes/notastecnicas/NT_57_202512.pdf",
};
const bcbInflationReport2024 = {
  name: "Banco Central, Relatório de Inflação de março de 2024, boxe “Decomposição da inflação de 2023”",
  url: "https://www.bcb.gov.br/content/ri/relatorioinflacao/202403/ri202403b4p.pdf",
};
const sgsFree = {
  name: "Banco Central, série 11428 no portal de dados abertos (IPCA, itens livres)",
  url: "https://dadosabertos.bcb.gov.br/dataset/11428-indice-nacional-de-precos-ao-consumidor---amplo-ipca---itens-livres",
};
const sgsAdministered = {
  name: "Banco Central, série 4449 no portal de dados abertos (IPCA, preços monitorados)",
  url: "https://dadosabertos.bcb.gov.br/dataset/4449-indice-nacional-de-precos-ao-consumidor-amplo-ipca---precos-monitorados---total",
};
const sgsServices = {
  name: "Banco Central, série 10844 no portal de dados abertos (IPCA, serviços)",
  url: "https://dadosabertos.bcb.gov.br/dataset/10844-indice-de-precos-ao-consumidor-amplo-ipca---servicos",
};
const copomPage = {
  name: "Banco Central, página do Copom",
  url: "https://www.bcb.gov.br/en/monetarypolicy/committee",
};
const sgs3696 = { ...sgs, name: "Banco Central, série 3696 do SGS (dólar, fim do mês)" };
const bcbDollarBulletins = {
  name: "Banco Central, cotações diárias do dólar no portal de dados abertos",
  url: "https://dadosabertos.bcb.gov.br/dataset/dolar-americano-usd-todos-os-boletins-diarios",
};
const dataset23079 = {
  name: "Banco Central, série 23079 no portal de dados abertos",
  url: "https://dadosabertos.bcb.gov.br/dataset/23079-transacoes-correntes-acumulado-em-12-meses-em-relacao-ao-pib---mensal",
};
const nfspDataset = {
  name: "Banco Central, série 5727 no portal de dados abertos",
  url: "https://dadosabertos.bcb.gov.br/dataset/5727-nfsp-sem-desvalorizacao-cambial--pib---fluxo-acumulado-em-12-meses---resultado-nominal---total",
};
const dlspDataset = {
  name: "Banco Central, série 4513 no portal de dados abertos",
  url: "https://dadosabertos.bcb.gov.br/dataset/4513-divida-liquida-do-setor-publico--pib---total---setor-publico-consolidado",
};
const dbggDataset = {
  name: "Banco Central, série 13762 no portal de dados abertos",
  url: "https://dadosabertos.bcb.gov.br/dataset/13762-divida-bruta-do-governo-geral--pib---metodologia-utilizada-a-partir-de-2008",
};
const dpmfDataset = {
  name: "Banco Central, série 10618 no portal de dados abertos",
  url: "https://dadosabertos.bcb.gov.br/dataset/10618-divida-mobiliaria-federal---titulos-do-tesouro-nacional---emitidos---prazo-medio---total",
};
const sgs4152 = {
  name: "Banco Central, série 4152 no portal de dados abertos (títulos do Tesouro na carteira do Banco Central)",
  url: "https://dadosabertos.bcb.gov.br/dataset/4152-divida-mobiliaria-saldos---titulos-do-tesouro-nacional-posicao-em-carteira---carteira-do-banco",
};
const sgs1832 = {
  name: "Banco Central, série 1832 no portal de dados abertos (títulos do Tesouro em compromissadas)",
  url: "https://dadosabertos.bcb.gov.br/dataset/1832-sgs",
};
const sgs1788 = {
  name: "Banco Central, série 1788 no portal de dados abertos (base monetária)",
  url: "https://dadosabertos.bcb.gov.br/dataset/1788-sgs",
};
const tesouroStock = {
  name: "Tesouro Nacional, estoque da dívida pública federal no Tesouro Transparente",
  url: "https://www.tesourotransparente.gov.br/ckan/dataset/estoque-da-divida-publica-federal",
};
const rmdJul2026 = {
  name: "Tesouro Nacional, Relatório Mensal da Dívida de julho de 2026",
  url: "https://www.tesourotransparente.gov.br/publicacoes/relatorio-mensal-da-divida-rmd/2026/7",
};
const ibgeGdpRelease = {
  name: "IBGE, PIB cresce 0,5% no segundo trimestre de 2026",
  url: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/47902-pib-cresce-0-5-no-segundo-trimestre-de-2026",
};
const sidra5932 = {
  name: "IBGE, tabela 5932 do SIDRA (taxa de variação do índice de volume trimestral do PIB)",
  url: "https://sidra.ibge.gov.br/tabela/5932",
};
const ibgeQuarterlyAccounts = {
  name: "IBGE, Sistema de Contas Nacionais Trimestrais",
  url: "https://www.ibge.gov.br/estatisticas/economicas/industria/9300-contas-nacionais-trimestrais.html",
};
const ibcDataset = {
  name: "Banco Central, série 24363 no portal de dados abertos (IBC-Br)",
  url: "https://dadosabertos.bcb.gov.br/dataset/24363-indice-de-atividade-economica-do-banco-central---ibc-br",
};
const ibcMethodology = {
  name: "Banco Central, aspectos metodológicos e comparações do IBC-Br e do PIB",
  url: "https://www.bcb.gov.br/conteudo/relatorioinflacao/estudosespeciais/metodologia_ibc-br_pib_estudos_especiais.pdf",
};
const ibgePnadRelease = {
  name: "IBGE, PNAD Contínua: taxa de desocupação de 5,3% no trimestre encerrado em agosto de 2026",
  url: "https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/48148-pnad-continua-taxa-de-desocupacao-e-de-5-3-e-taxa-de-subutilizacao-e-de-13-1-no-trimestre-encerrado-em-agosto",
};
const sidra6381 = {
  name: "IBGE, tabela 6381 do SIDRA (taxa de desocupação por trimestre móvel)",
  url: "https://sidra.ibge.gov.br/tabela/6381",
};
const lrf = {
  name: "Lei Complementar 101/2000 (Lei de Responsabilidade Fiscal)",
  url: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm",
};
const constitution = {
  name: "Constituição Federal",
  url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
};
const law10179 = {
  name: "Lei 10.179/2001",
  url: "https://www.planalto.gov.br/ccivil_03/leis/leis_2001/l10179.htm",
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

// Os números dos exemplos saem do banco do app (IPCA e contas públicas até ago/2026,
// setor externo até set/2026, dívida federal até jul/2026) e foram conferidos contra as
// telas, o SGS e o Relatório Mensal da Dívida; os fatos institucionais, contra o IBGE, o
// Banco Central, o Tesouro e a lei.
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

  "free-prices": {
    title: "Preços livres",
    topic: "inflation",
    summary: "Os preços que o mercado forma, pela oferta e pela demanda: a maior parte do IPCA.",
    lead: (
      <>
        Os <strong>preços livres</strong> são os do IPCA que o mercado forma, pela oferta e pela
        demanda. São a maior parte da cesta, e dentro deles ficam os alimentos em casa, os bens
        industriais e os serviços.
      </>
    ),
    keywords: ["ipca livres", "itens livres", "mercado", "oferta e demanda", "corte do ipca"],
    measures: (
      <>
        <p>
          O Banco Central divide o IPCA em dois pedaços. Os <strong>administrados</strong> são os
          preços sob a influência de governo ou de agência reguladora. Os <strong>livres</strong>{" "}
          são todo o resto, com preços mais sensíveis às condições usuais de oferta e demanda.
        </p>
        <p>
          Dentro dos livres, cada produto cai em um só de três segmentos: alimentação no domicílio,
          serviços e bens industriais.
        </p>
      </>
    ),
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <p>
          Os livres acumulam <strong>4,11%</strong> em 12 meses, perto dos 4,22% do IPCA inteiro,
          como se espera de um pedaço que é cerca de três quartos dele (75,2% em 2023, pelo Banco
          Central). Em agosto, o mês, os livres subiram 0,01%.
        </p>
      ),
    },
    reading: (
      <p>
        É o corte que a política monetária alcança: quando o Banco Central sobe a Selic, é nos
        livres que o efeito aparece. Não há faixa oficial de bom, e a referência é o IPCA inteiro
        contra a meta.
      </p>
    ),
    cautions: [
      {
        title: "A divisão é analítica.",
        text: (
          <>
            O próprio Banco Central diz que as definições têm fins analíticos e não são estritas:
            alguns preços administrados têm dinâmica de mercado, mesmo que em parte.
          </>
        ),
      },
    ],
    related: ["administered-prices", "services-inflation", "ipca", "rolling-12m"],
    sources: [
      {
        ...bcbNote57,
        backs:
          "A definição de livres e administrados, e a divisão dos livres em alimentação no domicílio, serviços e bens industriais.",
      },
      {
        ...bcbInflationReport2024,
        backs: "O peso de 75,2% dos livres no IPCA de 2023.",
      },
      {
        ...sgsFree,
        backs: "A variação mensal dos livres, que compõe os 4,11% em 12 meses até agosto de 2026.",
      },
    ],
    frequency: ipcaFrequency,
    screens: [inflationScreen],
  },

  "administered-prices": {
    title: "Preços administrados",
    abbr: "monitorados",
    topic: "inflation",
    summary: "Os preços sob influência de governo ou de agência reguladora, como energia e ônibus.",
    lead: (
      <>
        Os <strong>preços administrados</strong> (ou monitorados) são os do IPCA que sofrem a
        influência de governo ou de agência reguladora, como a tarifa de energia elétrica, o
        transporte público e o plano de saúde. Mudam por reajuste e por decisão.
      </>
    ),
    keywords: [
      "monitorados",
      "ipca administrados",
      "tarifa",
      "energia elétrica",
      "gasolina",
      "plano de saúde",
      "regulados",
    ],
    measures: (
      <>
        <p>
          Segundo o Banco Central, administrados são os componentes do IPCA sob influência,
          potencial ou efetiva, de órgão público ou agência reguladora. Em 2023 pesavam 24,8% do
          índice.
        </p>
        <p>
          São exemplos a tarifa de energia elétrica, as tarifas de transporte público e os planos de
          saúde. Em 2023, o Banco Central destacou também a gasolina.
        </p>
      </>
    ),
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <p>
          Os administrados acumulam <strong>4,42%</strong> em 12 meses, contra 4,22% do IPCA
          inteiro. Em agosto, o mês, caíram 1,25%: um único mês de reajuste pode mexer sozinho no
          IPCA.
        </p>
      ),
    },
    reading: (
      <p>
        A Selic pouco alcança esses preços, porque quem os decide é o governo, a agência ou o
        contrato. Por isso o Banco Central separa os dois cortes: um administrado que dispara não
        indica, sozinho, que a demanda esquentou.
      </p>
    ),
    cautions: [
      {
        title: "Contrato pode copiar a inflação passada.",
        text: (
          <>
            Planos de saúde e medicamentos têm reajuste ligado à inflação passada, e é por esse
            caminho que a inflação de ontem chega aos administrados de hoje.
          </>
        ),
      },
    ],
    related: ["free-prices", "services-inflation", "ipca", "selic"],
    sources: [
      {
        ...bcbNote57,
        backs: "A definição de preços administrados e os exemplos de energia, transporte e saúde.",
      },
      {
        ...bcbInflationReport2024,
        backs:
          "O peso de 24,8% no IPCA de 2023, o destaque da gasolina e o reajuste de planos de saúde e medicamentos ligado à inflação passada.",
      },
      {
        ...sgsAdministered,
        backs:
          "A variação mensal dos administrados: 4,42% em 12 meses até agosto de 2026 e −1,25% em agosto.",
      },
    ],
    frequency: ipcaFrequency,
    screens: [inflationScreen],
  },

  "services-inflation": {
    title: "Inflação de serviços",
    topic: "inflation",
    summary: "O IPCA do que é intangível, como aluguel e manutenção: o corte que o BC mais vigia.",
    lead: (
      <>
        A <strong>inflação de serviços</strong> é a do que se compra sem levar nada para casa, como
        aluguel e manutenção. É um pedaço dos preços livres, e o Banco Central a vigia porque ela
        reflete salários e demora a ceder.
      </>
    ),
    keywords: [
      "serviços",
      "ipca serviços",
      "inércia",
      "salários",
      "não comercializáveis",
      "cabeleireiro",
      "aluguel",
    ],
    measures: (
      <>
        <p>
          O Banco Central define serviços como os produtos intangíveis dos preços livres, como
          manutenção e aluguel. Os outros dois segmentos dos livres são a alimentação no domicílio e
          os bens industriais, que são os produtos tangíveis.
        </p>
        <p>
          Serviços pesaram 35% do IPCA em 2023, a maior fatia entre os cortes que o Banco Central
          destaca.
        </p>
      </>
    ),
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <p>
          Os serviços acumulam <strong>5,46%</strong> em 12 meses: acima dos livres (4,11%), dos
          administrados (4,42%) e dos 4,22% do IPCA inteiro. Em agosto, o mês, subiram 0,03%.
        </p>
      ),
    },
    reading: (
      <p>
        Serviços acima do restante por muito tempo é sinal de inflação enraizada: o preço de um
        serviço segue em boa parte o salário de quem o presta, e isso muda devagar. Não há faixa
        oficial, e a referência é o próprio IPCA.
      </p>
    ),
    cautions: [
      {
        title: "São pouco expostos ao mundo.",
        text: (
          <>
            Um corte de cabelo ou uma consulta não são importados, então serviços reagem menos ao
            dólar e à concorrência de fora do que os bens, e o Banco Central os trata como não
            comercializáveis.
          </>
        ),
      },
    ],
    related: ["free-prices", "administered-prices", "unemployment-rate", "selic"],
    sources: [
      {
        ...bcbNote57,
        backs:
          "A definição de serviços como produtos intangíveis e a classificação como não comercializáveis, com os exemplos de cabeleireiro e serviços médicos.",
      },
      {
        ...bcbInflationReport2024,
        backs: "O peso de 35% dos serviços no IPCA de 2023.",
      },
      {
        ...sgsServices,
        backs: "A variação mensal dos serviços: 5,46% em 12 meses até agosto de 2026.",
      },
    ],
    frequency: ipcaFrequency,
    screens: [inflationScreen],
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
      {
        title: "A tolerância também mudou.",
        text: (
          <>
            O intervalo em volta do centro foi de 2 p.p. de 1999 a 2002, de 2,5 p.p. de 2003 a 2005,
            de 2 p.p. de 2006 a 2016 e é de 1,5 p.p. desde 2017. Em 2015, por exemplo, a meta era
            4,5%, com limites de 2,5% e 6,5%; o IPCA fechou o ano em 10,67%, acima do teto. Em 2003
            e 2004 o centro foi revisto depois de fixado, e a série do Banco Central traz a meta já
            ajustada (4% e 5,5%).
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
      {
        name: "Banco Central, histórico de metas para a inflação",
        url: "https://www.bcb.gov.br/controleinflacao/historicometas",
        backs:
          "A meta e a tolerância de cada ano desde 1999, com as resoluções do CMN que as fixaram.",
      },
      {
        name: "Banco Central, série 13521 do SGS (meta de inflação)",
        url: "https://www3.bcb.gov.br/sgspub/",
        backs: "A meta de cada ano desde 1999, com 4% em 2003 e 5,5% em 2004.",
      },
    ],
    frequency: "Definida pelo CMN; comparada todo mês",
    screens: [inflationScreen, healthScreen],
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
        Câmbio é o preço de uma moeda em outra. Quando se fala em dólar a R$ 5,18, é a taxa de
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
            Um produto de US$ 100 custava R$ 531,86 com o dólar do fim de setembro de 2025 (R$
            5,3186) e R$ 518,09 com o do fim de setembro de 2026 (R$ 5,1809).
          </p>
          <FormulaBox>
            <Formula flushLeft tex="\dfrac{5{,}1809}{5{,}3186} - 1 = \mathbf{-2{,}59\%}" />
          </FormulaBox>
          <p>Em reais, o dólar ficou 2,59% mais barato em 12 meses.</p>
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
            O dólar caiu 2,59% em reais, mas o real subiu 2,66% em dólar (5,3186 ÷ 5,1809 − 1). As
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
      { ...sgs3696, backs: "O dólar do fim de setembro de 2025 e de 2026." },
    ],
    screens: [externalScreen, healthScreen],
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
        longo do dia, e a PTAX de fechamento é a média dessas quatro consultas. A tela usa a PTAX do
        último dia útil de cada mês, a mesma medida que a pesquisa Focus pergunta.
      </p>
    ),
    example: {
      title: "Com os números de setembro de 2026",
      content: (
        <p>
          A PTAX de venda fechou setembro de 2026 em <strong>R$ 5,1809</strong>, contra R$ 5,3186 no
          fim de setembro de 2025.
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
        title: "O fim do mês não é a média do mês.",
        text: (
          <>
            Num mês agitado, o último dia pode ficar longe da média: em agosto de 2026, a PTAX
            fechou em R$ 5,1816, e a média do mês foi R$ 5,1532.
          </>
        ),
      },
    ],
    related: ["exchange-rate"],
    sources: [
      {
        ...bcbDollarBulletins,
        backs:
          "Desde 1º de julho de 2011 (Circular 3.506), a PTAX é a média das taxas de quatro consultas diárias aos dealers de câmbio.",
      },
      { ...sgs3696, backs: "O fim de setembro de 2025 e de 2026 e o de agosto de 2026." },
      {
        ...sgs,
        name: "Banco Central, série 3698 do SGS (dólar, média mensal)",
        backs: "A média de agosto de 2026.",
      },
    ],
    frequency: "Diária; a do último dia útil fecha o mês",
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
    screens: [externalScreen, healthScreen],
  },

  "reserve-adequacy": {
    title: "Adequação das reservas",
    abbr: "ARA",
    topic: "external",
    summary: "O quanto as reservas cobrem do dinheiro que pode sair do país numa crise.",
    lead: (
      <>
        A <strong>métrica ARA</strong>, do FMI, compara as reservas internacionais com o dinheiro
        que poderia sair do país numa crise: dívida externa de curto prazo, outros investimentos de
        carteira, a quantidade de moeda na economia (M2) e as exportações. Reservas entre 100% e
        150% da métrica são vistas como adequadas.
      </>
    ),
    keywords: ["ara", "métrica ara", "assessing reserve adequacy", "reservas adequadas", "fmi"],
    measures: (
      <p>
        Cada item do risco entra com um peso, e a soma ponderada é o que as reservas deveriam
        cobrir. O peso é maior para a dívida externa de curto prazo e menor para a moeda e as
        exportações, e muda com o regime de câmbio. O resultado é uma razão: as reservas divididas
        pela métrica.
      </p>
    ),
    reading: (
      <p>
        100% quer dizer que as reservas cobrem exatamente a saída esperada num cenário de estresse;
        abaixo disso o colchão é curto, e muito acima de 150% pode ser custo demais, porque reserva
        parada rende pouco. O número serve de baliza e não de veredito.
      </p>
    ),
    cautions: [
      {
        title: "A faixa é um teste básico, não uma lei.",
        text: (
          <>
            Quando o FMI discutiu a métrica, parte dos diretores achou a faixa de 100% a 150% um
            teste básico razoável e parte a considerou mal justificada. O app não calcula o
            percentual do Brasil: mostra as reservas em dólares e em % do PIB ao lado da faixa, sem
            cor.
          </>
        ),
      },
    ],
    related: ["international-reserves", "exchange-rate", "share-of-gdp"],
    sources: [
      {
        name: "FMI, Public Information Notice 11/47: Executive Board Discusses Assessing Reserve Adequacy (7 de abril de 2011)",
        url: "https://www.imf.org/en/news/articles/2015/09/28/04/53/pn1147",
        backs:
          "A métrica de adequação ponderada pelo risco e a faixa de 100% a 150% como teste básico, com as ressalvas de parte dos diretores.",
      },
    ],
    screens: [healthScreen],
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

  nfsp: {
    title: "Necessidade de financiamento do setor público",
    abbr: "NFSP",
    topic: "public-accounts",
    summary: "O nome oficial do déficit: quanto o setor público precisou pedir emprestado.",
    lead: (
      <>
        A <strong>NFSP</strong> é quanto o setor público precisou pedir emprestado para fechar as
        contas num período. É o nome oficial do déficit: positivo é déficit, negativo é superávit.
      </>
    ),
    keywords: [
      "déficit público",
      "superávit",
      "resultado fiscal",
      "contas públicas",
      "abaixo da linha",
    ],
    measures: (
      <>
        <p>
          Abrange o governo federal (Tesouro e Previdência), os estados, os municípios, as estatais
          das três esferas, menos Petrobras e Eletrobras, e o Banco Central.
        </p>
        <p>
          O Banco Central mede pelo lado do financiamento, que ele chama de "abaixo da linha": em
          vez de somar receitas e despesas, olha quanto a dívida líquida cresceu no período. Daí
          saem três recortes: o resultado nominal, o primário e os juros.
        </p>
      </>
    ),
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <p>
          Nos 12 meses até agosto de 2026, a NFSP foi de <strong>9,48% do PIB</strong>: 0,62% de
          déficit primário mais 8,86% de juros.
        </p>
      ),
    },
    reading: (
      <p>
        Quanto maior a NFSP, mais rápido a dívida cresce. Negativa, o setor público arrecadou mais
        do que gastou com tudo, juros inclusive, e pôde abater dívida.
      </p>
    ),
    cautions: [
      {
        title: "Sem desvalorização cambial.",
        text: (
          <>
            As séries do app tiram dos juros o efeito do dólar sobre a dívida em moeda estrangeira.
            Assim o número mostra a política fiscal, e não o sobe e desce do câmbio.
          </>
        ),
      },
      {
        title: "Sinal ao contrário do noticiário.",
        text: (
          <>
            Na NFSP, positivo é déficit. O noticiário costuma falar em superávit positivo; aqui o
            mesmo superávit aparece com sinal negativo.
          </>
        ),
      },
    ],
    related: ["nominal-balance", "primary-balance", "nominal-interest", "net-debt"],
    sources: [
      {
        ...nfspDataset,
        backs:
          "Quem a NFSP abrange, a medida pelo lado do financiamento (abaixo da linha), os três recortes e a exclusão do efeito do câmbio nos juros.",
      },
      {
        ...sgs,
        name: "Banco Central, séries 5727, 5793 e 5760 do SGS",
        backs: "Os 9,48%, 0,62% e 8,86% do PIB nos 12 meses até agosto de 2026.",
      },
    ],
    frequency: fiscalNoteFrequency,
    screens: [deficitScreen],
  },

  "primary-balance": {
    title: "Resultado primário",
    topic: "public-accounts",
    summary: "Arrecadação menos gastos do setor público, sem contar os juros da dívida.",
    lead: (
      <>
        O resultado primário é o que o setor público arrecada menos o que gasta, sem contar os juros
        da dívida. Na conta da NFSP, positivo é déficit e negativo é superávit.
      </>
    ),
    keywords: ["primário", "superávit primário", "déficit primário", "meta fiscal", "orçamento"],
    measures: (
      <p>
        Se o governo cabe no próprio orçamento: salários, aposentadorias, saúde, educação e
        investimento contra impostos e contribuições. É a parte do déficit que depende das escolhas
        de gasto e de imposto, e não do tamanho da dívida.
      </p>
    ),
    formula: {
      tex: "\\text{primário} = \\text{nominal} - \\text{juros}",
      legend: [
        { symbol: "\\text{nominal}", text: <>o déficit completo, em % do PIB</> },
        { symbol: "\\text{juros}", text: <>os juros nominais da dívida no mesmo período</> },
      ],
    },
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <>
          <p>Nos 12 meses até agosto de 2026:</p>
          <FormulaBox>
            <Formula
              flushLeft
              tex="9{,}48 - 8{,}86 = \mathbf{0{,}62\%}\ \text{do PIB de déficit}"
            />
          </FormulaBox>
        </>
      ),
    },
    reading: (
      <p>
        Superávit primário abate parte dos juros e segura a dívida. O setor público fez superávit em
        todos os anos de 2002 a 2013, déficit de 2014 a 2020 (9,24% do PIB em 2020, ano da
        pandemia), superávit em 2021 e 2022 e déficit de novo desde 2023.
      </p>
    ),
    cautions: [
      {
        title: "Caixa, e não competência.",
        text: (
          <>
            O primário conta o dinheiro quando ele entra ou sai do caixa. Os juros contam quando
            correm, pagos ou não.
          </>
        ),
      },
    ],
    related: ["nfsp", "nominal-interest", "nominal-balance", "stabilizing-primary"],
    sources: [
      {
        ...nfspDataset,
        backs:
          "O primário é o componente não financeiro do resultado, igual ao nominal menos os juros, e é apurado pelo critério de caixa.",
      },
      {
        ...sgs,
        name: "Banco Central, séries 5793 e 5727 do SGS",
        backs:
          "O primário de cada dezembro desde 2002 e o de agosto de 2026, e o nominal de 9,48% do mesmo mês.",
      },
    ],
    frequency: fiscalNoteFrequency,
    screens: [deficitScreen, debtScreen],
  },

  "nominal-interest": {
    title: "Juros nominais",
    topic: "public-accounts",
    summary: "O custo da dívida pública num período, em % do PIB.",
    lead: (
      <>
        Os juros nominais são o custo da dívida pública no período: o quanto o setor público passa a
        dever a mais só por estar devendo. São a maior parte do déficit brasileiro.
      </>
    ),
    keywords: ["juros da dívida", "custo da dívida", "despesa com juros", "selic"],
    measures: (
      <p>
        Os juros sobre a dívida interna e a externa, com a correção pela inflação. Crescem com a
        Selic, porque boa parte da dívida é corrigida por ela, e com o tamanho da dívida.
      </p>
    ),
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <>
          <p>
            Nos 12 meses até agosto de 2026, os juros foram de <strong>8,86% do PIB</strong>, contra
            um déficit nominal de 9,48%:
          </p>
          <FormulaBox>
            <Formula
              flushLeft
              tex="\dfrac{8{,}86}{9{,}48} = \mathbf{93{,}5\%}\ \text{do déficit é juro}"
            />
          </FormulaBox>
        </>
      ),
    },
    reading: (
      <p>
        Desde 2002, só em 2020 o primário pesou mais que os juros no déficit. Juro alto por muito
        tempo faz a dívida crescer mesmo quando o governo fecha o orçamento do dia a dia.
      </p>
    ),
    cautions: [
      {
        title: "Competência, e não caixa.",
        text: (
          <>
            O juro entra na conta quando corre, mês a mês, mesmo que o título só seja pago no
            vencimento.
          </>
        ),
      },
    ],
    related: ["nominal-balance", "implicit-rate", "indexer", "nfsp"],
    sources: [
      {
        ...nfspDataset,
        backs:
          "Os juros nominais são apropriados por competência sobre a dívida interna e externa, com a correção monetária, e excluem o efeito do câmbio.",
      },
      {
        ...sgs,
        name: "Banco Central, séries 5760, 5793 e 5727 do SGS",
        backs:
          "Os 8,86% de juros e os 9,48% de nominal até agosto de 2026, e o primário maior que os juros só em dezembro de 2020.",
      },
    ],
    frequency: fiscalNoteFrequency,
    screens: [deficitScreen],
  },

  "nominal-balance": {
    title: "Resultado nominal",
    topic: "public-accounts",
    summary: "O déficit completo: o primário mais os juros da dívida.",
    lead: (
      <>
        O resultado nominal é o déficit completo: o primário mais os juros da dívida. É quanto a
        dívida precisou crescer no período para fechar as contas.
      </>
    ),
    keywords: ["déficit nominal", "nominal", "déficit total"],
    measures: (
      <p>
        A variação da dívida líquida no período, descontados os ajustes que não são déficit, como
        mudanças de método. Junta as duas partes: o que o governo gastou além do que arrecadou e o
        custo da dívida que ele já tinha.
      </p>
    ),
    formula: {
      tex: "\\text{nominal} = \\text{primário} + \\text{juros}",
      legend: [
        {
          symbol: "\\text{primário}",
          text: <>arrecadação menos gastos, sem os juros, em % do PIB</>,
        },
        { symbol: "\\text{juros}", text: <>o custo da dívida no mesmo período, em % do PIB</> },
      ],
    },
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <FormulaBox>
          <Formula flushLeft tex="0{,}62 + 8{,}86 = \mathbf{9{,}48\%}\ \text{do PIB}" />
        </FormulaBox>
      ),
    },
    reading: (
      <p>
        Déficit nominal de 9,48% do PIB quer dizer que, em 12 meses, o setor público precisou de
        dívida nova equivalente a quase um décimo de tudo o que o país produziu.
      </p>
    ),
    cautions: [
      {
        title: "Aqui é soma mesmo.",
        text: (
          <>
            As três partes estão em % do PIB do mesmo período: são pedaços de um mesmo bolo, e não
            taxas de crescimento, que se compõem multiplicando.
          </>
        ),
      },
    ],
    related: ["primary-balance", "nominal-interest", "nfsp", "net-debt"],
    sources: [
      {
        ...nfspDataset,
        backs:
          "O resultado nominal é a variação nominal da dívida líquida, deduzidos os ajustes, e soma o primário e os juros.",
      },
      {
        ...sgs,
        name: "Banco Central, séries 5727, 5793 e 5760 do SGS",
        backs: "Os 9,48%, 0,62% e 8,86% do PIB nos 12 meses até agosto de 2026.",
      },
    ],
    frequency: fiscalNoteFrequency,
    screens: [deficitScreen],
  },

  "net-debt": {
    title: "Dívida líquida do setor público",
    abbr: "DLSP",
    topic: "public-accounts",
    summary: "O que o setor público deve menos o que tem a receber, em % do PIB.",
    lead: (
      <>
        A dívida líquida é tudo o que o setor público deve menos o que ele tem a receber, como as
        reservas internacionais. Inclui o Banco Central e as estatais.
      </>
    ),
    keywords: ["dlsp", "dívida líquida", "dívida pública", "dívida/pib"],
    measures: (
      <p>
        O saldo entre as dívidas e os créditos do governo federal, dos estados, dos municípios, das
        estatais (menos Petrobras e Eletrobras) e do Banco Central. O Banco Central entra porque o
        resultado dele vai automaticamente para o Tesouro. É dela que sai a medida do déficit.
      </p>
    ),
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <p>
          Em agosto de 2026, a dívida líquida era de R$ 9,24 trilhões, ou{" "}
          <strong>69,26% do PIB</strong>.
        </p>
      ),
    },
    reading: (
      <p>
        O que importa é a direção: dívida/PIB subindo quer dizer que a dívida cresce mais rápido que
        a economia que paga por ela. A conta do primário que estabiliza diz quanto falta para ela
        parar.
      </p>
    ),
    cautions: [
      {
        title: "Desconta créditos.",
        text: (
          <>
            Quando um crédito cresce, a líquida cai sem que a bruta mude. As reservas em dólar valem
            mais reais quando o dólar sobe, e isso baixa a dívida líquida.
          </>
        ),
      },
    ],
    related: ["gross-debt", "implicit-rate", "stabilizing-primary", "nfsp"],
    sources: [
      {
        ...dlspDataset,
        backs:
          "A dívida líquida é o saldo entre dívidas e créditos do setor público não financeiro e do Banco Central, que entra por transferir o resultado ao Tesouro, e é a base do déficit abaixo da linha.",
      },
      {
        ...sgs,
        name: "Banco Central, séries 4513 e 4478 do SGS",
        backs: "Os 69,26% do PIB e os R$ 9,24 trilhões de agosto de 2026.",
      },
    ],
    frequency: fiscalNoteFrequency,
    screens: [debtScreen],
  },

  "gross-debt": {
    title: "Dívida bruta do governo geral",
    abbr: "DBGG",
    topic: "public-accounts",
    summary: "Tudo o que os governos devem, sem descontar o que têm a receber, em % do PIB.",
    lead: (
      <>
        A dívida bruta soma tudo o que os governos federal, estaduais e municipais devem, sem
        descontar o que têm a receber. Inclui as operações compromissadas do Banco Central e deixa
        de fora as estatais.
      </>
    ),
    keywords: ["dbgg", "dívida bruta", "dívida pública", "compromissadas"],
    measures: (
      <p>
        As dívidas dos três níveis de governo com o setor privado, com os bancos públicos e com o
        exterior, pelo valor cheio. Entram também as operações compromissadas, em que o Banco
        Central vende títulos do Tesouro com a promessa de recomprá-los, para tirar dinheiro de
        circulação: segundo o Banco Central, elas têm estreita relação com a dívida do Tesouro.
      </p>
    ),
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <>
          <p>
            Em agosto de 2026, a dívida bruta era de <strong>82,86% do PIB</strong>, contra 69,26%
            da líquida:
          </p>
          <FormulaBox>
            <Formula flushLeft tex="82{,}86 - 69{,}26 = \mathbf{13{,}60}\ \text{pontos do PIB}" />
          </FormulaBox>
        </>
      ),
    },
    reading: (
      <p>
        A bruta mostra quanto os governos devem a terceiros; a líquida, quanto o setor público deve
        depois de descontar o que tem a receber. As duas subindo juntas é o sinal mais claro de
        dívida em alta.
      </p>
    ),
    cautions: [
      {
        title: "Abrangência diferente da líquida.",
        text: (
          <>
            A bruta não tem as estatais nem o Banco Central, a não ser pelas compromissadas. A
            diferença entre as duas não é só o que o governo tem a receber.
          </>
        ),
      },
    ],
    related: ["net-debt", "federal-debt", "rollover"],
    sources: [
      {
        ...dbggDataset,
        backs:
          "Quem a dívida bruta abrange, a inclusão das compromissadas do Banco Central pela estreita relação com a dívida do Tesouro e a exclusão das estatais.",
      },
      {
        ...sgs,
        name: "Banco Central, séries 13762 e 4513 do SGS",
        backs: "Os 82,86% e os 69,26% do PIB de agosto de 2026.",
      },
    ],
    frequency: fiscalNoteFrequency,
    screens: [debtScreen, healthScreen],
  },

  "implicit-rate": {
    title: "Juro implícito da dívida",
    abbr: "r",
    topic: "public-accounts",
    summary: "A taxa média que a dívida líquida pagou em 12 meses: juros divididos pela dívida.",
    lead: (
      <>
        O juro implícito é a taxa média que a dívida líquida pagou nos últimos 12 meses: os juros do
        período divididos pela dívida média. É o r da conta r − g.
      </>
    ),
    keywords: ["r", "taxa implícita", "custo médio", "juro médio da dívida"],
    measures: (
      <p>
        Quanto custou, em média, cada real de dívida líquida no ano. Junta todos os títulos e
        contratos, cada um com o seu juro, numa taxa só.
      </p>
    ),
    formula: {
      tex: "r = \\dfrac{j \\times \\text{PIB}_{12m}}{\\bar{D}}",
      legend: [
        { symbol: "j", text: <>juros nominais de 12 meses, em fração do PIB</> },
        { symbol: "\\text{PIB}_{12m}", text: <>o PIB dos mesmos 12 meses, em reais</> },
        {
          symbol: "\\bar{D}",
          text: <>a média da dívida líquida em reais no fim de cada um dos 12 meses</>,
        },
      ],
    },
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <>
          <p>
            Juros de 8,86% de um PIB de R$ 13,34 trilhões, sobre uma dívida média de R$ 8,61
            trilhões de setembro de 2025 a agosto de 2026:
          </p>
          <FormulaBox>
            <Formula
              flushLeft
              tex="r = \dfrac{0{,}0886 \times 13{,}34}{8{,}61} = \dfrac{1{,}18}{8{,}61} = \mathbf{13{,}74\%}"
            />
          </FormulaBox>
        </>
      ),
    },
    reading: (
      <p>
        Sozinho ele diz quanto a dívida custa; o que decide a trajetória é compará-lo com o
        crescimento do PIB nominal, o g.
      </p>
    ),
    cautions: [
      {
        title: "Conta do app.",
        text: (
          <>
            O Banco Central não publica essa taxa pronta. O app a calcula com as séries de juros
            (5760), do PIB de 12 meses (4382) e da dívida líquida em reais (4478).
          </>
        ),
      },
    ],
    related: ["r-minus-g", "nominal-gdp-growth", "nominal-interest", "net-debt"],
    sources: [
      {
        ...nfspDataset,
        backs: "Os juros nominais são o fluxo de juros sobre a dívida, em % do PIB de 12 meses.",
      },
      {
        ...sgs,
        name: "Banco Central, séries 5760, 4382 e 4478 do SGS",
        backs:
          "Os juros de 8,86% do PIB, o PIB de 12 meses de R$ 13,34 trilhões e a dívida líquida de cada mês de setembro de 2025 a agosto de 2026.",
      },
    ],
    frequency: fiscalNoteFrequency,
    screens: [debtScreen],
  },

  "nominal-gdp-growth": {
    title: "Crescimento do PIB nominal",
    abbr: "g",
    topic: "public-accounts",
    summary: "Quanto o PIB em reais correntes cresceu em 12 meses, inflação inclusive.",
    lead: (
      <>
        O crescimento nominal é quanto o PIB em reais correntes cresceu em 12 meses, somando o
        crescimento de verdade e a inflação. É o g da conta r − g.
      </>
    ),
    keywords: ["g", "pib nominal", "crescimento", "pib em reais"],
    measures: (
      <p>
        O PIB dos últimos 12 meses contra o dos 12 meses anteriores, nos preços de cada época. A
        dívida está em reais correntes, e por isso se compara com o PIB em reais correntes.
      </p>
    ),
    formula: {
      tex: "g = \\dfrac{\\text{PIB}_{12m,\\,t}}{\\text{PIB}_{12m,\\,t-12}} - 1",
      legend: [
        { symbol: "\\text{PIB}_{12m,\\,t}", text: <>o PIB dos 12 meses até o mês t, em reais</> },
        { symbol: "t - 12", text: <>o mesmo mês, um ano antes</> },
      ],
    },
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <FormulaBox>
          <Formula flushLeft tex="g = \dfrac{13{,}34}{12{,}44} - 1 = \mathbf{7{,}23\%}" />
        </FormulaBox>
      ),
    },
    reading: (
      <p>
        Inflação alta empurra o g para cima e ajuda a dívida/PIB a cair: em dezembro de 2021 o PIB
        nominal crescia 18,4% em 12 meses, contra um juro implícito de 9,4%.
      </p>
    ),
    cautions: [
      {
        title: "Nominal, e não real.",
        text: (
          <>
            Os 7,23% incluem a inflação. O crescimento real, que é o que aparece no noticiário, é
            bem menor.
          </>
        ),
      },
    ],
    related: ["r-minus-g", "implicit-rate", "share-of-gdp"],
    sources: [
      {
        ...sgs,
        name: "Banco Central, série 4382 do SGS (PIB de 12 meses em reais correntes)",
        backs:
          "O PIB de R$ 13,34 trilhões até agosto de 2026 e de R$ 12,44 trilhões até agosto de 2025, e o de dezembro de 2020 e de 2021.",
      },
      {
        ...sgs,
        name: "Banco Central, séries 5760 e 4478 do SGS",
        backs: "O juro implícito de 9,4% em dezembro de 2021.",
      },
    ],
    frequency: fiscalNoteFrequency,
    screens: [debtScreen],
  },

  "r-minus-g": {
    title: "r − g",
    topic: "public-accounts",
    summary:
      "O juro da dívida menos o crescimento da economia: se positivo, a dívida/PIB sobe sozinha.",
    lead: (
      <>
        r − g é o juro médio da dívida menos o crescimento do PIB nominal. Positivo, a dívida/PIB
        sobe sozinha mesmo com o primário zerado; negativo, ela encolhe sozinha.
      </>
    ),
    keywords: ["r menos g", "dinâmica da dívida", "sustentabilidade", "bola de neve"],
    measures: (
      <p>
        A dívida cresce todo ano pelo juro, e o PIB, que é quem paga, cresce pelo g. A dívida/PIB do
        ano seguinte é a de hoje multiplicada pela razão entre os dois fatores, menos o primário
        feito no ano.
      </p>
    ),
    formula: {
      tex: "d_{t+1} = d_t \\times \\dfrac{1 + r}{1 + g} - p",
      legend: [
        { symbol: "d_t", text: <>dívida/PIB no ano t, em fração</> },
        { symbol: "r", text: <>juro implícito da dívida</> },
        { symbol: "g", text: <>crescimento do PIB nominal</> },
        { symbol: "p", text: <>superávit primário do ano, em fração do PIB</> },
      ],
    },
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <>
          <p>r de 13,74% contra g de 7,23%:</p>
          <FormulaBox>
            <Formula flushLeft tex="r - g = 13{,}74 - 7{,}23 = \mathbf{+6{,}51}\ \text{p.p.}" />
            <Formula
              flushLeft
              tex="\dfrac{1{,}1374}{1{,}0723} - 1 = 6{,}07\%\ \text{de alta da dívida/PIB num ano, sem primário}"
            />
          </FormulaBox>
        </>
      ),
    },
    reading: (
      <p>
        Com r acima de g, só superávit primário segura a dívida/PIB. Em 2021 a inflação alta fez g
        passar r, e a dívida líquida caiu de 61,4% para 55,1% do PIB em um ano.
      </p>
    ),
    cautions: [
      {
        title: "A diferença é um atalho.",
        text: (
          <>
            r − g em pontos percentuais é o jeito curto de falar. A conta exata divide os fatores,
            (1 + r) ÷ (1 + g) − 1, e dá um pouco menos: 6,07% contra 6,51 pontos.
          </>
        ),
      },
    ],
    related: ["implicit-rate", "nominal-gdp-growth", "stabilizing-primary", "net-debt"],
    sources: [
      {
        ...sgs,
        name: "Banco Central, séries 5760, 4382, 4478 e 4513 do SGS",
        backs:
          "O r de 13,74% e o g de 7,23% de agosto de 2026, e a dívida líquida de 61,37% e 55,11% do PIB em dezembro de 2020 e de 2021.",
      },
    ],
    frequency: fiscalNoteFrequency,
    screens: [debtScreen],
  },

  "stabilizing-primary": {
    title: "Primário que estabiliza a dívida",
    abbr: "p*",
    topic: "public-accounts",
    summary: "O superávit primário que deixaria a dívida/PIB parada.",
    lead: (
      <>
        É o superávit primário, em % do PIB, que deixa a dívida/PIB igual de um ano para o outro. Se
        o governo faz menos que isso, a dívida/PIB sobe.
      </>
    ),
    keywords: ["p*", "primário necessário", "estabilizar a dívida", "superávit necessário"],
    measures: (
      <p>
        Quanto o governo precisa economizar, antes dos juros, para que a dívida cresça no mesmo
        ritmo que a economia. Sai da conta de r − g, igualando a dívida/PIB dos dois anos.
      </p>
    ),
    formula: {
      tex: "p^* = d \\times \\dfrac{r - g}{1 + g}",
      legend: [
        { symbol: "p^*", text: <>primário que estabiliza, em fração do PIB</> },
        { symbol: "d", text: <>dívida líquida em fração do PIB</> },
        { symbol: "r", text: <>juro implícito da dívida</> },
        { symbol: "g", text: <>crescimento do PIB nominal</> },
      ],
    },
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <>
          <FormulaBox>
            <Formula
              flushLeft
              tex="p^* = 0{,}6926 \times \dfrac{0{,}1374 - 0{,}0723}{1{,}0723} = \mathbf{4{,}20\%}\ \text{do PIB}"
            />
          </FormulaBox>
          <p>
            O feito foi um déficit primário de 0,62% do PIB: faltam 4,82 pontos do PIB por ano para
            a dívida/PIB parar de subir.
          </p>
        </>
      ),
    },
    reading: (
      <p>
        Com dívida de 80% do PIB, r de 10% e g de 7%, seriam 0,8 × 0,03 ÷ 1,07 = 2,24% do PIB.
        Quanto maior a dívida e o r − g, maior o esforço.
      </p>
    ),
    cautions: [
      {
        title: "Observado, e não projetado.",
        text: (
          <>
            A conta usa o r e o g dos últimos 12 meses. As projeções oficiais usam o juro e o
            crescimento esperados para os próximos anos, e chegam a outros números.
          </>
        ),
      },
      {
        title: "Sobre a dívida líquida.",
        text: <>Com a dívida bruta, o d e o r mudam, e o p* também.</>,
      },
    ],
    related: ["r-minus-g", "primary-balance", "net-debt", "implicit-rate"],
    sources: [
      {
        ...sgs,
        name: "Banco Central, séries 4513, 5760, 4382, 4478 e 5793 do SGS",
        backs:
          "A dívida líquida de 69,26% do PIB, o r e o g de agosto de 2026 e o déficit primário de 0,62% do PIB.",
      },
    ],
    frequency: fiscalNoteFrequency,
    screens: [debtScreen, healthScreen],
  },

  "federal-debt": {
    title: "Dívida pública federal",
    abbr: "DPF",
    topic: "public-accounts",
    summary: "A dívida do Tesouro Nacional: títulos e contratos, no Brasil e no exterior.",
    lead: (
      <>
        A dívida pública federal é a dívida do Tesouro Nacional: os títulos vendidos no Brasil e no
        exterior e os contratos com bancos e organismos internacionais. Em julho de 2026 eram R$
        9,29 trilhões.
      </>
    ),
    keywords: ["dpf", "dpmfi", "dpfe", "títulos públicos", "tesouro", "dívida mobiliária"],
    measures: (
      <>
        <p>
          Tem duas partes: a dívida mobiliária interna (DPMFi), que são os títulos em reais, e a
          externa (DPFe). Conta os títulos com bancos, fundos, previdência e estrangeiros, que é a
          dívida em mercado.
        </p>
        <p>
          É um terceiro recorte, ao lado da líquida e da bruta: só o governo federal, sem estados
          nem municípios, e só o que o Tesouro emitiu.
        </p>
      </>
    ),
    example: {
      title: "Com os números de julho de 2026",
      content: (
        <p>
          Em julho de 2026, a DPF era de R$ 9.288,78 bilhões: R$ 8.948,72 bilhões de dívida interna
          e R$ 340,06 bilhões de externa.
        </p>
      ),
    },
    reading: (
      <p>
        Mais que o tamanho, que a dívida líquida e a bruta já medem, a DPF mostra de que a dívida é
        feita: quando vence e a que está atrelada. É isso que decide quanto ela sofre com juro alto
        ou dólar caro.
      </p>
    ),
    cautions: [
      {
        title: "A carteira do Banco Central fica de fora.",
        text: (
          <>
            O Banco Central guarda títulos do Tesouro para controlar o dinheiro em circulação: eram
            24,3% de todos os títulos federais emitidos em julho de 2026. Desde a Lei de
            Responsabilidade Fiscal, ele só compra título direto do Tesouro para trocar os que
            vencem na própria carteira, e não emite mais títulos próprios.
          </>
        ),
      },
    ],
    related: ["indexer", "average-maturity", "rollover", "gross-debt", "central-bank-portfolio"],
    sources: [
      {
        ...rmdJul2026,
        backs: "O estoque de R$ 9.288,78 bilhões em julho de 2026, dividido em DPMFi e DPFe.",
      },
      {
        ...tesouroStock,
        backs:
          "Cada título por carteira, em mercado ou no Banco Central, de onde sai a parte de 24,3% na carteira do Banco Central.",
      },
      {
        ...lrf,
        backs:
          "O artigo 39 limita a compra direta de títulos pelo Banco Central à troca dos que vencem na carteira dele, e o artigo 34 o proíbe de emitir títulos.",
      },
      {
        ...dpmfDataset,
        backs:
          "Os últimos títulos do Banco Central foram resgatados em 2006, pela proibição da lei.",
      },
    ],
    frequency: tesouroFrequency,
    screens: [debtScreen],
  },

  rollover: {
    title: "Rolagem da dívida",
    topic: "public-accounts",
    summary: "Pagar os títulos que vencem com o dinheiro de títulos novos.",
    lead: (
      <>
        Rolar a dívida é pagar os títulos que vencem com o dinheiro de títulos novos. Quanto mais
        vence de uma vez, mais o Tesouro depende das condições do mercado naquele momento.
      </>
    ),
    keywords: ["rolagem", "vencimentos", "refinanciamento", "vence em 12 meses"],
    measures: (
      <p>
        A fatia da dívida que vence logo, normalmente nos 12 meses seguintes. O governo raramente
        paga dívida com dinheiro do orçamento: ele troca o título que vence por outro.
      </p>
    ),
    example: {
      title: "Com os números de julho de 2026",
      content: (
        <p>
          Do principal da dívida federal em mercado em julho de 2026, <strong>16,9%</strong> vence
          até julho de 2027. Contando também os juros que os títulos pagam no caminho, o Tesouro
          chega a 18,91%.
        </p>
      ),
    },
    reading: (
      <p>
        Quanto menor a parte que vence em 12 meses, menos o Tesouro precisa ir ao mercado de uma
        vez. Prazo curto obriga a rolar muito, e é aí que a desconfiança vira crise: quem compra
        pede juro maior para continuar emprestando.
      </p>
    ),
    cautions: [
      {
        title: "Principal, e não fluxo.",
        text: (
          <>
            O app conta o valor de cada título no vencimento, pelo arquivo do Tesouro. O Tesouro
            conta todo pagamento dos próximos 12 meses, juros inclusive, e por isso chega a um
            número maior.
          </>
        ),
      },
    ],
    related: ["average-maturity", "federal-debt", "indexer"],
    sources: [
      {
        ...rmdJul2026,
        backs: "Os 18,91% da DPF que vencem nos 12 meses seguintes a julho de 2026.",
      },
      {
        ...tesouroStock,
        backs: "O vencimento e o valor de cada título, de onde sai o 16,9% do principal.",
      },
    ],
    frequency: tesouroFrequency,
    screens: [debtScreen],
  },

  indexer: {
    title: "Indexador",
    topic: "public-accounts",
    summary: "O que corrige o valor de um título: Selic, inflação, dólar ou nada (prefixado).",
    lead: (
      <>
        O indexador é o que corrige o valor de um título até ele vencer: a Selic, a inflação, o
        dólar, ou nada, no prefixado, que tem a taxa travada no dia da venda.
      </>
    ),
    keywords: [
      "lft",
      "ltn",
      "ntn-b",
      "ntn-f",
      "prefixado",
      "pós-fixado",
      "taxa flutuante",
      "selic",
    ],
    measures: (
      <ul className="list-disc pl-5">
        <li>LFT: corrigida pela Selic (taxa flutuante).</li>
        <li>LTN e NTN-F: prefixadas, com a taxa fixa desde a venda.</li>
        <li>NTN-B: corrigida pelo IPCA, mais um juro fixo.</li>
        <li>NTN-C: corrigida pelo IGP-M.</li>
        <li>Dívida externa: atrelada ao câmbio.</li>
      </ul>
    ),
    example: {
      title: "Com os números de julho de 2026",
      content: (
        <p>
          Em julho de 2026, a dívida federal era 51,11% de taxa flutuante, 26,02% de índice de
          preços, 19,22% de prefixados e 3,65% de câmbio.
        </p>
      ),
    },
    reading: (
      <p>
        Quanto mais Selic, mais rápido uma alta de juros chega ao custo da dívida. O Plano Anual de
        Financiamento de 2026 mira de 49% a 53% em taxa flutuante, de 21% a 25% em índice de preços,
        de 20% a 24% em prefixados e de 3% a 7% em câmbio.
      </p>
    ),
    cautions: [
      {
        title: "IPCA e IGP-M separados.",
        text: (
          <>
            O Tesouro junta os dois em "índice de preços". O app os mostra separados, e o IGP-M é
            menos de 1% da dívida.
          </>
        ),
      },
    ],
    related: ["federal-debt", "nominal-interest", "average-maturity"],
    sources: [
      {
        ...rmdJul2026,
        backs:
          "A composição de julho de 2026 por indexador e as faixas do Plano Anual de Financiamento de 2026.",
      },
      {
        ...tesouroStock,
        backs: "O nome de cada título, de onde sai o indexador dele.",
      },
    ],
    frequency: tesouroFrequency,
    screens: [debtScreen],
  },

  "average-maturity": {
    title: "Prazo médio da dívida",
    topic: "public-accounts",
    summary: "Quanto tempo, em média, falta para a dívida federal ser paga.",
    lead: (
      <>
        O prazo médio diz quanto tempo, em média, falta para a dívida ser paga, pesando cada
        pagamento pelo valor. Prazo mais longo deixa o Tesouro menos exposto a refinanciar tudo num
        momento ruim.
      </>
    ),
    keywords: ["prazo médio", "vencimento", "duração", "perfil da dívida"],
    measures: (
      <p>
        Cada pagamento que a dívida ainda vai fazer, o principal e os juros do caminho, pesa pelo
        valor dele. Um prazo médio de 4 anos quer dizer que, em média, o Tesouro troca a dívida
        inteira a cada 4 anos.
      </p>
    ),
    example: {
      title: "Com os números de julho de 2026",
      content: (
        <p>
          Em julho de 2026, o prazo médio da dívida federal era de 4,05 anos, e o da dívida interna,
          de 3,94 anos. A série do Banco Central dava 47,40 meses, os mesmos 3,95 anos, e passou a
          47,99 meses em agosto.
        </p>
      ),
    },
    reading: (
      <p>
        Mais longo é melhor. O Plano Anual de Financiamento de 2026 mira um prazo médio da dívida
        federal entre 3,8 e 4,2 anos.
      </p>
    ),
    cautions: [
      {
        title: "Conta os juros do caminho.",
        text: (
          <>
            Pela data final de cada título, sem os juros pagos antes, a conta com o arquivo do
            Tesouro dá 5,35 anos em julho de 2026. A medida oficial pesa também os cupons e chega a
            menos.
          </>
        ),
      },
    ],
    related: ["rollover", "federal-debt", "indexer"],
    sources: [
      {
        ...rmdJul2026,
        backs:
          "O prazo médio de 4,05 anos da DPF e de 3,94 anos da DPMFi em julho de 2026, e a faixa de 3,8 a 4,2 anos do Plano Anual de Financiamento.",
      },
      {
        ...dpmfDataset,
        backs:
          "O prazo médio dos títulos do Tesouro, de 47,40 meses em julho e 47,99 em agosto de 2026.",
      },
      {
        ...tesouroStock,
        backs: "O vencimento e o valor de cada título, de onde sai a conta de 5,35 anos.",
      },
    ],
    frequency: fiscalNoteFrequency,
    screens: [debtScreen],
  },

  "central-bank-portfolio": {
    title: "Carteira do Banco Central",
    topic: "public-accounts",
    summary: "Os títulos do Tesouro que ficam com o Banco Central, para ele regular o dinheiro.",
    lead: (
      <>
        O Banco Central guarda títulos do Tesouro para controlar quanto dinheiro circula entre os
        bancos. Em julho de 2026, eram 24,3% de todos os títulos federais emitidos. Esses títulos
        não são empréstimo do Banco Central ao governo: a Constituição proíbe esse empréstimo.
      </>
    ),
    keywords: [
      "carteira do bc",
      "títulos no banco central",
      "financiamento monetário",
      "lei 11.803",
    ],
    measures: (
      <>
        <p>
          O valor, no fim do mês, dos títulos do Tesouro que estão com o Banco Central. O Tesouro
          entrega esses títulos direto ao Banco Central, sem receber dinheiro em troca, para que ele
          tenha uma carteira do tamanho certo para a política monetária. Quando um título da
          carteira vence, o Banco Central pode comprar outro do Tesouro no lugar dele.
        </p>
        <p>
          Com esses títulos, o Banco Central faz as compromissadas: empresta os títulos aos bancos e
          recolhe o dinheiro que sobra entre eles, para a Selic ficar na meta.
        </p>
      </>
    ),
    formula: {
      tex: "\\text{carteira em \\% do PIB} = \\frac{\\text{títulos na carteira do BC}}{\\text{PIB de 12 meses}}",
      legend: [
        { symbol: "\\text{títulos na carteira do BC}", text: <>em R$, no fim do mês</> },
        {
          symbol: "\\text{PIB de 12 meses}",
          text: <>em R$, a soma dos 12 meses até o mesmo mês</>,
        },
      ],
    },
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <>
          <p>
            Em agosto de 2026, a carteira tinha R$ 2.929,82 bilhões em títulos, contra um PIB de 12
            meses de R$ 13.342,45 bilhões:
          </p>
          <FormulaBox>
            <Formula
              flushLeft
              tex="\frac{2.929{,}82}{13.342{,}45} = \mathbf{21{,}96\%}\ \text{do PIB}"
            />
          </FormulaBox>
          <p>
            Pelo arquivo do Tesouro, a carteira era 24,3% de todos os títulos federais emitidos em
            julho de 2026.
          </p>
        </>
      ),
    },
    reading: (
      <p>
        Uma carteira grande não quer dizer que o Banco Central financia o governo: quase metade dela
        está emprestada aos bancos nas compromissadas. O sinal de financiamento seria a base
        monetária crescer mais rápido que a economia.
      </p>
    ),
    cautions: [
      {
        title: "O Banco Central não compra título novo para financiar o Tesouro.",
        text: (
          <>
            A Lei de Responsabilidade Fiscal proíbe a compra de título no lançamento. A exceção é
            trocar os títulos que vencem na carteira do Banco Central por novos.
          </>
        ),
      },
    ],
    related: ["repo-operations", "monetary-base", "federal-debt"],
    sources: [
      {
        ...sgs4152,
        backs: "Os R$ 2.929,82 bilhões de títulos na carteira do Banco Central em agosto de 2026.",
      },
      {
        ...sgs,
        name: "Banco Central, série 4382 do SGS",
        backs: "O PIB de 12 meses de R$ 13.342,45 bilhões em agosto de 2026.",
      },
      {
        ...tesouroStock,
        backs:
          "A parte de 24,3% de todos os títulos federais emitidos na carteira do Banco Central em julho de 2026.",
      },
      {
        ...law10179,
        backs:
          "O Tesouro entrega títulos direto ao Banco Central, sem contrapartida financeira, para a carteira da política monetária (art. 1º, IX, e art. 3º, VIII, incluídos pela Lei 11.803/2008).",
      },
      {
        ...constitution,
        backs: "O Banco Central não pode emprestar ao Tesouro (art. 164, § 1º).",
      },
      {
        ...lrf,
        backs:
          "O Banco Central não compra título no lançamento, a não ser para trocar os que vencem na carteira dele (art. 39, I e § 2º).",
      },
    ],
    frequency: fiscalNoteFrequency,
    screens: [deficitScreen],
  },

  "repo-operations": {
    title: "Operações compromissadas",
    topic: "public-accounts",
    summary: "O Banco Central empresta títulos aos bancos para recolher o dinheiro que sobra.",
    lead: (
      <>
        Na compromissada, o Banco Central vende aos bancos um título da carteira dele com a promessa
        de recomprá-lo depois. Com isso, ele recolhe o dinheiro que sobra nos bancos e mantém a
        Selic na meta. Em agosto de 2026, eram R$ 1,37 trilhão.
      </>
    ),
    keywords: ["compromissadas", "mercado aberto", "liquidez", "recompra"],
    measures: (
      <p>
        O valor, no fim do mês, dos títulos da carteira do Banco Central que estão com o mercado por
        compromissadas. Sem elas, o dinheiro que sobra nos bancos faria o juro de um dia cair abaixo
        da meta. A Constituição autoriza o Banco Central a comprar e vender títulos do Tesouro para
        regular a moeda e os juros.
      </p>
    ),
    formula: {
      tex: "\\text{parte da carteira} = \\frac{\\text{compromissadas}}{\\text{títulos na carteira do BC}}",
      legend: [
        { symbol: "\\text{compromissadas}", text: <>em R$, no fim do mês</> },
        { symbol: "\\text{títulos na carteira do BC}", text: <>em R$, no fim do mesmo mês</> },
      ],
    },
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <>
          <p>
            Em agosto de 2026, as compromissadas eram de R$ 1.372,24 bilhões, contra R$ 2.929,82
            bilhões de títulos na carteira do Banco Central:
          </p>
          <FormulaBox>
            <Formula flushLeft tex="\frac{1.372{,}24}{2.929{,}82} = \mathbf{46{,}84\%}" />
          </FormulaBox>
          <p>Contra o PIB de 12 meses, as compromissadas eram 10,28% do PIB.</p>
        </>
      ),
    },
    reading: (
      <p>
        É gestão do dinheiro entre os bancos, e não financiamento do governo. A parte da carteira
        nas compromissadas mostra quanto dos títulos do Banco Central voltou ao mercado para segurar
        a Selic.
      </p>
    ),
    cautions: [
      {
        title: "Entra na dívida bruta.",
        text: (
          <>
            As compromissadas fazem parte da dívida bruta do governo geral: são títulos do Tesouro
            nas mãos do mercado, mesmo que tenham saído da carteira do Banco Central.
          </>
        ),
      },
    ],
    related: ["central-bank-portfolio", "selic", "gross-debt"],
    sources: [
      {
        ...sgs1832,
        backs:
          "Os R$ 1.372,24 bilhões de títulos do Tesouro em compromissadas em agosto de 2026, o financiamento líquido da base ampliada.",
      },
      {
        ...sgs4152,
        backs: "Os R$ 2.929,82 bilhões de títulos na carteira do Banco Central em agosto de 2026.",
      },
      {
        ...constitution,
        backs:
          "O Banco Central pode comprar e vender títulos do Tesouro para regular a oferta de moeda ou a taxa de juros (art. 164, § 2º).",
      },
      {
        ...dbggDataset,
        backs: "A dívida bruta inclui as compromissadas do Banco Central.",
      },
    ],
    frequency: monetaryNoteFrequency,
    screens: [deficitScreen],
  },

  "monetary-base": {
    title: "Base monetária",
    topic: "public-accounts",
    summary: "Todo o dinheiro que o Banco Central criou: papel-moeda e reservas dos bancos.",
    lead: (
      <>
        A base monetária é o dinheiro que o Banco Central criou: as cédulas e moedas em circulação e
        as reservas que os bancos deixam nele. Em % do PIB, mostra se o dinheiro cresce mais rápido
        que a economia. Em agosto de 2026, era 3,24% do PIB.
      </>
    ),
    keywords: [
      "base monetária",
      "emissão de moeda",
      "papel-moeda",
      "reservas bancárias",
      "imprimir dinheiro",
    ],
    measures: (
      <p>
        O papel-moeda emitido mais as reservas bancárias, no fim do mês. O Banco Central chama a
        base de emissão primária de moeda: é o que cresce quando ele cria dinheiro. Em reais, ela
        sobe com a economia, e por isso a régua é o PIB.
      </p>
    ),
    formula: {
      tex: "\\text{base em \\% do PIB} = \\frac{\\text{base monetária}}{\\text{PIB de 12 meses}}",
      legend: [
        { symbol: "\\text{base monetária}", text: <>em R$, no fim do mês</> },
        {
          symbol: "\\text{PIB de 12 meses}",
          text: <>em R$, a soma dos 12 meses até o mesmo mês</>,
        },
      ],
    },
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <>
          <p>
            Em agosto de 2026, a base era de R$ 432,66 bilhões, contra um PIB de 12 meses de R$
            13.342,45 bilhões:
          </p>
          <FormulaBox>
            <Formula
              flushLeft
              tex="\frac{432{,}66}{13.342{,}45} = \mathbf{3{,}24\%}\ \text{do PIB}"
            />
          </FormulaBox>
          <p>Em dezembro de 2002, era 4,92% do PIB.</p>
        </>
      ),
    },
    reading: (
      <p>
        Se o Banco Central pagasse as contas do governo com dinheiro novo, a base subiria em % do
        PIB junto com o déficit. Desde 2002, ela ficou entre 3% e 6% do PIB, e em agosto de 2026
        estava no ponto mais baixo da série.
      </p>
    ),
    cautions: [
      {
        title: "Pula em crise e com regra nova.",
        text: (
          <>
            A base muda também quando as pessoas guardam mais dinheiro vivo ou quando o Banco
            Central muda o depósito que os bancos são obrigados a deixar nele. Um pulo isolado, como
            o de 2020, não é emissão para o governo.
          </>
        ),
      },
    ],
    related: ["central-bank-portfolio", "repo-operations", "share-of-gdp"],
    sources: [
      {
        ...sgs1788,
        backs:
          "A base como passivo monetário do Banco Central, a emissão primária de moeda, com a moeda em circulação e as reservas bancárias; os R$ 432,66 bilhões de agosto de 2026 e os R$ 73,30 bilhões de dezembro de 2002.",
      },
      {
        ...sgs,
        name: "Banco Central, série 4382 do SGS",
        backs:
          "O PIB de 12 meses de R$ 13.342,45 bilhões em agosto de 2026 e de R$ 1.488,79 bilhões em dezembro de 2002.",
      },
    ],
    frequency: monetaryNoteFrequency,
    screens: [deficitScreen],
  },

  "focus-survey": {
    title: "Pesquisa Focus",
    abbr: "Focus",
    topic: "expectations",
    summary:
      "O que bancos, gestoras e consultorias esperam para a economia, perguntado pelo Banco Central.",
    lead: (
      <>
        A pesquisa Focus é o levantamento em que o Banco Central reúne as previsões de cerca de 140
        instituições do mercado (bancos, gestoras, consultorias) para inflação, juros, câmbio, PIB e
        contas públicas. O número publicado é a mediana dessas previsões.
      </>
    ),
    keywords: ["focus", "expectativas", "previsão", "mercado", "relatório de mercado", "projeção"],
    measures: (
      <p>
        Cada instituição informa ao Banco Central o que espera para cada indicador e pode atualizar
        a previsão a qualquer dia. Toda segunda-feira sai o Relatório de Mercado com a mediana das
        previsões informadas nos 30 dias até a sexta anterior. A pesquisa também publica a mediana
        dos últimos 5 dias úteis, que reage mais rápido mas junta menos respostas.
      </p>
    ),
    example: {
      title: "Com a pesquisa de 2 de outubro de 2026",
      content: (
        <p>
          A mediana do IPCA de 2026 foi <strong>5,01%</strong>, com 144 instituições respondendo;
          uma semana antes era 4,99%, e quatro semanas antes, 5,00%. A da Selic no fim de 2026 foi
          13,50%, com 139 respostas.
        </p>
      ),
    },
    reading: (
      <p>
        A pesquisa diz o que o mercado espera, não o que vai acontecer. O mais útil é a direção:
        previsão de inflação subindo semana após semana mostra que o mercado vê mais pressão de
        preços do que via antes.
      </p>
    ),
    cautions: [
      {
        title: "A previsão erra, e muito.",
        text: (
          <>
            Em janeiro de 2022, a mediana para o IPCA de 2026 era 3,00%, com 19 instituições
            respondendo. Na pesquisa de 2 de outubro de 2026, com o ano quase todo já medido, era
            5,01%.
          </>
        ),
      },
      {
        title: "O sinal das contas públicas é outro.",
        text: (
          <>
            O Focus pergunta o resultado do governo, em que negativo é déficit. As telas de contas
            públicas usam a necessidade de financiamento, em que positivo é déficit.
          </>
        ),
      },
    ],
    related: ["median", "unanchored-expectations", "inflation-target"],
    sources: [
      {
        ...focusPage,
        backs: "O que a pesquisa é, quem responde e a publicação do relatório toda segunda-feira.",
      },
      {
        ...focusReport,
        backs:
          "As medianas do IPCA de 2026 (5,01%, 4,99% e 5,00%) e da Selic de fim de 2026 (13,50%), com o número de respondentes nos 30 dias e nos 5 dias úteis.",
      },
      {
        ...focusData,
        backs:
          "A previsão de cada pesquisa desde 1999, incluindo os 3,00% para o IPCA de 2026 em janeiro de 2022.",
      },
    ],
    frequency: focusFrequency,
    screens: [focusScreen, healthScreen],
  },

  median: {
    title: "Mediana",
    topic: "expectations",
    summary: "O valor do meio de uma lista ordenada: metade fica acima, metade abaixo.",
    lead: (
      <>
        A mediana é o valor do meio quando as respostas são postas em ordem: metade das instituições
        espera mais que ela, metade espera menos. Uma previsão muito fora da curva não a puxa, como
        puxaria a média.
      </>
    ),
    keywords: ["mediana", "média", "valor do meio", "estatística"],
    measures: (
      <p>
        Com as previsões em ordem, a mediana é a do meio; com um número par delas, é a média das
        duas do meio. Ela diz o que a instituição típica espera.
      </p>
    ),
    example: {
      title: "Cinco previsões de IPCA",
      content: (
        <p>
          Se cinco instituições preveem 4,8%, 4,9%, 5,0%, 5,1% e 7,0%, a mediana é{" "}
          <strong>5,0%</strong>, a do meio. A média é 5,36%: a previsão de 7,0% sozinha a puxou para
          cima. Na pesquisa de 2 de outubro de 2026, as 144 previsões do IPCA de 2026 iam de 4,34% a
          5,90%, com mediana de 5,01% e média de 5,00%.
        </p>
      ),
    },
    reading: (
      <p>
        Mediana e média perto uma da outra quer dizer que as previsões estão bem distribuídas em
        volta do centro. Quando se afastam, há instituições muito longe das outras de um lado só.
      </p>
    ),
    related: ["focus-survey"],
    sources: [
      {
        ...focusData,
        backs:
          "A mediana, a média, a menor e a maior previsão do IPCA de 2026 na pesquisa de 2 de outubro de 2026.",
      },
    ],
    screens: [focusScreen],
  },

  "unanchored-expectations": {
    title: "Expectativa desancorada",
    topic: "expectations",
    summary: "Quando o mercado espera inflação longe da meta, mesmo para daqui a alguns anos.",
    lead: (
      <>
        A expectativa está desancorada quando o mercado espera inflação longe da meta não só para
        este ano, mas também para os seguintes. É sinal de que ele duvida que o Banco Central vá
        trazer a inflação de volta ao centro.
      </>
    ),
    keywords: ["desancoragem", "ancoragem", "expectativas", "credibilidade", "meta"],
    measures: (
      <p>
        Este ano pode estar fora da meta por um choque, como uma seca que encarece alimentos. O que
        mede a confiança no Banco Central é a previsão para dois ou três anos à frente, quando o
        choque já passou e a política de juros já teve tempo de agir.
      </p>
    ),
    example: {
      title: "Com a pesquisa de 2 de outubro de 2026",
      content: (
        <p>
          Com a meta em 3%, a mediana do IPCA era 5,01% para 2026, 4,30% para 2027, 3,80% para 2028
          e 3,51% para 2029. Mesmo três anos à frente, o mercado esperava inflação acima do centro.
        </p>
      ),
    },
    reading: (
      <p>
        Ancorada é a previsão dos anos à frente perto da meta. Quanto mais longe, mais alto o juro
        que o Banco Central precisa manter para convencer o mercado, porque quem espera inflação
        alta já reajusta preços e salários contando com ela.
      </p>
    ),
    related: ["focus-survey", "inflation-target"],
    sources: [
      {
        ...focusReport,
        backs: "A mediana do IPCA de 2026 a 2029 (5,01%, 4,30%, 3,80% e 3,51%).",
      },
      {
        ...bcbTarget,
        backs: "A meta contínua de 3% perseguida pelo Banco Central.",
      },
    ],
    frequency: focusFrequency,
    screens: [focusScreen, inflationScreen],
  },

  gdp: {
    title: "PIB",
    abbr: "IBGE",
    topic: "activity",
    summary: "Tudo o que o país produz, descontada a inflação, medido pelo IBGE por trimestre.",
    lead: (
      <>
        O <strong>PIB</strong> é tudo o que o país produz num período, em bens e serviços,
        descontada a inflação. O IBGE publica por trimestre, uns dois meses depois do fim dele, e é
        o número oficial do crescimento.
      </>
    ),
    keywords: ["produto interno bruto", "crescimento", "recessão", "contas nacionais", "economia"],
    measures: (
      <>
        <p>
          O valor de tudo o que foi produzido no país, medido em quantidade, e não em reais: o IBGE
          calcula o PIB em volume, a preços de um ano fixo, para que a inflação não pareça
          crescimento.
        </p>
        <p>
          A tela usa a taxa acumulada em 4 trimestres, que compara os 4 últimos trimestres com os 4
          anteriores. Assim a safra, o Natal e as outras oscilações do ano entram dos dois lados da
          conta.
        </p>
      </>
    ),
    formula: {
      tex: "\\text{PIB em 4 trimestres} = \\dfrac{\\text{volume dos últimos 4 trimestres}}{\\text{volume dos 4 trimestres anteriores}} - 1",
      legend: [
        {
          symbol: "\\text{volume}",
          text: <>o PIB em quantidade, a preços de um ano fixo, sem a inflação</>,
        },
      ],
    },
    example: {
      title: "Com o 2º trimestre de 2026",
      content: (
        <>
          <p>
            Os 4 trimestres de julho de 2025 a junho de 2026 produziram 1,9% a mais que os de julho
            de 2024 a junho de 2025. Com os 4 anteriores valendo 100, os últimos valem 101,9:
          </p>
          <FormulaBox>
            <Formula flushLeft tex="\dfrac{101{,}9}{100} - 1 = \mathbf{1{,}9\%}" />
          </FormulaBox>
        </>
      ),
    },
    reading: (
      <p>
        Positivo, o país produziu mais que um ano antes; negativo, menos. Não há número oficial de
        bom: o que a série conta é o ritmo. Em 4 trimestres, o PIB cresceu 3,6% até o 1º trimestre
        de 2025, 2,0% até o 1º de 2026 e 1,9% até o 2º de 2026, um ritmo que vem desacelerando.
      </p>
    ),
    cautions: [
      {
        title: "O número do noticiário é outro.",
        text: (
          <>
            A manchete do IBGE traz a variação contra o trimestre anterior (0,5% no 2º trimestre de
            2026). A tela mostra os 4 trimestres, que é o ritmo de um ano inteiro.
          </>
        ),
      },
      {
        title: "O PIB é revisado.",
        text: (
          <>
            O IBGE refaz os trimestres passados quando chegam dados melhores, por isso a série
            baixada hoje pode diferir um pouco da publicada antes.
          </>
        ),
      },
    ],
    related: ["ibc-br", "real-growth", "nominal-gdp-growth", "share-of-gdp"],
    sources: [
      {
        ...ibgeGdpRelease,
        backs:
          "O PIB acumulado em 4 trimestres de 1,9% até o 2º trimestre de 2026, 2,0% até o 1º, e a alta de 0,5% contra o trimestre anterior.",
      },
      {
        ...sidra5932,
        backs:
          "A série da taxa acumulada em 4 trimestres, desde 1996, e os 3,6% do 1º trimestre de 2025.",
      },
      {
        ...ibgeQuarterlyAccounts,
        backs:
          "O que as Contas Nacionais Trimestrais medem e a data de divulgação do 3º trimestre.",
      },
    ],
    frequency: "Trimestral, uns dois meses depois do fim do trimestre",
    screens: [activityScreen],
  },

  "ibc-br": {
    title: "IBC-Br",
    abbr: "BCB",
    topic: "activity",
    summary: "O indicador mensal de atividade do Banco Central, que acompanha o PIB mais depressa.",
    lead: (
      <>
        O <strong>IBC-Br</strong> é o índice de atividade econômica do Banco Central. Sai todo mês,
        uns 45 dias depois do mês medido, e mostra para onde o PIB caminha antes de o IBGE publicar
        o trimestre. Não é o PIB, e às vezes diverge dele.
      </>
    ),
    keywords: ["índice de atividade", "atividade econômica", "prévia do pib", "banco central"],
    measures: (
      <>
        <p>
          O Banco Central junta indicadores mensais da produção da agropecuária, da indústria e dos
          serviços, mais os impostos, com os pesos do Sistema de Contas Nacionais. O resultado é um
          índice, e a tela mostra a variação dele em 12 meses.
        </p>
        <p>
          O 12 meses compara a média do índice nos últimos 12 meses com a dos 12 anteriores, a mesma
          ideia dos 4 trimestres do PIB.
        </p>
      </>
    ),
    formula: {
      tex: "\\text{IBC-Br em 12 meses} = \\dfrac{\\text{média do índice nos últimos 12 meses}}{\\text{média do índice nos 12 meses anteriores}} - 1",
      legend: [
        {
          symbol: "\\text{índice}",
          text: <>o IBC-Br sem ajuste sazonal, como o Banco Central publica (série 24363)</>,
        },
      ],
    },
    example: {
      title: "Com os números de julho de 2026",
      content: (
        <>
          <p>
            A média do índice de agosto de 2025 a julho de 2026 foi 110,02, e a de agosto de 2024 a
            julho de 2025, 108,42:
          </p>
          <FormulaBox>
            <Formula flushLeft tex="\dfrac{110{,}02}{108{,}42} - 1 = \mathbf{1{,}48\%}" />
          </FormulaBox>
        </>
      ),
    },
    reading: (
      <p>
        Serve para ver a tendência mês a mês, antes do PIB. Como o IBC-Br é mais restrito que o PIB,
        o Banco Central diz que a comparação em prazos longos, como o ano, é mais fiel que a de um
        trimestre para o outro. Em julho de 2026 ele marcava 1,48% em 12 meses, e o PIB do 2º
        trimestre, 1,9% em 4 trimestres.
      </p>
    ),
    cautions: [
      {
        title: "Não é o PIB.",
        text: (
          <>
            O PIB oficial é o do IBGE. O IBC-Br usa menos informação e não fecha a conta com a
            demanda, então os dois diferem, em média, em alguns décimos de ponto por ano.
          </>
        ),
      },
      {
        title: "Com ou sem ajuste sazonal.",
        text: (
          <>
            A tela usa o índice sem ajuste, que é o que se compara ao PIB acumulado. O Banco Central
            também publica o dessazonalizado (série 24364), que em julho de 2026 dá 1,32% em 12
            meses.
          </>
        ),
      },
    ],
    related: ["gdp", "real-growth"],
    sources: [
      {
        ...ibcDataset,
        backs: "O índice do IBC-Br, mês a mês, até julho de 2026.",
      },
      {
        ...ibcMethodology,
        backs:
          "Como o índice é calculado, a divulgação cerca de 45 dias depois do mês e a recomendação de comparar com o PIB em prazos longos.",
      },
    ],
    frequency: "Mensal, uns 45 dias depois do mês medido",
    screens: [activityScreen],
  },

  "real-growth": {
    title: "Crescimento real e nominal",
    topic: "activity",
    summary: "O real desconta a inflação e mostra se o país produz mais; o nominal não.",
    lead: (
      <>
        O crescimento <strong>nominal</strong> é o do PIB em reais correntes, nos preços de cada
        época. O <strong>real</strong> tira a inflação e mostra se o país produz mais de verdade. Os
        gráficos de atividade mostram o real.
      </>
    ),
    keywords: ["pib real", "pib nominal", "deflator", "inflação", "descontada a inflação"],
    measures: (
      <p>
        Um PIB de R$ 13 trilhões num ano e de R$ 14 trilhões no seguinte pode ser só preços mais
        altos. Para saber se a produção cresceu, o IBGE mede também o PIB em volume. A diferença
        entre o nominal e o real é a alta dos preços do que o país produz.
      </p>
    ),
    formula: {
      tex: "1 + g_{\\text{nominal}} = (1 + g_{\\text{real}}) \\times (1 + \\pi)",
      legend: [
        { symbol: "g_{\\text{nominal}}", text: <>crescimento do PIB em reais correntes</> },
        { symbol: "g_{\\text{real}}", text: <>crescimento do PIB em volume, sem a inflação</> },
        { symbol: "\\pi", text: <>alta dos preços do que o país produz</> },
      ],
    },
    example: {
      title: "Com os 4 trimestres até junho de 2026",
      content: (
        <>
          <p>
            O PIB em reais foi de R$ 13.190 bilhões contra R$ 12.305 bilhões nos 4 trimestres
            anteriores, +7,20%. Em volume, o crescimento foi de 1,9%. O que sobra são os preços:
          </p>
          <FormulaBox>
            <Formula
              flushLeft
              tex="\dfrac{1{,}0720}{1{,}019} - 1 = \mathbf{5{,}20\%}\ \text{de alta dos preços}"
            />
          </FormulaBox>
        </>
      ),
    },
    reading: (
      <p>
        Para saber se a economia anda, olhe o real. Para a conta da dívida, que está em reais
        correntes, vale o nominal: na conta r − g, o g é o crescimento nominal.
      </p>
    ),
    cautions: [
      {
        title: "Os dois se multiplicam, não se somam.",
        text: (
          <>
            1,9% de crescimento real e 5,20% de preços não dão 7,1%, e sim 7,20%, porque os fatores
            se multiplicam: 1,019 × 1,0520.
          </>
        ),
      },
    ],
    related: ["gdp", "nominal-gdp-growth", "r-minus-g"],
    sources: [
      {
        ...sgs,
        name: "Banco Central, série 4382 do SGS (PIB de 12 meses em reais correntes)",
        backs:
          "O PIB de R$ 13.190 bilhões até junho de 2026 e de R$ 12.305 bilhões até junho de 2025.",
      },
      {
        ...ibgeGdpRelease,
        backs: "O crescimento de 1,9% em volume nos 4 trimestres até o 2º trimestre de 2026.",
      },
    ],
    frequency: "Trimestral, junto com o PIB",
    screens: [activityScreen, debtScreen],
  },

  "unemployment-rate": {
    title: "Taxa de desocupação",
    abbr: "PNAD",
    topic: "activity",
    summary: "Quem procurou trabalho e não achou, sobre todos que trabalham ou procuram.",
    lead: (
      <>
        A <strong>taxa de desocupação</strong> é a parcela de quem procurou trabalho e não achou,
        sobre todos que trabalham ou procuram. Vem da PNAD Contínua do IBGE, e o Banco Central
        republica o mesmo número.
      </>
    ),
    keywords: ["desemprego", "desocupação", "pnad contínua", "mercado de trabalho", "emprego"],
    measures: (
      <>
        <p>
          O IBGE entrevista domicílios todas as semanas. Desocupada é a pessoa de 14 anos ou mais
          que, na semana de referência, não tinha trabalho, procurou e estava disponível para
          começar. A força de trabalho é ela mais os ocupados.
        </p>
        <p>Quem não procura trabalho, por ter desistido ou por estudar, fica fora da conta.</p>
      </>
    ),
    formula: {
      tex: "\\text{taxa de desocupação} = \\dfrac{\\text{desocupados}}{\\text{ocupados} + \\text{desocupados}}",
      legend: [
        {
          symbol: "\\text{ocupados}",
          text: <>quem tinha algum trabalho na semana de referência</>,
        },
        { symbol: "\\text{desocupados}", text: <>quem não tinha, procurou e podia começar</> },
      ],
    },
    example: {
      title: "Com o trimestre móvel até agosto de 2026",
      content: (
        <p>
          A taxa foi de 5,3%: a cada 100 pessoas na força de trabalho, 5,3 procuravam emprego sem
          ter achado. No mesmo trimestre de 2025 eram 5,6%, uma queda de 0,3 ponto percentual.
        </p>
      ),
    },
    reading: (
      <p>
        Quanto menor, mais gente empregada, e não há faixa oficial de bom. Muito baixo também
        pressiona salários e o preço dos serviços, e o Banco Central olha isso ao decidir a Selic.
      </p>
    ),
    cautions: [
      {
        title: "É o mesmo número do IBGE.",
        text: (
          <>
            O Banco Central republica no SGS (série 24369) a taxa da PNAD Contínua, sem refazer a
            conta.
          </>
        ),
      },
    ],
    related: ["moving-quarter", "percentage-point", "gdp"],
    sources: [
      {
        ...ibgePnadRelease,
        backs: "A taxa de 5,3% no trimestre encerrado em agosto de 2026 e de 5,6% um ano antes.",
      },
      {
        ...sidra6381,
        backs: "A série da taxa de desocupação por trimestre móvel.",
      },
      {
        ...sgs,
        name: "Banco Central, série 24369 do SGS (taxa de desocupação)",
        backs: "Que o Banco Central republica a taxa da PNAD Contínua.",
      },
    ],
    frequency: "Mensal, no fim do mês seguinte ao fim do trimestre móvel",
    screens: [activityScreen, healthScreen],
  },

  nairu: {
    title: "Desemprego que não acelera a inflação",
    abbr: "NAIRU",
    topic: "activity",
    summary: "A taxa de desemprego abaixo da qual a inflação tende a subir.",
    lead: (
      <>
        A <strong>NAIRU</strong> é a taxa de desemprego em que o mercado de trabalho está em
        equilíbrio: abaixo dela, faltam trabalhadores, os salários sobem mais rápido e a inflação de
        serviços acelera. Ninguém a observa; economistas a estimam, e as estimativas divergem.
      </>
    ),
    keywords: ["nairu", "nawru", "desemprego natural", "desemprego neutro", "pleno emprego"],
    measures: (
      <p>
        É uma régua para a taxa de desocupação: ela diz se o emprego está folgado ou apertado em
        relação ao que a economia aguenta sem pressionar preços. A sigla vem do inglês, taxa de
        desemprego que não acelera a inflação.
      </p>
    ),
    reading: (
      <p>
        Desocupação bem abaixo da NAIRU sugere mercado de trabalho apertado: as empresas disputam
        gente, pagam mais e repassam o custo aos preços, e o Banco Central tende a manter o juro
        alto. Desocupação acima dela indica folga, que segura salários e preços. O que vale é a
        distância entre as duas, e não o nível sozinho.
      </p>
    ),
    cautions: [
      {
        title: "É uma estimativa, e não há consenso.",
        text: (
          <>
            O FGV-Ibre estimou a taxa de equilíbrio em cerca de 8,5% da força de trabalho em 2022, e
            as projeções de mercado para a desocupação em 2025 e 2026 giravam em torno de 9,5%. O
            valor muda com o método e com o período. Por isso o app mostra a desocupação ao lado da
            referência escrita, sem cor.
          </>
        ),
      },
    ],
    related: ["unemployment-rate", "inflation-target", "neutral-rate"],
    sources: [
      {
        name: "FGV-Ibre, Blog do Ibre: a taxa de desemprego de equilíbrio brasileira está mais próxima dos 8,5% da PEA (18 de julho de 2022)",
        url: "https://blogdoibre.fgv.br/posts/taxa-de-desemprego-de-equilibrio-brasileira-esta-mais-proxima-dos-85-da-pea",
        backs:
          "A estimativa de cerca de 8,5% da força de trabalho e as projeções de mercado de cerca de 9,5% para 2025 e 2026.",
      },
    ],
    screens: [healthScreen],
  },

  "moving-quarter": {
    title: "Trimestre móvel",
    topic: "activity",
    summary: "A média de três meses seguidos, que anda um mês por vez.",
    lead: (
      <>
        O <strong>trimestre móvel</strong> é uma janela de três meses seguidos que avança um mês por
        vez. O que termina em agosto junta junho, julho e agosto; o de setembro troca junho por
        setembro.
      </>
    ),
    keywords: ["trimestre móvel", "média móvel", "pnad", "janela de três meses"],
    measures: (
      <p>
        O IBGE divulga todo mês a taxa de desocupação do trimestre que termina nele. Cada número
        reaproveita dois meses do anterior, e por isso a linha é suave e muda devagar.
      </p>
    ),
    example: {
      title: "Com os números de 2026",
      content: (
        <p>
          O trimestre móvel até maio (março, abril e maio) deu 5,6%, e o até agosto (junho, julho e
          agosto), 5,3%. Os dois não têm nenhum mês em comum.
        </p>
      ),
    },
    reading: (
      <p>
        A linha reage com atraso: um mês bom ou ruim só pesa por inteiro três meses depois. Para ver
        se melhorou de verdade, compare com o mesmo trimestre do ano anterior.
      </p>
    ),
    cautions: [
      {
        title: "A data é a do último mês.",
        text: (
          <>
            No gráfico, o ponto de agosto é o trimestre de junho a agosto, e não só o mês de agosto.
          </>
        ),
      },
    ],
    related: ["unemployment-rate"],
    sources: [
      {
        ...ibgePnadRelease,
        backs: "A taxa de 5,3% no trimestre encerrado em agosto de 2026 e a divulgação mensal.",
      },
      {
        ...sidra6381,
        backs: "A série por trimestre móvel e o mês em que cada um termina.",
      },
    ],
    frequency: "Mensal, no fim do mês seguinte ao fim do trimestre móvel",
    screens: [activityScreen],
  },

  selic: {
    title: "Selic meta",
    abbr: "Copom",
    topic: "interest",
    summary: "A taxa básica de juros do país, fixada pelo Copom.",
    lead: (
      <>
        A <strong>Selic meta</strong> é a taxa básica de juros do país, fixada pelo Copom a cada
        reunião. É o piso do custo do dinheiro: financiamentos, rendimento da renda fixa e parte da
        dívida pública andam atrás dela.
      </>
    ),
    keywords: ["taxa básica", "juros", "selic over", "banco central", "política monetária"],
    measures: (
      <>
        <p>
          Quanto o Banco Central quer que os bancos paguem para emprestar dinheiro uns aos outros de
          um dia para o outro, ao ano. A taxa que se forma no mercado, a Selic <em>over</em>, fica
          em volta da meta porque o Banco Central compra e vende títulos até ela chegar lá.
        </p>
        <p>
          A meta só muda nas reuniões do Copom, e a tela mostra o valor dela no fim de cada mês, em
          degraus.
        </p>
      </>
    ),
    example: {
      title: "Com os números de 8 de outubro de 2026",
      content: (
        <p>
          A meta era <strong>13,75% ao ano</strong>, em vigor desde 17 de setembro de 2026, quando o
          Copom a cortou em 0,25 ponto percentual, de 14,00%. Em junho de 2025 ela chegou a 15,00%.
        </p>
      ),
    },
    reading: (
      <p>
        Juro alto encarece o crédito, segura o consumo e a inflação, e também a atividade e a dívida
        pública. Juro baixo faz o contrário. O Banco Central sobe a Selic quando a inflação passa da
        meta e baixa quando ela cede, e o efeito leva de vários meses a mais de um ano para chegar
        aos preços. Por isso o que importa é a Selic contra a inflação (o juro real), e não o número
        sozinho.
      </p>
    ),
    cautions: [
      {
        title: "A meta não é o juro que você paga.",
        text: (
          <>
            O financiamento, o cartão e o cheque especial cobram muito acima da Selic: ela é o ponto
            de partida do custo do dinheiro, e os bancos somam o risco e a margem deles.
          </>
        ),
      },
      {
        title: "É uma taxa ao ano.",
        text: (
          <>13,75% ao ano não são 13,75% por mês: compostos mês a mês, são cerca de 1,08% ao mês.</>
        ),
      },
    ],
    related: ["copom", "real-rate", "inflation-target", "focus-survey", "nominal-interest"],
    sources: [
      {
        ...copomPage,
        backs: "Que o Copom fixa a meta da Selic, em reuniões ordinárias a cada cerca de 45 dias.",
      },
      {
        ...sgs,
        name: "Banco Central, série 432 do SGS (meta Selic)",
        backs:
          "A meta de 13,75% em 8 de outubro de 2026, as mudanças desde 1999 e o corte de 17 de setembro.",
      },
    ],
    frequency: "Diária no SGS; só muda nas 8 reuniões do Copom por ano",
    screens: [interestScreen],
  },

  copom: {
    title: "Copom",
    abbr: "BCB",
    topic: "interest",
    summary: "O comitê do Banco Central que decide a Selic meta, 8 vezes por ano.",
    lead: (
      <>
        O <strong>Copom</strong> (Comitê de Política Monetária) é o grupo do Banco Central, formado
        pela diretoria e pelo presidente, que decide a Selic meta. Reúne-se 8 vezes por ano, a cada
        cerca de 45 dias, em dois dias seguidos.
      </>
    ),
    keywords: ["comitê de política monetária", "reunião", "decisão de juros", "ata", "comunicado"],
    measures: (
      <>
        <p>
          O Copom analisa a inflação, as expectativas e a atividade e decide se sobe, mantém ou
          corta a Selic. A decisão sai no comunicado do fim do segundo dia e vale a partir do dia
          seguinte. A ata, com a discussão, sai na terça-feira da semana seguinte.
        </p>
        <p>
          O Banco Central divulga o calendário do ano seguinte até o fim de junho, e o app o busca
          sozinho. A pesquisa Focus pergunta a Selic de cada reunião.
        </p>
      </>
    ),
    example: {
      title: "Com a reunião de novembro de 2026",
      content: (
        <p>
          A próxima reunião é a 7ª do ano, em 3 e 4 de novembro de 2026. A decisão sai no dia 4 e
          vale a partir do dia 5. Na pesquisa Focus de 2 de outubro, a mediana do mercado esperava
          13,50%, um corte de 0,25 ponto percentual sobre os 13,75% de hoje.
        </p>
      ),
    },
    reading: (
      <p>
        O mercado costuma acertar a decisão antes de ela sair, e por isso a notícia está no que o
        comunicado e a ata dizem sobre as reuniões seguintes: é aí que se lê para onde o Copom
        caminha.
      </p>
    ),
    cautions: [
      {
        title: "O calendário pode mudar.",
        text: (
          <>
            O Banco Central pode ajustar as datas até o fim do ano em que o calendário vale, e pode
            convocar reunião extraordinária.
          </>
        ),
      },
    ],
    related: ["selic", "real-rate", "focus-survey", "inflation-target"],
    sources: [
      {
        ...copomPage,
        backs: "Quem compõe o Copom, que ele fixa a Selic meta e o calendário de reuniões.",
      },
      {
        name: "Banco Central, histórico do Copom",
        url: "https://www.bcb.gov.br/htms/copom_normas/a-hist.asp?idpai=co&frame=1",
        backs:
          "Que o calendário é divulgado por comunicado até o fim de junho do ano anterior e pode ser ajustado.",
      },
      {
        ...focusData,
        backs: "A previsão de 13,50% do Focus de 2 de outubro de 2026 para a reunião de novembro.",
      },
    ],
    frequency: "8 reuniões por ano; o calendário do ano seguinte sai até junho",
    screens: [interestScreen],
  },

  "real-rate": {
    title: "Juro real",
    topic: "interest",
    summary: "Quanto o juro rende acima da inflação, descontando-a dividindo.",
    lead: (
      <>
        O <strong>juro real</strong> é o que o juro rende acima da inflação. Com a Selic em 13,75% e
        a inflação esperada em 4,59%, o dinheiro rende 8,76% acima dos preços. É esse juro, e não a
        Selic sozinha, que segura ou solta a economia.
      </>
    ),
    keywords: [
      "juro real",
      "selic real",
      "ex-ante",
      "descontar a inflação",
      "juro acima da inflação",
    ],
    measures: (
      <>
        <p>
          A Selic tira da inflação o pedaço que só repõe o preço: o que sobra é o ganho de poder de
          compra. A tela usa a inflação que o mercado espera para os próximos 12 meses (a pesquisa
          Focus), o <strong>juro real ex-ante</strong>, porque quem decide hoje olha para a inflação
          que vem, e não para a que passou.
        </p>
        <p>A conta é dividir, e não subtrair, como em todo desconto de taxa.</p>
      </>
    ),
    formula: {
      tex: "\\text{juro real} = \\dfrac{1 + \\text{Selic}}{1 + \\text{inflação esperada}} - 1",
      legend: [
        { symbol: "\\text{Selic}", text: <>a meta ao ano, em fração (13,75% é 0,1375)</> },
        {
          symbol: "\\text{inflação esperada}",
          text: <>a mediana do Focus para o IPCA dos 12 meses seguintes, em fração</>,
        },
      ],
    },
    example: {
      title: "Com os números de 2 de outubro de 2026",
      content: (
        <>
          <p>Selic de 13,75% e IPCA esperado de 4,59% nos 12 meses seguintes, segundo o Focus:</p>
          <FormulaBox>
            <Formula flushLeft tex="\dfrac{1{,}1375}{1{,}0459} - 1 = \mathbf{8{,}76\%}" />
          </FormulaBox>
        </>
      ),
    },
    reading: (
      <p>
        Juro real alto segura a inflação e também o crescimento, e encarece a dívida pública. Baixo
        ou negativo estimula o crédito e o consumo. Quanto é alto ou baixo depende do juro neutro, o
        que não acelera nem freia a economia: acima dele, a política aperta.
      </p>
    ),
    cautions: [
      {
        title: "Dividir, não subtrair.",
        text: (
          <>
            13,75% menos 4,59% dá 9,16%, mas o ganho de poder de compra é 8,76%. A diferença cresce
            com as taxas.
          </>
        ),
      },
      {
        title: "Ex-ante e ex-post.",
        text: (
          <>
            O ex-post desconta a inflação que já aconteceu, e é o que o gráfico mostra no passado,
            na distância entre a Selic e o IPCA em 12 meses. O ex-ante desconta a esperada, e é o
            número do resumo.
          </>
        ),
      },
    ],
    related: ["selic", "neutral-rate", "focus-survey", "purchasing-power", "implicit-rate"],
    sources: [
      {
        ...focusData,
        backs:
          "A mediana de 4,59% da inflação esperada para os 12 meses seguintes, em 2 de outubro de 2026.",
      },
      {
        ...sgs,
        name: "Banco Central, série 432 do SGS (meta Selic)",
        backs: "A meta de 13,75%.",
      },
    ],
    frequency: "Muda toda semana, com a pesquisa Focus, e a cada reunião do Copom",
    screens: [interestScreen, healthScreen],
  },

  "neutral-rate": {
    title: "Juro neutro",
    topic: "interest",
    summary: "O juro real que nem acelera nem freia a economia.",
    lead: (
      <>
        O <strong>juro neutro</strong> é o juro real que mantém a economia no ritmo em que ela
        consegue crescer sem acelerar a inflação: nem esquenta, nem esfria. Ninguém o observa;
        economistas e o Banco Central o estimam.
      </>
    ),
    keywords: ["taxa neutra", "juro real neutro", "r*", "r-estrela", "política monetária neutra"],
    measures: (
      <p>
        É o patamar de referência para dizer se a política monetária aperta ou alivia: juro real
        acima do neutro segura a economia, abaixo estimula. O Banco Central estima o neutro por
        vários métodos, que dão resultados diferentes, e publica a mediana deles.
      </p>
    ),
    reading: (
      <p>
        Serve de baliza, não de alvo exato. Se o juro real fica bem acima do neutro por muito tempo,
        a inflação tende a ceder e a atividade, a esfriar. O neutro também muda: dívida pública
        alta, por exemplo, empurra o neutro para cima.
      </p>
    ),
    cautions: [
      {
        title: "É uma estimativa, não um dado.",
        text: (
          <>
            O Banco Central e as instituições financeiras divergem sobre o valor, e cada relatório
            pode revisá-lo. Por isso o app não pinta o juro real de verde ou vermelho.
          </>
        ),
      },
    ],
    related: ["real-rate", "selic", "inflation-target", "net-debt"],
    sources: [
      {
        name: "Banco Central, Relatório de Inflação de junho de 2024, boxe sobre a taxa de juros real neutra",
        url: "https://www.bcb.gov.br/content/ri/relatorioinflacao/202406/ri202406b11p.pdf",
        backs:
          "Que a taxa neutra é estimada por vários métodos e que as estimativas subiram depois do mínimo da pandemia.",
      },
    ],
    screens: [interestScreen, healthScreen],
  },

  "credit-cost": {
    title: "Custo do crédito",
    abbr: "ICC",
    topic: "credit",
    summary: "Quanto, em média, os bancos cobram por ano por todo o crédito em aberto.",
    lead: (
      <>
        O <strong>indicador de custo do crédito (ICC)</strong> é o custo médio, ao ano, de todo o
        crédito que as famílias e as empresas devem aos bancos hoje. Mostra o que o crédito custa na
        prática, bem acima da Selic.
      </>
    ),
    keywords: ["icc", "juros do crédito", "custo médio", "empréstimo", "financiamento", "banco"],
    measures: (
      <>
        <p>
          O custo médio das operações de crédito em aberto no sistema financeiro, em % ao ano:
          empréstimos, financiamentos e arrendamento mercantil, de qualquer data de contratação.
        </p>
        <p>
          Como pesa o que já foi emprestado, e não só o crédito novo, o ICC anda devagar: uma
          mudança da Selic leva meses para aparecer nele inteira.
        </p>
      </>
    ),
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <p>
          O ICC foi de <strong>24,19% ao ano</strong>, contra 23,39% em agosto de 2025. No fim de
          agosto a Selic meta era de 14,00%: o crédito custou 10,19 pontos percentuais a mais que a
          taxa básica.
        </p>
      ),
    },
    reading: (
      <p>
        Quanto maior, mais caro é se endividar e mais o juro pesa no orçamento de quem deve. Compare
        sempre com a Selic: se o ICC sobe e a Selic não, a conta do banco aumentou por outro motivo,
        como calote esperado ou margem. Não há faixa certa; o que informa é a direção e a distância
        para a Selic.
      </p>
    ),
    cautions: [
      {
        title: "É uma média de tudo.",
        text: (
          <>
            O ICC mistura o cartão rotativo, de juro altíssimo, com o financiamento de imóvel, bem
            mais barato. Quase ninguém paga exatamente a média.
          </>
        ),
      },
      {
        title: "É uma taxa ao ano.",
        text: <>24,19% ao ano não são 24,19% por mês: compostos mês a mês, são cerca de 1,82%.</>,
      },
    ],
    related: ["credit-spread", "selic", "credit-concessions", "free-and-directed-credit"],
    sources: [
      {
        name: "Banco Central, indicador de custo do crédito (ICC)",
        url: "https://www.bcb.gov.br/estabilidadefinanceira/indicadorcustocredito",
        backs: "O que o indicador mede e que ele cobre as operações em aberto da carteira.",
      },
      {
        ...sgs,
        name: "Banco Central, série 25351 do SGS (ICC, total)",
        url: "https://dadosabertos.bcb.gov.br/dataset/25351-indicador-de-custo-do-credito---icc",
        backs: "Os 24,19% de agosto de 2026 e os 23,39% de agosto de 2025.",
      },
    ],
    frequency: "Mensal, perto do fim do mês seguinte",
    screens: [creditScreen],
  },

  "credit-spread": {
    title: "Spread",
    abbr: "ICC − Selic",
    topic: "credit",
    summary: "A distância entre o que o crédito custa e a Selic.",
    lead: (
      <>
        O <strong>spread</strong> é a diferença entre o custo do crédito e a Selic. A Selic é o
        começo da conta do banco; o spread é o resto: risco de calote, impostos, custos e lucro.
      </>
    ),
    keywords: ["margem", "spread bancário", "diferença", "juros do banco", "calote"],
    measures: (
      <>
        <p>
          Aqui, o ICC menos a Selic meta em vigor no fim do mesmo mês, em pontos percentuais. Na
          tela é a faixa sombreada entre as duas linhas.
        </p>
        <p>
          É a medida simples do app, e não o spread bancário do Banco Central, que compara o que o
          banco cobra com o que ele paga para captar o dinheiro.
        </p>
      </>
    ),
    formula: {
      tex: "\\text{spread} = \\text{ICC} - \\text{Selic}",
      legend: [
        { symbol: "ICC", text: "o custo do crédito do mês, ao ano" },
        { symbol: "Selic", text: "a meta em vigor no fim do mês, ao ano" },
      ],
    },
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <p>
          ICC de 24,19% menos Selic de 14,00%: <strong>spread de 10,19 pontos percentuais</strong>.
        </p>
      ),
    },
    reading: (
      <p>
        Spread largo significa que o crédito é caro mesmo com a Selic cedendo, e é por isso que
        cortar a Selic não derruba o juro do cartão na mesma proporção. Se o spread aumenta quando a
        Selic cai, os bancos estão embolsando o corte ou esperando mais calote.
      </p>
    ),
    cautions: [
      {
        title: "Mais caro não é só lucro do banco.",
        text: (
          <>
            Uma parte do spread cobre quem não paga: quanto maior a inadimplência, mais largo o
            spread necessário para o banco empatar.
          </>
        ),
      },
    ],
    related: ["credit-cost", "selic", "percentage-point"],
    sources: [
      {
        ...sgs,
        name: "Banco Central, séries 25351 (ICC) e 432 (meta Selic) do SGS",
        url: "https://dadosabertos.bcb.gov.br/dataset/25351-indicador-de-custo-do-credito---icc",
        backs: "Os 24,19% do ICC de agosto de 2026 e os 14,00% da meta em vigor no fim do mês.",
      },
    ],
    frequency: "Mensal, junto com o ICC",
    screens: [creditScreen],
  },

  "credit-concessions": {
    title: "Concessões de crédito",
    topic: "credit",
    summary: "O crédito novo que os bancos liberaram no mês.",
    lead: (
      <>
        As <strong>concessões</strong> são o dinheiro novo que os bancos emprestaram no mês. Diferem
        do saldo, que soma tudo o que ainda se deve, e mostram se o crédito está acelerando ou
        freando.
      </>
    ),
    keywords: [
      "crédito novo",
      "empréstimos",
      "financiamentos",
      "liberações",
      "famílias",
      "empresas",
    ],
    measures: (
      <>
        <p>
          O valor das operações de crédito contratadas no mês, em R$. O app mostra as de recursos
          livres, de empresas e de famílias, e a variação em 12 meses.
        </p>
        <p>
          A conta soma os 12 meses que terminam no mês e compara com a soma dos 12 anteriores,
          porque as concessões variam muito de um mês para o outro (dezembro é sempre forte, por
          exemplo).
        </p>
      </>
    ),
    example: {
      title: "Com os números de agosto de 2026",
      content: (
        <p>
          As famílias tomaram R$ 826,6 bilhões nos 12 meses até agosto, contra R$ 732,4 bilhões nos
          12 meses anteriores: <strong>+12,9%</strong>. As empresas, <strong>+11,6%</strong>. O
          valor é nominal, sem descontar a inflação.
        </p>
      ),
    },
    reading: (
      <p>
        Variação positiva e crescente indica crédito acelerando; negativa, freando. Juros altos
        costumam frear o crédito com alguns meses de atraso. Como o valor é nominal, uma variação de
        12% com inflação de 4% no período é um crescimento real de cerca de 7,7%.
      </p>
    ),
    cautions: [
      {
        title: "As famílias não incluem o rotativo do cartão.",
        text: (
          <>
            O rotativo gira todo mês e infla o valor sem ser dinheiro novo de verdade. A tela usa a
            série das famílias sem ele, como a página do Banco Central.
          </>
        ),
      },
      {
        title: "Concessão não é dívida.",
        text: (
          <>
            Parte do que se empresta em um mês é paga no mesmo ano. O saldo da dívida das famílias é
            outra série.
          </>
        ),
      },
    ],
    related: ["free-and-directed-credit", "credit-cost", "rolling-12m"],
    sources: [
      {
        name: "Banco Central, estatísticas monetárias e de crédito",
        url: "https://www.bcb.gov.br/estatisticas/estatisticasmonetariascredito",
        backs: "Que as concessões são as operações novas do mês, separadas por tipo de recurso.",
      },
      {
        ...sgs,
        name: "Banco Central, série 20635 do SGS (concessões de recursos livres, empresas)",
        url: "https://dadosabertos.bcb.gov.br/dataset/20635-concessoes-de-credito-com-recursos-livres---pessoas-juridicas---total",
        backs: "As concessões das empresas e a variação de 11,6% em 12 meses até agosto de 2026.",
      },
      {
        ...sgs,
        name: "Banco Central, série 20663 do SGS (concessões de recursos livres, famílias, não rotativo)",
        url: "https://dadosabertos.bcb.gov.br/dataset/20663-concessoes-de-credito-com-recursos-livres-nao-rotativo---pessoas-fisicas",
        backs: "As concessões das famílias e a variação de 12,9% em 12 meses até agosto de 2026.",
      },
    ],
    frequency: "Mensal, perto do fim do mês seguinte",
    screens: [creditScreen],
  },

  "free-and-directed-credit": {
    title: "Recursos livres e direcionados",
    topic: "credit",
    summary: "Crédito com juro negociado entre banco e cliente, e crédito com regra definida.",
    lead: (
      <>
        No <strong>crédito livre</strong>, banco e cliente negociam o juro. No{" "}
        <strong>direcionado</strong>, a lei define a origem do dinheiro e o juro, como no crédito
        rural e no imobiliário com a poupança.
      </>
    ),
    keywords: ["livre", "direcionado", "crédito rural", "financiamento imobiliário", "bndes"],
    measures: (
      <>
        <p>
          Os recursos <strong>livres</strong> seguem o mercado: cartão, cheque especial, crédito
          pessoal, capital de giro. Os <strong>direcionados</strong> têm regra, e muitas vezes juro
          mais baixo, como o crédito rural, o imobiliário e o do BNDES.
        </p>
        <p>A tela mostra só o livre, que é o que reage à Selic.</p>
      </>
    ),
    reading: (
      <p>
        O crédito livre sente a Selic e o ciclo da economia com mais força, e por isso é o melhor
        termômetro do efeito da política monetária. O direcionado anda mais pelas regras e pelos
        programas do governo.
      </p>
    ),
    related: ["credit-concessions", "credit-cost", "selic"],
    sources: [
      {
        name: "Banco Central, estatísticas monetárias e de crédito",
        url: "https://www.bcb.gov.br/estatisticas/estatisticasmonetariascredito",
        backs: "A divisão do crédito em recursos livres e direcionados.",
      },
    ],
    screens: [creditScreen],
  },
};
