# EconomicStatistics — convenções do projeto

Contexto de produto e ordem de construção: [DECISIONS.md](DECISIONS.md) e
[ROADMAP.md](ROADMAP.md). Comandos e estrutura: [README.md](README.md). O molde de
stack e de convenções é o projeto irmão `../Finance Manager`.

## Git

- Todo commit vai direto na `main`: o repo é pessoal e solo.
- O assunto do commit descreve o que foi feito, pelo nome da coisa ("Criado o
  scaffold em FastAPI + Vite").

## IDs do roadmap ficam no roadmap

`N#`, `D#`, `F#`, `M#` e os nomes de spike existem só no `ROADMAP.md` e no
`DECISIONS.md`. Código, comentários, testes, textos de UI, README e commits dizem a
coisa pelo nome, para quem lê sem abrir o roadmap: "taxa composta multiplicando", e
não "(D3)"; "poder de compra por categoria", e não "F6".

## Documentos do roadmap

- O `ROADMAP.md` é gerado: toda mudança passa por
  `python <claude-skills>/feature-roadmap/scripts/roadmap.py ROADMAP.md <comando>`.
- O `DECISIONS.md` é o único de prosa livre.

## Dados

- `data/` (o banco) é local e ignorado: é cache de dado público, rebaixável da fonte.
- Toda fonte externa mora em `backend/adapters/`, com fetcher próprio (`urllib` +
  Pydantic); a tela lê só do banco.

## Backend

- Estrutura:
  - models num arquivo só, `backend/core/models/models.py`, com a `Base` e todas as
    tabelas;
  - enums em `backend/core/enum/`, um por arquivo, reexportados no `__init__`;
  - `Base` com `MappedAsDataclass`, o que faz o pyright acusar kwarg inexistente
    no construtor.
- Números:
  - valor de série é float, na unidade em que a fonte publica (% no mês, R$);
  - taxa no domínio e na API é fração (0.0054 é 0,54%);
  - taxa se compõe multiplicando e se desconta dividindo, em `backend/domain/rates.py`.
    O front só formata.
- Erro de domínio é `EconomicError`, com o `status` HTTP como atributo de classe. O
  domínio é puro, sem `fastapi`, e a borda (`backend/app.py`) traduz tudo para
  `{"detail": "<string>"}`, inclusive o 422.
- Schema: nasce de migration Alembic. `pnpm db:revision "<descrição em inglês>"` gera
  a revisão, e o arquivo gerado é revisado antes de aplicar.
- O `main.py` leva o banco ao head antes do uvicorn. O `create_app` não toca no banco.
- `pyright` em `strict`, sem `# type: ignore`, `cast(` ou `Any`. A exceção é
  `backend/adapters/`, que tem regras relaxadas no `pyrightconfig.json`.

## Testes

- Nome da função em inglês, descrevendo o comportamento
  (`test_second_refresh_does_not_hit_the_source`).
- O que o teste verifica vai em pt-BR, na docstring do teste.
- Teste não acessa a rede: provider é fake, e o parse das fontes roda sobre bytes
  gravados.

## Frontend

- Os tipos vêm de `pnpm openapi`, que gera `frontend/types/openapi.generated.ts`
  direto do backend, sem servidor de pé.
- O front fica no TypeScript 6, que é o que o `openapi-typescript` suporta. O
  lint é `oxlint` com type-aware.
- `shared/components/ui` e `shared/hooks/use-mobile.ts` são código vendorizado do
  shadcn, fora do lint e do formatter. O estilo é o `base-nova`: os primitivos são do
  Base UI, e a troca de elemento é pela prop `render`.
- O `oxfmt` formata o front (`pnpm format`), e o `pnpm check` do front confere.
- O `@shadcn/lint` roda dentro do oxlint:
  - componente do design system recebe por `className` só layout, espaçamento e
    tipografia; cor, borda e forma vêm de variante do componente;
  - valor calculado em render chega ao CSS por propriedade customizada no `style`,
    lida pela classe (`bg-(--swatch)`), e os tokens novos moram no `@theme` do
    `index.css`.
- O estado da tela (período, referência) mora na URL.
