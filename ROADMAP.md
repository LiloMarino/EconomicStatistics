<!-- ARQUIVO GERADO POR scripts/roadmap.py (skill feature-roadmap) -- NÃO EDITAR À MÃO. -->

> ⚠️ **Este arquivo é gerado automaticamente — não edite manualmente.** Toda mudança (inserir/mover/concluir/descartar/remover um card, cadastrar ou atualizar uma necessidade/decisão/marco, o cabeçalho) passa por `scripts/roadmap.py` (ver `SKILL.md`); uma edição direta aqui é sobrescrita sem aviso na próxima regeneração.

# Roadmap — EconomicStatistics

> Kanban de features, segue a metodologia da skill `feature-roadmap`. Companion: [DECISIONS.md](DECISIONS.md) — lá está o "porquê" (necessidades `N#` e decisões `D#`); aqui fica só o "o quê construir, em que marco e em que estado está".
>
> **Regra de sincronização:** os dois documentos usam os mesmos IDs (`N#`, `D#`) e devem sempre concordar sobre a decisão vigente de cada item.
>
> **Última mudança (2026-10-07):** IPCA por grupo desde 1999 concluído, e o Aprender passou a citar a fonte de cada fato e a mostrar a composição de cada grupo do IPCA.

## Glossário

> Descrição completa de cada `N#`/`D#` em `DECISIONS.md`; `F#` é espelho do kanban abaixo. "Condiciona" é derivado dos cards: as `F#` que citam aquele `N#`/`D#`.

| ID | Resumo | Condiciona (F#) | Status |
| --- | --- | --- | --- |
| **N1** | Acompanhar a economia brasileira num lugar só | F1, F2, F3, F4, F5, F10, F11, F12, F20, F21, F25, F26 | — |
| **N2** | Entender o que cada número significa enquanto olho | F1, F7, F8, F9, F22, F23, F25, F26 | — |
| **N3** | Saber em que áreas de gasto o dinheiro passou a comprar mais ou menos | F1, F2, F3, F4, F6, F20, F23 | — |
| **N4** | Saber se a dívida pública está sob controle | F4, F13, F14, F16, F24 | — |
| **N5** | Saber se a economia está saudável ou caminhando para uma crise | F9, F10, F17, F21, F24 | — |
| **N6** | Saber como o déficit é financiado | F4, F13, F16 | — |
| **F9** | Explicadores de mecanismo: inércia, Plano Real, os quatro ciclos, dívida × inflação, r − g | — | ⏳ |
| **F10** | Fonte Focus/BCB: expectativas de mercado | — | ⏳ |
| **F11** | Painel "Visão geral": inflação e juros, contas públicas, atividade e setor externo | — | ⏳ |
| **F12** | Tela de série: histórico, período e comparação na URL | — | ⏳ |
| **F13** | Tela Déficit: primário, juros e nominal | — | ⏳ |
| **F14** | Tela Dívida: r, g, r − g e o primário que estabiliza | — | ⏳ |
| **F15** | Como medir o financiamento monetário do déficit | — | 🔍 |
| **F16** | Composição da dívida pública federal (Tesouro), na tela Dívida | — | ⏳ |
| **F17** | "Check engine": semáforo dos sinais de crise | — | ⏳ |
| **F24** | Simulador da dívida, com casos que aconteceram e exemplos | — | ⏳ |

<details>
<summary><strong>Concluído / decidido / descartado (22 itens — clique pra expandir)</strong></summary>

| ID | Resumo | Condiciona (F#) | Status |
| --- | --- | --- | --- |
| **D1** | Stack igual à do Finance Manager | F1 | ✅ |
| **D2** | Dado externo passa por um cache SQLite descartável: tela → banco → fonte | F2, F3, F4, F10, F16, F20 | ✅ |
| **D3** | Toda conta econômica mora no backend, em float, e taxa se compõe multiplicando | F2, F5, F6, F14, F21, F24, F25 | ✅ |
| **D4** | Conceito é um registro único e tipado no front, e toda série do backend aponta para um conceito | F7, F8, F11, F26 | ✅ |
| **D5** | Cada grupo do IPCA tem cor e ícone fixos | F21, F23, F25 | ✅ |
| **D6** | Linguagem visual própria, definida no canvas antes de virar código | F7, F8, F9, F11, F12, F13, F14, F16, F17, F22, F23, F24, F26 | ✅ |
| **F1** | Scaffold no padrão do Finance Manager, aposentando o Streamlit | — | ✅ |
| **F2** | Cache de séries no SQLite com refresh idempotente | — | ✅ |
| **F3** | Fonte IBGE: IPCA por grupo (tabela 7060) | — | ✅ |
| **F4** | Fonte BCB/SGS, portada do Finance Manager e parametrizada por código | — | ✅ |
| **F5** | Tela de inflação por categoria (os três gráficos atuais) | — | ✅ |
| **F6** | Poder de compra por categoria: conta exata e quatro referências de reajuste | — | ✅ |
| **F7** | Catálogo de conceitos: os textos dos "?" num registro único | — | ✅ |
| **F8** | Aba Aprender: glossário e página por conceito | — | ✅ |
| **F18** | Linha do tempo histórica com os episódios marcados | — | 🚫 |
| **F19** | Comparação internacional da dívida (FMI) | — | 🚫 |
| **F20** | IPCA por grupo desde 1999 (emenda das tabelas do IBGE) | — | ✅ |
| **F21** | Inflação acelerando ou freando | — | ✅ |
| **F22** | Rodadas de design no canvas | — | ✅ |
| **F23** | Linguagem visual nas telas que existem | — | ✅ |
| **F25** | Comparação com o mesmo mês de outros anos | — | ✅ |
| **F26** | Busca com Ctrl+K: telas e conceitos | — | ✅ |

</details>

---

## 🚦 Livre pra pegar

> Derivado do grafo de dependências: as `F#` que podem ser pegas agora — toda dependência já ✅. "Destrava" é quantas `F#` em aberto esperam por ela, direta ou indiretamente; é por aí que a tabela está ordenada. 💤 (sem prioridade) e 🚫 não entram.

| ID | Resumo | Marco | Destrava | Status |
| --- | --- | --- | --- | --- |
| **F13** | Tela Déficit: primário, juros e nominal | M4 | 5 | ⏳ |
| **F10** | Fonte Focus/BCB: expectativas de mercado | M3 | 2 | ⏳ |
| **F16** | Composição da dívida pública federal (Tesouro), na tela Dívida | M4 | 1 | ⏳ |
| **F9** | Explicadores de mecanismo: inércia, Plano Real, os quatro ciclos, dívida × inflação, r − g | M2 | 0 | ⏳ |
| **F12** | Tela de série: histórico, período e comparação na URL | M3 | 0 | ⏳ |

---

## 🧭 Marcos

### M1 — Inflação e poder de compra na nova stack

> **Objetivo:** O que o Streamlit faz hoje, com o SQLite de cache e o poder de compra corrigido nas quatro referências de reajuste.
>
> **Serve:** N1, N3
>
> **Progresso:** 6/6 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| — | *(nada em aberto)* | — | — |

<details><summary>Concluído (6 itens)</summary>

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F1** | Scaffold no padrão do Finance Manager, aposentando o Streamlit | — | ✅ |
| **F2** | Cache de séries no SQLite com refresh idempotente | F1 | ✅ |
| **F3** | Fonte IBGE: IPCA por grupo (tabela 7060) | F2 | ✅ |
| **F4** | Fonte BCB/SGS, portada do Finance Manager e parametrizada por código | F2 | ✅ |
| **F5** | Tela de inflação por categoria (os três gráficos atuais) | F3 | ✅ |
| **F6** | Poder de compra por categoria: conta exata e quatro referências de reajuste | F3, F4 | ✅ |

</details>

### M2 — Camada didática

> **Objetivo:** Todo número na tela tem um "?" com explicação e fórmula, e a aba Aprender permite estudar os conceitos.
>
> **Serve:** N2
>
> **Progresso:** 3/4 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F9** | Explicadores de mecanismo: inércia, Plano Real, os quatro ciclos, dívida × inflação, r − g | F8 | ⏳ |

<details><summary>Concluído (3 itens)</summary>

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F7** | Catálogo de conceitos: os textos dos "?" num registro único | F22 | ✅ |
| **F8** | Aba Aprender: glossário e página por conceito | F7 | ✅ |
| **F26** | Busca com Ctrl+K: telas e conceitos | F8 | ✅ |

</details>

### M3 — Painel da economia

> **Objetivo:** Uma tela com os indicadores principais atualizados, em três blocos: inflação e juros, contas públicas, atividade e setor externo.
>
> **Serve:** N1
>
> **Progresso:** 0/3 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F10** | Fonte Focus/BCB: expectativas de mercado | F2 | ⏳ |
| **F11** | Painel "Visão geral": inflação e juros, contas públicas, atividade e setor externo | F4, F7, F10, F13 | ⏳ |
| **F12** | Tela de série: histórico, período e comparação na URL | F4 | ⏳ |

### M4 — Dívida e déficit

> **Objetivo:** Ver onde está o déficit, como ele é financiado e se a dívida se estabiliza.
>
> **Serve:** N4, N6
>
> **Progresso:** 0/5 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F13** | Tela Déficit: primário, juros e nominal | F4 | ⏳ |
| **F14** | Tela Dívida: r, g, r − g e o primário que estabiliza | F13 | ⏳ |
| **F15** | Como medir o financiamento monetário do déficit | F13, F16 | 🔍 |
| **F16** | Composição da dívida pública federal (Tesouro), na tela Dívida | F2 | ⏳ |
| **F24** | Simulador da dívida, com casos que aconteceram e exemplos | F14 | ⏳ |

### M5 — Saúde da economia

> **Objetivo:** Os sinais que costumam piorar antes de uma crise, com cor só onde existe faixa oficial.
>
> **Serve:** N5
>
> **Progresso:** 0/1 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F17** | "Check engine": semáforo dos sinais de crise | F11, F14 | ⏳ |

### M6 — Linguagem visual própria e ritmo da inflação

> **Objetivo:** As telas de inflação e de poder de compra na linguagem visual aprovada no canvas, com a seção acelerando ou freando.
>
> **Serve:** N1, N2, N3
>
> **Progresso:** 4/4 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| — | *(nada em aberto)* | — | — |

<details><summary>Concluído (4 itens)</summary>

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F21** | Inflação acelerando ou freando | F5 | ✅ |
| **F22** | Rodadas de design no canvas | — | ✅ |
| **F23** | Linguagem visual nas telas que existem | F22, F7 | ✅ |
| **F25** | Comparação com o mesmo mês de outros anos | F5 | ✅ |

</details>

### Sem marco

> **Progresso:** 1/1 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| — | *(nada em aberto)* | — | — |

<details><summary>Concluído (1 item)</summary>

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F20** | IPCA por grupo desde 1999 (emenda das tabelas do IBGE) | F3 | ✅ |

</details>

---

## 1. Atende necessidade

| ID | Resumo | Atende (N#) | D# | Marco | Depende de | Esforço | Risco | Valor | Custo-benefício | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **F1** | Scaffold no padrão do Finance Manager, aposentando o Streamlit | N1, N2, N3 | D1 | M1 | — | Médio | Baixo | Alto | Excelente | ✅ Concluído |
| **F2** | Cache de séries no SQLite com refresh idempotente | N1, N3 | D2, D3 | M1 | F1 | Médio | Médio | Alto | Excelente | ✅ Concluído |
| **F3** | Fonte IBGE: IPCA por grupo (tabela 7060) | N1, N3 | D2 | M1 | F2 | Baixo | Médio | Alto | Excelente | ✅ Concluído |
| **F4** | Fonte BCB/SGS, portada do Finance Manager e parametrizada por código | N1, N3, N4, N6 | D2 | M1 | F2 | Baixo | Baixo | Alto | Excelente | ✅ Concluído |
| **F5** | Tela de inflação por categoria (os três gráficos atuais) | N1 | D3 | M1 | F3 | Médio | Baixo | Alto | Bom | ✅ Concluído |
| **F6** | Poder de compra por categoria: conta exata e quatro referências de reajuste | N3 | D3 | M1 | F3, F4 | Médio | Médio | Alto | Excelente | ✅ Concluído |
| **F7** | Catálogo de conceitos: os textos dos "?" num registro único | N2 | D4, D6 | M2 | F22 | Médio | Baixo | Alto | Excelente | ✅ Concluído |
| **F8** | Aba Aprender: glossário e página por conceito | N2 | D4, D6 | M2 | F7 | Médio | Baixo | Alto | Bom | ✅ Concluído |
| **F9** | Explicadores de mecanismo: inércia, Plano Real, os quatro ciclos, dívida × inflação, r − g | N2, N5 | D6 | M2 | F8 | Médio | Médio | Médio | Bom | ⏳ Pendente |
| **F10** | Fonte Focus/BCB: expectativas de mercado | N1, N5 | D2 | M3 | F2 | Baixo | Médio | Médio | Bom | ⏳ Pendente |
| **F11** | Painel "Visão geral": inflação e juros, contas públicas, atividade e setor externo | N1 | D4, D6 | M3 | F4, F7, F10, F13 | Médio | Médio | Alto | Excelente | ⏳ Pendente |
| **F12** | Tela de série: histórico, período e comparação na URL | N1 | D6 | M3 | F4 | Médio | Baixo | Médio | Bom | ⏳ Pendente |
| **F13** | Tela Déficit: primário, juros e nominal | N4, N6 | D6 | M4 | F4 | Baixo | Médio | Alto | Excelente | ⏳ Pendente |
| **F14** | Tela Dívida: r, g, r − g e o primário que estabiliza | N4 | D3, D6 | M4 | F13 | Médio | Médio | Alto | Excelente | ⏳ Pendente |
| **F23** | Linguagem visual nas telas que existem | N2, N3 | D5, D6 | M6 | F22, F7 | Médio | Baixo | Alto | Bom | ✅ Concluído |
| **F21** | Inflação acelerando ou freando | N1, N5 | D3, D5 | M6 | F5 | Médio | Baixo | Alto | Excelente | ✅ Concluído |
| **F24** | Simulador da dívida, com casos que aconteceram e exemplos | N4, N5 | D3, D6 | M4 | F14 | Médio | Baixo | Alto | Excelente | ⏳ Pendente |
| **F16** | Composição da dívida pública federal (Tesouro), na tela Dívida | N4, N6 | D2, D6 | M4 | F2 | Médio | Médio | Alto | Bom | ⏳ Pendente |
| **F17** | "Check engine": semáforo dos sinais de crise | N5 | D6 | M5 | F11, F14 | Médio | Baixo | Alto | Bom | ⏳ Pendente |
| **F20** | IPCA por grupo desde 1999 (emenda das tabelas do IBGE) | N3, N1 | D2 | — | F3 | Baixo | Baixo | Alto | Excelente | ✅ Concluído |
| **F22** | Rodadas de design no canvas | N2 | D6 | M6 | — | Médio | Baixo | Alto | Excelente | ✅ Concluído |
| **F25** | Comparação com o mesmo mês de outros anos | N1, N2 | D3, D5 | M6 | F5 | Médio | Baixo | Alto | Bom | ✅ Concluído |
| **F26** | Busca com Ctrl+K: telas e conceitos | N1, N2 | D4, D6 | M2 | F8 | Baixo | Baixo | Alto | Excelente | ✅ Concluído |

**F1 — Scaffold no padrão do Finance Manager.** Feito.

**Backend:** a estrutura e as configurações vieram do Finance Manager, com três cortes:
- **Decimal:** sai, porque aqui o valor é float.
- **Snapshot e dry-run de migration:** saem, porque o banco é cache de dado público e o `migrate()` é só `alembic upgrade head`.
- **Dependências:** o `pyproject.toml` ficou com alembic, fastapi, pydantic, pydantic-settings, sqlalchemy e uvicorn, sem pandas.

**Frontend:** vieram do Finance Manager:
- as configurações (Vite 8, TS 6, oxlint/oxfmt, shadcn base-nova);
- o gerador de tipos, sem os transforms de Decimal e Blob;
- os componentes de UI usados;
- o `index.css`, sem os tokens de carteira (referências, liquidez, subcarteira, compra/venda).

O layout tem sidebar e toggle de tema, e os caminhos são em inglês (`/inflation`, `/purchasing-power`), como no Finance Manager. `CLAUDE.md` e `README.md` adaptados. Saem o Streamlit, o `requirements.txt` e o launch do VS Code.

**Limitação:** `venv/`, `__pycache__/` e `ipca_cache.csv` não puderam ser apagados pela sessão (permissão negada) e ficam para remoção manual; os dois primeiros já estão no `.gitignore`.

**F2 — Cache de séries no SQLite.** Feito.

**Registro das séries.** O registro é `SERIES: dict[SeriesId, SeriesSpec]` (`backend/domain/series.py`), com fonte, código, unidade, primeira data, atraso em meses e dia de publicação.

**Tabelas** (primeira migration):
- `observations(series_id, ref_date, value)`;
- `fetch_log(series_id, attempted_at, succeeded_at, gap)`.

O `series_id` é texto sem CHECK, então uma série nova entra no registro sem migration.

**Decisão de ida à fonte** (`domain/coverage.py`, porte do Finance Manager generalizado pelo spec):
- a referência esperada é o mês `hoje − atraso`, com um mês a menos antes do dia de publicação;
- na primeira carga, busca a série inteira; depois, a janela de 12 meses antes do último em cache;
- no máximo uma tentativa a cada 6 h.

**Refresh e API:**
- o refresh (`features/series/refresh.py`) roda um por vez e consulta a rede fora da transação;
- falha da fonte deixa o cache como estava, e o `failed` traz só a falta nova;
- os endpoints são `POST /api/series/refresh` e `GET /api/series/status`.

**Front.** Dispara o refresh ao abrir o app e mostra "IPCA até <mês>" no rodapé da sidebar.

**Aceite cumprido:** dois refreshes seguidos, e um terceiro 7 h depois, fazem zero consultas (`test_second_refresh_does_not_hit_the_source`).

**F3 — Fonte IBGE (tabela 7060).** Feito. O `IbgeAggregatesProvider` (`backend/adapters/ibge_provider.py`) usa a API de agregados v3 com `urllib` + Pydantic, e descomprime o gzip que parte dos endpoints manda sem o cliente pedir. Cada um dos 10 grupos é um `SeriesId`, com o código `7060/63/315/<categoria>` no registro.

**Correção de convenção:** no IBGE, `"-"` é **zero absoluto** e vira 0. Só `".."`, `"..."` e `"X"` são valor inexistente e ficam de fora. Os rótulos são do app, porque a API devolve os nomes de categoria com acentuação corrompida.

**Limitação:** uma consulta por grupo (10 na primeira carga, cerca de 0,4 s cada).
**Aceite:** as variações mensais de 2022 batem com as do IBGE. O acumulado compõe esses mensais de 2 casas e dá 5,78% no índice geral e 11,63% em Alimentação e bebidas; o IBGE publica 5,79% e 11,64%, calculados do índice sem arredondar.

**F4 — Fonte BCB/SGS.** Feito. Porte do `bcb_sgs_provider.py` do Finance Manager, com a janela de 10 anos e o 404 como janela vazia; o código vem do registro, e o valor vira float.

**Séries:**
- **INPC:** SGS 188, desde abr/1979.
- **Salário mínimo:** SGS 1619. O registro começa em jul/1994, porque antes do Real o valor está em outras moedas e a razão entre dois meses deixa de ser reajuste. O SGS publica o ano inteiro do mínimo já em janeiro, e por isso o registro dele não tem atraso de publicação.

**F5 — Tela de inflação por categoria.** Feito. API `GET /api/inflation/groups` e tela `/inflation`. As contas moram em `backend/domain/rates.py` e fazem uma passada só, com o 12 meses lendo os 11 meses anteriores ao período.

**Período:** fica na URL (`?start=AAAA-MM&end=AAAA-MM`). Os atalhos são "Ano atual", "12 meses", "Ano anterior" e "Tudo", mais dois seletores de mês. Sem período, vale o ano do último dado.

**Os três gráficos mudaram de forma em relação ao Streamlit.** A regra de no máximo 8 cores categóricas não comporta 10 séries:
- **variação mensal:** mapa de calor grupo × mês, divergente azul↔vermelho com cinza no zero. Tem o valor em cada célula, e por isso serve também de tabela.
- **acumulado no período:** barras de uma cor, ordenadas, com o índice geral tracejado;
- **acumulado de 12 meses:** pequenos múltiplos, um painel por grupo na mesma escala, com o índice geral tracejado.

Os eixos usam ticks "redondos" (`shared/lib/nice-scale.ts`), e cada gráfico traz a descrição de como ler.

**Limitações:**
- o 12 meses só existe a partir de dez/2020, porque a série por grupo começa em jan/2020;
- o acumulado difere do oficial em até ~0,02 pp, e a tela avisa (decisão registrada na D3).

**F6 — Poder de compra por categoria.** Feito. API `GET /api/inflation/purchasing-power` e tela `/purchasing-power`. A conta é `(1 + reajuste) / (1 + inflação do grupo) − 1` (`real_change`), e substitui a subtração do Streamlit.

**Referências** (na URL, `?reference=…&raise=…`):
- IPCA geral;
- INPC (SGS 188);
- salário mínimo ponto a ponto: o valor do fim do período sobre o do mês anterior ao início;
- reajuste digitado, com vírgula aceita.

**Erros tratados:**
- reajuste digitado sem valor dá 422;
- INPC ou mínimo faltando no período dá 409, com o motivo.

**Tela:**
- barras divergentes ordenadas da maior perda ao maior ganho, num eixo simétrico em torno do zero;
- vermelho é perda e azul é ganho, o mesmo par do mapa de calor;
- uma frase de leitura com o reajuste, a maior perda e o maior ganho;
- a conta escrita com exemplo.

**Aceite cumprido:** em 2022, com a referência IPCA geral, Alimentação e bebidas dá −5,24%, no teste e na tela com dados reais. O salário mínimo de 2022 dá reajuste de 10,18%, e o INPC de 2022 dá 5,93%.

**F7 — Catálogo de conceitos.** Feito.

**Registro** (`frontend/shared/concepts/`):
- `concepts: Record<ConceptId, Concept>` com 11 conceitos: IPCA, INPC, grupo do IPCA, acumulado, acumulado em 12 meses, efeito base, sazonalidade, ponto percentual, poder de compra, meta de inflação e salário mínimo;
- cada `Concept` tem título, sigla, tema, resumo de uma linha, o `lead` de duas ou três frases, palavras-chave, o que mede, a fórmula com legenda, o exemplo datado com números reais, como ler, os cuidados, os relacionados, a fonte oficial e as telas em que aparece;
- `conceptBySeries: Record<SeriesId, ConceptId>` obriga toda série do backend a ter conceito (D4).

**Nas telas:**
- o "?" de um número do resumo é o `ConceptHint`: mostra o `lead` do conceito e "Ver em Aprender";
- o "?" do ritmo continua contextual, porque explica a conta da tela;
- o bloco da bandeja que trata de um conceito ("O que cada ponto é", "Efeito base", "p.p. não é %", "Sazonalidade", as fórmulas do acumulado e do poder de compra) leva à página dele.

**Os exemplos** usam os números do banco até ago/2026, calculados com as contas de `backend/domain/rates.py`. Os fatos foram conferidos na fonte: faixa de renda e áreas do IPCA e do INPC (IBGE), meta contínua de 3% ± 1,5 p.p. desde 2025 (CMN) e a regra do mínimo (Lei 14.663/2023, ganho real limitado a 2,5% desde 2025).

**Limitação:** só os conceitos de inflação. Os de juros, contas públicas, atividade e setor externo entram com as features que os mostram.

**F8 — Aba Aprender.** Feito, a partir das pranchas `Learn` e `Concept` do canvas.

**`/learn`:** o glossário. Tem a busca (ignora acento) e o tema, os dois na URL (`?q=`, `?topic=`). Os conceitos aparecem agrupados por tema, em cartões com título, sigla, resumo e a etiqueta "fórmula".

**`/learn/:conceptId`:** a página do conceito, toda lida do catálogo (F7):
- a trilha, o título e o `lead`;
- O que mede, A fórmula, o exemplo datado, É bom ou ruim?, Cuidado ao ler e Relacionados;
- ao lado, a fonte oficial, a frequência e as telas do app em que o conceito aparece.

Um id desconhecido mostra "Conceito não encontrado", com o link para o glossário.

**Relação com as telas:** a página é um superset do "?", que mostra o mesmo `lead`. Ela complementa as bandejas "Como ler"/"Ver a conta": as bandejas explicam aquele gráfico com os números da tela, e a página explica o conceito em geral.

**Fica para depois:**
- a seção "Como as coisas se ligam" entra com os explicadores (F9);
- o número de hoje e o gráfico da série na página do conceito entram com a tela de série (F12); até lá, o exemplo é fixo e datado.

**F9 — Explicadores de mecanismo.** Páginas longas em `/learn`, listadas no glossário (F8) na seção "Como as coisas se ligam", com o tempo de leitura. Uma por tema:
- inflação inercial e indexação, e por que a inércia não morreu com o Real: hoje ela aparece na inflação de serviços e nas expectativas acima da meta;
- URV e Plano Real;
- os quatro ciclos que se alimentam (inflação, juros, dívida e câmbio), num diagrama: inflação → reajustes → inflação; dívida → juros → déficit → dívida; dívida → risco → câmbio → inflação; inflação → juros → dívida;
- os três caminhos de dívida para inflação: câmbio, monetização e recessão por juros;
- dominância fiscal;
- por que r − g decide a trajetória da dívida, com o País A (dívida de 120%, r 2%, g 6%) e o País B (dívida de 60%, r 15%, g 3%).

**Links no meio do texto:** o explicador leva ao dado real e ao simulador no ponto em que o assunto aparece. O de r − g liga à tela Dívida ("ver r, g e o primário que estabiliza") e ao simulador com os números do País A e do País B ("mexer nesses números"). O cabeçalho cita os conceitos usados, cada um com link para a página dele (F8).

O ponto de partida é a conversa com o ChatGPT, e cada afirmação factual é conferida contra a fonte oficial (BCB, IBGE, Tesouro) antes de entrar. Esse é o motivo do risco médio.

**F10 — Fonte Focus/BCB.** Provider da API Olinda do BCB: `https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoAnuais`.
- **O que busca:** a mediana das expectativas de IPCA, Selic, PIB e câmbio para o ano corrente e os dois seguintes.
- **O que é essa série:** a pesquisa Focus, que o BC publica toda segunda-feira com o que o mercado espera.
- **Onde grava:** em `observations`, com um `SeriesId` por indicador e ano-alvo.

**F11 — Painel "Visão geral".** Três blocos de cards, nesta ordem. Os códigos SGS foram conferidos ao vivo em 2026-10-06, menos o da conta corrente:
- **Inflação e juros:** IPCA 12 meses (13522) × meta (13521), expectativas (F10), Selic meta (432) e juro real ex-ante.
- **Contas públicas:** dívida bruta do governo geral/PIB (13762, desde dez/2006), dívida líquida do setor público/PIB (4513, desde dez/2001) e o cartão "Resultado do governo em 12 meses": barras de primário, juros e nominal (F13), a frase com quanto do déficit é juro e o link para a tela Déficit.
- **Atividade e setor externo:** PIB em 12 meses em R$ (4382), desemprego da PNAD Contínua (24369), dólar PTAX (1 diário, 3698 média mensal), reservas internacionais (13621) e conta corrente em % do PIB em 12 meses (código a levantar na implementação).

Cada card traz o último valor, a variação, uma sparkline, o "dado até", a fonte e o "?" (D6). O clique leva à tela de série (F12). O `Record` da D4 obriga a existir conceito para cada card. O cabeçalho tem "Atualizar dados" com a hora da última verificação.

O juro real ex-ante é `(1 + Selic) / (1 + IPCA esperado em 12 meses) − 1`: o juro descontada a inflação que o mercado espera.

**Detalhe do SGS:** a série 432 publica a Selic meta até a próxima reunião do Copom, e por isso o último ponto tem data futura. O "dado até" do card usa a data de hoje.

**F12 — Tela de série.** A rota `/serie/:id` mostra o gráfico histórico de qualquer série. Tudo isto fica na URL:
- o período;
- a sobreposição de até três séries;
- a transformação: nível, variação mensal ou acumulado de 12 meses.

É o destino do clique em qualquer card do painel.

**F13 — Resultado fiscal decomposto.** A NFSP é a necessidade de financiamento do setor público, ou seja, o déficit. Na convenção da NFSP, valor positivo é déficit.

**Séries candidatas** (SGS, % do PIB, 12 meses, setor público consolidado, sem desvalorização cambial): nominal 5727, juros nominais 5728, primário 5793. As três respondem, mas não fecham a conta em ago/2026: 0,62 + 7,83 dá 8,45, e a 5727 diz 9,48. O primeiro passo da implementação é conferir o nome de cada código no catálogo do SGS e achar o trio que fecha `nominal = primário + juros`.

**Tela "Déficit"** (rota própria, separada da tela Dívida):
- três números de resumo, cada um com "?": déficit nominal, primário e juros da dívida, com quanto do déficit é juro;
- o cartão "De onde vem o déficit": barras empilhadas de primário e juros por ano, com o nominal marcado, e a bandeja "Como ler e a conta" (o que é cada parte e a conta do último mês, que aqui é soma porque são valores em % do PIB do mesmo período);
- a seção "Como o déficit é pago", que fica como esboço até a F15 fechar as séries.

Responde "onde se vê o déficit" e quanto dele é juro.

**Aceite:** o último mês bate com a nota de Estatísticas Fiscais do BCB do mesmo mês, e o primário somado aos juros dá o nominal.

**F14 — Dinâmica da dívida.**

**Definições:**
- **r**, o juro implícito: juros nominais de 12 meses ÷ dívida líquida média;
- **g**: crescimento do PIB nominal em 12 meses (SGS 4382).

**Primário que estabiliza a dívida:** `p* = d · (r − g) / (1 + g)`, composto como manda a D3. Comparado com o primário observado, ele diz se a dívida/PIB sobe ou desce.

**Exemplo de leitura:** com dívida de 80% do PIB, r = 10% e g = 7%, é preciso cerca de 2,2% do PIB de superávit só para a dívida não crescer.

**Conferência:** a IFI do Senado estima cerca de 2,1% do PIB de primário para estabilizar a dívida bruta (RAF 115, ago/2026). O p* do app usa a dívida líquida e r e g nominais observados, então não precisa bater. A ordem de grandeza serve de conferência, e a tela explica a diferença de conceito.

**Tela "Dívida"** (rota própria; a composição da F16 fica embaixo):
- quatro números de resumo com "?": dívida líquida, dívida bruta, r − g e o primário que falta para a dívida parar de subir;
- "A dívida sobe ou desce?": o primário feito contra o p*, a bandeja "Ver a conta" com a fórmula e a conta com os números, e o link para o simulador (F24);
- "Juro da dívida contra crescimento da economia": r e g em 12 meses, com sombra onde r passa g, e a bandeja "Como ler" com por que r − g decide e o caso de 2021 e 2022, quando a inflação alta fez g passar r. A bandeja liga ao explicador de r − g (F9).

**F23 — Linguagem visual nas telas que existem.** Feito.

**Base:**
- tokens da paleta da D6 no `index.css` (papel, folha, tinta, marca-texto, tendência, faixa de gráfico e os 10 `--group-*` da D5), em claro e escuro;
- Bricolage Grotesque e Public Sans pelo fontsource, sem rede;
- KaTeX nas fórmulas.

**Design system:**
- variantes novas: `pill` e `hint` no `Button`, `sheet` e `CardTray` no `Card`, `chip` no `Toggle` e `nav` no item da sidebar;
- `popover` e `collapsible` do shadcn.

**Componentes compartilhados:**
- `GroupChip`;
- `StatCard`;
- `HintButton`;
- `ExplainedCard`, o cartão com a bandeja "Como ler"/"Ver a conta";
- `Formula` e `FormulaBox`;
- `PeriodPicker` (Mês com setas, atalhos e Personalizado em dois cliques; o modo vai na URL);
- `PageHeader` com os controles embaixo.

**Sidebar:** sem a variante inset e só com as telas que existem.

**Telas:**
- inflação com os quatro números do resumo, o mapa de calor com a maior alta contornada e a nota sazonal, e o acumulado com a conta do grupo escolhido;
- poder de compra com os cartões de referência mostrando o reajuste de cada uma, o resumo e as barras clicáveis com a conta em R$ 100, a fórmula e "por que dividir".

As contas de contraste (soma simples e subtração) vêm da API (D3).

**Limitação:** os textos dos "?" estão nos componentes; o catálogo de conceitos (F7) os absorve.

**F21 — Inflação acelerando ou freando.** Feito. Um endpoint novo, `GET /api/inflation/pace?end=` (`features/inflation/service.py`), traz:
- o IPCA em 12 meses dos 24 meses até o fim do período, com o teto da meta de cada ano;
- os 3 últimos meses contra os mesmos do ano anterior;
- as inclinações de 1 e de 3 meses e o veredito (`domain/pace.py`: estável dentro de ±0,10 p.p. em 3 meses);
- por grupo, o 12 meses no fim e as janelas de 1, 3 e 6 meses, com a inclinação em p.p. e relativa.

**Meta de inflação:** é o SGS 13521. O registro de séries ganhou periodicidade anual: a meta do ano é cobrada desde janeiro. A tolerância de 1,5 ponto fica no registro.

**Tela:**
- o cartão "Ritmo da inflação", com o "?" curto que leva à conta de 1 e de 3 meses, com os números do mês, na bandeja do gráfico de 12 meses;
- o gráfico do 12 meses com o teto e o trecho dos 3 últimos meses na cor do veredito;
- a tabela "Quem acelerou e quem freou", com janela de 1, 3 ou 6 meses na URL.

**Aceite cumprido:** em ago/2026, entrou −0,32% e saiu −0,11%, e o 12 meses foi de 4,44% para 4,22%, −0,50 p.p. em 3 meses, "freando" (`test_pace_in_august_2026_is_slowing`).

**Limitação:** o ritmo precisa de 15 meses de IPCA antes do fim do período, então começa em mar/2021.

**F24 — Simulador da trajetória da dívida.** Partir de um caso que aconteceu ou de um exemplo, mexer em juros, crescimento e primário e ver a dívida/PIB dos próximos 10 anos. Absorve a pergunta da comparação internacional: "como um país com mais de 200% do PIB de dívida pode estar de boa".

**Backend:** `GET /api/debt/simulation?debt=&r=&g=&primary=&years=` devolve a trajetória ano a ano, com `d(t+1) = d(t) · (1 + r) / (1 + g) − p`, composta dividindo (D3), e o `p*` que estabiliza.

**Pontos de partida, em dois grupos:**
- **Casos que aconteceram:** Brasil hoje (com os valores da F14), Japão anos 2010, Grécia 2010 e Argentina 2001. Os parâmetros (dívida, r, g e primário) são conferidos com o FMI DataMapper na implementação. Escolher um caso abre o painel de contexto: moeda da dívida, quem empresta e o que aconteceu de verdade. Quando o usuário mexe nos números, o painel avisa que eles partiram daquele caso.
- **Exemplos para entender a conta:** País A (dívida de 120%, r 2%, g 6%, primário zero) e País B (dívida de 60%, r 15%, g 3%, déficit de 1%).

**Tela:**
- quatro controles, com o caso e os números na URL: dívida inicial (% do PIB), juro nominal efetivo, crescimento nominal do PIB, que aceita valor negativo, e primário (% do PIB, positivo é superávit);
- a linha da dívida/PIB por 10 anos;
- dois resultados, cada um com "?": a dívida em 10 anos, com a frase de que sobe ou desce, e o primário que estabiliza, com a distância para o primário escolhido;
- a bandeja "Como funciona": a corrida entre r e g; o que o simulador não vê (juro e câmbio que reagem à desconfiança, como na Argentina em 2002); por que o tamanho não basta (dever na própria moeda, para gente de dentro, contra dever em moeda que o país não emite), com o link para o explicador de r − g (F9);
- a bandeja "Ver a conta": a fórmula com legenda e o primeiro ano com os números escolhidos.

**Aceite:** com d = 80%, r = 10%, g = 7% e primário igual ao p* (2,24% do PIB), a dívida fica em 80% em todos os anos.

**F16 — Composição da dívida pública federal.**

**Fonte:** o CSV "Estoque da Dívida Pública Federal" do Tesouro Transparente (CKAN, dataset `estoque-da-divida-publica-federal`). É mensal desde set/2017, tem cerca de 12 MB e traz uma linha por título e mês: título, vencimento, valor, quantidade, mês, carteira ("Mercado" ou "Banco Central") e tipo (interna ou externa). O arquivo vem em latin-1, com separador `;` e decimal com vírgula.

**Provider:** baixa o CSV inteiro e agrega por mês no backend. Grava em `observations` uma série derivada por agregado (D2):
- **composição por indexador**, pelo prefixo do título: LFT → Selic; LTN e NTN-F → prefixado; NTN-B → IPCA; NTN-C → IGP-M; dívida externa → câmbio; títulos legados (TDA, NTN-I, CVS…) → "outros";
- **prazo médio**, ponderado pelo valor;
- **vencimentos nos próximos 12 meses**, que é quanto o governo precisa refinanciar;
- **parcela na carteira do Banco Central**, que alimenta a F15.

**Tela "Dívida",** abaixo da dinâmica (F14):
- o cartão "De que é feita a dívida federal": barras empilhadas por indexador, em dezembro de cada ano, com a bandeja "Como ler" (por que o indexador importa; prazo e vencimentos);
- três números com "?": prazo médio, vencimentos em 12 meses e a parcela na carteira do BC, que liga com a tela Déficit (F15).

**Fora:** detentores e custo médio, que só existem no Relatório Mensal da Dívida (PDF e anexo).

**Aceite:** a composição por indexador do último mês bate com a do Relatório Mensal da Dívida do mesmo mês.

**F17 — "Check engine" da economia.** O semáforo só tem cor onde existe faixa oficial. Os outros sinais aparecem com o número e a referência escrita, sem cor, para o semáforo nunca virar opinião.

**Com cor:**
- **Inflação × meta:** IPCA 12 meses (13522) contra a meta de 3% com tolerância de 1,5 ponto (CMN, meta contínua desde 2025). Verde dentro do intervalo; amarelo fora há menos de 6 meses; vermelho fora por 6 meses seguidos, que é quando o BC tem de escrever a carta aberta.
- **Primário observado × primário que estabiliza (F14):** verde se o observado cobre o p*, vermelho se não cobre. A distância em pontos do PIB aparece escrita.

**Sem cor, com a referência escrita:**
- expectativas Focus × meta, sem faixa formal (F10);
- juro real ex-ante × juro neutro estimado pelo BC (cerca de 5%, Relatório de Política Monetária);
- desemprego × NAIRU estimada pela FGV-Ibre (9% a 9,5%, 2023), sem consenso;
- reservas pela métrica ARA do FMI (adequado entre 100% e 150%). O BC não publica o % do Brasil, e a tela cita o número do FMI com data;
- dívida/PIB, sem limiar de consenso, o que a tela diz;
- câmbio, sem faixa citável.

Cada sinal tem a fonte da faixa ligada e um `<ConceptHint>`.

**F20 — IPCA por grupo desde 1999.** Feito. Quatro tabelas do IBGE se emendam sem sobreposição, todas com a variável 63 e a classificação 315 e com os mesmos códigos de categoria (conferido ao vivo):

| Tabela | Período |
|---|---|
| 655 | ago/1999 a jun/2006 |
| 2938 | jul/2006 a dez/2011 |
| 1419 | jan/2012 a dez/2019 |
| 7060 | jan/2020 em diante |

**Implementação:**
- o `SeriesSpec` ganhou `earlier_codes`, as tabelas antigas com o último mês de cada uma, e `code_ranges` (`domain/series.py`) parte um pedido nos trechos de cada tabela;
- o provider do IBGE faz um pedido por tabela e emenda;
- a regra de busca (`domain/coverage.py`) passou a olhar as duas pontas do cache: quando o registro cobre meses mais antigos que o primeiro em cache, busca o trecho que falta. Foi o que trouxe o histórico para o cache que já existia, sem apagar nada.

**Aceite cumprido:**
- dez/2011 0,50% e jan/2012 0,56%, nas emendas;
- o acumulado de 2002 dá 12,53% e o de 2015, 10,67%, iguais aos oficiais;
- as 10 séries têm 325 meses, de ago/1999 a ago/2026, e o segundo refresh não consulta nada.

**Na tela:** o rodapé da inflação cita as quatro tabelas e avisa que a cesta de cada grupo muda a cada POF. O 12 meses por grupo passa a existir desde jul/2000, o ritmo desde nov/2000 e o poder de compra pelo salário mínimo ganha os grupos desde ago/1999.

**Fora:** antes de ago/1999 (tabela 58, 1991 a 1999) há só 7 grupos, com Transportes e Comunicação juntos e sem Educação.

**F22 — Rodadas de design no canvas.** Feito. O canvas de design foi iterado no Claude Design, em duas rodadas.

**Primeira rodada:** as pranchas de inflação por categoria e de poder de compra, o seletor de período, a navegação e o chip de grupo foram aprovados e implementados (F23).

**Segunda rodada:**
- a linha do tempo (F18) e a comparação internacional (F19) saíram; os países viraram casos do simulador (F24);
- as contas públicas viraram duas telas, Déficit (F13, com o esboço da F15) e Dívida (F14 e F16);
- o padrão de tela da D6 ficou fechado: "?" curto no resumo, conta na bandeja do gráfico, fórmula separada do exemplo e semáforo só com faixa oficial.

As pranchas das telas que faltam (Visão geral, tela de série, Aprender, página de conceito, Déficit, Dívida, simulador, saúde da economia e o explicador de r − g) seguem no canvas, como esboço de cada feature que as implementa.

**F25 — Comparação com o mesmo mês de outros anos.** Feito. `GET /api/inflation/seasonality?year=` (`domain/seasonality.py`) traz, para cada grupo:
- os meses do ano;
- por mês do calendário, a faixa (mínimo e máximo) e a média dos até 5 anos completos anteriores;
- o mês de maior desvio.

**Tela:** o cartão "Comparado com o mesmo mês de outros anos" tem:
- a escolha do grupo por chips, na URL;
- três números: maior desvio, típico e diferença;
- a linha do ano sobre a faixa e a média.

A nota do mapa de calor usa a mesma faixa para dizer se a maior alta do período é sazonal, e um mapa curto de causas conhecidas explica Educação em fevereiro.

**Aceite cumprido:** Educação em fev/2026 subiu 5,21%, contra a média de fevereiro de 2021 a 2025 de 4,81%.

**Histórico:** com a série por grupo desde ago/1999 (F20), a faixa tem sempre os 5 anos completos anteriores.

**F26 — Busca com Ctrl+K.** Feito, no molde da busca do Finance Manager e da prancha `Nav` do canvas (`layouts/command-search.tsx`, shadcn `command` com cmdk).

- **Abertura:** Ctrl+K (ou Cmd+K) em qualquer tela, ou o botão "Buscar" no topo da sidebar.
- **Grupos:**
  - "Conceitos em Aprender", vindos do catálogo (F7), com o resumo como subtítulo; sem nada digitado, os mais buscados (IPCA, acumulado em 12 meses, poder de compra);
  - "Telas", vindas da navegação, cada uma com descrição e palavras-chave.
- **Filtro:** ignora acento ("educacao" acha "Grupo do IPCA" pelo nome do grupo), e o resultado que bate no título vem antes.
- **Teclado:** ↑↓ navegam, Enter abre, Esc fecha; o rodapé leva a "Ver tudo em Aprender".

**Entra depois:** os explicadores (F9) como terceiro grupo, e as séries quando existir a tela de série (F12).

---
## 2. Nice-to-have

> Nenhum item nesta categoria atualmente.

---
## 3. Descartada

| ID | Resumo | N# | Status |
| --- | --- | --- | --- |
| **F18** | Linha do tempo histórica com os episódios marcados | N5, N2 | 🚫 Descartado |
| **F19** | Comparação internacional da dívida (FMI) | N4, N5 | 🚫 Descartado |

**F18 — Descartado.** 🚫 Descartada na segunda rodada de design (2026-10-07): a linha do tempo foi considerada irrelevante.

**F19 — Descartado.** 🚫 Descartada como tela própria na segunda rodada de design (2026-10-07) e absorvida pelo simulador da dívida (F24), que ganhou os casos Japão anos 2010, Grécia 2010 e Argentina 2001, com os parâmetros conferidos com o FMI DataMapper.

---
## 4. Incerta / exploratória

| ID | Resumo | Conexão | Marco | Depende de | Status |
| --- | --- | --- | --- | --- | --- |
| **F15** | Como medir o financiamento monetário do déficit | Serviria N6; falta separar gestão de liquidez do BC de financiamento do Tesouro | M4 | F13, F16 | 🔍 Em avaliação |

**F15 — Como medir o financiamento monetário.** As candidatas já têm fonte:
- **base monetária:** SGS 1788 responde (ago/2026: 432.655.492, provavelmente em R$ mil); falta conferir nome e unidade;
- **fatores condicionantes da base, operações com títulos públicos:** SGS 1809;
- **títulos da dívida na carteira do Banco Central:** o CSV de estoque do Tesouro (F16) separa a carteira "Banco Central" da carteira "Mercado".

**Na tela:** a seção "Como o déficit é pago" da tela Déficit (F13) fica como esboço no canvas: o fluxo déficit → Tesouro vende títulos → mercado ou carteira do BC, os números da base monetária e da carteira do BC, e a vedação do financiamento direto pela Lei de Responsabilidade Fiscal.

**O que o spike fecha,** lendo as notas de política monetária do BCB:
- como separar a gestão de liquidez do dia a dia do BC (operações compromissadas) do que seria financiamento do Tesouro;
- se a base monetária entra na tela ou só confunde, já que ela cresce também com a economia;
- a frase final, com os números de verdade, no formato "o déficit é financiado com títulos vendidos ao mercado; a parcela da dívida na carteira do BC é X%".
