# EconomicStatistics

Acompanhador da economia brasileira e, ao mesmo tempo, ferramenta de aprendizado de
economia. Junta as estatísticas que hoje ficam espalhadas entre BCB, IBGE e Tesouro,
calcula o que ninguém publica pronto (como o poder de compra por categoria de gasto) e
explica cada número. **Local-first**: roda em 127.0.0.1, sem autenticação e sem nuvem.

O que construir, em que ordem e por quê está em [ROADMAP.md](ROADMAP.md) e
[DECISIONS.md](DECISIONS.md).

## Stack

| Camada | Escolha |
|---|---|
| Backend | Python 3.13, FastAPI, Pydantic, `uv` |
| Frontend | React 19, Vite 8, React Router 7, TanStack Query, Tailwind 4, shadcn/ui, Recharts |
| Tipagem | `pyright` em `strict`; `tsc` em `strict`; tipos do front gerados do OpenAPI |
| Lint | `ruff` no Python; `oxlint` com type-aware no front |
| Banco | SQLite, SQLAlchemy 2 (`MappedAsDataclass`), Alembic |

## Comandos

```bash
pnpm setup     # uv sync --dev + pnpm install no front
pnpm dev       # gera os tipos e sobe backend (:8000) e frontend (:5173)
pnpm check     # codegen + ruff + pyright + pytest + oxlint + tsc
pnpm openapi   # regenera frontend/types/openapi.generated.ts direto do backend
pnpm format    # ruff format
pnpm db:revision "create x table"   # gera uma migration por autogenerate (revise o arquivo)
```

## Estrutura

```
backend/
├── app.py            # create_app(): CORS, handlers de erro, rotas
├── config/           # config.toml + variáveis de ambiente (ES_*)
├── core/             # dto.py (fronteira Pydantic), errors.py, logger.py
│   ├── database/     # engine, sessão e migrations no start
│   ├── enum/         # enums do domínio
│   └── models/       # models.py: Base e todas as tabelas
├── migrations/       # Alembic: env.py e versions/
├── adapters/         # fontes externas: IBGE, BCB (SGS, Focus e calendário do Copom) e Tesouro (pyright relaxado)
├── domain/           # dataclasses e funções puras
├── repository/       # acesso a dados compartilhado; devolve dataclass, nunca Row
└── features/<dominio>/router.py

frontend/
├── layouts/, pages/, features/<dominio>/
├── shared/{components/ui, lib, hooks}
└── types/            # openapi.generated.ts (gerado)
```

## Banco

O banco vive em `data/economic.db` e guarda só dado público: é o cache das fontes
externas, que a tela lê sem sair da máquina. Apagar o arquivo não perde nada, só obriga
o próximo refresh a baixar tudo de novo. A cada start, o `main.py` aplica as
migrations pendentes.

## Configuração

`config.toml` é local e não versionado — copie de `config.example.toml`.
Variável de ambiente tem precedência: `ES_SERVER__PORT=9000`.
