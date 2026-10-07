import type { IpcaSeriesId } from "@/shared/lib/group-identity";

export type IpcaGroupId = Exclude<IpcaSeriesId, "ipca_general">;

export interface IpcaGroupContent {
  /** O que o grupo junta, numa frase. */
  summary: string;
  /** O peso do grupo no IPCA de agosto de 2026, em fração: 0,2151 é 21,51%. */
  weight: number;
  /** Os subgrupos do IBGE, com exemplos do que ele pesquisa quando o nome não diz tudo. */
  subgroups: { name: string; examples: string[] }[];
}

// A estrutura (grupo, subgrupo, item e subitem) e os pesos são os da tabela 7060 do
// IBGE, variável 66 (peso mensal), em ago/2026. Os exemplos são subitens pesquisados.
export const ipcaGroupContents: Record<IpcaGroupId, IpcaGroupContent> = {
  ipca_food: {
    summary: "A comida e a bebida compradas para comer em casa e as consumidas fora dela.",
    weight: 0.215115,
    subgroups: [
      {
        name: "Alimentação no domicílio",
        examples: [
          "arroz e feijão",
          "carnes, aves, ovos e peixes",
          "leite e derivados",
          "pão",
          "frutas, legumes e verduras",
          "açúcar, óleo, café e bebidas",
        ],
      },
      {
        name: "Alimentação fora do domicílio",
        examples: ["refeição", "lanche", "cafezinho", "refrigerante, cerveja e vinho"],
      },
    ],
  },
  ipca_housing: {
    summary: "O custo de morar: aluguel, condomínio, as contas da casa e a manutenção.",
    weight: 0.15503,
    subgroups: [
      {
        name: "Encargos e manutenção",
        examples: [
          "aluguel residencial",
          "condomínio",
          "taxa de água e esgoto",
          "mudança",
          "reparos",
          "artigos de limpeza",
        ],
      },
      {
        name: "Combustíveis e energia",
        examples: ["energia elétrica residencial", "gás de botijão", "gás encanado"],
      },
    ],
  },
  ipca_household: {
    summary: "O que se compra para equipar a casa e o conserto desses objetos.",
    weight: 0.03451,
    subgroups: [
      { name: "Móveis e utensílios", examples: ["móveis", "utensílios", "cama, mesa e banho"] },
      {
        name: "Aparelhos eletroeletrônicos",
        examples: ["eletrodomésticos", "TV, som e informática"],
      },
      {
        name: "Consertos e manutenção",
        examples: ["conserto de geladeira, de TV e de celular", "reforma de estofado"],
      },
    ],
  },
  ipca_apparel: {
    summary: "Roupa, calçado e acessórios.",
    weight: 0.045963,
    subgroups: [
      { name: "Roupas", examples: ["roupa masculina", "roupa feminina", "roupa infantil"] },
      { name: "Calçados e acessórios", examples: [] },
      { name: "Joias e bijuterias", examples: [] },
      { name: "Tecidos e armarinho", examples: [] },
    ],
  },
  ipca_transport: {
    summary: "Andar de transporte público ou ter e usar o próprio veículo, combustível incluído.",
    weight: 0.202696,
    subgroups: [
      {
        name: "Transporte público",
        examples: [
          "ônibus urbano, metrô e trem",
          "ônibus intermunicipal e interestadual",
          "táxi e transporte por aplicativo",
          "passagem aérea",
          "transporte escolar",
        ],
      },
      {
        name: "Veículo próprio",
        examples: [
          "carro novo e usado e moto",
          "seguro, emplacamento e licença",
          "conserto, pneu e peças",
          "estacionamento e pedágio",
        ],
      },
      { name: "Combustíveis (veículos)", examples: ["gasolina", "etanol", "óleo diesel", "GNV"] },
    ],
  },
  ipca_health: {
    summary: "Remédio, consulta, plano de saúde e os produtos de higiene e beleza.",
    weight: 0.137648,
    subgroups: [
      {
        name: "Produtos farmacêuticos e óticos",
        examples: ["remédios de todo tipo", "óculos de grau"],
      },
      {
        name: "Serviços de saúde",
        examples: [
          "médico, dentista, fisioterapeuta e psicólogo",
          "exames, hospitalização e cirurgia",
          "plano de saúde",
        ],
      },
      {
        name: "Cuidados pessoais",
        examples: [
          "sabonete, desodorante e papel higiênico",
          "produtos para cabelo, pele e barba",
          "perfume e maquiagem",
          "fralda e absorvente",
        ],
      },
    ],
  },
  ipca_personal: {
    summary:
      "Serviços que a família contrata para si (beleza, casa, banco, cartório), lazer e cigarro.",
    weight: 0.102426,
    subgroups: [
      {
        name: "Serviços pessoais",
        examples: [
          "cabeleireiro, barbeiro e manicure",
          "empregado doméstico",
          "costureira",
          "cartório e despachante",
          "serviço bancário",
        ],
      },
      {
        name: "Recreação e fumo",
        examples: [
          "cinema, teatro e shows",
          "hospedagem e pacote turístico",
          "clube e brinquedo",
          "ração e veterinário para animais",
          "jogos de azar",
          "cigarro",
        ],
      },
    ],
  },
  ipca_education: {
    summary: "Mensalidade de escola e faculdade, cursos livres, livros e material escolar.",
    weight: 0.061601,
    subgroups: [
      {
        name: "Cursos regulares",
        examples: [
          "creche e pré-escola",
          "ensino fundamental e médio",
          "ensino superior e pós-graduação",
          "curso técnico",
        ],
      },
      { name: "Leitura", examples: ["livro didático e não didático", "jornal e revista"] },
      { name: "Papelaria", examples: ["caderno e artigos de papelaria"] },
      {
        name: "Cursos diversos",
        examples: ["idioma", "informática", "autoescola", "curso preparatório", "academia"],
      },
    ],
  },
  ipca_communication: {
    summary: "Telefone, internet, TV por assinatura, streaming e correio.",
    weight: 0.045011,
    subgroups: [
      {
        name: "Comunicação",
        examples: [
          "plano de celular e de telefone fixo",
          "acesso à internet",
          "TV por assinatura e streaming",
          "aparelho de celular",
          "correio",
        ],
      },
    ],
  },
};

export const ipcaGroupIds = Object.keys(ipcaGroupContents).filter(
  (key): key is IpcaGroupId => key in ipcaGroupContents,
);
