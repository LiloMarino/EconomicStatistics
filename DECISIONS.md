# Decisões — EconomicStatistics

> O "porquê" do projeto: **necessidades** (`N#`, por que construir) e **decisões transversais** (`D#`, por que desse jeito — só as que já condicionam alguma feature concreta). Segue a metodologia da skill `feature-roadmap`. Companion: [ROADMAP.md](ROADMAP.md) — lá está o "o quê construir, em que marco e em que estado"; aqui não há status de implementação.
>
> **Regra de sincronização:** os dois documentos usam os mesmos IDs (`N#`, `D#`) e devem sempre concordar. Ao criar/alterar um `N#`/`D#` aqui, espelhar no ROADMAP via `roadmap.py upsert-ref` na mesma resposta.
>
> **Última mudança (2026-10-07):** a D6 foi reescrita com a linguagem implementada e o padrão de toda tela nova, depois da segunda rodada de design no canvas.

---

## Contexto

Acompanhador da economia brasileira e, ao mesmo tempo, ferramenta de aprendizado de economia para quem é leigo. **Local-first**, no mesmo molde do Finance Manager: roda em 127.0.0.1, sem autenticação e sem nuvem, para um usuário só. O app só guarda dado público, que vem de fontes oficiais gratuitas (BCB, IBGE, Tesouro).

**O que já existe:** um app Streamlit de 4 arquivos. Ele busca o IPCA por grupo na tabela 7060 do SIDRA e guarda um cache em CSV que expira em 30 dias. Desenha três gráficos: a inflação mensal por categoria, o acumulado de cada categoria contra o índice geral, e o acumulado de 12 meses. O segundo gráfico traz o "poder de compra após reajuste", que supõe um reajuste igual ao IPCA geral e o compara com a inflação de cada grupo. A conta tem dois problemas:
- **Subtrai percentuais, e o certo é dividir.** Em 2022, o IPCA foi 5,79% e Alimentação e bebidas subiu 11,64%. A conta exata dá 1,0579 ÷ 1,1164 − 1 = −5,24%; a subtração dá −5,85.
- **Rotula como "no ano"** um intervalo que pode ter qualquer duração.

**De onde vem a virada:** de uma conversa com o ChatGPT sobre o histórico da dívida brasileira, que passou por:
- Collor e hiperinflação;
- Plano Real e URV;
- dívida/PIB e r − g;
- os caminhos pelos quais dívida vira inflação;
- dominância fiscal;
- onde se vê o déficit.

A conversa deixou três constatações:
- as métricas estão espalhadas entre BCB, IBGE e Tesouro;
- vários números úteis não são publicados prontos por ninguém (o r − g, o superávit que estabiliza a dívida, o poder de compra por categoria);
- sem saber ler a métrica, o número não diz nada.

O app junta as fontes, faz as contas compostas e explica cada número no ponto de uso. O conteúdo do chat é ponto de partida: toda afirmação factual dele é conferida contra a fonte oficial antes de entrar no app.

**Projetos irmãos:**
- **Finance Manager:** molde de stack, de convenções e do mecanismo de cache de fonte externa. O provider do BCB/SGS é portado de lá.
- **SimuladorFinanceiro:** referência secundária.

---

## Necessidades

**N1. Acompanhar a economia brasileira num lugar só ⭐**
Ver inflação, juros, dívida, déficit, câmbio, atividade e expectativas atualizados, sem caçar cada número em BCB, IBGE e Tesouro: "as métricas estão todas fragmentadas". Cada número diz até que data é real.

**N2. Entender o que cada número significa enquanto olho ⭐**
Sou leigo em economia. Cada métrica e cada jargão vêm explicados no ponto de uso: o que mede, um exemplo numérico e o que é valor bom ou ruim. A fórmula aparece escrita e explicada. Além disso, quero poder estudar os conceitos por conta própria, fora dos gráficos. É o que torna o app útil enquanto ainda não sei ler os gráficos.

**N3. Saber em que áreas de gasto o dinheiro passou a comprar mais ou menos ⭐**
Dado um reajuste, quero ver a perda ou o ganho de poder de compra em cada categoria: alimentação, habitação, transporte… O reajuste pode ser:
- o do salário mínimo;
- o meu;
- só a reposição pela inflação.

Essa métrica não é publicada pronta em lugar nenhum.

**N4. Saber se a dívida pública está sob controle**
O que faz a dívida crescer sozinha, quanto de superávit seria preciso para estabilizá-la, e por que um país com 100% do PIB de dívida pode estar "de boa" enquanto outro, com menos, quebra.

**N5. Saber se a economia está saudável ou caminhando para uma crise**
"Que números deveriam ser olhados pra dizer que a economia tá uma bosta, ou prever que vai ficar?" Quais sinais olhar, e como o Brasil de hoje se compara com Collor, o Plano Real, 2002, 2015 e 2020.

**N6. Saber como o déficit é financiado**
Onde se vê o déficit, e se o governo está emitindo moeda para pagar a dívida ou apenas vendendo títulos: "como dá pra saber se o governo tá emitindo dinheiro pra pagar dívida?"

---

## Decisões

> Só entra aqui a decisão que já condiciona uma feature concreta do roadmap (ver `methodology.md` seção 3).

### D1 — Stack igual à do Finance Manager
**Status:** ✅ Decidida

**Decisão:**
- **Backend:** Python 3.13, FastAPI, SQLAlchemy 2 com `MappedAsDataclass`, Alembic e SQLite em `data/`. Ferramentas: uv, ruff e pyright strict.
- **Frontend:** SPA em React 19 com Vite 8, TypeScript 6, Tailwind 4, shadcn base-nova (primitivos do Base UI), TanStack Query, React Router 7 e Recharts 3. Ferramentas: pnpm, oxlint e oxfmt. O `openapi-typescript` gera os tipos do OpenAPI exportado offline.
- **Raiz:** um `package.json` com `concurrently` sobe os dois.

**Por quê:** é a stack que o autor mantém no Finance Manager. Lá, a tipagem ponta a ponta via OpenAPI e o cache de fonte externa já estão resolvidos e provados.

**Consequências:**
- Saem Streamlit, pandas, `sidrapy` e `requirements.txt`.
- Cada fonte externa ganha um fetcher próprio em `backend/adapters/`, com `urllib` e Pydantic, como o `bcb_sgs_provider.py` do Finance Manager.
- O `sidrapy` não paga a dependência. Ele monta a URL da `apisidra`, embrulha a resposta num DataFrame com colunas posicionais (`D2C`, `D4N`), cujo significado muda com a ordem dos parâmetros na URL, e traz `requests` e `pandas` junto. O único ajuste não trivial dele, a renegociação TLS legada, deixou de ser necessário: um GET simples à API do IBGE funciona.

### D2 — Dado externo passa por um cache SQLite descartável: tela → banco → fonte
**Status:** ✅ Decidida

**Decisão:**
- Cada fonte externa é um provider em `backend/adapters/`.
- O dado vai para `observations` (série, data de referência, valor), e as tentativas de busca vão para `fetch_log`.
- A tela lê só do banco.
- O refresh decide se vai à rede. A fonte só é consultada quando falta um dado que já devia ter sido publicado, e no máximo uma vez por intervalo. É o mecanismo do Finance Manager (`refresh_indexes` + `fetch_log`).

**Por quê:** as fontes oficiais mudam de formato, ficam fora do ar e limitam requisições. Com o cache em dia, o app funciona offline e o refresh é idempotente: chamá-lo de novo não sai da máquina.

**Consequências:**
- **O banco só guarda dado público,** que pode ser rebaixado da fonte a qualquer momento. Por isso, diferente do Finance Manager, não há snapshot nem backup. O Alembic continua, para evoluir o schema.
- **Toda busca rebaixa uma janela final** (os últimos 12 meses), porque PIB e estatística fiscal são revisados depois de publicados.
- **Trocar de fonte fica restrito a `adapters/`.**

### D3 — Toda conta econômica mora no backend, em float, e taxa se compõe multiplicando
**Status:** ✅ Decidida

**Decisão:**
- Percentuais nunca se somam nem se subtraem.
- Acumular é multiplicar: `Π(1 + xᵢ) − 1`. Assim, 1% num mês e 2% no seguinte dão 3,02%, não 3%.
- Descontar uma taxa de outra é dividir: `(1 + a) / (1 + b) − 1`. Isso vale para poder de compra, juro real e a dinâmica da dívida.
- Os valores são float.
- As contas moram no Python (`backend/domain/`), e o front só formata.

**Por quê:**
- A subtração é uma aproximação, e o erro dela cresce com a magnitude dos números. Com inflação de dois dígitos, ela deixa de ser desprezível.
- Float, e não Decimal: são estatísticas publicadas com 2 casas, não dinheiro. É o mesmo argumento que o Finance Manager usa para volatilidade e correlação.

**Atualização (2026-10-06):** o acumulado de um período compõe as variações mensais que o IBGE publica, com 2 casas. O número oficial do ano é calculado pelo IBGE a partir do índice sem arredondar, e por isso os dois diferem em até ~0,02 ponto percentual. Em 2022, a composição dá 5,78% e o oficial é 5,79%; Alimentação e bebidas dá 11,63% contra 11,64%. A tela avisa a diferença.

A alternativa avaliada foi guardar também os acumulados oficiais que a tabela 7060 publica por grupo (no ano e em 12 meses) e encadeá-los. Ela bateria com o oficial no ano cheio, mas dobraria as séries e o código do provider. Ficou de fora pela simplicidade: a composição dos mensais é o que o app Streamlit já fazia.

### D4 — Conceito é um registro único e tipado no front, chaveado pelo id que o backend exporta
**Status:** ✅ Decidida

**Decisão:**
- O backend identifica cada série pelo enum `SeriesId`, que chega ao front pelo OpenAPI.
- O front guarda as explicações em `concepts: Record<ConceptId, Concept>`, em que `ConceptId` é `SeriesId` mais os conceitos sem série própria (inflação inercial, dominância fiscal…).
- Cada `Concept` tem:
  - título, sigla e resumo de uma linha;
  - o que mede;
  - um exemplo numérico;
  - o que é valor bom e o que é ruim;
  - a fórmula em LaTeX com a legenda das variáveis;
  - onde a fonte oficial publica;
  - os conceitos relacionados.
- O "?" com hover card, a aba Aprender e o card do painel leem o mesmo registro.

**Por quê:** com `Record`, uma série nova sem explicação não compila. Explicar toda métrica (N2) deixa de depender de alguém lembrar. E o texto mora perto de quem o renderiza (markdown e KaTeX).

### D5 — Cada grupo do IPCA tem cor e ícone fixos
**Status:** ✅ Decidida

**Decisão:**
- Cada um dos 9 grupos do IPCA, mais o índice geral, tem uma cor e um ícone (lucide) que não mudam de tela para tela:

  | Grupo | Ícone | Cor |
  |---|---|---|
  | Índice geral | `ChartNoAxesCombined` | `#9AA0A8` |
  | Alimentação e bebidas | `Utensils` | `#E8853D` |
  | Habitação | `House` | `#7C83E6` |
  | Artigos de residência | `Sofa` | `#B07AD9` |
  | Vestuário | `Shirt` | `#E66AA6` |
  | Transportes | `Car` | `#2FB3A6` |
  | Saúde e cuidados pessoais | `HeartPulse` | `#4FB061` |
  | Despesas pessoais | `Wallet` | `#C9A43A` |
  | Educação | `GraduationCap` | `#3FA7E0` |
  | Comunicação | `Smartphone` | `#8E9AAF` |

- O nome do grupo aparece sempre num chip: o ícone num quadrado tingido com a cor, ao lado do nome.
- A cor do grupo pinta a marca do gráfico (barra, linha) só onde a cor não codifica outra coisa. No mapa de calor a cor é o valor, e no poder de compra é ganho ou perda; nesses gráficos a identidade do grupo fica só no chip.

**Por quê:**
- O usuário reconhece o grupo pelo desenho antes de ler o nome, em qualquer tela.
- São 10 identidades, acima das cerca de 8 cores que o olho separa com segurança. Por isso o ícone carrega a identidade junto com a cor, e a cor sozinha nunca é a única pista.

**Consequências:** a paleta é do domínio do IPCA. Séries de outro domínio (juros, contas públicas) quase nunca aparecem junto com os grupos e podem reaproveitar as cores. As cores exatas podem mudar nas rodadas de design da D6; a regra de uso fica.

### D6 — Linguagem visual própria, definida no canvas antes de virar código
**Status:** ✅ Decidida

**Decisão:** toda tela segue a linguagem aprovada nas rodadas de design do canvas, a mesma das telas de inflação e de poder de compra.

**Base visual:**
- paleta própria em claro e escuro: papel, folha, tinta e régua, mais o marca-texto amarelo para o número em destaque, o par vermelho (sobe, perde) e azul (desce, ganha) para tendência e verde para "dentro da faixa";
- Bricolage Grotesque nos títulos e nos números grandes, Public Sans no texto, em corpo 15px; a explicação vem na cor normal do texto, e não em cinza miúdo;
- fórmulas em KaTeX;
- o título da página é o nome da tela, com uma linha embaixo dizendo o que ela mostra; os controles, como o período, ficam abaixo do título.

**Padrão de toda tela:**
- **Resumo:** cartões de número no topo, cada um com um "?" curto: o que o número é e como lê-lo, em duas ou três frases. Quando a conta é longa, o "?" leva até ela em vez de repeti-la.
- **Cartão de gráfico:** o título diz o que o gráfico mostra, e a linha de apoio dá o período e a unidade. A explicação longa mora na bandeja no pé do cartão, que começa fechada e abre pelo botão "Como ler" ou "Ver a conta" no cabeçalho.
- **Conta:** a fórmula vem separada do exemplo. Primeiro a fórmula, com a legenda de cada símbolo; depois a mesma conta com os números da tela.
- **Semáforo:** verde, amarelo e vermelho só onde existe faixa oficial, como a meta de inflação. Sem faixa, o número aparece com a referência escrita ao lado.
- **Grupos do IPCA:** sempre no chip da D5.

**Por quê:**
- O texto cinza pequeno debaixo do título tem cara de letra miúda, e o olho aprende a pulá-lo. O conteúdo é importante, mas a hierarquia visual diz que não é.
- A bandeja tira a explicação longa do caminho de quem só quer o número, sem escondê-la: o botão fica no cabeçalho do gráfico que ela explica.
- A fórmula sozinha ensina a regra, e o exemplo com número inventado obriga a traduzi-lo para os números reais. Os dois juntos, com os números da tela, mostram que a regra dá exatamente o número que está ali.
- Cor de semáforo sem faixa oficial vira opinião do app.
- O visual herdado do Finance Manager era uma cópia, e o app pede identidade própria.

**Consequências:**
- O catálogo de conceitos (F7) guarda os textos dos "?" e das bandejas, que hoje moram nos componentes das telas.
- Toda tela nova nasce no padrão, a partir da prancha dela no canvas.
