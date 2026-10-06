<!-- ARQUIVO GERADO POR scripts/roadmap.py (skill feature-roadmap) -- NÃO EDITAR À MÃO. -->

> ⚠️ **Este arquivo é gerado automaticamente — não edite manualmente.** Toda mudança (inserir/mover/concluir/descartar/remover um card, cadastrar ou atualizar uma necessidade/decisão/marco, o cabeçalho) passa por `scripts/roadmap.py` (ver `SKILL.md`); uma edição direta aqui é sobrescrita sem aviso na próxima regeneração.

# Roadmap — EconomicStatistics

> Kanban de features, segue a metodologia da skill `feature-roadmap`. Companion: [DECISIONS.md](DECISIONS.md) — lá está o "porquê" (necessidades `N#` e decisões `D#`); aqui fica só o "o quê construir, em que marco e em que estado está".
>
> **Regra de sincronização:** os dois documentos usam os mesmos IDs (`N#`, `D#`) e devem sempre concordar sobre a decisão vigente de cada item.
>
> **Última mudança (2026-10-06):** Cache de séries e fontes IBGE e BCB/SGS concluídos; a D3 registra a composição dos mensais.

## Glossário

> Descrição completa de cada `N#`/`D#` em `DECISIONS.md`; `F#` é espelho do kanban abaixo. "Condiciona" é derivado dos cards: as `F#` que citam aquele `N#`/`D#`.

| ID | Resumo | Condiciona (F#) | Status |
| --- | --- | --- | --- |
| **N1** | Acompanhar a economia brasileira num lugar só | F1, F2, F3, F4, F5, F10, F11, F12 | — |
| **N2** | Entender o que cada número significa enquanto olho | F1, F7, F8, F9, F18 | — |
| **N3** | Saber em que áreas de gasto o dinheiro passou a comprar mais ou menos | F1, F2, F3, F4, F6 | — |
| **N4** | Saber se a dívida pública está sob controle | F4, F13, F14, F19 | — |
| **N5** | Saber se a economia está saudável ou caminhando para uma crise | F9, F10, F18, F19 | — |
| **N6** | Saber como o déficit é financiado | F4, F13 | — |
| **F5** | Tela de inflação por categoria (os três gráficos atuais) | — | ⏳ |
| **F6** | Poder de compra por categoria: conta exata e quatro referências de reajuste | — | ⏳ |
| **F7** | Catálogo de conceitos, "?" com hover card e fórmula em KaTeX | — | ⏳ |
| **F8** | Aba Aprender: glossário e página por conceito | — | ⏳ |
| **F9** | Explicadores de mecanismo: inércia, Plano Real, dívida × inflação, r − g | — | ⏳ |
| **F10** | Fonte Focus/BCB: expectativas de mercado | — | ⏳ |
| **F11** | Painel "Visão geral" em três camadas | — | ⏳ |
| **F12** | Tela de série: histórico, período e comparação na URL | — | ⏳ |
| **F13** | Resultado fiscal decomposto: primário, juros e nominal | — | ⏳ |
| **F14** | Dinâmica da dívida: r, g, r − g e o primário que estabiliza | — | ⏳ |
| **F15** | Como medir o financiamento monetário do déficit | — | 🔍 |
| **F16** | Composição da dívida pública federal (Tesouro) | — | 🔍 |
| **F17** | "Check engine": semáforo dos sinais de crise | — | 🔍 |
| **F18** | Linha do tempo histórica com os episódios marcados | — | ⏳ |
| **F19** | Comparação internacional da dívida (FMI) | — | 💤 |
| **F20** | IPCA por grupo antes de 2020 (tabelas antigas do IBGE) | — | 🔍 |

<details>
<summary><strong>Concluído / decidido / descartado (8 itens — clique pra expandir)</strong></summary>

| ID | Resumo | Condiciona (F#) | Status |
| --- | --- | --- | --- |
| **D1** | Stack igual à do Finance Manager | F1 | ✅ |
| **D2** | Dado externo passa por um cache SQLite descartável: tela → banco → fonte | F2, F3, F4, F10, F19 | ✅ |
| **D3** | Toda conta econômica mora no backend, em float, e taxa se compõe multiplicando | F2, F5, F6, F14 | ✅ |
| **D4** | Conceito é um registro único e tipado no front, chaveado pelo id que o backend exporta | F7, F8, F11 | ✅ |
| **F1** | Scaffold no padrão do Finance Manager, aposentando o Streamlit | — | ✅ |
| **F2** | Cache de séries no SQLite com refresh idempotente | — | ✅ |
| **F3** | Fonte IBGE: IPCA por grupo (tabela 7060) | — | ✅ |
| **F4** | Fonte BCB/SGS, portada do Finance Manager e parametrizada por código | — | ✅ |

</details>

---

## 🚦 Livre pra pegar

> Derivado do grafo de dependências: as `F#` que podem ser pegas agora — toda dependência já ✅. "Destrava" é quantas `F#` em aberto esperam por ela, direta ou indiretamente; é por aí que a tabela está ordenada. 💤 (sem prioridade) e 🚫 não entram.

| ID | Resumo | Marco | Destrava | Status |
| --- | --- | --- | --- | --- |
| **F7** | Catálogo de conceitos, "?" com hover card e fórmula em KaTeX | M2 | 4 | ⏳ |
| **F13** | Resultado fiscal decomposto: primário, juros e nominal | M4 | 3 | ⏳ |
| **F10** | Fonte Focus/BCB: expectativas de mercado | M3 | 2 | ⏳ |
| **F12** | Tela de série: histórico, período e comparação na URL | M3 | 1 | ⏳ |
| **F5** | Tela de inflação por categoria (os três gráficos atuais) | M1 | 0 | ⏳ |
| **F6** | Poder de compra por categoria: conta exata e quatro referências de reajuste | M1 | 0 | ⏳ |
| **F16** | Composição da dívida pública federal (Tesouro) | — | 0 | 🔍 |
| **F20** | IPCA por grupo antes de 2020 (tabelas antigas do IBGE) | — | 0 | 🔍 |

---

## 🧭 Marcos

### M1 — Inflação e poder de compra na nova stack

> **Objetivo:** O que o Streamlit faz hoje, com o SQLite de cache e o poder de compra corrigido nas quatro referências de reajuste.
>
> **Serve:** N1, N3
>
> **Progresso:** 4/6 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F5** | Tela de inflação por categoria (os três gráficos atuais) | F3 | ⏳ |
| **F6** | Poder de compra por categoria: conta exata e quatro referências de reajuste | F3, F4 | ⏳ |

<details><summary>Concluído (4 itens)</summary>

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F1** | Scaffold no padrão do Finance Manager, aposentando o Streamlit | — | ✅ |
| **F2** | Cache de séries no SQLite com refresh idempotente | F1 | ✅ |
| **F3** | Fonte IBGE: IPCA por grupo (tabela 7060) | F2 | ✅ |
| **F4** | Fonte BCB/SGS, portada do Finance Manager e parametrizada por código | F2 | ✅ |

</details>

### M2 — Camada didática

> **Objetivo:** Todo número na tela tem um "?" com explicação e fórmula, e a aba Aprender permite estudar os conceitos.
>
> **Serve:** N2
>
> **Progresso:** 0/3 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F7** | Catálogo de conceitos, "?" com hover card e fórmula em KaTeX | F1 | ⏳ |
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
> **Progresso:** 0/3 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F13** | Resultado fiscal decomposto: primário, juros e nominal | F4 | ⏳ |
| **F14** | Dinâmica da dívida: r, g, r − g e o primário que estabiliza | F13 | ⏳ |
| **F15** | Como medir o financiamento monetário do déficit | F13 | 🔍 |

### M5 — Saúde e história

> **Objetivo:** Os sinais de crise e o Brasil de hoje contra os episódios passados.
>
> **Serve:** N5
>
> **Progresso:** 0/2 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F17** | "Check engine": semáforo dos sinais de crise | F11, F14 | 🔍 |
| **F18** | Linha do tempo histórica com os episódios marcados | F12 | ⏳ |

### Sem marco

> **Progresso:** 0/3 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F16** | Composição da dívida pública federal (Tesouro) | F2 | 🔍 |
| **F19** | Comparação internacional da dívida (FMI) | F2 | 💤 |
| **F20** | IPCA por grupo antes de 2020 (tabelas antigas do IBGE) | F3 | 🔍 |

---

## 1. Atende necessidade

| ID | Resumo | Atende (N#) | D# | Marco | Depende de | Esforço | Risco | Valor | Custo-benefício | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **F1** | Scaffold no padrão do Finance Manager, aposentando o Streamlit | N1, N2, N3 | D1 | M1 | — | Médio | Baixo | Alto | Excelente | ✅ Concluído |
| **F2** | Cache de séries no SQLite com refresh idempotente | N1, N3 | D2, D3 | M1 | F1 | Médio | Médio | Alto | Excelente | ✅ Concluído |
| **F3** | Fonte IBGE: IPCA por grupo (tabela 7060) | N1, N3 | D2 | M1 | F2 | Baixo | Médio | Alto | Excelente | ✅ Concluído |
| **F4** | Fonte BCB/SGS, portada do Finance Manager e parametrizada por código | N1, N3, N4, N6 | D2 | M1 | F2 | Baixo | Baixo | Alto | Excelente | ✅ Concluído |
| **F5** | Tela de inflação por categoria (os três gráficos atuais) | N1 | D3 | M1 | F3 | Médio | Baixo | Alto | Bom | ⏳ Pendente |
| **F6** | Poder de compra por categoria: conta exata e quatro referências de reajuste | N3 | D3 | M1 | F3, F4 | Médio | Médio | Alto | Excelente | ⏳ Pendente |
| **F7** | Catálogo de conceitos, "?" com hover card e fórmula em KaTeX | N2 | D4 | M2 | F1 | Médio | Baixo | Alto | Excelente | ⏳ Pendente |
| **F8** | Aba Aprender: glossário e página por conceito | N2 | D4 | M2 | F7 | Médio | Baixo | Alto | Bom | ⏳ Pendente |
| **F9** | Explicadores de mecanismo: inércia, Plano Real, dívida × inflação, r − g | N2, N5 | — | M2 | F8 | Médio | Médio | Médio | Bom | ⏳ Pendente |
| **F10** | Fonte Focus/BCB: expectativas de mercado | N1, N5 | D2 | M3 | F2 | Baixo | Médio | Médio | Bom | ⏳ Pendente |
| **F11** | Painel "Visão geral" em três camadas | N1 | D4 | M3 | F4, F7, F10 | Médio | Médio | Alto | Excelente | ⏳ Pendente |
| **F12** | Tela de série: histórico, período e comparação na URL | N1 | — | M3 | F4 | Médio | Baixo | Médio | Bom | ⏳ Pendente |
| **F13** | Resultado fiscal decomposto: primário, juros e nominal | N4, N6 | — | M4 | F4 | Baixo | Médio | Alto | Excelente | ⏳ Pendente |
| **F14** | Dinâmica da dívida: r, g, r − g e o primário que estabiliza | N4 | D3 | M4 | F13 | Médio | Médio | Alto | Excelente | ⏳ Pendente |
| **F18** | Linha do tempo histórica com os episódios marcados | N5, N2 | — | M5 | F12 | Médio | Baixo | Médio | Bom | ⏳ Pendente |
| **F19** | Comparação internacional da dívida (FMI) | N4, N5 | D2 | — | F2 | Médio | Médio | Médio | Médio | 💤 Registrado, sem prioridade |

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

**F5 — Tela de inflação por categoria.** Os três gráficos do Streamlit, em Recharts via o `chart.tsx` do shadcn:
- variação mensal por grupo, em barras agrupadas;
- acumulado do período por grupo contra o índice geral;
- acumulado de 12 meses por grupo, em linha.

O período fica na URL. As contas moram em `backend/domain/rates.py` (`accumulate`, `rolling_12m`) e fazem uma passada só sobre a série. O código atual relê o cache a cada linha. O rótulo passa a dizer "acumulado no período", e não "no ano" (D3).

**F6 — Poder de compra por categoria.** Por grupo, a conta é `(1 + reajuste) / (1 + inflação_categoria) − 1`, em `domain/rates.py` (D3). Ela substitui a subtração do app atual.

**Seletor de referência:**
- **IPCA geral:** acumulado do índice geral no período.
- **INPC:** acumulado da SGS 188, a reposição pela inflação das famílias de renda mais baixa.
- **Salário mínimo real:** valor da SGS 1619 no fim do período ÷ valor no início − 1. O reajuste do mínimo é um degrau por ano.
- **Reajuste digitado:** percentual informado na tela, guardado só na URL.

**Gráfico:** barras divergentes, com perda abaixo de zero e ganho acima, e a dica de como ler.
**Aceite:** em 2022, com a referência IPCA geral, Alimentação e bebidas dá −5,24% (1,0579 ÷ 1,1164 − 1).

**F7 — Catálogo de conceitos e hints.**

**Catálogo.** `frontend/shared/concepts/` guarda o `Record<ConceptId, Concept>` (D4).

**`<ConceptHint id>`.** Um ícone "?" que abre o hover card do shadcn no desktop e um popover no toque. Mostra o resumo, o exemplo numérico, o que é bom e o que é ruim, e o link "saiba mais".

**`<Formula tex>`.** Usa `katex.renderToString` com o CSS do pacote `katex`, mais a legenda das variáveis.

**Onde entra primeiro.** Nas telas de F5 e F6. Conceitos iniciais:
- IPCA, INPC e grupo do IPCA;
- acumulado (composição) e acumulado de 12 meses;
- poder de compra e salário mínimo.

Gatilho: pode andar em paralelo ao M1 assim que F1 existir.

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
- inflação inercial e indexação;
- URV e Plano Real;
- os três caminhos de dívida para inflação: câmbio, monetização e recessão por juros;
- dominância fiscal;
- por que r − g decide a trajetória da dívida.

Cada página liga aos conceitos (F7) e aos gráficos do app. O ponto de partida é a conversa com o ChatGPT, e cada afirmação factual é conferida contra a fonte oficial (BCB, IBGE, Tesouro) antes de entrar. Esse é o motivo do risco médio.

**F10 — Fonte Focus/BCB.** Provider da API Olinda do BCB: `https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoAnuais`.
- **O que busca:** a mediana das expectativas de IPCA, Selic, PIB e câmbio para o ano corrente e os dois seguintes.
- **O que é essa série:** a pesquisa Focus, que o BC publica toda segunda-feira com o que o mercado espera.
- **Onde grava:** em `observations`, com um `SeriesId` por indicador e ano-alvo.

**F11 — Painel "Visão geral".** Três blocos de cards:
- **Fiscal:** dívida líquida/PIB, dívida bruta/PIB, e resultado primário, juros e nominal.
- **Monetário:** IPCA 12 meses × meta, expectativas, Selic e juro real ex-ante.
- **Atividade e externo:** PIB, desemprego, câmbio e reservas.

Cada card traz o último valor, a variação, uma sparkline, o "dado até" e um `<ConceptHint>`. O `Record` da D4 obriga a existir conceito para cada card.

O juro real ex-ante é `(1 + Selic) / (1 + IPCA esperado em 12 meses) − 1`: o juro descontada a inflação que o mercado espera. Os códigos SGS de desemprego, câmbio e reservas são conferidos na implementação.

**F12 — Tela de série.** A rota `/serie/:id` mostra o gráfico histórico de qualquer série. Tudo isto fica na URL:
- o período;
- a sobreposição de até três séries;
- a transformação: nível, variação mensal ou acumulado de 12 meses.

É o destino do clique em qualquer card do painel.

**F13 — Resultado fiscal decomposto.** A NFSP é a necessidade de financiamento do setor público, ou seja, o déficit.
- **Séries:** levantar no SGS os códigos da NFSP do setor público consolidado: primário, juros nominais e nominal, em 12 meses, em R$ e em % do PIB.
- **Tela "Dívida e déficit":** barras empilhadas de primário + juros = nominal. Responde "onde se vê o déficit" e quanto dele é juro.

**Aceite:** o último mês bate com a nota de Estatísticas Fiscais do BCB do mesmo mês.

**F14 — Dinâmica da dívida.**

**Definições:**
- **r**, o juro implícito: juros nominais de 12 meses ÷ dívida líquida média;
- **g**: crescimento do PIB nominal em 12 meses.

**Primário que estabiliza a dívida:** `p* = d · (r − g) / (1 + g)`, composto como manda a D3. Comparado com o primário observado, ele diz se a dívida/PIB sobe ou desce.

**Exemplo de leitura:** com dívida de 80% do PIB, r = 10% e g = 7%, é preciso cerca de 2,2% do PIB de superávit só para a dívida não crescer.

Inclui a fórmula com legenda (F7).

**F18 — Linha do tempo histórica.** Um gráfico longo, com os episódios marcados: Collor, Real (1994), 1999, 2002, 2008, 2015 e 2020. Cada episódio tem um texto curto que liga ao explicador correspondente (F9).
- **Séries:** IPCA desde 1980 (SGS 433), Selic desde 1986 e dívida líquida desde 2001.
- **Limitação:** a dívida antes de 2001 precisa de outra fonte, e fica de fora até existir uma.

**F19 — Comparação internacional.**
- **Fonte:** provider da API DataMapper do FMI: `https://www.imf.org/external/datamapper/api/v1/GGXWDG_NGDP` (dívida bruta/PIB), mais a inflação por país.
- **Países:** Brasil, Argentina, Japão e Grécia, lado a lado.
- **Pergunta que responde:** "como um país com mais de 200% do PIB de dívida pode estar de boa".

Registrado sem prioridade.

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
| **F15** | Como medir o financiamento monetário do déficit | Serviria N6; falta definir quais séries mostram emissão de moeda para pagar dívida | M4 | F13 | 🔍 Em avaliação |
| **F16** | Composição da dívida pública federal (Tesouro) | Serviria N4; falta achar a fonte estruturada do Tesouro | — | F2 | 🔍 Em avaliação |
| **F17** | "Check engine": semáforo dos sinais de crise | Serviria N5; falta definir as faixas de alerta de cada sinal, com fonte | M5 | F11, F14 | 🔍 Em avaliação |
| **F20** | IPCA por grupo antes de 2020 (tabelas antigas do IBGE) | Serviria N3 em períodos longos; falta mapear as tabelas antigas e a emenda entre POFs | — | F3 | 🔍 Em avaliação |

**F15 — Como medir o financiamento monetário.** Falta definir quais séries respondem "o governo está emitindo moeda para pagar a dívida". As candidatas:
- base monetária;
- operações compromissadas;
- títulos na carteira do BC;
- conta única do Tesouro.

Também falta saber se dá para separar a emissão ligada ao déficit da gestão de liquidez do dia a dia do BC. Um spike de leitura das notas do BCB fecha isso e define o plano.

**F16 — Composição da dívida pública federal.** O objetivo é mostrar prazo médio, custo médio, indexadores (prefixado, Selic, IPCA, câmbio) e quem detém os títulos. Falta achar a fonte estruturada: Tesouro Transparente ou Relatório Mensal da Dívida. Também falta ver se ela tem API ou só CSV ou PDF. Sem isso, não dá para escrever o provider.

**F17 — "Check engine" da economia.** Um semáforo por sinal:
- inflação × meta;
- expectativas desancoradas;
- juro real;
- r − g;
- primário × primário que estabiliza;
- dívida/PIB;
- câmbio, reservas e desemprego.

Falta definir as faixas de alerta de cada sinal, com fonte. A meta de inflação com a tolerância é objetiva; as outras exigem referência, como a métrica de adequação de reservas do FMI. Sem as faixas, o semáforo é opinião.

**F20 — IPCA por grupo antes de 2020.** Falta mapear as tabelas anteriores à 7060: a 1419 (2012–2019), a 2938 (2006–2011) e as mais antigas. Também falta decidir como emendar grupos cuja composição muda a cada POF (Pesquisa de Orçamentos Familiares, que redefine os pesos e itens do IPCA). Sem isso, o poder de compra por categoria fica limitado a 2020 em diante.
