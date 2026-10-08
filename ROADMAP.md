<!-- ARQUIVO GERADO POR scripts/roadmap.py (skill feature-roadmap) -- NÃO EDITAR À MÃO. -->

> ⚠️ **Este arquivo é gerado automaticamente — não edite manualmente.** Toda mudança (inserir/mover/concluir/descartar/remover um card, cadastrar ou atualizar uma necessidade/decisão/marco, o cabeçalho) passa por `scripts/roadmap.py` (ver `SKILL.md`); uma edição direta aqui é sobrescrita sem aviso na próxima regeneração.

# Roadmap — EconomicStatistics

> Kanban de features, segue a metodologia da skill `feature-roadmap`. Companion: [DECISIONS.md](DECISIONS.md) — lá está o "porquê" (necessidades `N#` e decisões `D#`); aqui fica só o "o quê construir, em que marco e em que estado está".
>
> **Regra de sincronização:** os dois documentos usam os mesmos IDs (`N#`, `D#`) e devem sempre concordar sobre a decisão vigente de cada item.
>
> **Última mudança (2026-10-08):** Revisão das features em aberto: o Focus completo com tabela própria, os limites da meta, as telas que cobrem a página de estatísticas do BCB (juros, setor externo, atividade, crédito) e os explicadores com diagrama. A tela de série foi descartada.

## Glossário

> Descrição completa de cada `N#`/`D#` em `DECISIONS.md`; `F#` é espelho do kanban abaixo. "Condiciona" é derivado dos cards: as `F#` que citam aquele `N#`/`D#`.

| ID | Resumo | Condiciona (F#) | Status |
| --- | --- | --- | --- |
| **N1** | Acompanhar a economia brasileira num lugar só | F1, F2, F3, F4, F5, F10, F11, F20, F21, F25, F26, F27, F28, F29, F30, F31, F32, F33, F34, F35 | — |
| **N2** | Entender o que cada número significa enquanto olho | F1, F7, F8, F9, F22, F23, F25, F26, F29, F31, F32, F35, F36, F38 | — |
| **N3** | Saber em que áreas de gasto o dinheiro passou a comprar mais ou menos | F1, F2, F3, F4, F6, F20, F23 | — |
| **N4** | Saber se a dívida pública está sob controle | F4, F13, F14, F16, F24, F36, F37 | — |
| **N5** | Saber se a economia está saudável ou caminhando para uma crise | F9, F10, F17, F21, F24, F27, F28, F37 | — |
| **N6** | Saber como o déficit é financiado | F4, F13, F16 | — |
| **N7** | Entender como os números se ligam: a teia de ciclos e fluxos | F9, F13, F30, F31, F33, F36, F37 | — |
| **F9** | Explicadores com diagrama: os dois loops e as três pontes, inércia e Plano Real, emissão de moeda, reservas, dominância fiscal, r − g | — | ⏳ |
| **F10** | Fonte Focus completa: todos os indicadores, na menor escala, com o histórico das pesquisas | — | ⏳ |
| **F11** | Painel "Visão geral": a página de estatísticas do BCB refeita com explicação | — | ⏳ |
| **F13** | Tela Déficit: primário, juros e nominal | — | ⏳ |
| **F14** | Tela Dívida: r, g, r − g e o primário que estabiliza | — | ⏳ |
| **F15** | Como medir o financiamento monetário do déficit | — | 🔍 |
| **F16** | Composição da dívida pública federal (Tesouro), na tela Dívida | — | ⏳ |
| **F17** | "Check engine": semáforo dos sinais de crise | — | ⏳ |
| **F24** | Simulador da dívida, com casos que aconteceram e exemplos | — | ⏳ |
| **F27** | Continuação pelo Focus nos gráficos | — | ⏳ |
| **F28** | Tela Focus: como a expectativa mudou semana a semana | — | ⏳ |
| **F29** | Limites mínimo e máximo da meta no gráfico do IPCA | — | ⏳ |
| **F30** | Tela Juros: Selic, Copom e juro real | — | ⏳ |
| **F31** | Tela Setor externo: dólar, transações correntes e IDP, reservas, posição internacional | — | ⏳ |
| **F32** | Tela Atividade: PIB, IBC-Br e desemprego | — | ⏳ |
| **F33** | Tela Crédito: custo do crédito, concessões e solidez dos bancos | — | ⏳ |
| **F34** | Mercado imobiliário, na tela Crédito | — | 💤 |
| **F35** | IPCA livres, administrados e serviços | — | ⏳ |
| **F36** | Explicador: as três dívidas (DBGG, DLSP e DPF) | — | ⏳ |
| **F37** | Explicador: por que a dívida não explode (prazo, rolagem, moeda, credores) | — | ⏳ |
| **F38** | Diagramas nos conceitos que já existem | — | ⏳ |

<details>
<summary><strong>Concluído / decidido / descartado (24 itens — clique pra expandir)</strong></summary>

| ID | Resumo | Condiciona (F#) | Status |
| --- | --- | --- | --- |
| **D1** | Stack igual à do Finance Manager | F1 | ✅ |
| **D2** | Dado externo passa por um cache SQLite descartável: tela → banco → fonte | F2, F3, F4, F10, F16, F20 | ✅ |
| **D3** | Toda conta econômica mora no backend, em float, e taxa se compõe multiplicando | F2, F5, F6, F14, F21, F24, F25, F27, F30 | ✅ |
| **D4** | Conceito é um registro único e tipado no front, e toda série do backend aponta para um conceito | F7, F8, F11, F26 | ✅ |
| **D5** | Cada grupo do IPCA tem cor e ícone fixos | F21, F23, F25 | ✅ |
| **D6** | Linguagem visual própria, definida no canvas antes de virar código | F7, F8, F9, F11, F13, F14, F16, F17, F22, F23, F24, F26 | ✅ |
| **D7** | Mecanismo se explica com diagrama, desenhado em React Flow | F9, F36, F37, F38 | ✅ |
| **F1** | Scaffold no padrão do Finance Manager, aposentando o Streamlit | — | ✅ |
| **F2** | Cache de séries no SQLite com refresh idempotente | — | ✅ |
| **F3** | Fonte IBGE: IPCA por grupo (tabela 7060) | — | ✅ |
| **F4** | Fonte BCB/SGS, portada do Finance Manager e parametrizada por código | — | ✅ |
| **F5** | Tela de inflação por categoria (os três gráficos atuais) | — | ✅ |
| **F6** | Poder de compra por categoria: conta exata e quatro referências de reajuste | — | ✅ |
| **F7** | Catálogo de conceitos: os textos dos "?" num registro único | — | ✅ |
| **F8** | Aba Aprender: glossário e página por conceito | — | ✅ |
| **F12** | Tela de série: histórico, período e comparação na URL | — | 🚫 |
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
| **F10** | Fonte Focus completa: todos os indicadores, na menor escala, com o histórico das pesquisas | M7 | 5 | ⏳ |
| **F13** | Tela Déficit: primário, juros e nominal | M4 | 5 | ⏳ |
| **F9** | Explicadores com diagrama: os dois loops e as três pontes, inércia e Plano Real, emissão de moeda, reservas, dominância fiscal, r − g | M2 | 3 | ⏳ |
| **F16** | Composição da dívida pública federal (Tesouro), na tela Dívida | M4 | 1 | ⏳ |
| **F33** | Tela Crédito: custo do crédito, concessões e solidez dos bancos | M8 | 1 | ⏳ |
| **F29** | Limites mínimo e máximo da meta no gráfico do IPCA | M7 | 0 | ⏳ |
| **F31** | Tela Setor externo: dólar, transações correntes e IDP, reservas, posição internacional | M8 | 0 | ⏳ |
| **F32** | Tela Atividade: PIB, IBC-Br e desemprego | M8 | 0 | ⏳ |
| **F35** | IPCA livres, administrados e serviços | — | 0 | ⏳ |

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
> **Serve:** N2, N7
>
> **Progresso:** 3/7 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F9** | Explicadores com diagrama: os dois loops e as três pontes, inércia e Plano Real, emissão de moeda, reservas, dominância fiscal, r − g | F8 | ⏳ |
| **F36** | Explicador: as três dívidas (DBGG, DLSP e DPF) | F9 | ⏳ |
| **F37** | Explicador: por que a dívida não explode (prazo, rolagem, moeda, credores) | F9 | ⏳ |
| **F38** | Diagramas nos conceitos que já existem | F9 | ⏳ |

<details><summary>Concluído (3 itens)</summary>

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F7** | Catálogo de conceitos: os textos dos "?" num registro único | F22 | ✅ |
| **F8** | Aba Aprender: glossário e página por conceito | F7 | ✅ |
| **F26** | Busca com Ctrl+K: telas e conceitos | F8 | ✅ |

</details>

### M3 — Painel da economia

> **Objetivo:** Uma tela com os indicadores principais atualizados, nos blocos da página de estatísticas do BCB: inflação e juros, contas públicas, atividade, setor externo e crédito.
>
> **Serve:** N1
>
> **Progresso:** 0/1 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F11** | Painel "Visão geral": a página de estatísticas do BCB refeita com explicação | F4, F7, F10, F13 | ⏳ |

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

### M7 — Expectativas de mercado e meta completa

> **Objetivo:** O Focus inteiro no banco, continuando os gráficos e mostrando como a expectativa mudou, e o gráfico do IPCA com os dois limites da meta de cada ano.
>
> **Serve:** N1, N5
>
> **Progresso:** 0/4 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F10** | Fonte Focus completa: todos os indicadores, na menor escala, com o histórico das pesquisas | F2 | ⏳ |
| **F27** | Continuação pelo Focus nos gráficos | F10 | ⏳ |
| **F28** | Tela Focus: como a expectativa mudou semana a semana | F10 | ⏳ |
| **F29** | Limites mínimo e máximo da meta no gráfico do IPCA | F21 | ⏳ |

### M8 — Cobertura da página de estatísticas do BCB

> **Objetivo:** Uma tela explicada para cada bloco da página de estatísticas do BCB que ainda não tem: juros, setor externo, atividade e crédito.
>
> **Serve:** N1, N2, N7
>
> **Progresso:** 0/5 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F30** | Tela Juros: Selic, Copom e juro real | F4, F10 | ⏳ |
| **F31** | Tela Setor externo: dólar, transações correntes e IDP, reservas, posição internacional | F4 | ⏳ |
| **F32** | Tela Atividade: PIB, IBC-Br e desemprego | F3, F4 | ⏳ |
| **F33** | Tela Crédito: custo do crédito, concessões e solidez dos bancos | F4 | ⏳ |
| **F34** | Mercado imobiliário, na tela Crédito | F33 | 💤 |

### Sem marco

> **Progresso:** 1/2 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| **F35** | IPCA livres, administrados e serviços | F4, F8 | ⏳ |

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
| **F9** | Explicadores com diagrama: os dois loops e as três pontes, inércia e Plano Real, emissão de moeda, reservas, dominância fiscal, r − g | N2, N5, N7 | D6, D7 | M2 | F8 | Alto | Médio | Médio | Bom | ⏳ Pendente |
| **F10** | Fonte Focus completa: todos os indicadores, na menor escala, com o histórico das pesquisas | N1, N5 | D2 | M7 | F2 | Baixo | Médio | Médio | Bom | ⏳ Pendente |
| **F11** | Painel "Visão geral": a página de estatísticas do BCB refeita com explicação | N1 | D4, D6 | M3 | F4, F7, F10, F13 | Médio | Médio | Alto | Excelente | ⏳ Pendente |
| **F13** | Tela Déficit: primário, juros e nominal | N4, N6, N7 | D6 | M4 | F4 | Baixo | Médio | Alto | Excelente | ⏳ Pendente |
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
| **F27** | Continuação pelo Focus nos gráficos | N1, N5 | D3 | M7 | F10 | Médio | Médio | Alto | Excelente | ⏳ Pendente |
| **F28** | Tela Focus: como a expectativa mudou semana a semana | N1, N5 | — | M7 | F10 | Médio | Baixo | Médio | Bom | ⏳ Pendente |
| **F29** | Limites mínimo e máximo da meta no gráfico do IPCA | N1, N2 | — | M7 | F21 | Baixo | Baixo | Alto | Excelente | ⏳ Pendente |
| **F30** | Tela Juros: Selic, Copom e juro real | N1, N7 | D3 | M8 | F4, F10 | Médio | Baixo | Alto | Excelente | ⏳ Pendente |
| **F31** | Tela Setor externo: dólar, transações correntes e IDP, reservas, posição internacional | N1, N2, N7 | — | M8 | F4 | Médio | Médio | Alto | Bom | ⏳ Pendente |
| **F32** | Tela Atividade: PIB, IBC-Br e desemprego | N1, N2 | — | M8 | F3, F4 | Médio | Médio | Alto | Bom | ⏳ Pendente |
| **F33** | Tela Crédito: custo do crédito, concessões e solidez dos bancos | N1, N7 | — | M8 | F4 | Médio | Baixo | Médio | Bom | ⏳ Pendente |
| **F34** | Mercado imobiliário, na tela Crédito | N1 | — | M8 | F33 | Médio | Médio | Baixo | Médio | 💤 Registrado, sem prioridade |
| **F35** | IPCA livres, administrados e serviços | N1, N2 | — | — | F4, F8 | Baixo | Baixo | Médio | Bom | ⏳ Pendente |
| **F36** | Explicador: as três dívidas (DBGG, DLSP e DPF) | N2, N4, N7 | D7 | M2 | F9 | Baixo | Médio | Alto | Excelente | ⏳ Pendente |
| **F37** | Explicador: por que a dívida não explode (prazo, rolagem, moeda, credores) | N4, N5, N7 | D7 | M2 | F9 | Baixo | Médio | Alto | Excelente | ⏳ Pendente |
| **F38** | Diagramas nos conceitos que já existem | N2 | D7 | M2 | F9 | Baixo | Baixo | Médio | Bom | ⏳ Pendente |

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

**F9 — Explicadores de mecanismo, com diagrama.** Páginas em `/learn`, listadas no glossário (F8) na seção "Como as coisas se ligam" e no Ctrl+K (F26). Cada página é um diagrama em React Flow (D7) com texto curto em volta: o diagrama carrega a estrutura e o texto explica cada seta. É a primeira feature com diagrama, e por isso cria o componente base (nó de conceito com link para `/learn/<id>` e, quando há série, o valor de hoje).

**O explicador central: os dois loops e as três pontes.** Nasce da pergunta da conversa de origem ("dívida e inflação são 2 loops fechados que interferem um no outro, enviando uma 'carga'?"):
- o loop da dívida: dívida → juros → déficit nominal → dívida;
- o loop da inflação: inflação → reajustes → expectativas → inflação;
- as três pontes que levam carga de um ao outro: câmbio (dívida → desconfiança → dólar sobe → importados e inflação), emissão de moeda (déficit → BC cria dinheiro → inflação) e juros (inflação → BC sobe a Selic → custo da dívida → dívida);
- o que freia cada loop: superávit primário, crescimento nominal acima do juro, credibilidade do BC e a vedação de financiamento do Tesouro pelo BC na Lei de Responsabilidade Fiscal.

**Os outros temas,** cada um com o seu diagrama:
- inflação inercial e indexação, URV e Plano Real, e por que a inércia não morreu com o Real (serviços e expectativas acima da meta);
- emitir moeda gera inflação? Monetização e senhoriagem, e por que déficit não é emissão automática; liga ao estudo do financiamento monetário (F15);
- reservas, câmbio e dívida: as reservas como seguro contra a fuga de dólares, o efeito do câmbio na dívida líquida e o custo de carregá-las;
- dominância fiscal: quando o juro que combate a inflação piora a dívida;
- por que r − g decide a trajetória da dívida, com o País A (dívida de 120%, r 2%, g 6%) e o País B (dívida de 60%, r 15%, g 3%).

**Links no meio do texto:** o explicador leva ao dado real e ao simulador no ponto em que o assunto aparece. O de r − g liga à tela Dívida e ao simulador com os números do País A e do País B. O cabeçalho cita os conceitos usados, cada um com link para a página dele (F8).

**Fonte:** os ciclos de partida estão anotados da conversa com o ChatGPT (seis ciclos, com o que freia cada um). Cada afirmação factual é conferida contra a fonte oficial (BCB, IBGE, Tesouro, Planalto) antes de entrar, como manda a D4. Esse é o motivo do risco médio.

**F10 — Fonte Focus completa.** Provider da API Olinda do BCB (`https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/`), com todos os indicadores na menor escala que o Focus publica:

| Escala da previsão | Endpoint | Indicadores |
|---|---|---|
| Mês | `ExpectativaMercadoMensais` | IPCA, IPCA Administrados, Livres, Serviços, Bens industrializados, Alimentação no domicílio, câmbio, IGP-M, taxa de desocupação |
| Reunião do Copom | `ExpectativasMercadoSelic` | Selic |
| Trimestre | `ExpectativasMercadoTrimestrais` | PIB Total, além dos mensais (menos IGP-M) |
| Ano | `ExpectativasMercadoAnuais` | resultado primário e nominal, dívida líquida do setor público, dívida bruta do governo geral, conta corrente, balança comercial, investimento direto no país, PIB e seus componentes |
| 12 meses à frente | `ExpectativasMercadoInflacao12Meses` | IPCA, para o juro real ex-ante |

Conferido em 2026-10-07: o IPCA mensal vai até 24 meses à frente (set/2028), que é o horizonte da linha "Focus mais recente" da página do BCB.

**Tabela própria** (D2): `focus_expectations(indicator, survey_date, target_kind, target, median, respondents)`, em que `target_kind` é mês, trimestre, reunião, ano ou 12 meses, e `target` é o período previsto. Guarda o histórico de todas as pesquisas, dia útil a dia útil, como a API publica; o relatório semanal é a pesquisa de sexta.

**Refresh:** busca quando a última pesquisa em cache é anterior ao último dia útil, no máximo a cada 6 h, como as outras fontes. A primeira carga traz o histórico inteiro de cada endpoint, paginado.

**A conferir na implementação:** qual `baseCalculo` (0 ou 1) o relatório Focus publica, e o encoding dos nomes de indicador, que a API devolve com acentuação corrompida (os nomes viram enum do app, como no IBGE).

**Aceite:** a mediana do IPCA do ano corrente e a da Selic de fim de ano, na pesquisa de uma sexta, batem com o relatório Focus da segunda seguinte.

**F11 — Painel "Visão geral".** A página de estatísticas do BCB refeita com explicação: os mesmos indicadores, em cartões agrupados por bloco. Os códigos citados foram conferidos ao vivo em 2026-10-06; os demais são levantados na implementação.
- **Inflação e juros:** IPCA 12 meses (13522) × meta (13521), com a expectativa do Focus (F10); Selic meta (432); juro real ex-ante.
- **Contas públicas:** DLSP/PIB (4513) e DBGG/PIB (13762); o cartão "Resultado do governo em 12 meses", com barras de primário, juros e nominal (F13) e a frase com quanto do déficit é juro.
- **Atividade:** IBC-Br em 12 meses, PIB em 12 meses como crescimento em % e desemprego da PNAD Contínua (24369).
- **Setor externo:** dólar PTAX (1 diário, 3698 média mensal), reservas internacionais (13621), transações correntes e IDP em % do PIB, posição internacional de investimento.
- **Crédito:** custo do crédito, concessões de recursos livres e o índice de adequação do patrimônio dos bancos.

Cada cartão traz o último valor, a variação, uma sparkline, o "dado até", a fonte e o "?" (D6). O clique leva à tela temática do bloco (Inflação, Juros, Déficit, Dívida, Setor externo, Atividade, Crédito); enquanto a tela não existe, o cartão fica sem link. O `Record` da D4 obriga a existir conceito para cada cartão. O cabeçalho tem "Atualizar dados" com a hora da última verificação.

O juro real ex-ante é `(1 + Selic) / (1 + IPCA esperado em 12 meses) − 1`: o juro descontada a inflação que o mercado espera.

**Detalhe do SGS:** a série 432 publica a Selic meta até a próxima reunião do Copom, e por isso o último ponto tem data futura. O "dado até" do cartão usa a data de hoje.

**F13 — Resultado fiscal decomposto.** A NFSP é a necessidade de financiamento do setor público, ou seja, o déficit. Na convenção da NFSP, valor positivo é déficit.

**Séries candidatas** (SGS, % do PIB, 12 meses, setor público consolidado, sem desvalorização cambial): nominal 5727, juros nominais 5728, primário 5793. As três respondem, mas não fecham a conta em ago/2026: 0,62 + 7,83 dá 8,45, e a 5727 diz 9,48. O primeiro passo da implementação é conferir o nome de cada código no catálogo do SGS e achar o trio que fecha `nominal = primário + juros`.

**Tela "Déficit"** (rota própria, separada da tela Dívida):
- três números de resumo, cada um com "?": déficit nominal, primário e juros da dívida, com quanto do déficit é juro;
- o cartão "De onde vem o déficit": barras empilhadas de primário e juros por ano, com o nominal marcado, e a bandeja "Como ler e a conta" (o que é cada parte e a conta do último mês, que aqui é soma porque são valores em % do PIB do mesmo período). A bandeja liga ao loop da dívida no explicador dos dois loops (F9);
- a previsão do Focus para o primário e o nominal do ano, quando a continuação pelo Focus (F27) existir;
- a seção "Como o déficit é pago", que fica como esboço até a F15 fechar as séries.

Responde "onde se vê o déficit" e quanto dele é juro. A página de estatísticas fiscais do BCB mostra só o último mês publicado; a tela mostra a história.

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
- "Dívida líquida e dívida bruta": as duas linhas, como no gráfico do BCB, com a bandeja "Como ler" dizendo o que cada uma conta, por que a líquida desconta as reservas e que o Focus pergunta as duas. Liga ao explicador das três dívidas (F36);
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

**F24 — Simulador da trajetória da dívida.** Partir de um caso que aconteceu ou de um exemplo, mexer em juros, crescimento e primário e ver a dívida/PIB dos próximos 10 anos. Responde por que uma dívida de 200% do PIB pode estar "de boa" e outra de 40% não.

**Backend:** `GET /api/debt/simulation?debt=&r=&g=&primary=&years=` devolve a trajetória ano a ano, com `d(t+1) = d(t) · (1 + r) / (1 + g) − p`, composta dividindo (D3), e o `p*` que estabiliza.

**Pontos de partida, em dois grupos:**
- **Casos que aconteceram,** cada um com o período no nome:
  - **Brasil hoje,** sempre com os valores atuais da tela Dívida (F14), nunca um ano fixo;
  - **Brasil, Collor (1990):** dívida líquida perto de 40% do PIB, mas curta e numa moeda instável;
  - **Brasil, crise de 2002:** a desvalorização levou a dívida líquida a 56% do PIB;
  - **Brasil, recessão de 2015–2016:** déficit primário e PIB caindo ao mesmo tempo;
  - **Japão, anos 2010:** dívida acima de 200% do PIB, longa, em moeda própria e com credores de dentro;
  - **Grécia, 2010:** o mercado se recusa a rolar a dívida, e o país precisa de resgate;
  - **Argentina, 2001–2002:** calote da dívida e fim da paridade com o dólar;
  - **Argentina, 2023:** a moeda perde a confiança e a inflação passa de 200% ao ano.

  Os parâmetros (dívida, r, g e primário) são conferidos na implementação: os de fora com o FMI DataMapper, os do Brasil com as séries históricas do BCB (a DLSP do SGS 4513 começa em dez/2001; a de 1990 vem de uma série histórica a levantar). Escolher um caso abre o painel de contexto: moeda da dívida, prazo, quem empresta e o que aconteceu de verdade. Quando o usuário mexe nos números, o painel avisa que eles partiram daquele caso.
- **Exemplos para entender a conta:** País A (dívida de 120%, r 2%, g 6%, primário zero) e País B (dívida de 60%, r 15%, g 3%, déficit de 1%).

**Tela:**
- quatro controles, com o caso e os números na URL: dívida inicial (% do PIB), juro nominal efetivo, crescimento nominal do PIB, que aceita valor negativo, e primário (% do PIB, positivo é superávit);
- a linha da dívida/PIB por 10 anos;
- dois resultados, cada um com "?": a dívida em 10 anos, com a frase de que sobe ou desce, e o primário que estabiliza, com a distância para o primário escolhido;
- a bandeja "Como funciona": a corrida entre r e g; o que o simulador não vê (juro e câmbio que reagem à desconfiança, como na Argentina em 2002); por que o tamanho não basta (prazo, moeda e credores), com o link para os explicadores de r − g (F9) e de por que a dívida não explode (F37);
- a bandeja "Ver a conta": a fórmula com legenda e o primeiro ano com os números escolhidos.

**Aceite:** com d = 80%, r = 10%, g = 7% e primário igual ao p* (2,24% do PIB), a dívida fica em 80% em todos os anos.

**F16 — Composição da dívida pública federal.**

**Fonte:** o CSV "Estoque da Dívida Pública Federal" do Tesouro Transparente (CKAN, dataset `estoque-da-divida-publica-federal`). É mensal desde set/2017, tem cerca de 12 MB e traz uma linha por título e mês: título, vencimento, valor, quantidade, mês, carteira ("Mercado" ou "Banco Central") e tipo (interna ou externa). O arquivo vem em latin-1, com separador `;` e decimal com vírgula.

**Provider:** baixa o CSV inteiro e agrega por mês no backend. Grava em `observations` uma série derivada por agregado (D2):
- **composição por indexador**, pelo prefixo do título: LFT → Selic; LTN e NTN-F → prefixado; NTN-B → IPCA; NTN-C → IGP-M; dívida externa → câmbio; títulos legados (TDA, NTN-I, CVS…) → "outros";
- **prazo médio**, ponderado pelo valor;
- **vencimentos nos próximos 12 meses**, que é quanto o governo precisa rolar: emitir dívida nova para pagar a que vence;
- **parcela na carteira do Banco Central**, que alimenta a F15.

**Tela "Dívida",** abaixo da dinâmica (F14):
- o cartão "Quanto vence e quando": os vencimentos por ano à frente, com a bandeja "Como ler" sobre a rolagem. Prazo curto obriga a rolar muito de uma vez, e é aí que a desconfiança do mercado vira crise; a bandeja liga ao explicador de por que a dívida não explode (F37);
- o cartão "De que é feita a dívida federal": barras empilhadas por indexador, em dezembro de cada ano, com a bandeja "Como ler" (por que o indexador importa);
- três números com "?": prazo médio, vencimentos em 12 meses e a parcela na carteira do BC, que liga com a tela Déficit (F15).

A dívida federal (DPF) é um terceiro recorte, ao lado da DLSP e da DBGG, e a tela diz qual é qual pelo explicador das três dívidas (F36).

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

**F27 — Continuação pelo Focus nos gráficos.** O gráfico de uma série segue depois do último dado real com o que o mercado espera, na pesquisa Focus mais recente (F10), como a página de estatísticas do BCB faz com o IPCA.

**Como a previsão aparece:**
- uma linha vertical "hoje" separa o real da previsão;
- a previsão é tracejada, numa cor neutra, sobre uma faixa de fundo clara com o rótulo "previsão de mercado (Focus de <data>)";
- o destaque dos 3 últimos meses na cor do veredito (acelerando ou freando) fica só na linha real, porque fala de ritmo que já aconteceu.

**Por escala do Focus:**
- **mês a mês** (IPCA, câmbio, desemprego): linha contínua. O IPCA em 12 meses é composto no backend (D3), juntando os meses reais e os esperados até 24 meses à frente;
- **por reunião do Copom** (Selic): degraus nas datas das reuniões;
- **trimestre ou ano** (PIB, primário, nominal, dívidas, conta corrente, IDP): um ponto por período no fim dele, sem linha ligando.

**Componente:** um trecho de previsão compartilhado pelos gráficos de linha, ligado primeiro no gráfico do IPCA em 12 meses da tela de inflação. Nas telas que ainda não existem (Juros, Déficit, Dívida, Setor externo, Atividade), entra junto com cada uma.

**Aceite:** o trecho previsto do IPCA em 12 meses bate com a linha "Focus mais recente" do gráfico do BCB para a mesma data de pesquisa.

**F28 — Tela Focus: como a expectativa mudou.** Rota própria que mostra a evolução da previsão do mercado semana a semana, lida do histórico das pesquisas (F10).

- **Escolha:** o indicador e o período previsto (o ano de 2026, a reunião de dezembro do Copom), na URL.
- **Gráfico:** a mediana daquela previsão a cada sexta, com a meta de inflação quando o indicador é IPCA, e o número de instituições que responderam.
- **Frase de leitura:** "a previsão do IPCA de 2026 subiu nas últimas 5 semanas, de 4,94% para 5,01%", que é o formato da manchete do relatório Focus.
- **Tabela:** os indicadores do relatório Focus com a previsão de hoje, a de 4 semanas atrás e a seta de subida ou queda, como o próprio relatório.

Os conceitos do Aprender entram junto: pesquisa Focus, mediana, expectativa desancorada.

**F29 — Limites mínimo e máximo da meta no gráfico do IPCA.** O gráfico do IPCA em 12 meses passa a desenhar a meta, o limite máximo e o limite mínimo, como o gráfico do BCB, com os valores de cada ano.

**Hoje:** o gráfico tem só o teto. O registro da meta (SGS 13521) começa em 2019, e a tolerância é uma constante de 1,5 ponto. Com o histórico desde 1999 (F20), o ritmo vai até 2000, e antes de 2019 a linha some; e entre 1999 e 2016 a tolerância foi outra.

**Mudança:**
- o registro da meta começa em 1999, que é onde o SGS 13521 começa;
- a tolerância vira uma tabela por ano no domínio, conferida nas resoluções do CMN: 2 pontos em 1999–2002 e 2006–2016, 2,5 em 2003–2005 e 1,5 desde 2017;
- o `pace` devolve meta, piso e teto por mês, e o gráfico desenha a meta cheia e os dois limites tracejados;
- os anos em que a meta foi ajustada depois de fixada (2003 e 2004) são conferidos contra a série e o histórico de metas do BCB.

**Aceite:** em 2015, meta de 4,5% com limites de 2,5% e 6,5%; em 2026, 3% com 1,5% e 4,5%.

**F30 — Tela Juros.** Rota própria para a Selic, o centro da teia (N7): ela freia a inflação, encarece a dívida e o crédito.

- **Resumo:** Selic meta de hoje (SGS 432), a próxima reunião do Copom com a previsão do Focus para ela (F10), e o juro real ex-ante (Selic descontada a inflação esperada em 12 meses, dividindo, D3).
- **"A Selic e a inflação":** a Selic meta em degraus por reunião e o IPCA em 12 meses no mesmo período, com a distância entre as duas marcada como juro real. A bandeja "Como ler" conta por que o BC sobe o juro quando a inflação passa da meta e por que o efeito demora, e liga ao explicador dos dois loops (F9).
- **Continuação:** a Selic prevista por reunião, pela continuação do Focus (F27).
- **Juro neutro:** o juro real comparado com o neutro estimado pelo BC no Relatório de Política Monetária, escrito ao lado e sem cor (D6).

Os conceitos do Aprender entram junto: Selic, Copom, juro real, juro neutro.

**F31 — Tela Setor externo.** Rota própria com os gráficos de setor externo da página do BCB, todos do SGS. Responde de onde vem o preço do dólar e se o país depende de dinheiro que foge rápido.

- **"O dólar":** PTAX diária (SGS 1) e média mensal (3698), com a continuação do Focus (F27).
- **"De onde vêm e para onde vão os dólares":** transações correntes e IDP em % do PIB, em 12 meses, no mesmo gráfico como o BCB. A bandeja "Como ler": quando o IDP cobre o déficit em conta corrente, o buraco está financiado por dinheiro que veio para ficar.
- **"O colchão":** reservas internacionais (13621) em US$ e em % do PIB, com a bandeja ligando ao explicador de reservas, câmbio e dívida (F9).
- **"O balanço com o mundo":** posição internacional de investimento em % do PIB (trimestral), com ativos e passivos separados quando o SGS publicar. A bandeja explica por que um saldo negativo é normal em país emergente e por que pesa do que o passivo é feito (fábrica e ação em reais contra dívida em dólar de prazo curto).

Os códigos de transações correntes, IDP e posição internacional são levantados no catálogo do SGS na implementação. Os conceitos do Aprender entram junto: câmbio, PTAX, reservas, transações correntes, IDP, posição internacional de investimento.

**F32 — Tela Atividade.** Rota própria para quanto a economia produz e quanto emprega.

- **"A economia cresce ou encolhe?":** o PIB trimestral do IBGE (variação em 4 trimestres, tabela do SIDRA levantada na implementação, pelo provider do IBGE que já existe) e o IBC-Br mensal do BCB (SGS) no mesmo gráfico. A bandeja "Como ler" diz qual é qual: o PIB do IBGE é o oficial e sai por trimestre; o IBC-Br é a prévia mensal do BCB, para ver antes, e às vezes diverge.
- **"Desemprego":** a taxa de desocupação da PNAD Contínua (SGS 24369), trimestre móvel, com a continuação do Focus (F27). A bandeja diz que o número do BCB é o mesmo do IBGE: o BCB republica a PNAD.
- **Continuação:** PIB do ano e por trimestre, pelo Focus.

Os conceitos do Aprender entram junto: PIB, IBC-Br, crescimento real e nominal, taxa de desocupação, trimestre móvel.

**F33 — Tela Crédito.** Rota própria com os gráficos de crédito da página do BCB, todos do SGS. Liga a Selic à vida real: quanto custa pegar dinheiro emprestado e quanto está sendo emprestado.

- **"Quanto custa o crédito":** o indicador de custo do crédito (ICC), em % ao ano, com a Selic no mesmo gráfico. A bandeja "Como ler" explica o spread, a distância entre o que o banco cobra e a Selic.
- **"Quanto está sendo emprestado":** concessões de recursos livres, variação em 12 meses, para pessoa jurídica e para pessoa física (não rotativo), como o BCB.
- **"Os bancos aguentam?":** o índice de adequação do patrimônio de referência (Basileia), com o mínimo regulatório escrito ao lado.

Os códigos são levantados no catálogo do SGS na implementação. Os conceitos do Aprender entram junto: ICC, spread, concessões, recursos livres e direcionados, índice de Basileia. A bandeja de custo liga ao explicador dos dois loops (F9), na ponte dos juros.

**F34 — Mercado imobiliário.** Uma seção na tela Crédito (F33) com os dois gráficos de mercado imobiliário da página do BCB:
- as fontes de recursos do financiamento imobiliário: estoque e o SBPE (a poupança que financia a casa própria);
- a carteira de crédito imobiliário de pessoa física por modalidade: SFH, FGTS, livre, home equity e comercial.

**Fonte:** as Informações do Mercado Imobiliário do BCB, levantadas na implementação (serviço Olinda ou SGS), com o provider em `backend/adapters/`.

Fica registrado sem prioridade: completa a cobertura da página do BCB, mas é o bloco mais distante das perguntas de dívida, inflação e juros.

**F35 — IPCA livres, administrados e serviços.** Outro corte do IPCA, diferente dos 9 grupos: pela forma como o preço se forma.
- **Administrados (monitorados):** preços que dependem de governo ou contrato, como energia, gasolina, ônibus, água, plano de saúde e remédio.
- **Livres:** os que o mercado forma, e dentro deles os serviços, que carregam a inércia (F9).

**No Aprender:** uma página de conceito com o que entra em cada corte, por que o BC olha os serviços para medir a inércia e por que a inflação de administrados reage a decisão de governo, não a juro.

**Na tela de inflação:** um cartão com os três em 12 meses e a continuação do Focus (F27), que tem previsão mensal para cada um. As séries são do SGS (IPCA livres, monitorados e serviços), com os códigos levantados na implementação e conferidos contra a nota do IBGE.

**F36 — Explicador: as três dívidas.** Página em `/learn` com um diagrama (D7) das três medidas de dívida pública e do que cada uma conta:
- **DBGG**, dívida bruta do governo geral: o que União, estados e municípios devem, sem descontar nada. É a que o FMI e a IFI usam;
- **DLSP**, dívida líquida do setor público: inclui o Banco Central e as estatais, e desconta o que o setor público tem a receber, com as reservas internacionais como maior item;
- **DPF**, dívida pública federal: só os títulos do Tesouro, a que o Relatório Mensal da Dívida detalha (F16).

**O diagrama** mostra a passagem de uma para a outra: da DBGG se somam o BC e as estatais e se descontam os ativos, e sai a DLSP. Os nós mostram o valor de hoje em % do PIB (em ago/2026, DBGG 82,9% e DLSP 69,3%).

**Perguntas que a página responde:** qual dívida aparece na notícia; o Focus pergunta as duas (DLSP e DBGG), separadas; por que o dólar subir faz a líquida cair e não mexe na bruta.

Os fatos são conferidos no manual de estatísticas fiscais do BCB e no Tesouro (D4).

**F37 — Explicador: por que a dívida não explode.** Página em `/learn` com um diagrama (D7) do que decide se uma dívida é sustentável, além do tamanho:
- **prazo e rolagem:** dívida longa vence aos poucos; dívida curta obriga a rolar muito de uma vez, e a desconfiança vira crise na hora de rolar;
- **moeda:** dever na própria moeda contra dever em moeda que o país não emite;
- **credores:** gente de dentro, mercado de fora ou credores oficiais;
- **r − g:** o juro contra o crescimento (F9).

**Os casos** são os mesmos do simulador (F24), cada um mostrando qual desses fatores pesou:
- Japão, anos 2010: dívida acima de 200% do PIB, longa, em iene e com credores de dentro;
- Grécia, 2010: o mercado se recusa a rolar; hoje, com credores oficiais e prazos longos, uma dívida em torno de 137% do PIB não está em crise;
- Brasil, Collor (1990): dívida perto de 40% do PIB, mas curta e numa moeda instável.

Cada caso leva ao simulador já carregado com ele, e a página liga aos vencimentos da tela Dívida (F16). Os números vêm da conversa com o ChatGPT e são conferidos no FMI DataMapper e no BCB antes de entrar (D4).

**F38 — Diagramas nos conceitos que já existem.** Passar pelos conceitos do catálogo (F7) e decidir, um a um, onde um diagrama explica melhor do que o texto (D7). Candidatos:
- acumulado em 12 meses: a janela que anda um mês e o mês que sai;
- efeito base: o mês que sai da janela puxando o 12 meses;
- poder de compra: o reajuste e a inflação do grupo como duas réguas, dividindo;
- meta de inflação: a faixa, a carta aberta e quem decide (CMN, BC);
- salário mínimo: a regra de reajuste (INPC mais o crescimento do PIB, com o teto).

O resultado de cada um fica registrado: diagrama novo na página, ou "o texto basta". O diagrama usa o componente base criado pelos explicadores (F9).

---
## 2. Nice-to-have

> Nenhum item nesta categoria atualmente.

---
## 3. Descartada

| ID | Resumo | N# | Status |
| --- | --- | --- | --- |
| **F18** | Linha do tempo histórica com os episódios marcados | N5, N2 | 🚫 Descartado |
| **F19** | Comparação internacional da dívida (FMI) | N4, N5 | 🚫 Descartado |
| **F12** | Tela de série: histórico, período e comparação na URL | N1 | 🚫 Descartado |

**F18 — Descartado.** 🚫 Descartada na segunda rodada de design (2026-10-07): a linha do tempo foi considerada irrelevante.

**F19 — Descartado.** 🚫 Descartada como tela própria na segunda rodada de design (2026-10-07) e absorvida pelo simulador da dívida (F24), que ganhou os casos Japão anos 2010, Grécia 2010 e Argentina 2001, com os parâmetros conferidos com o FMI DataMapper.

**F12 — Descartado.** 🚫 Descartada na revisão de 2026-10-08. O comparador livre de séries não vinha de nenhuma pergunta, e sobrepor séries de unidades diferentes sugere correlação que não existe. Os pares que fazem sentido são poucos e conhecidos (DLSP e DBGG, transações correntes e IDP, Selic e IPCA) e ficam montados nas telas temáticas. O clique no cartão do painel leva à tela temática do bloco.

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
