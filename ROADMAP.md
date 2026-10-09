<!-- ARQUIVO GERADO POR scripts/roadmap.py (skill feature-roadmap) -- NÃO EDITAR À MÃO. -->

> ⚠️ **Este arquivo é gerado automaticamente — não edite manualmente.** Toda mudança (inserir/mover/concluir/descartar/remover um card, cadastrar ou atualizar uma necessidade/decisão/marco, o cabeçalho) passa por `scripts/roadmap.py` (ver `SKILL.md`); uma edição direta aqui é sobrescrita sem aviso na próxima regeneração.

# Roadmap — EconomicStatistics

> Kanban de features, segue a metodologia da skill `feature-roadmap`. Companion: [DECISIONS.md](DECISIONS.md) — lá está o "porquê" (necessidades `N#` e decisões `D#`); aqui fica só o "o quê construir, em que marco e em que estado está".
>
> **Regra de sincronização:** os dois documentos usam os mesmos IDs (`N#`, `D#`) e devem sempre concordar sobre a decisão vigente de cada item.
>
> **Última mudança (2026-10-08):** Concluída a tela Juros, com a Selic meta diária e o calendário do Copom buscado do site do BCB, e registrada a D8: dado externo se atualiza sozinho, sem número digitado no código.

## Glossário

> Descrição completa de cada `N#`/`D#` em `DECISIONS.md`; `F#` é espelho do kanban abaixo. "Condiciona" é derivado dos cards: as `F#` que citam aquele `N#`/`D#`.

| ID | Resumo | Condiciona (F#) | Status |
| --- | --- | --- | --- |
| **N1** | Acompanhar a economia brasileira num lugar só | [F1](#f1), [F2](#f2), [F3](#f3), [F4](#f4), [F5](#f5), [F10](#f10), [F11](#f11), [F20](#f20), [F21](#f21), [F25](#f25), [F26](#f26), [F27](#f27), [F28](#f28), [F29](#f29), [F30](#f30), [F31](#f31), [F32](#f32), [F33](#f33), [F34](#f34), [F35](#f35), [F44](#f44), [F45](#f45) | — |
| **N2** | Entender o que cada número significa enquanto olho | [F1](#f1), [F7](#f7), [F8](#f8), [F9](#f9), [F22](#f22), [F23](#f23), [F25](#f25), [F26](#f26), [F29](#f29), [F31](#f31), [F32](#f32), [F35](#f35), [F36](#f36), [F38](#f38), [F39](#f39), [F40](#f40), [F42](#f42) | — |
| **N3** | Saber em que áreas de gasto o dinheiro passou a comprar mais ou menos | [F1](#f1), [F2](#f2), [F3](#f3), [F4](#f4), [F6](#f6), [F20](#f20), [F23](#f23) | — |
| **N4** | Saber se a dívida pública está sob controle | [F4](#f4), [F13](#f13), [F14](#f14), [F16](#f16), [F24](#f24), [F36](#f36), [F37](#f37), [F40](#f40), [F41](#f41), [F43](#f43) | — |
| **N5** | Saber se a economia está saudável ou caminhando para uma crise | [F9](#f9), [F10](#f10), [F17](#f17), [F21](#f21), [F24](#f24), [F27](#f27), [F28](#f28), [F37](#f37) | — |
| **N6** | Saber como o déficit é financiado | [F4](#f4), [F13](#f13), [F16](#f16), [F41](#f41), [F43](#f43) | — |
| **N7** | Entender como os números se ligam: a teia de ciclos e fluxos | [F9](#f9), [F13](#f13), [F30](#f30), [F31](#f31), [F33](#f33), [F36](#f36), [F37](#f37), [F39](#f39) | — |
| [**F9**](#f9) | Explicadores com diagrama: os dois loops e as três pontes, inércia e Plano Real, emissão de moeda, reservas, dominância fiscal, r − g | — | ⏳ |
| [**F11**](#f11) | Painel "Visão geral": a página de estatísticas do BCB refeita com explicação | — | ⏳ |
| [**F15**](#f15) | Como medir o financiamento monetário do déficit | — | 🔍 |
| [**F17**](#f17) | "Check engine": semáforo dos sinais de crise | — | ⏳ |
| [**F24**](#f24) | Simulador da dívida, com casos que aconteceram e exemplos | — | ⏳ |
| [**F34**](#f34) | Mercado imobiliário, na tela Crédito | — | 💤 |
| [**F35**](#f35) | IPCA livres, administrados e serviços | — | ⏳ |
| [**F36**](#f36) | Explicador: as três dívidas (DBGG, DLSP e DPF) | — | ⏳ |
| [**F37**](#f37) | Explicador: por que a dívida não explode (prazo, rolagem, moeda, credores) | — | ⏳ |
| [**F38**](#f38) | Diagramas nos conceitos que já existem | — | ⏳ |
| [**F39**](#f39) | Pranchas dos explicadores no canvas | — | ⏳ |
| [**F45**](#f45) | Tolerância da meta de inflação buscada da fonte | — | ⏳ |
| [**F46**](#f46) | Juro neutro na tela Juros | — | 🔍 |
| [**F47**](#f47) | Basileia dos bancos na tela Crédito | — | 🔍 |

<details>
<summary><strong>Concluído / decidido / descartado (41 itens — clique pra expandir)</strong></summary>

| ID | Resumo | Condiciona (F#) | Status |
| --- | --- | --- | --- |
| **D1** | Stack igual à do Finance Manager | [F1](#f1) | ✅ |
| **D2** | Dado externo passa por um cache SQLite descartável: tela → banco → fonte | [F2](#f2), [F3](#f3), [F4](#f4), [F10](#f10), [F16](#f16), [F20](#f20), [F43](#f43) | ✅ |
| **D3** | Toda conta econômica mora no backend, em float, e taxa se compõe multiplicando | [F2](#f2), [F5](#f5), [F6](#f6), [F14](#f14), [F21](#f21), [F24](#f24), [F25](#f25), [F27](#f27), [F30](#f30) | ✅ |
| **D4** | Conceito é um registro único e tipado no front, e toda série do backend aponta para um conceito | [F7](#f7), [F8](#f8), [F11](#f11), [F26](#f26) | ✅ |
| **D5** | Cada grupo do IPCA tem cor e ícone fixos | [F21](#f21), [F23](#f23), [F25](#f25) | ✅ |
| **D6** | Linguagem visual própria, definida no canvas antes de virar código | [F7](#f7), [F8](#f8), [F9](#f9), [F11](#f11), [F13](#f13), [F14](#f14), [F16](#f16), [F17](#f17), [F22](#f22), [F23](#f23), [F24](#f24), [F26](#f26), [F39](#f39), [F40](#f40), [F41](#f41), [F44](#f44) | ✅ |
| **D7** | Mecanismo se explica com diagrama, desenhado em React Flow | [F9](#f9), [F36](#f36), [F37](#f37), [F38](#f38), [F39](#f39) | ✅ |
| **D8** | Dado externo se atualiza sozinho e aos poucos, sem número digitado no código | [F45](#f45) | ✅ |
| [**F1**](#f1) | Scaffold no padrão do Finance Manager, aposentando o Streamlit | — | ✅ |
| [**F2**](#f2) | Cache de séries no SQLite com refresh idempotente | — | ✅ |
| [**F3**](#f3) | Fonte IBGE: IPCA por grupo (tabela 7060) | — | ✅ |
| [**F4**](#f4) | Fonte BCB/SGS, portada do Finance Manager e parametrizada por código | — | ✅ |
| [**F5**](#f5) | Tela de inflação por categoria (os três gráficos atuais) | — | ✅ |
| [**F6**](#f6) | Poder de compra por categoria: conta exata e quatro referências de reajuste | — | ✅ |
| [**F7**](#f7) | Catálogo de conceitos: os textos dos "?" num registro único | — | ✅ |
| [**F8**](#f8) | Aba Aprender: glossário e página por conceito | — | ✅ |
| [**F10**](#f10) | Fonte Focus completa: todos os indicadores, na menor escala, com o histórico das pesquisas | — | ✅ |
| [**F12**](#f12) | Tela de série: histórico, período e comparação na URL | — | 🚫 |
| [**F13**](#f13) | Tela Déficit: primário, juros e nominal | — | ✅ |
| [**F14**](#f14) | Tela Dívida: r, g, r − g e o primário que estabiliza | — | ✅ |
| [**F16**](#f16) | Composição da dívida pública federal (Tesouro), na tela Dívida | — | ✅ |
| [**F18**](#f18) | Linha do tempo histórica com os episódios marcados | — | 🚫 |
| [**F19**](#f19) | Comparação internacional da dívida (FMI) | — | 🚫 |
| [**F20**](#f20) | IPCA por grupo desde 1999 (emenda das tabelas do IBGE) | — | ✅ |
| [**F21**](#f21) | Inflação acelerando ou freando | — | ✅ |
| [**F22**](#f22) | Rodadas de design no canvas | — | ✅ |
| [**F23**](#f23) | Linguagem visual nas telas que existem | — | ✅ |
| [**F25**](#f25) | Comparação com o mesmo mês de outros anos | — | ✅ |
| [**F26**](#f26) | Busca com Ctrl+K: telas e conceitos | — | ✅ |
| [**F27**](#f27) | Continuação pelo Focus nos gráficos | — | ✅ |
| [**F28**](#f28) | Tela Focus: como a expectativa mudou semana a semana | — | ✅ |
| [**F29**](#f29) | Limites mínimo e máximo da meta no gráfico do IPCA | — | ✅ |
| [**F30**](#f30) | Tela Juros: Selic, Copom e juro real | — | ✅ |
| [**F31**](#f31) | Tela Setor externo: dólar, transações correntes e IDP, reservas, posição internacional | — | ✅ |
| [**F32**](#f32) | Tela Atividade: PIB, IBC-Br e desemprego | — | ✅ |
| [**F33**](#f33) | Tela Crédito: custo do crédito, spread e concessões | — | ✅ |
| [**F40**](#f40) | Leitura mais clara nas telas Dívida, Setor externo e Déficit | — | ✅ |
| [**F41**](#f41) | Déficit mês a mês, com o nominal numa coluna própria | — | ✅ |
| [**F42**](#f42) | Gráfico com o dado de hoje no "É bom ou ruim?" do Aprender | — | ✅ |
| [**F43**](#f43) | Quem faz o déficit: a NFSP por esfera | — | ✅ |
| [**F44**](#f44) | A busca e o rodapé da barra lateral seguem a tela | — | ✅ |

</details>

---

## 🚦 Livre pra pegar

> Derivado do grafo de dependências: as `F#` que podem ser pegas agora — toda dependência já ✅. "Destrava" é quantas `F#` em aberto esperam por ela, direta ou indiretamente; é por aí que a tabela está ordenada. 💤 (sem prioridade) e 🚫 não entram.

| ID | Resumo | Marco | Destrava | Status |
| --- | --- | --- | --- | --- |
| [**F39**](#f39) | Pranchas dos explicadores no canvas | M2 | 4 | ⏳ |
| [**F11**](#f11) | Painel "Visão geral": a página de estatísticas do BCB refeita com explicação | M3 | 1 | ⏳ |
| [**F24**](#f24) | Simulador da dívida, com casos que aconteceram e exemplos | M4 | 1 | ⏳ |
| [**F15**](#f15) | Como medir o financiamento monetário do déficit | M4 | 0 | 🔍 |
| [**F35**](#f35) | IPCA livres, administrados e serviços | — | 0 | ⏳ |
| [**F45**](#f45) | Tolerância da meta de inflação buscada da fonte | — | 0 | ⏳ |
| [**F46**](#f46) | Juro neutro na tela Juros | M8 | 0 | 🔍 |
| [**F47**](#f47) | Basileia dos bancos na tela Crédito | M8 | 0 | 🔍 |

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
| [**F1**](#f1) | Scaffold no padrão do Finance Manager, aposentando o Streamlit | — | ✅ |
| [**F2**](#f2) | Cache de séries no SQLite com refresh idempotente | [F1](#f1) | ✅ |
| [**F3**](#f3) | Fonte IBGE: IPCA por grupo (tabela 7060) | [F2](#f2) | ✅ |
| [**F4**](#f4) | Fonte BCB/SGS, portada do Finance Manager e parametrizada por código | [F2](#f2) | ✅ |
| [**F5**](#f5) | Tela de inflação por categoria (os três gráficos atuais) | [F3](#f3) | ✅ |
| [**F6**](#f6) | Poder de compra por categoria: conta exata e quatro referências de reajuste | [F3](#f3), [F4](#f4) | ✅ |

</details>

### M2 — Camada didática

> **Objetivo:** Todo número na tela tem um "?" com explicação e fórmula, e a aba Aprender permite estudar os conceitos.
>
> **Serve:** N2, N7
>
> **Progresso:** 4/9 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| [**F9**](#f9) | Explicadores com diagrama: os dois loops e as três pontes, inércia e Plano Real, emissão de moeda, reservas, dominância fiscal, r − g | [F8](#f8), [F39](#f39), [F13](#f13), [F14](#f14), [F30](#f30), [F31](#f31) | ⏳ |
| [**F36**](#f36) | Explicador: as três dívidas (DBGG, DLSP e DPF) | [F9](#f9), [F14](#f14), [F16](#f16) | ⏳ |
| [**F37**](#f37) | Explicador: por que a dívida não explode (prazo, rolagem, moeda, credores) | [F9](#f9), [F16](#f16), [F24](#f24) | ⏳ |
| [**F38**](#f38) | Diagramas nos conceitos que já existem | [F9](#f9) | ⏳ |
| [**F39**](#f39) | Pranchas dos explicadores no canvas | — | ⏳ |

<details><summary>Concluído (4 itens)</summary>

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| [**F7**](#f7) | Catálogo de conceitos: os textos dos "?" num registro único | [F22](#f22) | ✅ |
| [**F8**](#f8) | Aba Aprender: glossário e página por conceito | [F7](#f7) | ✅ |
| [**F26**](#f26) | Busca com Ctrl+K: telas e conceitos | [F8](#f8) | ✅ |
| [**F42**](#f42) | Gráfico com o dado de hoje no "É bom ou ruim?" do Aprender | [F8](#f8), [F29](#f29) | ✅ |

</details>

### M3 — Painel da economia

> **Objetivo:** Uma tela com os indicadores principais atualizados, nos blocos da página de estatísticas do BCB: inflação e juros, contas públicas, atividade, setor externo e crédito.
>
> **Serve:** N1
>
> **Progresso:** 0/1 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| [**F11**](#f11) | Painel "Visão geral": a página de estatísticas do BCB refeita com explicação | [F4](#f4), [F7](#f7), [F10](#f10), [F13](#f13) | ⏳ |

### M4 — Dívida e déficit

> **Objetivo:** Ver onde está o déficit, como ele é financiado e se a dívida se estabiliza.
>
> **Serve:** N4, N6
>
> **Progresso:** 5/7 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| [**F15**](#f15) | Como medir o financiamento monetário do déficit | [F13](#f13), [F16](#f16) | 🔍 |
| [**F24**](#f24) | Simulador da dívida, com casos que aconteceram e exemplos | [F14](#f14) | ⏳ |

<details><summary>Concluído (5 itens)</summary>

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| [**F13**](#f13) | Tela Déficit: primário, juros e nominal | [F4](#f4) | ✅ |
| [**F14**](#f14) | Tela Dívida: r, g, r − g e o primário que estabiliza | [F13](#f13) | ✅ |
| [**F16**](#f16) | Composição da dívida pública federal (Tesouro), na tela Dívida | [F2](#f2) | ✅ |
| [**F41**](#f41) | Déficit mês a mês, com o nominal numa coluna própria | [F13](#f13) | ✅ |
| [**F43**](#f43) | Quem faz o déficit: a NFSP por esfera | [F13](#f13) | ✅ |

</details>

### M5 — Saúde da economia

> **Objetivo:** Os sinais que costumam piorar antes de uma crise, com cor só onde existe faixa oficial.
>
> **Serve:** N5
>
> **Progresso:** 0/1 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| [**F17**](#f17) | "Check engine": semáforo dos sinais de crise | [F11](#f11), [F14](#f14) | ⏳ |

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
| [**F21**](#f21) | Inflação acelerando ou freando | [F5](#f5) | ✅ |
| [**F22**](#f22) | Rodadas de design no canvas | — | ✅ |
| [**F23**](#f23) | Linguagem visual nas telas que existem | [F22](#f22), [F7](#f7) | ✅ |
| [**F25**](#f25) | Comparação com o mesmo mês de outros anos | [F5](#f5) | ✅ |

</details>

### M7 — Expectativas de mercado e meta completa

> **Objetivo:** O Focus inteiro no banco, continuando os gráficos e mostrando como a expectativa mudou, e o gráfico do IPCA com os dois limites da meta de cada ano.
>
> **Serve:** N1, N5
>
> **Progresso:** 4/4 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| — | *(nada em aberto)* | — | — |

<details><summary>Concluído (4 itens)</summary>

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| [**F10**](#f10) | Fonte Focus completa: todos os indicadores, na menor escala, com o histórico das pesquisas | [F2](#f2) | ✅ |
| [**F27**](#f27) | Continuação pelo Focus nos gráficos | [F10](#f10) | ✅ |
| [**F28**](#f28) | Tela Focus: como a expectativa mudou semana a semana | [F10](#f10) | ✅ |
| [**F29**](#f29) | Limites mínimo e máximo da meta no gráfico do IPCA | [F21](#f21) | ✅ |

</details>

### M8 — Cobertura da página de estatísticas do BCB

> **Objetivo:** Uma tela explicada para cada bloco da página de estatísticas do BCB que ainda não tem: juros, setor externo, atividade e crédito.
>
> **Serve:** N1, N2, N7
>
> **Progresso:** 4/7 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| [**F34**](#f34) | Mercado imobiliário, na tela Crédito | [F33](#f33) | 💤 |
| [**F46**](#f46) | Juro neutro na tela Juros | [F30](#f30) | 🔍 |
| [**F47**](#f47) | Basileia dos bancos na tela Crédito | [F33](#f33) | 🔍 |

<details><summary>Concluído (4 itens)</summary>

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| [**F30**](#f30) | Tela Juros: Selic, Copom e juro real | [F4](#f4), [F10](#f10) | ✅ |
| [**F31**](#f31) | Tela Setor externo: dólar, transações correntes e IDP, reservas, posição internacional | [F4](#f4) | ✅ |
| [**F32**](#f32) | Tela Atividade: PIB, IBC-Br e desemprego | [F3](#f3), [F4](#f4) | ✅ |
| [**F33**](#f33) | Tela Crédito: custo do crédito, spread e concessões | [F4](#f4) | ✅ |

</details>

### Sem marco

> **Progresso:** 3/5 concluídas

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| [**F35**](#f35) | IPCA livres, administrados e serviços | [F4](#f4), [F8](#f8) | ⏳ |
| [**F45**](#f45) | Tolerância da meta de inflação buscada da fonte | [F29](#f29) | ⏳ |

<details><summary>Concluído (3 itens)</summary>

| ID | Resumo | Depende de | Status |
| --- | --- | --- | --- |
| [**F20**](#f20) | IPCA por grupo desde 1999 (emenda das tabelas do IBGE) | [F3](#f3) | ✅ |
| [**F40**](#f40) | Leitura mais clara nas telas Dívida, Setor externo e Déficit | [F13](#f13), [F14](#f14), [F31](#f31) | ✅ |
| [**F44**](#f44) | A busca e o rodapé da barra lateral seguem a tela | [F13](#f13), [F14](#f14), [F31](#f31), [F28](#f28) | ✅ |

</details>

---

## 1. Atende necessidade

| ID | Resumo | Atende (N#) | D# | Marco | Depende de | Esforço | Risco | Valor | Custo-benefício | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **F1** | Scaffold no padrão do Finance Manager, aposentando o Streamlit | N1, N2, N3 | D1 | M1 | — | Médio | Baixo | Alto | Excelente | ✅ Concluído |
| **F2** | Cache de séries no SQLite com refresh idempotente | N1, N3 | D2, D3 | M1 | [F1](#f1) | Médio | Médio | Alto | Excelente | ✅ Concluído |
| **F3** | Fonte IBGE: IPCA por grupo (tabela 7060) | N1, N3 | D2 | M1 | [F2](#f2) | Baixo | Médio | Alto | Excelente | ✅ Concluído |
| **F4** | Fonte BCB/SGS, portada do Finance Manager e parametrizada por código | N1, N3, N4, N6 | D2 | M1 | [F2](#f2) | Baixo | Baixo | Alto | Excelente | ✅ Concluído |
| **F5** | Tela de inflação por categoria (os três gráficos atuais) | N1 | D3 | M1 | [F3](#f3) | Médio | Baixo | Alto | Bom | ✅ Concluído |
| **F6** | Poder de compra por categoria: conta exata e quatro referências de reajuste | N3 | D3 | M1 | [F3](#f3), [F4](#f4) | Médio | Médio | Alto | Excelente | ✅ Concluído |
| **F7** | Catálogo de conceitos: os textos dos "?" num registro único | N2 | D4, D6 | M2 | [F22](#f22) | Médio | Baixo | Alto | Excelente | ✅ Concluído |
| **F8** | Aba Aprender: glossário e página por conceito | N2 | D4, D6 | M2 | [F7](#f7) | Médio | Baixo | Alto | Bom | ✅ Concluído |
| **F9** | Explicadores com diagrama: os dois loops e as três pontes, inércia e Plano Real, emissão de moeda, reservas, dominância fiscal, r − g | N2, N5, N7 | D6, D7 | M2 | [F8](#f8), [F39](#f39), [F13](#f13), [F14](#f14), [F30](#f30), [F31](#f31) | Alto | Médio | Médio | Bom | ⏳ Pendente |
| **F10** | Fonte Focus completa: todos os indicadores, na menor escala, com o histórico das pesquisas | N1, N5 | D2 | M7 | [F2](#f2) | Baixo | Médio | Médio | Bom | ✅ Concluído |
| **F11** | Painel "Visão geral": a página de estatísticas do BCB refeita com explicação | N1 | D4, D6 | M3 | [F4](#f4), [F7](#f7), [F10](#f10), [F13](#f13) | Médio | Médio | Alto | Excelente | ⏳ Pendente |
| **F13** | Tela Déficit: primário, juros e nominal | N4, N6, N7 | D6 | M4 | [F4](#f4) | Baixo | Médio | Alto | Excelente | ✅ Concluído |
| **F14** | Tela Dívida: r, g, r − g e o primário que estabiliza | N4 | D3, D6 | M4 | [F13](#f13) | Médio | Médio | Alto | Excelente | ✅ Concluído |
| **F23** | Linguagem visual nas telas que existem | N2, N3 | D5, D6 | M6 | [F22](#f22), [F7](#f7) | Médio | Baixo | Alto | Bom | ✅ Concluído |
| **F21** | Inflação acelerando ou freando | N1, N5 | D3, D5 | M6 | [F5](#f5) | Médio | Baixo | Alto | Excelente | ✅ Concluído |
| **F24** | Simulador da dívida, com casos que aconteceram e exemplos | N4, N5 | D3, D6 | M4 | [F14](#f14) | Médio | Baixo | Alto | Excelente | ⏳ Pendente |
| **F16** | Composição da dívida pública federal (Tesouro), na tela Dívida | N4, N6 | D2, D6 | M4 | [F2](#f2) | Médio | Médio | Alto | Bom | ✅ Concluído |
| **F17** | "Check engine": semáforo dos sinais de crise | N5 | D6 | M5 | [F11](#f11), [F14](#f14) | Médio | Baixo | Alto | Bom | ⏳ Pendente |
| **F20** | IPCA por grupo desde 1999 (emenda das tabelas do IBGE) | N3, N1 | D2 | — | [F3](#f3) | Baixo | Baixo | Alto | Excelente | ✅ Concluído |
| **F22** | Rodadas de design no canvas | N2 | D6 | M6 | — | Médio | Baixo | Alto | Excelente | ✅ Concluído |
| **F25** | Comparação com o mesmo mês de outros anos | N1, N2 | D3, D5 | M6 | [F5](#f5) | Médio | Baixo | Alto | Bom | ✅ Concluído |
| **F26** | Busca com Ctrl+K: telas e conceitos | N1, N2 | D4, D6 | M2 | [F8](#f8) | Baixo | Baixo | Alto | Excelente | ✅ Concluído |
| **F27** | Continuação pelo Focus nos gráficos | N1, N5 | D3 | M7 | [F10](#f10) | Médio | Médio | Alto | Excelente | ✅ Concluído |
| **F28** | Tela Focus: como a expectativa mudou semana a semana | N1, N5 | — | M7 | [F10](#f10) | Médio | Baixo | Médio | Bom | ✅ Concluído |
| **F29** | Limites mínimo e máximo da meta no gráfico do IPCA | N1, N2 | — | M7 | [F21](#f21) | Baixo | Baixo | Alto | Excelente | ✅ Concluído |
| **F30** | Tela Juros: Selic, Copom e juro real | N1, N7 | D3 | M8 | [F4](#f4), [F10](#f10) | Médio | Baixo | Alto | Excelente | ✅ Concluído |
| **F31** | Tela Setor externo: dólar, transações correntes e IDP, reservas, posição internacional | N1, N2, N7 | — | M8 | [F4](#f4) | Médio | Médio | Alto | Bom | ✅ Concluído |
| **F32** | Tela Atividade: PIB, IBC-Br e desemprego | N1, N2 | — | M8 | [F3](#f3), [F4](#f4) | Médio | Médio | Alto | Bom | ✅ Concluído |
| **F33** | Tela Crédito: custo do crédito, spread e concessões | N1, N7 | — | M8 | [F4](#f4) | Médio | Baixo | Médio | Bom | ✅ Concluído |
| **F34** | Mercado imobiliário, na tela Crédito | N1 | — | M8 | [F33](#f33) | Médio | Médio | Baixo | Médio | 💤 Registrado, sem prioridade |
| **F35** | IPCA livres, administrados e serviços | N1, N2 | — | — | [F4](#f4), [F8](#f8) | Baixo | Baixo | Médio | Bom | ⏳ Pendente |
| **F36** | Explicador: as três dívidas (DBGG, DLSP e DPF) | N2, N4, N7 | D7 | M2 | [F9](#f9), [F14](#f14), [F16](#f16) | Baixo | Médio | Alto | Excelente | ⏳ Pendente |
| **F37** | Explicador: por que a dívida não explode (prazo, rolagem, moeda, credores) | N4, N5, N7 | D7 | M2 | [F9](#f9), [F16](#f16), [F24](#f24) | Baixo | Médio | Alto | Excelente | ⏳ Pendente |
| **F38** | Diagramas nos conceitos que já existem | N2 | D7 | M2 | [F9](#f9) | Baixo | Baixo | Médio | Bom | ⏳ Pendente |
| **F39** | Pranchas dos explicadores no canvas | N2, N7 | D6, D7 | M2 | — | Médio | Baixo | Alto | Excelente | ⏳ Pendente |
| **F40** | Leitura mais clara nas telas Dívida, Setor externo e Déficit | N2, N4 | D6 | — | [F13](#f13), [F14](#f14), [F31](#f31) | Baixo | Baixo | Médio | Excelente | ✅ Concluído |
| **F41** | Déficit mês a mês, com o nominal numa coluna própria | N4, N6 | D6 | M4 | [F13](#f13) | Baixo | Baixo | Médio | Bom | ✅ Concluído |
| **F42** | Gráfico com o dado de hoje no "É bom ou ruim?" do Aprender | N2 | — | M2 | [F8](#f8), [F29](#f29) | Baixo | Baixo | Médio | Bom | ✅ Concluído |
| **F43** | Quem faz o déficit: a NFSP por esfera | N4, N6 | D2 | M4 | [F13](#f13) | Médio | Médio | Médio | Bom | ✅ Concluído |
| **F44** | A busca e o rodapé da barra lateral seguem a tela | N1 | D6 | — | [F13](#f13), [F14](#f14), [F31](#f31), [F28](#f28) | Baixo | Baixo | Baixo | Bom | ✅ Concluído |
| **F45** | Tolerância da meta de inflação buscada da fonte | N1 | D8 | — | [F29](#f29) | Médio | Baixo | Médio | Bom | ⏳ Pendente |

<a id="f1"></a>
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

<a id="f2"></a>
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

<a id="f3"></a>
**F3 — Fonte IBGE (tabela 7060).** Feito. O `IbgeAggregatesProvider` (`backend/adapters/ibge_provider.py`) usa a API de agregados v3 com `urllib` + Pydantic, e descomprime o gzip que parte dos endpoints manda sem o cliente pedir. Cada um dos 10 grupos é um `SeriesId`, com o código `7060/63/315/<categoria>` no registro.

**Correção de convenção:** no IBGE, `"-"` é **zero absoluto** e vira 0. Só `".."`, `"..."` e `"X"` são valor inexistente e ficam de fora. Os rótulos são do app, porque a API devolve os nomes de categoria com acentuação corrompida.

**Limitação:** uma consulta por grupo (10 na primeira carga, cerca de 0,4 s cada).
**Aceite:** as variações mensais de 2022 batem com as do IBGE. O acumulado compõe esses mensais de 2 casas e dá 5,78% no índice geral e 11,63% em Alimentação e bebidas; o IBGE publica 5,79% e 11,64%, calculados do índice sem arredondar.

<a id="f4"></a>
**F4 — Fonte BCB/SGS.** Feito. Porte do `bcb_sgs_provider.py` do Finance Manager, com a janela de 10 anos e o 404 como janela vazia; o código vem do registro, e o valor vira float.

**Séries:**
- **INPC:** SGS 188, desde abr/1979.
- **Salário mínimo:** SGS 1619. O registro começa em jul/1994, porque antes do Real o valor está em outras moedas e a razão entre dois meses deixa de ser reajuste. O SGS publica o ano inteiro do mínimo já em janeiro, e por isso o registro dele não tem atraso de publicação.

<a id="f5"></a>
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

<a id="f6"></a>
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

<a id="f7"></a>
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

<a id="f8"></a>
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

<a id="f9"></a>
**F9 — Explicadores de mecanismo, com diagrama.** Páginas em `/learn`, listadas no glossário (F8) na seção "Como as coisas se ligam" e no Ctrl+K (F26). Cada página é um diagrama em React Flow (D7) com texto curto em volta: o diagrama carrega a estrutura e o texto explica cada seta. É a primeira feature com diagrama, e por isso cria o componente base (nó de conceito com link para `/learn/<id>` e, quando há série, o valor de hoje).

**Vem depois das telas.** Os nós são conceitos de juros, contas públicas e setor externo: Selic e juro real, primário e nominal, dívida e r − g, câmbio e reservas. Esses conceitos entram no catálogo e as séries no cache com as telas Juros (F30), Déficit (F13), Dívida (F14) e Setor externo (F31), e o explicador usa o que elas trouxeram: o nó mostra o valor de hoje da série em cache e leva à página do conceito. O desenho da página e do nó sai das pranchas dos explicadores (F39). O explicador de inércia cita os serviços no texto, e o nó ganha o link quando o conceito entrar com o IPCA livres, administrados e serviços (F35).

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

**Links de volta:** as telas que citam um explicador (as bandejas de Déficit, Dívida, Juros, Setor externo e Crédito) nascem antes dele, e é o explicador que, ao entrar, liga cada bandeja a ele. Com o simulador (F24) vale o mesmo: entre os dois, o que for feito por último faz o link para o outro. Já existem, sem o link, a bandeja "Como ler e a conta" da tela Déficit (F13), que leva ao loop da dívida, e a bandeja "Como ler" do gráfico de r e g da tela Dívida (F14), que leva ao explicador de r − g.

**Fonte:** os ciclos de partida estão anotados da conversa com o ChatGPT (seis ciclos, com o que freia cada um). Cada afirmação factual é conferida contra a fonte oficial (BCB, IBGE, Tesouro, Planalto) antes de entrar, como manda a D4. Esse é o motivo do risco médio.

<a id="f10"></a>
**F10 — Fonte Focus completa.** Feito. Provider da API Olinda do BCB (`backend/adapters/bcb_focus_provider.py`), com os indicadores que o Focus pergunta hoje, na menor escala de cada um:

| Escala da previsão | Endpoint | Desde |
|---|---|---|
| Mês | `ExpectativaMercadoMensais` | jan/2000 |
| Trimestre | `ExpectativasMercadoTrimestrais` | nov/2001 |
| Ano | `ExpectativasMercadoAnuais` | abr/1999 |
| Reunião do Copom | `ExpectativasMercadoSelic` | nov/2004 |
| 12 meses à frente | `ExpectativasMercadoInflacao12Meses`, a suavizada | nov/2001 |

**Uma pesquisa por semana,** e não por dia útil: a de sexta, que é a do relatório, ou a do dia útil anterior quando a sexta é feriado. A API publica uma pesquisa por dia útil, com todos os horizontes (cerca de 470 linhas por dia), e guardar o dia a dia daria 2 a 3 milhões de linhas sem tela que o use. O provider pede 25 sextas por consulta, filtrando as datas no `$filter`, e repete a semana sem sexta no dia anterior, até a segunda.

**Conferido na implementação (2026-10-08):**
- **base de cálculo:** o relatório usa a `baseCalculo` 0, as respostas dos últimos 30 dias; a 1 é a dos últimos 5 dias úteis, a coluna à direita do relatório;
- **nomes:** só o "í" chega corrompido, e só em parte dos endpoints. O nome vira `FocusIndicator` por uma chave sem os caracteres não ASCII, que é a mesma no nome certo e no corrompido. O indicador que o Focus deixou de perguntar (IPC-Fipe, IGP-DI) fica de fora;
- **publicação:** os dados de uma semana saem juntos na segunda seguinte, com o relatório. A pesquisa cobrada é a da semana anterior a partir da terça.

**Tabela própria** (D2): `focus_expectations(indicator, target_kind, target_year, target_period, survey_date, median, respondents)`. O período previsto é o mês, o trimestre ou a reunião em `target_period`, e 0 no ano; nos 12 meses à frente, ano e período são 0. A mediana fica na unidade em que o Focus publica.

**Refresh:** roda no "Atualizar dados", depois das séries e da dívida federal, com o registro em `dataset_fetch_log`. A primeira carga trouxe 307 mil linhas, 1.431 semanas de abr/1999 a out/2026, em 130 s, e o banco cresceu cerca de 35 MB. Depois dela, o refresh pede a partir da última pesquisa em cache.

**Aceite cumprido:** na pesquisa de 2/out/2026, o IPCA de 2026 dá 5,0129 com 144 respondentes e a Selic de fim de 2026 dá 13,50 com 139, iguais ao relatório Focus da mesma data (5,01 e 13,50).

<a id="f11"></a>
**F11 — Painel "Visão geral".** A página de estatísticas do BCB refeita com explicação: os mesmos indicadores, em cartões agrupados por bloco. Os códigos citados foram conferidos ao vivo em 2026-10-06; os demais são levantados na implementação.
- **Inflação e juros:** IPCA 12 meses (13522) × meta (13521), com a expectativa do Focus (F10); Selic meta (432); juro real ex-ante.
- **Contas públicas:** DLSP/PIB (4513) e DBGG/PIB (13762); o cartão "Resultado do governo em 12 meses", com barras de primário, juros e nominal (F13) e a frase com quanto do déficit é juro. Os números já saem do cache pelas telas Déficit (F13) e Dívida (F14), e os cartões levam a `/deficit` e `/debt`.
- **Atividade:** IBC-Br em 12 meses, PIB em 12 meses como crescimento em % e desemprego da PNAD Contínua (24369).
- **Setor externo:** os números da tela Setor externo (F31): dólar PTAX (3698, média mensal), reservas internacionais (3546, conceito liquidez), transações correntes e IDP em % do PIB (23079 e 23080) e a posição internacional de investimento (24011 e 24040, sobre o PIB de 12 meses em dólar, 4192).
- **Crédito:** custo do crédito, concessões de recursos livres e o índice de adequação do patrimônio dos bancos.

Cada cartão traz o último valor, a variação, uma sparkline, o "dado até", a fonte e o "?" (D6). O clique leva à tela temática do bloco (Inflação, Juros, Déficit, Dívida, Setor externo, Atividade, Crédito); enquanto a tela não existe, o cartão fica sem link. O `Record` da D4 obriga a existir conceito para cada cartão. O cabeçalho tem "Atualizar dados" com a hora da última verificação.

O juro real ex-ante é `(1 + Selic) / (1 + IPCA esperado em 12 meses) − 1`: o juro descontada a inflação que o mercado espera.

**Detalhe do SGS:** a série 432 publica a Selic meta até a próxima reunião do Copom, e por isso o último ponto tem data futura. O "dado até" do cartão usa a data de hoje.

<a id="f13"></a>
**F13 — Resultado fiscal decomposto.** Feito, a partir da prancha `Deficit` do canvas. É a rota `/deficit`, no grupo "Contas públicas" da navegação. Responde "onde se vê o déficit" e quanto dele é juro. A página de estatísticas fiscais do BCB mostra só o último mês publicado; a tela mostra a história desde 2002.

**Séries do SGS** (NFSP do setor público consolidado, sem desvalorização cambial, % do PIB, 12 meses; conferidas ao vivo em 2026-10-08): nominal 5727, primário 5793 e juros nominais **5760**. O trio fecha a conta: em ago/2026, 0,62 + 8,86 = 9,48. A 5728, candidata antes, é outra série. As três começam em nov/2002. Na convenção da NFSP, valor positivo é déficit.

**Tela:**
- três números de resumo com "?": déficit nominal, primário e juros, com quanto do déficit é juro (93% em ago/2026);
- o cartão "De onde vem o déficit": primário e juros empilhados em dezembro de cada ano e no último mês, com o primário negativo (superávit) descendo do zero e o nominal marcado por um traço. A bandeja "Como ler e a conta" traz o que é cada parte e a conta do último mês, que aqui é soma porque são % do PIB do mesmo período.

**Backend:** `GET /api/deficit`, com o último mês, a parte do déficit que é juro e os pontos de cada dezembro.

**No Aprender:** NFSP, resultado primário, resultado nominal e juros nominais, no tema novo "Contas públicas", com as séries em `conceptBySeries`.

**Fica para depois:**
- o link da bandeja para o loop da dívida, que o explicador dos dois loops (F9) faz ao entrar;
- a seção "Como o déficit é pago", que segue como esboço no canvas até a F15.

**Aceite:** conferido. O último mês tem o primário mais os juros igual ao nominal (0,62 + 8,86 = 9,48% do PIB em ago/2026), com os números das séries do SGS.

<a id="f14"></a>
**F14 — Dinâmica da dívida.** Feito, a partir da prancha `Debt` do canvas. É a rota `/debt`, no grupo "Contas públicas", com a composição da F16 embaixo.

**Séries do SGS** (conferidas ao vivo em 2026-10-08): DLSP em % do PIB (4513) e em R$ milhões (4478), DBGG em % do PIB (13762, desde dez/2006), PIB de 12 meses em R$ milhões correntes (4382), além dos juros (5760) e do primário (5793) da F13.

**As contas** (em `backend/domain/debt.py`, em fração):
- **r**, o juro implícito: os juros de 12 meses em reais (a fração do PIB da 5760 vezes o PIB de 12 meses da 4382) divididos pela média da dívida líquida em reais (4478) no fim de cada um dos 12 meses. O BCB não publica essa taxa pronta;
- **g**: o PIB de 12 meses contra o do mesmo mês do ano anterior, dividindo;
- **p\*** `= d · (r − g) / (1 + g)`, com d = DLSP/PIB, que é a mesma conta de `d · ((1 + r) / (1 + g) − 1)`. O primário que falta é o p* menos o superávit feito (o primário da NFSP com o sinal trocado).

Em ago/2026: r = 13,74%, g = 7,23%, p* = 4,20% do PIB e, com déficit primário de 0,62%, faltam 4,82 pontos. É mais que os cerca de 2% da IFI, porque a conta usa r e g observados nos últimos 12 meses sobre a dívida líquida, e a projeção usa juros e crescimento esperados. A bandeja e a página do conceito dizem isso.

**Tela:**
- quatro números com "?": dívida líquida, dívida bruta, r − g e o primário que falta;
- "Dívida líquida e dívida bruta": as duas linhas desde dez/2006, com a bandeja "Como ler";
- "A dívida sobe ou desce?": o feito contra o preciso na mesma régua, com a bandeja "Ver a conta" (fórmula, legenda e a conta com os números da tela);
- "Juro da dívida contra crescimento da economia": r e g desde nov/2002, com sombra onde r passa g, e a bandeja com o caso de 2021 (a DLSP caiu de 61,4% para 55,1% do PIB).

**Backend:** `GET /api/debt`, com as duas dívidas, r e g mês a mês e a conta do p* no último mês.

**No Aprender:** DLSP, DBGG, juro implícito, crescimento nominal, r − g e o primário que estabiliza.

**Fica para depois:** os links das bandejas para o explicador das três dívidas (F36), para o de r − g (F9) e para o simulador (F24), que cada um faz ao entrar.

<a id="f23"></a>
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

<a id="f21"></a>
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

<a id="f24"></a>
**F24 — Simulador da trajetória da dívida.** Partir de um caso que aconteceu ou de um exemplo, mexer em juros, crescimento e primário e ver a dívida/PIB dos próximos 10 anos. Responde por que uma dívida de 200% do PIB pode estar "de boa" e outra de 40% não.

**Backend:** `GET /api/debt/simulation?debt=&r=&g=&primary=&years=` devolve a trajetória ano a ano, com `d(t+1) = d(t) · (1 + r) / (1 + g) − p`, composta dividindo (D3), e o `p*` que estabiliza.

**Pontos de partida, em dois grupos:**
- **Casos que aconteceram,** cada um com o período no nome:
  - **Brasil hoje,** sempre com os valores atuais da tela Dívida (F14), nunca um ano fixo, lidos de `GET /api/debt` (dívida líquida, r, g e o primário feito);
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

**Link de volta:** o cartão "A dívida sobe ou desce?" da tela Dívida (F14) nasceu sem o botão "Mexer nos números no simulador"; o simulador o acrescenta ao entrar, levando os números de hoje.

<a id="f16"></a>
**F16 — Composição da dívida pública federal.** Feito, embaixo da dinâmica na tela Dívida (F14).

**Fonte:** o CSV "Estoque da Dívida Pública Federal" do Tesouro Transparente (CKAN, dataset `estoque-da-divida-publica-federal`). O provider pede ao CKAN o endereço do CSV do dia e baixa o arquivo inteiro, de cerca de 12 MB, que vai de set/2017 ao último mês, uma linha por título, vencimento e carteira. Conferido em 2026-10-08: o arquivo vem em **UTF-8** (e não latin-1), com separador `;` e vírgula decimal sem separador de milhar.

**Tabela própria**, como o Focus (D2): `federal_debt_stock(stock_month, title, maturity, holder, external, value)`, trocada inteira a cada arquivo novo, e `dataset_fetch_log` para as tentativas, no papel da `fetch_log`. O refresh baixa só quando falta o mês esperado: o mês M sai por volta do dia 16 de M + 2, e o app o cobra a partir do dia 25, no máximo a cada 6 h. Roda junto do "Atualizar dados", que avisa a falta como faz com as séries.

**As contas** (em `backend/domain/federal_debt.py`, calculadas na leitura):
- **universo:** só a carteira "Mercado". É a dívida federal que o Tesouro reporta: em jul/2026, R$ 9.288,8 bilhões, igual ao Relatório Mensal da Dívida;
- **indexador** pelo prefixo do título, sem olhar a caixa: LFT (com LFT-TD) é Selic; LTN e NTN-F são prefixado; NTN-B é IPCA; NTN-C é IGP-M; dívida externa é câmbio; o resto é "outros";
- **vence em 12 meses:** o principal que vence até o fim do 12º mês depois do estoque;
- **perfil de vencimentos:** o resto do ano do estoque, os 4 anos seguintes um a um, os 5 anos depois deles e o que vence mais tarde;
- **carteira do BC:** a parte de todos os títulos emitidos que está no Banco Central (24,3% em jul/2026), que alimenta a F15.

**Prazo médio** pela série oficial do SGS **10618** (títulos do Tesouro emitidos, em meses), e não pelo CSV: a medida oficial pesa cada pagamento, cupons inclusive, e dá 47,40 meses (3,95 anos) em jul/2026, igual aos 3,94 anos da DPMFi no Relatório Mensal. Pela data final de cada título, o CSV daria 5,35 anos.

**Tela Dívida:**
- o cartão "Quanto vence e quando", com as faixas que começam nos próximos 12 meses em vermelho e a bandeja "Como ler" sobre a rolagem;
- o cartão "De que é feita a dívida federal", com barras 100% empilhadas por indexador em dezembro de cada ano e no último mês, e três números com "?": prazo médio, vence em 12 meses e a carteira do BC.

**Backend:** `GET /api/debt/federal`. A tela pede as duas rotas da Dívida em separado, e cada metade espera a sua fonte.

**No Aprender:** DPF, rolagem, indexador e prazo médio, com as fontes do Relatório Mensal da Dívida de jul/2026, do CKAN, do SGS e da Lei de Responsabilidade Fiscal.

**Limitação:** o "vence em 12 meses" conta só o principal (16,9% em jul/2026). O Tesouro conta todo pagamento dos 12 meses, juros inclusive, e publica 18,91%; não há série oficial dele no SGS. O número na tela diz "do principal", e a página da rolagem cita os dois.

**Fora:** detentores e custo médio, que só existem no Relatório Mensal (PDF e anexo). O link da bandeja de vencimentos para o explicador de por que a dívida não explode (F37) entra com ele.

**Aceite:** conferido. A composição de jul/2026 bate com o Relatório Mensal da Dívida do mesmo mês: taxa flutuante 51,11% (Selic no app: 51,1%), prefixado 19,22% (19,2%), índice de preços 26,02% (IPCA 25,1% + IGP-M 0,8%) e câmbio 3,65% (3,7%).

<a id="f17"></a>
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

<a id="f20"></a>
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

<a id="f22"></a>
**F22 — Rodadas de design no canvas.** Feito. O canvas de design foi iterado no Claude Design, em duas rodadas.

**Primeira rodada:** as pranchas de inflação por categoria e de poder de compra, o seletor de período, a navegação e o chip de grupo foram aprovados e implementados (F23).

**Segunda rodada:**
- a linha do tempo (F18) e a comparação internacional (F19) saíram; os países viraram casos do simulador (F24);
- as contas públicas viraram duas telas, Déficit (F13, com o esboço da F15) e Dívida (F14 e F16);
- o padrão de tela da D6 ficou fechado: "?" curto no resumo, conta na bandeja do gráfico, fórmula separada do exemplo e semáforo só com faixa oficial.

As pranchas das telas que faltam (Visão geral, tela de série, Aprender, página de conceito, Déficit, Dívida, simulador, saúde da economia e o explicador de r − g) seguem no canvas, como esboço de cada feature que as implementa.

<a id="f25"></a>
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

<a id="f26"></a>
**F26 — Busca com Ctrl+K.** Feito, no molde da busca do Finance Manager e da prancha `Nav` do canvas (`layouts/command-search.tsx`, shadcn `command` com cmdk).

- **Abertura:** Ctrl+K (ou Cmd+K) em qualquer tela, ou o botão "Buscar" no topo da sidebar.
- **Grupos:**
  - "Conceitos em Aprender", vindos do catálogo (F7), com o resumo como subtítulo; sem nada digitado, os mais buscados (IPCA, acumulado em 12 meses, poder de compra);
  - "Telas", vindas da navegação, cada uma com descrição e palavras-chave.
- **Filtro:** ignora acento ("educacao" acha "Grupo do IPCA" pelo nome do grupo), e o resultado que bate no título vem antes.
- **Teclado:** ↑↓ navegam, Enter abre, Esc fecha; o rodapé leva a "Ver tudo em Aprender".

**Entra depois:** os explicadores (F9) como terceiro grupo, e as séries quando existir a tela de série (F12).

<a id="f27"></a>
**F27 — Continuação pelo Focus nos gráficos.** Feito. O gráfico de uma série segue depois do último dado real com o que o mercado espera na pesquisa Focus mais recente (F10).

**Como a previsão aparece:** uma faixa clara do último dado real até o fim, com o rótulo "previsão (Focus de <data>)", e uma linha vertical pontilhada no último dado. A linha prevista é tracejada, numa cor neutra (`--forecast`, com `--forecast-band` na faixa, em claro e escuro). O destaque dos 3 últimos meses fica só na linha real. O componente é o `ForecastSpan` (`shared/components/forecast-span.tsx`), e cada bandeja ganhou o item "A previsão", que leva à página da pesquisa Focus.

**Onde entrou:**
- **IPCA em 12 meses** (tela de inflação): o 12 meses composto no backend (D3) com os meses reais e o IPCA mensal esperado, até 24 meses à frente (set/2028), com a faixa da meta continuando. Só aparece quando o gráfico termina no último IPCA publicado;
- **dólar** (Setor externo): o câmbio de fim de mês esperado, mês a mês. O gráfico passou para a PTAX do fim do mês (SGS 3696), a mesma medida que o Focus pergunta (ver F31);
- **transações correntes e IDP**: o Focus prevê o ano em US$ bilhões e não prevê o PIB em dólar, então a previsão fica escrita em cima do gráfico em % do PIB ("o mercado espera, para 2026, déficit de US$ 60,0 bi nas transações correntes e US$ 80,0 bi de investimento direto no país");
- **déficit**: uma coluna para dezembro do ano corrente e do seguinte, com primário e juros nas cores deles, claras e com contorno tracejado, e o nominal marcado. O sinal do Focus (negativo é déficit) é trocado para a convenção da NFSP, e os juros são o nominal menos o primário;
- **dívida líquida e bruta**: um ponto para cada uma em dezembro do ano corrente e do seguinte, com os meses do meio vazios para o eixo manter a escala do tempo.

**Backend:** os DTOs de `pace`, `external-sector`, `deficit` e `debt` ganharam a previsão, nula quando não há pesquisa em cache. As contas moram em `backend/domain/focus.py` (`rolling_12m_forecast`, `nfsp_from_balance`, `forecast_years`).

**Fica para depois:** a Selic por reunião e o desemprego entram com as telas Juros (F30) e Atividade (F32), e o IPCA livres, administrados e serviços com a F35.

**Aceite:** na pesquisa de 2/out/2026, o 12 meses esperado para dez/2026 dá 5,01%, igual à mediana anual do IPCA de 2026 no relatório Focus, e o de dez/2027 dá 4,29%, contra a mediana anual de 4,30%; a diferença vem de as medianas mensais não comporem exatamente na mediana do ano. A comparação com a linha "Focus mais recente" do gráfico do BCB fica para conferir na página, que monta o gráfico no navegador.

<a id="f28"></a>
**F28 — Tela Focus: como a expectativa mudou.** Feito, sem prancha no canvas: segue o padrão da D6 com os componentes das telas que existem. É a rota `/focus`, no grupo novo "Expectativas" da navegação.

**Tela:**
- **Escolha:** o ano previsto num seletor abaixo do título (o ano da pesquisa e os 3 seguintes, como o relatório) e o indicador pelo clique numa linha da tabela, os dois na URL (`?indicator=ipca&year=2026`);
- **resumo:** a previsão de hoje, a de 4 semanas atrás e quantas instituições responderam nos 30 dias, cada uma com o "?";
- **"Como a previsão mudou":** a mediana daquela previsão em cada pesquisa semanal, com a meta e os dois limites quando o indicador é o IPCA, e os respondentes no tooltip. Em cima, a frase de leitura no formato da manchete do relatório: "A previsão do IPCA para 2026 subiu nas últimas 3 semanas, de 4,90% para 5,01%";
- **"O relatório Focus para <ano>":** os 12 indicadores do relatório (IPCA, PIB, câmbio, Selic, IGP-M, IPCA administrados, conta corrente, balança comercial, IDP, dívida líquida, primário e nominal) com a previsão de 4 semanas atrás, a da semana passada, a de hoje e a direção da última semana com o número de semanas seguidas. A seta não tem cor, porque subir é bom num indicador e ruim em outro.

**Backend:** `GET /api/focus/report` e `GET /api/focus/history?indicator=&year=`. A Selic entra pela previsão anual, que é a Selic de fim de ano, e a tela não precisa do calendário do Copom. As taxas vêm em fração, o câmbio em R$/US$ e as contas externas em US$ bilhões; primário e nominal ficam com o sinal do Focus, em que negativo é déficit. A faixa da meta e o seu DTO passaram a ter dois consumidores e subiram para `backend/features/`.

**No Aprender:** o tema novo "Expectativas", com pesquisa Focus, mediana e expectativa desancorada, citando o relatório de 2/out/2026 e os dados abertos do BCB.

**Aceite:** as 24 sequências da pesquisa de 2/out/2026 (12 indicadores em 2026 e 2027) dão a mesma direção e o mesmo número de semanas que os parênteses do relatório do BCB, e as colunas de 1 e 4 semanas antes batem com as do relatório.

<a id="f29"></a>
**F29 — Limites mínimo e máximo da meta no gráfico do IPCA.** Feito. O gráfico "IPCA em 12 meses e a meta" desenha a meta em linha cheia e os dois limites tracejados, em degrau na virada de cada ano, como o gráfico do BCB.

**Mudança:**
- o registro da meta (SGS 13521) começa em 1999, e o refresh trouxe a ponta que faltava sem apagar nada;
- a tolerância é uma tabela por ano em `backend/domain/inflation_target.py`: 2 pontos em 1999–2002, 2,5 em 2003–2005 (Res. CMN 2.972/2002 e 3.108/2003), 2 em 2006–2016 e 1,5 desde 2017;
- 2003 e 2004 tiveram a meta revista depois de fixada, e a série já traz a meta ajustada (4% e 5,5%);
- depois do último ano publicado, a meta contínua (desde 2025) segue valendo, o que dá faixa à previsão do Focus nos anos seguintes;
- o `pace` devolve a faixa (`band`, com meta, piso e teto) em cada ponto e no fim do período;
- o botão "Meta" no cabeçalho do gráfico mostra e esconde a meta e os limites (`?target=hide`), porque os tracejados disputam espaço com os rótulos do ritmo;
- o cartão do resumo diz se o 12 meses está dentro da meta, acima do teto ou abaixo do piso;
- a página do conceito de meta de inflação ganhou a tolerância de cada período, com o histórico de metas do BCB como fonte.

**Aceite cumprido:** em 2015, meta de 4,5% com limites de 2,5% e 6,5%; em 2026, 3% com 1,5% e 4,5% (`test_tolerance_changes_with_the_period`, e na tela com os dados reais).

<a id="f30"></a>
**F30 — Tela Juros.** Feito, a partir da prancha `Juros` do canvas. É a rota `/interest`, no grupo "Juros e expectativas" da navegação (o antigo "Expectativas"), e responde a que juro o Banco Central segura a economia e se esse juro é alto perto da inflação.

**Fontes** (conferidas ao vivo em 2026-10-08):

| Dado | Fonte | Unidade |
|---|---|---|
| Selic meta | SGS 432, um valor por dia desde 5/mar/1999 | % ao ano |
| Calendário das reuniões do Copom | JSON público que a página do Copom no site do BCB lê (`/api/servico/sitebcb/calendar/anual`, lista "Reuniões do Copom") | dois dias por reunião |
| Selic de cada reunião, IPCA esperado para os 12 meses seguintes e IPCA mensal esperado | pesquisa Focus (F10) | % ao ano e % no mês |

O Focus numera as reuniões (`R7/2026`) e não dá a data. O calendário do BCB dá as datas sem número, e a ordem da reunião no ano as liga: a 7ª de 2026 é a de 3 e 4 de novembro.

**Implementação:**
- o cache ganhou série diária: cada valor é datado no próprio dia, a referência esperada é hoje, e o fetch vai só até hoje (a 432 já traz os próximos dias preenchidos com a meta em vigor). O SGS estoura o tempo numa janela de 10 anos de dado diário, então as janelas do provider passaram a 5 anos;
- o calendário do Copom tem tabela própria (`copom_meetings`) e refresh próprio: o do ano seguinte é esperado a partir de julho, porque o BCB o divulga até o fim de junho, e a busca só acontece quando ele falta (D8). Reuniões do Focus sem data no calendário, como as de 2028 hoje, ficam fora da tela e entram sozinhas quando o BCB as datar;
- `GET /api/interest` devolve a Selic de fim de mês, a de hoje com a última mudança, o IPCA em 12 meses no mesmo período, a previsão dos dois, a próxima reunião e o juro real ex-ante. A previsão do IPCA em 12 meses saiu do serviço da inflação para `features/ipca_forecast.py`, que as duas telas usam;
- a Selic prevista muda de degrau em cada reunião datada, com a mediana do Focus, a partir do dia seguinte à decisão; o juro real divide (D3): 13,75% de Selic sobre 4,59% esperados dão 8,76%, e a subtração daria 9,16%;
- a tela tem o resumo (Selic meta, próximo Copom e juro real, cada um com o "?") e o gráfico "A Selic e a inflação", com a faixa do juro real entre as duas linhas e a bandeja "Como ler";
- no Aprender, o tema "Juros" com Selic meta, Copom, juro real e juro neutro, que é só conceito.

**Fica para depois:**
- o cartão "O juro aperta ou alivia?" da prancha, com o juro real contra o neutro (F46);
- o link da bandeja para o explicador dos dois loops entra com ele (F9).

<a id="f31"></a>
**F31 — Tela Setor externo.** Feito, a partir da prancha `External` do canvas. É a rota `/external-sector`, no grupo "Economia real e mundo" da navegação, e responde de onde vem o preço do dólar e se o país depende de dinheiro que foge rápido.

**Séries do SGS** (conferidas ao vivo em 2026-10-08):

| Série | Código | Unidade |
|---|---|---|
| Dólar, média mensal da PTAX | 3698 | R$ por US$ |
| Transações correntes em 12 meses | 23079 | % do PIB |
| Investimento direto no país em 12 meses | 23080 | % do PIB |
| Reservas internacionais, conceito liquidez, fim do mês | 3546 | US$ milhões |
| PIB de 12 meses em dólar | 4192 | US$ milhões |
| Posição internacional: ativos e passivos | 24011 e 24040 | US$ milhões, trimestral |

As reservas usam o conceito liquidez (3546), que é o número que o BCB divulga. A série 13621 é o conceito caixa. O SGS não publica reservas nem posição internacional em % do PIB, então as duas se dividem pelo PIB de 12 meses em dólar: o estoque do trimestre vai contra o PIB do último mês dele. O saldo da posição é ativo − passivo; a série 24010 publica o mesmo número e por isso não entra.

**Implementação:**
- o cache ganhou série trimestral: o SGS data o trimestre no 1º mês dele, e a referência esperada arredonda para o começo do trimestre (o 2º trimestre é cobrado a partir de 28 de setembro);
- `GET /api/external-sector` devolve cada gráfico na sua janela, terminando no último dado: 24 meses de dólar com a variação em 12 meses, 10 anos de fluxos e de reservas, e um ponto por ano da posição nos últimos 6 anos;
- a tela tem o resumo (dólar, transações correntes, investimento direto e reservas, cada um com o "?") e os quatro gráficos da prancha, "O dólar", "De onde vêm e para onde vão os dólares", "O colchão" e "O balanço com o mundo", cada um com a bandeja "Como ler";
- no Aprender, o tema "Setor externo" com câmbio, PTAX, transações correntes, IDP, reservas internacionais, posição internacional de investimento e % do PIB, que é o conceito da série do PIB em dólar.

**Fica para depois:**
- o dólar diário (SGS 1): pede que o cache aceite série diária, com a regra de qual dia útil já devia estar publicado. A tela usa a média mensal, como a prancha;
- os links das bandejas para os explicadores de câmbio e de reservas entram com os explicadores (F9).

**Mudança com a continuação pelo Focus (F27):** o dólar passou da média mensal da PTAX (SGS 3698) para a PTAX do fim do mês (SGS 3696), que é a medida que o Focus pergunta (conferido: na pesquisa de 5/jan/2018, o "Câmbio" da API dá 3,34 para 2018, igual à linha "fim de período" do relatório, e não aos 3,32 da média). Uma migration apagou a série antiga do cache. Em set/2026, o dólar fechou a R$ 5,1809, −2,59% em 12 meses.

<a id="f32"></a>
**F32 — Tela Atividade.** Feito, a partir da prancha `Activity` do canvas. É a rota `/activity`, no grupo "Economia real e mundo" da navegação, e responde se a economia cresce ou encolhe e como está o emprego.

**Séries** (conferidas ao vivo em 2026-10-08):

| Série | Fonte e código | Unidade |
|---|---|---|
| PIB acumulado em 4 trimestres | IBGE, SIDRA `5932/6562/11255/90707` | %, trimestral (período `AAAATT`) |
| IBC-Br, sem ajuste sazonal | SGS 24363 | índice, mensal |
| Taxa de desocupação, PNAD Contínua | SGS 24369 | %, trimestre móvel datado no último mês dele |

O IBC-Br não é publicado em variação: o 12 meses é a média do índice nos últimos 12 meses sobre a dos 12 anteriores, menos 1 (a mesma ideia dos 4 trimestres do PIB). Em jul/2026 dá 1,48%, contra 1,32% na série dessazonalizada (24364); a sem ajuste é a comparável ao PIB acumulado. O Banco Central trata o IBC-Br como indicador de tendência, e não como prévia oficial do PIB; a bandeja diz que serve para ver antes, mas não é o PIB.

**Implementação:**
- o provider do IBGE passou a ler a tabela trimestral (`AAAATT`, `202602` é o 2º trimestre) e data o trimestre no 1º dia dele, como o resto do cache; no registro, o PIB é cobrado a partir do dia 5 do terceiro mês depois do fim do trimestre, o IBC-Br a partir do dia 20 do segundo mês seguinte e a PNAD a partir do dia 30 do mês seguinte;
- `GET /api/activity` devolve os últimos 4 anos de cada gráfico, com o PIB datado no mês em que o trimestre termina, a diferença da desocupação contra um ano antes em pontos (`change_12m`) e 409 enquanto o cache está vazio;
- o 12 meses do índice mora em `backend/domain/rates.py` (`index_change_12m`), junto com o resto da conta de taxa;
- `MonthValue` e `MonthlyForecast`, antes do setor externo, subiram para `backend/features/`, porque a atividade os usa também;
- a tela tem o resumo (PIB, IBC-Br e desemprego, cada um com o "?"), "A economia cresce ou encolhe?" (IBC-Br em linha, PIB em pontos, um por trimestre) e "Desemprego", cada um com a bandeja "Como ler" e um bloco por conceito;
- no Aprender, o tema "Atividade" com PIB, IBC-Br, crescimento real e nominal, taxa de desocupação e trimestre móvel.

**Mudança em relação ao card:** a continuação do PIB pelo Focus é só no ano, com um ponto em dezembro do ano corrente e do seguinte, como a prancha desenha. O gráfico é de 4 trimestres, e o Focus trimestral é a taxa contra o mesmo trimestre do ano anterior, outra medida, que não continua a linha sem o nível do PIB; em dezembro, o acumulado de 4 trimestres é o próprio crescimento do ano. O desemprego continua mês a mês, até dezembro do ano seguinte.

**Aceite cumprido:** com os dados de 2/out/2026, o PIB dá 1,9% em 4 trimestres até o 2º tri/2026, igual ao IBGE; o IBC-Br, 1,48% em 12 meses até jul/2026; e a desocupação, 5,3% no trimestre até ago/2026, contra 5,6% um ano antes (−0,3 p.p.), igual à divulgação do IBGE de 29/9. A previsão do Focus de 2/out/2026 traz 1,85% para o PIB de 2026 e 1,40% para o de 2027.

**Fica para depois:** o link "Ver na saúde da economia" da bandeja do desemprego entra com a F17; por enquanto ela leva só ao conceito.

<a id="f33"></a>
**F33 — Tela Crédito.** Feito, a partir da prancha `Credit` do canvas. É a rota `/credit`, no grupo "Economia real e mundo" da navegação, e responde quanto custa pegar dinheiro emprestado e quanto está sendo emprestado.

**Séries do SGS** (conferidas ao vivo em 2026-10-08):

| Série | Código | Unidade |
|---|---|---|
| Indicador de custo do crédito (ICC), total | 25351 | % ao ano, mensal, desde jan/2013 |
| Concessões de crédito com recursos livres, pessoas jurídicas, total | 20635 | R$ milhões, mensal, desde mar/2011 |
| Concessões de crédito com recursos livres não rotativo, pessoas físicas | 20663 | R$ milhões, mensal, desde mar/2011 |

O SGS não publica a variação em 12 meses das concessões: a tela soma os 12 meses que terminam em cada mês e divide pela soma dos 12 anteriores, e a conta é a `index_change_12m` de `backend/domain/rates.py`, a mesma do IBC-Br (a razão das médias é a razão das somas). O 20631 não serve: é o total de concessões com recursos livres e direcionados. O ICC é o custo médio de todo o crédito em aberto, e não só do novo, por isso anda devagar.

**Implementação:**
- as três séries entram no registro, mensais, cobradas a partir do dia 28 do mês seguinte, como a nota de crédito do BCB; não pedem tabela nem migration;
- `GET /api/credit` devolve os últimos 24 meses do ICC com a Selic meta de fim de mês, o spread do último mês (ICC menos Selic, em fração) e a variação em 12 meses das concessões de empresas e de famílias, e 409 enquanto o cache está vazio;
- a tela tem o resumo (custo do crédito, spread e concessões a famílias, cada um com o "?"), "Quanto custa o crédito" (ICC e Selic, com a faixa do spread entre as duas) e "Quanto está sendo emprestado" (concessões de recursos livres em 12 meses), cada um com a bandeja "Como ler";
- no Aprender, o tema "Crédito" com custo do crédito (ICC), spread, concessões e recursos livres e direcionados.

**Mudança em relação ao card:** o bloco "Os bancos aguentam?" (índice de Basileia) ficou de fora e virou a F47: a série do SGS (21424) parou em jun/2023. O spread da tela é a diferença simples entre o ICC e a Selic, e não o spread bancário do BCB, que compara o que o banco cobra com o que ele paga para captar.

**Aceite cumprido:** com os dados de 8/out/2026, o ICC de ago/2026 dá 24,19% ao ano contra a Selic de 14,00%, spread de 10,19 pontos percentuais; as concessões em 12 meses até ago/2026 dão +12,86% para as famílias e +11,55% para as empresas.

**Fica para depois:** o link da bandeja de custo para o explicador dos dois loops entra com ele (F9).

<a id="f34"></a>
**F34 — Mercado imobiliário.** Uma seção na tela Crédito (F33) com os dois gráficos de mercado imobiliário da página do BCB:
- as fontes de recursos do financiamento imobiliário: estoque e o SBPE (a poupança que financia a casa própria);
- a carteira de crédito imobiliário de pessoa física por modalidade: SFH, FGTS, livre, home equity e comercial.

**Fonte:** as Informações do Mercado Imobiliário do BCB, levantadas na implementação (serviço Olinda ou SGS), com o provider em `backend/adapters/`.

Fica registrado sem prioridade: completa a cobertura da página do BCB, mas é o bloco mais distante das perguntas de dívida, inflação e juros.

<a id="f35"></a>
**F35 — IPCA livres, administrados e serviços.** Outro corte do IPCA, diferente dos 9 grupos: pela forma como o preço se forma.
- **Administrados (monitorados):** preços que dependem de governo ou contrato, como energia, gasolina, ônibus, água, plano de saúde e remédio.
- **Livres:** os que o mercado forma, e dentro deles os serviços, que carregam a inércia (F9).

**No Aprender:** uma página de conceito com o que entra em cada corte, por que o BC olha os serviços para medir a inércia e por que a inflação de administrados reage a decisão de governo, não a juro.

**Na tela de inflação:** um cartão com os três em 12 meses e a continuação do Focus (F27), que tem previsão mensal para cada um. As séries são do SGS (IPCA livres, monitorados e serviços), com os códigos levantados na implementação e conferidos contra a nota do IBGE.

<a id="f36"></a>
**F36 — Explicador: as três dívidas.** Página em `/learn` com um diagrama (D7) das três medidas de dívida pública e do que cada uma conta:
- **DBGG**, dívida bruta do governo geral: o que União, estados e municípios devem, sem descontar nada. É a que o FMI e a IFI usam;
- **DLSP**, dívida líquida do setor público: inclui o Banco Central e as estatais, e desconta o que o setor público tem a receber, com as reservas internacionais como maior item;
- **DPF**, dívida pública federal: só os títulos do Tesouro, a que o Relatório Mensal da Dívida detalha (F16).

**O diagrama** mostra a passagem de uma para a outra: da DBGG se somam o BC e as estatais e se descontam os ativos, e sai a DLSP. Os nós mostram o valor de hoje em % do PIB (em ago/2026, DBGG 82,9% e DLSP 69,3%).

**Perguntas que a página responde:** qual dívida aparece na notícia; o Focus pergunta as duas (DLSP e DBGG), separadas; por que o dólar subir faz a líquida cair e não mexe na bruta.

**Vem depois da tela Dívida:** a DLSP e a DBGG, conceito e série, entram com a dinâmica da dívida (F14), e a DPF com a composição (F16).

**Link de volta:** a bandeja "Como ler" do gráfico "Dívida líquida e dívida bruta" da tela Dívida (F14) nasceu sem o link; é o explicador que, ao entrar, liga a bandeja a ele.

Os fatos são conferidos no manual de estatísticas fiscais do BCB e no Tesouro (D4).

<a id="f37"></a>
**F37 — Explicador: por que a dívida não explode.** Página em `/learn` com um diagrama (D7) do que decide se uma dívida é sustentável, além do tamanho:
- **prazo e rolagem:** dívida longa vence aos poucos; dívida curta obriga a rolar muito de uma vez, e a desconfiança vira crise na hora de rolar;
- **moeda:** dever na própria moeda contra dever em moeda que o país não emite;
- **credores:** gente de dentro, mercado de fora ou credores oficiais;
- **r − g:** o juro contra o crescimento (F9).

**Os casos** são os mesmos do simulador (F24), cada um mostrando qual desses fatores pesou:
- Japão, anos 2010: dívida acima de 200% do PIB, longa, em iene e com credores de dentro;
- Grécia, 2010: o mercado se recusa a rolar; hoje, com credores oficiais e prazos longos, uma dívida em torno de 137% do PIB não está em crise;
- Brasil, Collor (1990): dívida perto de 40% do PIB, mas curta e numa moeda instável.

Cada caso leva ao simulador já carregado com ele, e a página liga aos vencimentos da tela Dívida (F16). Por isso vem depois dos dois: os casos, os vencimentos e os conceitos de prazo e rolagem já existem quando ela entra. Os números vêm da conversa com o ChatGPT e são conferidos no FMI DataMapper e no BCB antes de entrar (D4).

**Link de volta:** a bandeja "Como ler" do cartão "Quanto vence e quando" da tela Dívida (F16) nasceu sem o link; é o explicador que, ao entrar, liga a bandeja a ele.

<a id="f38"></a>
**F38 — Diagramas nos conceitos que já existem.** Passar pelos conceitos do catálogo (F7) e decidir, um a um, onde um diagrama explica melhor do que o texto (D7). Candidatos:
- acumulado em 12 meses: a janela que anda um mês e o mês que sai;
- efeito base: o mês que sai da janela puxando o 12 meses;
- poder de compra: o reajuste e a inflação do grupo como duas réguas, dividindo;
- meta de inflação: a faixa, a carta aberta e quem decide (CMN, BC);
- salário mínimo: a regra de reajuste (INPC mais o crescimento do PIB, com o teto).

O resultado de cada um fica registrado: diagrama novo na página, ou "o texto basta". O diagrama usa o componente base criado pelos explicadores (F9).

<a id="f39"></a>
**F39 — Pranchas dos explicadores no canvas.** Rodada de design no Claude Design, no molde das rodadas da F22, para a página de explicador antes de ela virar código (D6):
- a página: onde fica o diagrama, o texto em volta e os conceitos citados no cabeçalho;
- o nó de conceito, com o link para a página do conceito e o valor de hoje;
- como o texto explica cada seta, e como seta e texto se encontram;
- as cores dos dois loops, das pontes e do que freia cada loop, em claro e escuro.

O canvas está em edição. Os explicadores com diagrama (F9) são implementados a partir destas pranchas, e o das três dívidas (F36), o de por que a dívida não explode (F37) e os diagramas nos conceitos (F38) seguem o mesmo molde.

<a id="f40"></a>
**F40 — Leitura mais clara nas telas Dívida, Setor externo e Déficit.** Feito, a partir da rodada de ajustes nas telas do app no canvas, que respondeu às dúvidas deixadas em cada cartão.

**Um bloco por conceito na bandeja (D6):** quando o cartão mostra dois conceitos, cada um ganha o seu bloco, com um quadradinho na cor da série no gráfico. O `TrayItem` ganhou a prop `color`.
- Dívida: DBGG e DLSP em blocos próprios, e um terceiro bloco diz por que a distância entre elas muda.
- Setor externo, transações correntes e IDP: cada um explicado do zero, e um bloco "As duas juntas" com a pergunta do gráfico e os números. A legenda diz o que é cada linha.
- Setor externo, ativos e passivos: Ativos, Passivos e Saldo em blocos próprios.
- Déficit: primário, juros e nominal.

**Dívida, o primário que estabiliza:**
- o cartão ganhou a linha **Falta**, uma barra que vai do primário feito ao preciso, com a distância escrita: em ago/2026, de −0,62% a 4,20% do PIB, 4,82 pontos percentuais;
- os rótulos das linhas mostram o valor ("Feito: −0,62%", "Preciso: 4,20%").

**Setor externo:**
- a posição internacional ganhou uma coluna **Saldo** por ano, ao lado das barras de ativos e passivos;
- o eixo das reservas diz "US$ 300 bi", e não só "300".

<a id="f41"></a>
**F41 — Déficit mês a mês, com o nominal numa coluna própria.** Feito, a partir da rodada de ajustes nas telas do app no canvas.

**Nominal em coluna:** no ano a ano, o nominal deixou de ser um traço sobre a pilha e virou uma coluna clara ao lado do par primário + juros, do tamanho da soma das duas. A previsão do Focus segue tracejada.

**Escala Ano a ano / Mês a mês:**
- um seletor no cabeçalho do cartão, com a escolha na URL (`?scale=months`);
- o mês a mês mostra as três linhas de 12 meses, um ponto por mês desde nov/2002, para ver as viradas dentro do ano que o fim de dezembro esconde;
- o `GET /api/deficit` passou a devolver `months`, com todos os pontos que já estavam no cache, sem série nova.

<a id="f42"></a>
**F42 — Gráfico com o dado de hoje no "É bom ou ruim?" do Aprender.** Feito, a partir da rodada de ajustes nas telas do app no canvas. O texto do "É bom ou ruim?" diz a regra; o gráfico mostra onde o número está agora.

- A página do acumulado em 12 meses mostra os últimos 24 meses do IPCA em 12 meses com a meta, o piso e o teto, e diz se o último mês está dentro do intervalo.
- O gráfico termina no último mês do IPCA no banco e lê o mesmo `GET /api/inflation/pace` da tela de inflação.
- O `concept-article.tsx` tem um mapa `readingCharts`, por id de conceito. Outro conceito com série ganha o seu gráfico entrando nesse mapa.

<a id="f43"></a>
**F43 — Quem faz o déficit: a NFSP por esfera.** Feito, a partir do desenho da rodada de ajustes nas telas do app no canvas. O cartão "Quem faz o déficit", na tela Déficit, divide a necessidade de financiamento do setor público (a NFSP, o déficit nominal do Brasil inteiro) entre quem a produz: o governo central (Tesouro, Previdência e Banco Central), os estados e municípios, e as estatais (sem a Petrobras e os bancos públicos).

**Séries do SGS** (NFSP sem desvalorização cambial, % do PIB, 12 meses; conferidas ao vivo em 2026-10-08, todas desde nov/2002 no cache):
- primário: governo central 5783, estados e municípios 5786, estatais 5789;
- juros nominais: governo central 5750, estados e municípios 5753, estatais 5756.

O BCB não publica o nominal por esfera no bloco "Total": ele é o primário mais os juros.

**Backend:** `GET /api/deficit` ganhou `spheres`, o último mês dividido entre as três esferas, com o enum `Sphere`.

**Tela:**
- uma barra por esfera, com primário e juros empilhados como no gráfico do déficit: o superávit primário vai para a esquerda do zero e abate os juros; o nominal da esfera fica à direita;
- a bandeja "Como ler" explica cada esfera e, num bloco à parte, mostra a soma das três contra o consolidado. Em ago/2026, o governo central pagou 91% dos juros do setor público.

**Aceite:** conferido. Em ago/2026, as três esferas somam 0,61% de primário e 8,86% de juros, contra 0,62% e 8,86% do consolidado; o 0,01 é arredondamento do BCB, e o teste aceita até 0,02 ponto.

<a id="f44"></a>
**F44 — A busca e o rodapé da barra lateral seguem a tela.** Feito, a partir das observações da rodada de ajustes nas telas do app no canvas.

- **Busca:** o grupo "Telas" vem antes dos conceitos. Ao digitar "dívida", a tela Dívida aparece primeiro, e não abaixo de nove conceitos.
- **Rodapé da barra lateral:** mostra até quando há dado na tela aberta e quem o publica: "Resultado fiscal até ago/2026 · Banco Central" no Déficit, "Dólar até set/2026 · Banco Central" no Setor externo. Cada item de `navigation.ts` diz a série e as fontes da sua tela. O Focus mostra só a fonte, porque a pesquisa não é série do cache, e o Aprender fica com o IPCA.

<a id="f45"></a>
**F45 — Tolerância da meta de inflação buscada da fonte.** A faixa da meta (piso e teto) soma uma tolerância à meta que o SGS publica, e essa tolerância está digitada em `backend/domain/inflation_target.py`, a partir das resoluções do CMN (2 p.p. de 1999 a 2002, 2,5 de 2003 a 2005, 2 de 2006 a 2016 e 1,5 desde 2017). Se o CMN a mudar, o app erra sem avisar, o que a D8 não admite.

- **Primeiro passo:** achar onde o BCB publica a tolerância de forma buscável (a página da meta de inflação, uma série do SGS ou o JSON que o site lê), do mesmo jeito que o calendário do Copom foi achado.
- **Depois:** um fetcher em `backend/adapters/` e a tabela ou série que o alimente, no lugar da constante, com o mesmo mecanismo incremental das outras fontes.
- **Se não houver fonte buscável:** a constante fica, com a data da última conferência escrita ao lado, e a tela diz de quando é a tolerância.

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

<a id="f18"></a>
**F18 — Descartado.** 🚫 Descartada na segunda rodada de design (2026-10-07): a linha do tempo foi considerada irrelevante.

<a id="f19"></a>
**F19 — Descartado.** 🚫 Descartada como tela própria na segunda rodada de design (2026-10-07) e absorvida pelo simulador da dívida (F24), que ganhou os casos Japão anos 2010, Grécia 2010 e Argentina 2001, com os parâmetros conferidos com o FMI DataMapper.

<a id="f12"></a>
**F12 — Descartado.** 🚫 Descartada na revisão de 2026-10-08. O comparador livre de séries não vinha de nenhuma pergunta, e sobrepor séries de unidades diferentes sugere correlação que não existe. Os pares que fazem sentido são poucos e conhecidos (DLSP e DBGG, transações correntes e IDP, Selic e IPCA) e ficam montados nas telas temáticas. O clique no cartão do painel leva à tela temática do bloco.

---
## 4. Incerta / exploratória

| ID | Resumo | Conexão | Marco | Depende de | Status |
| --- | --- | --- | --- | --- | --- |
| **F15** | Como medir o financiamento monetário do déficit | Serviria N6; falta separar gestão de liquidez do BC de financiamento do Tesouro | M4 | [F13](#f13), [F16](#f16) | 🔍 Em avaliação |
| **F46** | Juro neutro na tela Juros | Serviria N1 e N2; falta uma fonte que dê para baixar: o BC só publica o juro neutro em texto de PDF do Relatório de Política Monetária | M8 | [F30](#f30) | 🔍 Em avaliação |
| **F47** | Basileia dos bancos na tela Crédito | Serviria N1; falta uma fonte que dê para baixar: a série do SGS parou em jun/2023, e o BC publica o número no Relatório de Estabilidade Financeira, semestral, e no IF.data, por instituição | M8 | [F33](#f33) | 🔍 Em avaliação |

<a id="f15"></a>
**F15 — Como medir o financiamento monetário.** As candidatas já têm fonte:
- **base monetária:** SGS 1788 responde (ago/2026: 432.655.492, provavelmente em R$ mil); falta conferir nome e unidade;
- **fatores condicionantes da base, operações com títulos públicos:** SGS 1809;
- **títulos da dívida na carteira do Banco Central:** o CSV de estoque do Tesouro já está no cache (F16) e separa a carteira "Banco Central" da carteira "Mercado"; a tela Dívida mostra a parcela: 24,3% de todos os títulos federais emitidos em jul/2026. A composição por indexador usa só a carteira "Mercado", e essa parcela usa as duas.

**Na tela:** a seção "Como o déficit é pago" da tela Déficit (F13) fica como esboço no canvas: o fluxo déficit → Tesouro vende títulos → mercado ou carteira do BC, os números da base monetária e da carteira do BC, e a vedação do financiamento direto pela Lei de Responsabilidade Fiscal.

**Link de volta:** o cartão "Na carteira do BC" da tela Dívida (F16) nasceu sem o link para esta seção; ela o acrescenta ao entrar. Na frase final, o X é essa parcela de todos os títulos emitidos, e a frase diz isso.

**O que o spike fecha,** lendo as notas de política monetária do BCB:
- como separar a gestão de liquidez do dia a dia do BC (operações compromissadas) do que seria financiamento do Tesouro;
- se a base monetária entra na tela ou só confunde, já que ela cresce também com a economia;
- a frase final, com os números de verdade, no formato "o déficit é financiado com títulos vendidos ao mercado; a parcela da dívida na carteira do BC é X%".

<a id="f46"></a>
**F46 — Juro neutro na tela Juros.** O cartão "O juro aperta ou alivia?" da prancha `Juros` compara o juro real com o juro neutro que o Banco Central estima, em barras, com o neutro sem cor (D6). Ficou de fora da F30: o Banco Central só publica a estimativa em texto de PDF do Relatório de Política Monetária (o anexo estatístico em planilha não traz a série, e o layout das abas muda a cada edição), e digitar o número o deixaria envelhecer (D8). Volta quando houver uma fonte que dê para baixar.

<a id="f47"></a>
**F47 — Basileia dos bancos.** O bloco "Os bancos aguentam?" da prancha `Credit` do canvas: o índice de Basileia do sistema bancário (quanto capital próprio os bancos têm para cada real emprestado, ponderado pelo risco), com o mínimo regulatório escrito ao lado. Ficou de fora da F33: a série do SGS (21424) parou em jun/2023, e o Banco Central hoje só publica o número no Relatório de Estabilidade Financeira, semestral (17,24% em dez/2025), e no IF.data, por instituição.

Dois caminhos a avaliar: ler o número do relatório, que é um PDF e envelheceria sem ninguém editar (D8), ou somar o patrimônio de referência e os ativos ponderados pelo risco de todas as instituições, por trimestre, no serviço Olinda do IF.data, e dividir, o que pede um adapter novo e pode divergir um pouco do número do relatório. O mínimo é regra e entra digitado com a fonte: 8% de patrimônio de referência mais 2,5% de adicional de conservação de capital, na Resolução CMN 4.958, a confirmar no texto da norma. Volta quando uma das fontes se mostrar baixável.
