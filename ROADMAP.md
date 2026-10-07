<!-- ARQUIVO GERADO POR scripts/roadmap.py (skill feature-roadmap) -- NÃO EDITAR À MÃO. -->

> ⚠️ **Este arquivo é gerado automaticamente — não edite manualmente.** Toda mudança (inserir/mover/concluir/descartar/remover um card, cadastrar ou atualizar uma necessidade/decisão/marco, o cabeçalho) passa por `scripts/roadmap.py` (ver `SKILL.md`); uma edição direta aqui é sobrescrita sem aviso na próxima regeneração.

# Roadmap — EconomicStatistics

> Kanban de features, segue a metodologia da skill `feature-roadmap`. Companion: [DECISIONS.md](DECISIONS.md) — lá está o "porquê" (necessidades `N#` e decisões `D#`); aqui fica só o "o quê construir, em que marco e em que estado está".
>
> **Regra de sincronização:** os dois documentos usam os mesmos IDs (`N#`, `D#`) e devem sempre concordar sobre a decisão vigente de cada item.
>
> **Última mudança (2026-10-07):** Features delineadas com as pesquisas de fonte: IPCA por grupo desde 1999, composição da dívida e check engine ganharam plano; entram o ritmo da inflação, o simulador da dívida e as rodadas de design (M6).

## Glossário

> Descrição completa de cada `N#`/`D#` em `DECISIONS.md`; `F#` é espelho do kanban abaixo. "Condiciona" é derivado dos cards: as `F#` que citam aquele `N#`/`D#`.

| ID | Resumo | Condiciona (F#) | Status |
| --- | --- | --- | --- |
| **N1** | Acompanhar a economia brasileira num lugar só | F1, F2, F3, F4, F5, F10, F11, F12, F20, F21 | — |
| **N2** | Entender o que cada número significa enquanto olho | F1, F7, F8, F9, F18, F23 | — |
| **N3** | Saber em que áreas de gasto o dinheiro passou a comprar mais ou menos | F1, F2, F3, F4, F6, F20, F23 | — |
| **N4** | Saber se a dívida pública está sob controle | F4, F13, F14, F16, F19, F24 | — |
| **N5** | Saber se a economia está saudável ou caminhando para uma crise | F9, F10, F17, F18, F19, F21 | — |
| **N6** | Saber como o déficit é financiado | F4, F13, F16 | — |
| **D6** | Linguagem visual própria, definida no canvas antes de virar código | F7, F23 | 🔍 |
| **F7** | Catálogo de conceitos, "?" com hover card e fórmula em KaTeX | — | ⏳ |
| **F8** | Aba Aprender: glossário e página por conceito | — | ⏳ |
| **F9** | Explicadores de mecanismo: inércia, Plano Real, dívida × inflação, r − g | — | ⏳ |
| **F10** | Fonte Focus/BCB: expectativas de mercado | — | ⏳ |
| **F11** | Painel "Visão geral" em três camadas | — | ⏳ |
| **F12** | Tela de série: histórico, período e comparação na URL | — | ⏳ |
| **F13** | Resultado fiscal decomposto: primário, juros e nominal | — | ⏳ |
| **F14** | Dinâmica da dívida: r, g, r − g e o primário que estabiliza | — | ⏳ |
| **F15** | Como medir o financiamento monetário do déficit | — | 🔍 |
| **F16** | Composição da dívida pública federal (Tesouro) | — | ⏳ |
| **F17** | "Check engine": semáforo dos sinais de crise | — | ⏳ |
| **F18** | Linha do tempo histórica com os episódios marcados | — | ⏳ |
| **F19** | Comparação internacional da dívida (FMI) | — | 💤 |
| **F20** | IPCA por grupo desde 1999 (emenda das tabelas do IBGE) | — | ⏳ |
| **F21** | Inflação acelerando ou freando | — | ⏳ |
| **F22** | Rodadas de design no canvas | — | 🔍 |
| **F23** | Linguagem visual nas telas que existem | — | ⏳ |
| **F24** | Simulador da trajetória da dívida | — | ⏳ |

<details>
<summary><strong>Concluído / decidido / descartado (11 itens — clique pra expandir)</strong></summary>

| ID | Resumo | Condiciona (F#) | Status |
| --- | --- | --- | --- |
| **D1** | Stack igual à do Finance Manager | F1 | ✅ |
| **D2** | Dado externo passa por um cache SQLite descartável: tela → banco → fonte | F2, F3, F4, F10, F16, F19, F20 | ✅ |
| **D3** | Toda conta econômica mora no backend, em float, e taxa se compõe multiplicando | F2, F5, F6, F14, F21, F24 | ✅ |
| **D4** | Conceito é um registro único e tipado no front, chaveado pelo id que o backend exporta | F7, F8, F11 | ✅ |
| **D5** | Cada grupo do IPCA tem cor e ícone fixos | F21, F23 | ✅ |
| **F1** | Scaffold no padrão do Finance Manager, aposentando o Streamlit | — | ✅ |
| **F2** | Cache de séries no SQLite com refresh idempotente | — | ✅ |
| **F3** | Fonte IBGE: IPCA por grupo (tabela 7060) | — | ✅ |
| **F4** | Fonte BCB/SGS, portada do Finance Manager e parametrizada por código | — | ✅ |
| **F5** | Tela de inflação por categoria (os três gráficos atuais) | — | ✅ |
| **F6** | Poder de compra por categoria: conta exata e quatro referências de reajuste | — | ✅ |

</details>

---

## 🚦 Livre pra pegar

> Derivado do grafo de dependências: as `F#` que podem ser pegas agora — toda dependência já ✅. "Destrava" é quantas `F#` em aberto esperam por ela, direta ou indiretamente; é por aí que a tabela está ordenada. 💤 (sem prioridade) e 🚫 não entram.

| ID | Resumo | Marco | Destrava | Status |
| --- | --- | --- | --- | --- |
| **F22** | Rodadas de design no canvas | M6 | 6 | 🔍 |
| **F13** | Resultado fiscal decomposto: primário, juros e nominal | M4 | 4 | ⏳ |
| **F10** | Fonte Focus/BCB: expectativas de mercado | M3 | 2 | ⏳ |
| **F12** | Tela de série: histórico, período e comparação na URL | M3 | 1 | ⏳ |
| **F16** | Composição da dívida pública federal (Tesouro) | M4 | 1 | ⏳ |
| **F20** | IPCA por grupo desde 1999 (emenda das tabelas do IBGE) | — | 0 | ⏳ |
| **F21** | Inflação acelerando ou freando | M6 | 0 | ⏳ |

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
> **Progresso:** 0/3 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F7** | Catálogo de conceitos, "?" com hover card e fórmula em KaTeX | F22 | ⏳ |
| **F8** | Aba Aprender: glossário e página por conceito | F7 | ⏳ |
| **F9** | Explicadores de mecanismo: inércia, Plano Real, dívida × inflação, r − g | F8 | ⏳ |

### M3 — Painel da economia

> **Objetivo:** Uma tela com os indicadores principais atualizados, em três camadas: fiscal, monetária, atividade e externo.
>
> **Serve:** N1
>
> **Progresso:** 0/3 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F10** | Fonte Focus/BCB: expectativas de mercado | F2 | ⏳ |
| **F11** | Painel "Visão geral" em três camadas | F4, F7, F10 | ⏳ |
| **F12** | Tela de série: histórico, período e comparação na URL | F4 | ⏳ |

### M4 — Dívida e déficit

> **Objetivo:** Ver onde está o déficit, como ele é financiado e se a dívida se estabiliza.
>
> **Serve:** N4, N6
>
> **Progresso:** 0/5 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F13** | Resultado fiscal decomposto: primário, juros e nominal | F4 | ⏳ |
| **F14** | Dinâmica da dívida: r, g, r − g e o primário que estabiliza | F13 | ⏳ |
| **F15** | Como medir o financiamento monetário do déficit | F13, F16 | 🔍 |
| **F16** | Composição da dívida pública federal (Tesouro) | F2 | ⏳ |
| **F24** | Simulador da trajetória da dívida | F14 | ⏳ |

### M5 — Saúde e história

> **Objetivo:** Os sinais de crise e o Brasil de hoje contra os episódios passados.
>
> **Serve:** N5
>
> **Progresso:** 0/2 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F17** | "Check engine": semáforo dos sinais de crise | F11, F14 | ⏳ |
| **F18** | Linha do tempo histórica com os episódios marcados | F12 | ⏳ |

### M6 — Linguagem visual própria e ritmo da inflação

> **Objetivo:** As telas de inflação e de poder de compra na linguagem visual aprovada no canvas, com a seção acelerando ou freando.
>
> **Serve:** N1, N2, N3
>
> **Progresso:** 0/3 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F21** | Inflação acelerando ou freando | F5 | ⏳ |
| **F22** | Rodadas de design no canvas | — | 🔍 |
| **F23** | Linguagem visual nas telas que existem | F22, F7 | ⏳ |

### Sem marco

> **Progresso:** 0/2 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F19** | Comparação internacional da dívida (FMI) | F2 | 💤 |
| **F20** | IPCA por grupo desde 1999 (emenda das tabelas do IBGE) | F3 | ⏳ |

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
| **F7** | Catálogo de conceitos, "?" com hover card e fórmula em KaTeX | N2 | D4, D6 | M2 | F22 | Médio | Baixo | Alto | Excelente | ⏳ Pendente |
| **F8** | Aba Aprender: glossário e página por conceito | N2 | D4 | M2 | F7 | Médio | Baixo | Alto | Bom | ⏳ Pendente |
| **F9** | Explicadores de mecanismo: inércia, Plano Real, dívida × inflação, r − g | N2, N5 | — | M2 | F8 | Médio | Médio | Médio | Bom | ⏳ Pendente |
| **F10** | Fonte Focus/BCB: expectativas de mercado | N1, N5 | D2 | M3 | F2 | Baixo | Médio | Médio | Bom | ⏳ Pendente |
| **F11** | Painel "Visão geral" em três camadas | N1 | D4 | M3 | F4, F7, F10 | Médio | Médio | Alto | Excelente | ⏳ Pendente |
| **F12** | Tela de série: histórico, período e comparação na URL | N1 | — | M3 | F4 | Médio | Baixo | Médio | Bom | ⏳ Pendente |
| **F13** | Resultado fiscal decomposto: primário, juros e nominal | N4, N6 | — | M4 | F4 | Baixo | Médio | Alto | Excelente | ⏳ Pendente |
| **F14** | Dinâmica da dívida: r, g, r − g e o primário que estabiliza | N4 | D3 | M4 | F13 | Médio | Médio | Alto | Excelente | ⏳ Pendente |
| **F18** | Linha do tempo histórica com os episódios marcados | N5, N2 | — | M5 | F12 | Médio | Baixo | Médio | Bom | ⏳ Pendente |
| **F19** | Comparação internacional da dívida (FMI) | N4, N5 | D2 | — | F2 | Médio | Médio | Médio | Médio | 💤 Registrado, sem prioridade |
| **F23** | Linguagem visual nas telas que existem | N2, N3 | D5, D6 | M6 | F22, F7 | Médio | Baixo | Alto | Bom | ⏳ Pendente |
| **F21** | Inflação acelerando ou freando | N1, N5 | D3, D5 | M6 | F5 | Médio | Baixo | Alto | Excelente | ⏳ Pendente |
| **F24** | Simulador da trajetória da dívida | N4 | D3 | M4 | F14 | Médio | Baixo | Alto | Excelente | ⏳ Pendente |
| **F16** | Composição da dívida pública federal (Tesouro) | N4, N6 | D2 | M4 | F2 | Médio | Médio | Alto | Bom | ⏳ Pendente |
| **F17** | "Check engine": semáforo dos sinais de crise | N5 | — | M5 | F11, F14 | Médio | Baixo | Alto | Bom | ⏳ Pendente |
| **F20** | IPCA por grupo desde 1999 (emenda das tabelas do IBGE) | N3, N1 | D2 | — | F3 | Baixo | Baixo | Alto | Excelente | ⏳ Pendente |

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

**F7 — Catálogo de conceitos e hints.**

**Catálogo.** `frontend/shared/concepts/` guarda o `Record<ConceptId, Concept>` (D4).

**`<ConceptHint id>`.** Um ícone "?" que abre o hover card no desktop e um popover no toque. Mostra o resumo, o exemplo numérico, o que é bom e o que é ruim, e o link "saiba mais".

**`<Formula tex>`.** Usa `katex.renderToString` com o CSS do pacote `katex`, mais a legenda das variáveis.

**Forma na tela (D6).** O "?" guarda a definição de referência. A explicação do gráfico é a nota numerada na margem, com o exemplo calculado com os números da tela, no padrão que as rodadas de design (F22) aprovarem.

**Onde entra primeiro.** Nas telas de F5 e F6. Conceitos iniciais:
- IPCA, INPC e grupo do IPCA;
- acumulado (composição) e acumulado de 12 meses;
- ponto percentual (p.p.) × percentual;
- poder de compra e salário mínimo.

Gatilho: depois da F22, para nascer já na forma aprovada.

**F8 — Aba Aprender.** Duas rotas:
- **`/aprender`:** glossário com busca, agrupado por tema (inflação, juros, fiscal, externo, atividade);
- **`/aprender/:conceptId`:** a página completa do conceito.

A página do conceito traz:
- a definição;
- a fórmula com legenda;
- o exemplo numérico;
- o link de onde a fonte oficial publica;
- os conceitos relacionados;
- o gráfico da série, quando o conceito tem uma (`SeriesId`).

Tudo sai do mesmo registro do F7 (D4).

**F9 — Explicadores de mecanismo.** Páginas longas em `/aprender`, uma por tema:
- inflação inercial e indexação, e por que a inércia não morreu com o Real: hoje ela aparece na inflação de serviços e nas expectativas acima da meta;
- URV e Plano Real;
- os quatro loops e as setas que os cruzam, num diagrama: inflação → reajustes → inflação; dívida → juros → déficit → dívida; dívida → risco → câmbio → inflação; inflação → juros → dívida;
- os três caminhos de dívida para inflação: câmbio, monetização e recessão por juros;
- dominância fiscal;
- por que r − g decide a trajetória da dívida, com o País A (dívida de 120%, r 2%, g 6%) e o País B (dívida de 60%, r 15%, g 3%).

Cada página liga aos conceitos (F7) e aos gráficos do app. O ponto de partida é a conversa com o ChatGPT, e cada afirmação factual é conferida contra a fonte oficial (BCB, IBGE, Tesouro) antes de entrar. Esse é o motivo do risco médio.

**F10 — Fonte Focus/BCB.** Provider da API Olinda do BCB: `https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoAnuais`.
- **O que busca:** a mediana das expectativas de IPCA, Selic, PIB e câmbio para o ano corrente e os dois seguintes.
- **O que é essa série:** a pesquisa Focus, que o BC publica toda segunda-feira com o que o mercado espera.
- **Onde grava:** em `observations`, com um `SeriesId` por indicador e ano-alvo.

**F11 — Painel "Visão geral".** Três blocos de cards. Os códigos SGS foram conferidos ao vivo em 2026-10-06, menos o da conta corrente:
- **Fiscal:** dívida líquida do setor público/PIB (4513, desde dez/2001), dívida bruta do governo geral/PIB (13762, desde dez/2006), e resultado primário, juros e nominal (F13).
- **Monetário:** IPCA 12 meses (13522) × meta (13521), expectativas (F10), Selic meta (432) e juro real ex-ante.
- **Atividade e externo:** PIB em 12 meses em R$ (4382), desemprego da PNAD Contínua (24369), dólar PTAX (1 diário, 3698 média mensal), reservas internacionais (13621) e conta corrente (código a levantar na implementação).

Cada card traz o último valor, a variação, uma sparkline, o "dado até" e um `<ConceptHint>`. O `Record` da D4 obriga a existir conceito para cada card.

O juro real ex-ante é `(1 + Selic) / (1 + IPCA esperado em 12 meses) − 1`: o juro descontada a inflação que o mercado espera.

**Detalhe do SGS:** a série 432 publica a Selic meta até a próxima reunião do Copom, e por isso o último ponto tem data futura. O "dado até" do card usa a data de hoje.

**F12 — Tela de série.** A rota `/serie/:id` mostra o gráfico histórico de qualquer série. Tudo isto fica na URL:
- o período;
- a sobreposição de até três séries;
- a transformação: nível, variação mensal ou acumulado de 12 meses.

É o destino do clique em qualquer card do painel.

**F13 — Resultado fiscal decomposto.** A NFSP é a necessidade de financiamento do setor público, ou seja, o déficit. Na convenção da NFSP, valor positivo é déficit.

**Séries candidatas** (SGS, % do PIB, 12 meses, setor público consolidado, sem desvalorização cambial): nominal 5727, juros nominais 5728, primário 5793. As três respondem, mas não fecham a conta em ago/2026: 0,62 + 7,83 dá 8,45, e a 5727 diz 9,48. O primeiro passo da implementação é conferir o nome de cada código no catálogo do SGS e achar o trio que fecha `nominal = primário + juros`.

**Tela "Dívida e déficit":** barras empilhadas de primário + juros = nominal. Responde "onde se vê o déficit" e quanto dele é juro.

**Aceite:** o último mês bate com a nota de Estatísticas Fiscais do BCB do mesmo mês, e o primário somado aos juros dá o nominal.

**F14 — Dinâmica da dívida.**

**Definições:**
- **r**, o juro implícito: juros nominais de 12 meses ÷ dívida líquida média;
- **g**: crescimento do PIB nominal em 12 meses (SGS 4382).

**Primário que estabiliza a dívida:** `p* = d · (r − g) / (1 + g)`, composto como manda a D3. Comparado com o primário observado, ele diz se a dívida/PIB sobe ou desce.

**Exemplo de leitura:** com dívida de 80% do PIB, r = 10% e g = 7%, é preciso cerca de 2,2% do PIB de superávit só para a dívida não crescer.

**Conferência:** a IFI do Senado estima cerca de 2,1% do PIB de primário para estabilizar a dívida bruta (RAF 115, ago/2026). O p* do app usa a dívida líquida e r e g nominais observados, então não precisa bater. A ordem de grandeza serve de conferência, e a tela explica a diferença de conceito.

Inclui a fórmula com legenda (F7).

**F18 — Linha do tempo histórica.** Um gráfico longo, com os episódios marcados: Collor, Real (1994), 1999, 2002, 2008, 2015 e 2020. Cada episódio tem um texto curto que liga ao explicador correspondente (F9).
- **Séries:** IPCA desde 1980 (SGS 433), Selic desde 1986 e dívida líquida desde 2001 (SGS 4513).
- **Escala:** a inflação anual vai de 2.477% (1993) a 1,65% (1998). Na escala comum, tudo depois de 1994 vira uma reta no zero. O eixo da inflação é logarítmico, com a explicação de como ler.
- **Limitação:** a dívida antes de 2001 precisa de outra fonte, e fica de fora até existir uma.

**F19 — Comparação internacional.**
- **Fonte:** provider da API DataMapper do FMI: `https://www.imf.org/external/datamapper/api/v1/GGXWDG_NGDP` (dívida bruta/PIB), mais a inflação por país.
- **Países:** Brasil, Argentina, Japão e Grécia, lado a lado.
- **Pergunta que responde:** "como um país com mais de 200% do PIB de dívida pode estar de boa".

Registrado sem prioridade.

**F23 — Linguagem visual nas telas que existem.**
- **Tokens:** os da D6 no `@theme` do `index.css` (fontes, papel, tinta, marca-texto), em claro e escuro.
- **Componentes novos no design system:**
  - `GroupChip` (D5);
  - a nota de margem numerada;
  - o cabeçalho de página com a frase-conclusão, montada no front a partir dos números da API (só formatação).
- **Tela de inflação por categoria:** reescrita conforme o canvas aprovado.
- **Tela de poder de compra:**
  - cartões de referência com o reajuste de cada um;
  - barras clicáveis;
  - o painel "como chegamos neste número", com a conta do grupo escolhido em R$ 100 e a fórmula em KaTeX (F7).

Gatilho: a F22 aprovada.

**F21 — Inflação acelerando ou freando.** Uma seção nova na tela de inflação, como a do canvas de design.

**Backend:**
- no endpoint de inflação, para cada mês do 12 meses, o mês que entrou e o que saiu da conta (`m_t` e `m_{t−12}`), que já saem da passada do `rolling_12m`;
- por grupo, o 12 meses do fim do período e o de 3 meses antes;
- a meta de inflação como série nova: SGS 13521 (anual). A tolerância vem de série do SGS se houver; se não houver, vem do registro, com as datas de vigência.

**Tela:**
- a linha do IPCA 12 meses com o teto da meta;
- o veredito ("acelerando" ou "freando") com a explicação calculada no último mês: o mês que entrou contra o que saiu;
- um gráfico de halteres por grupo (12 meses de agora × de 3 meses antes) com a contagem "N de 9 grupos aceleraram";
- a nota sobre efeito base.

**Aceite:** em ago/2026, entrou −0,32%, saiu −0,11%, e o 12 meses foi de 4,44% para 4,22%.

**F24 — Simulador da trajetória da dívida.** Mexer em juros, crescimento e primário e ver a dívida/PIB dos próximos anos.

**Backend:** `GET /api/debt/simulation?debt=&r=&g=&primary=&years=` devolve a trajetória ano a ano, com `d(t+1) = d(t) · (1 + r) / (1 + g) − p`, composta dividindo (D3), e o `p*` que estabiliza.

**Tela:**
- quatro controles, com o estado na URL: dívida inicial (% do PIB), juro nominal efetivo, crescimento nominal do PIB e primário (% do PIB);
- a linha da dívida/PIB por 10 anos;
- a frase "a dívida se estabiliza em X% do PIB", ou "a dívida cresce sem parar";
- três exemplos prontos:
  - Brasil hoje, com os valores da F14;
  - País A: dívida de 120%, r 2%, g 6%, primário zero;
  - País B: dívida de 60%, r 15%, g 3%, déficit de 1%.

**Aceite:** com d = 80%, r = 10%, g = 7% e primário igual ao p* (2,24% do PIB), a dívida fica em 80% em todos os anos.

**F16 — Composição da dívida pública federal.**

**Fonte:** o CSV "Estoque da Dívida Pública Federal" do Tesouro Transparente (CKAN, dataset `estoque-da-divida-publica-federal`). É mensal desde set/2017, tem cerca de 12 MB e traz uma linha por título e mês: título, vencimento, valor, quantidade, mês, carteira ("Mercado" ou "Banco Central") e tipo (interna ou externa). O arquivo vem em latin-1, com separador `;` e decimal com vírgula.

**Provider:** baixa o CSV inteiro e agrega por mês no backend. Grava em `observations` uma série derivada por agregado (D2):
- **composição por indexador**, pelo prefixo do título: LFT → Selic; LTN e NTN-F → prefixado; NTN-B → IPCA; NTN-C → IGP-M; dívida externa → câmbio; títulos legados (TDA, NTN-I, CVS…) → "outros";
- **prazo médio**, ponderado pelo valor;
- **vencimentos nos próximos 12 meses**, que é quanto o governo precisa refinanciar;
- **parcela na carteira do Banco Central**, que alimenta a F15.

**Tela, na seção de dívida:** barras empilhadas por indexador ao longo do tempo, mais cards de prazo médio e de vencimentos em 12 meses.

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

**F20 — IPCA por grupo desde 1999.** Quatro tabelas do IBGE se emendam sem sobreposição. Todas usam a variável 63 e a classificação 315 com os mesmos códigos de categoria (conferido ao vivo; a 655 já traz Educação em ago/1999):

| Tabela | Período |
|---|---|
| 655 | ago/1999 a jun/2006 |
| 2938 | jul/2006 a dez/2011 |
| 1419 | jan/2012 a dez/2019 |
| 7060 | jan/2020 em diante |

**Implementação:** o `SeriesSpec` do IPCA por grupo passa a ter as faixas de tabela por período. O provider do IBGE quebra o pedido nas tabelas que cobrem o intervalo, e o `first_date` vai a ago/1999. O 12 meses por grupo passa a existir desde jul/2000, e o poder de compra pelo salário mínimo (desde jul/1994 no registro) ganha os grupos a partir de ago/1999.

**Fora:** antes de ago/1999 (tabela 58, 1991 a 1999) há só 7 grupos, com Transportes e Comunicação juntos e sem Educação.

**Ressalva na tela:** a cesta de cada grupo muda a cada POF (a pesquisa que redefine pesos e itens do IPCA). A variação mensal publicada já reflete a cesta da época.

**Aceite:** a variação mensal do índice geral bate com a publicada nos meses de troca de tabela: dez/2011 0,50% e jan/2012 0,56%.

---
## 2. Nice-to-have

> Nenhum item nesta categoria atualmente.

---
## 3. Descartada

> Nenhum item nesta categoria atualmente.

---
## 4. Incerta / exploratória

| ID | Resumo | Conexão | Marco | Depende de | Status |
| --- | --- | --- | --- | --- | --- |
| **F15** | Como medir o financiamento monetário do déficit | Serviria N6; falta separar gestão de liquidez do BC de financiamento do Tesouro | M4 | F13, F16 | 🔍 Em avaliação |
| **F22** | Rodadas de design no canvas | Serviria N2; fecha a D6 | M6 | — | 🔍 Em avaliação |

**F15 — Como medir o financiamento monetário.** As candidatas já têm fonte:
- **base monetária:** SGS 1788 responde (ago/2026: 432.655.492, provavelmente em R$ mil); falta conferir nome e unidade;
- **fatores condicionantes da base, operações com títulos públicos:** SGS 1809;
- **títulos da dívida na carteira do Banco Central:** o CSV de estoque do Tesouro (F16) separa a carteira "Banco Central" da carteira "Mercado".

Falta separar a gestão de liquidez do dia a dia do BC (operações compromissadas) do que seria financiamento do Tesouro. A Lei de Responsabilidade Fiscal veda o financiamento direto. O spike lê as notas de política monetária do BCB e fecha duas coisas: quais séries entram, e a frase que a tela diz, no formato "o déficit é financiado com títulos vendidos ao mercado; a parcela da dívida na carteira do BC é X%".

**F22 — Rodadas de design no canvas.** O canvas de design, iterado no Claude Design, tem três pranchas: inflação por categoria, poder de compra e o chip dos grupos. O usuário comenta e as próximas telas entram em ondas no Claude chat, com as que ainda estão em aberto marcadas como esboço.

Sai deste estado quando a linguagem visual estiver aprovada: tipografia, cores claro e escuro, padrão de explicação e componentes. O resultado fecha a D6 e vira o plano concreto da F23.
