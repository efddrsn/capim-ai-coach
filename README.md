# Capim AI Coach

Skill organizacional do Claude Code que sugere proativamente tools de AI (skills, MCPs, plugins, features do Claude Code; Cowork; produtos off-the-shelf) curadas pela Capim, conforme o contexto do prompt do usuário.

## Como funciona

1. A skill `capim-ai-coach` está em `.claude/skills/capim-ai-coach/`.
2. Em qualquer sessão Claude Code que tenha a skill instalada, o Claude lê a `description` e ativa a skill quando o prompt sugere oportunidade de usar uma tool.
3. Antes de recomendar, a skill obriga o Claude a fazer 1–3 perguntas curtas se o contexto (tarefa, papel/stack, restrições) ainda não estiver claro.
4. Com contexto, a skill busca o catálogo no Notion (DB **AI Tools Catalog**) via Notion MCP e recomenda 1–2 tools com formato padronizado.

Sugestões são pro próprio usuário da sessão (não pra terceiros).

## Setup

### 1. Notion já configurado

- Database **AI Tools Catalog** já criado (id `a51ef42eec804de9ba870eff9fe8587d`, data source `2cd369c1-d5f3-4b8b-adfa-847676702da5`), populado com 100+ entradas cobrindo Claude Code, Anthropic API, Claude Apps, Cowork e third-party.
- Página separada **AI Tools — Sync Sources (Registries)** lista as fontes que o sync automático consome.
- Garanta que a integração Notion da Capim (usada pelo Notion MCP da skill e pelo workflow de sync) tem acesso ao database.

### 2. Instalar como org skill

Publique `.claude/skills/capim-ai-coach/` no marketplace interno de skills da org Capim no Claude Code (via plugin/marketplace da org). A partir daí, qualquer sessão Claude Code de membros da org carrega a skill automaticamente.

Para testes locais antes de publicar: a skill já fica disponível em qualquer sessão aberta neste repo (Claude Code lê `.claude/skills/` do projeto).

### 3. Smoke tests

Numa sessão Claude Code, valide:

- **Vago** → "tô com problema de produtividade" → skill deve **perguntar** antes de sugerir.
- **Rico** → "montando roadmap Q3 como PM de growth" → skill sugere direto.
- **Repo aberto + óbvio** → "revisar esse PR grande" → sugere `/review` ou `simplify`.
- **Trivial** → "qual a hora?" → skill **não dispara**.
- **Recusa** → após "não curto X", X **não** reaparece na sessão.

## Manutenção

- **Adicionar tool**: nova linha no Notion DB. `Status=active`, `Last verified=hoje`. Reflete imediatamente — sem deploy.
- **Deprecar**: mude `Status=deprecated`. A skill nunca recomenda deprecated.
- **Refresh periódico**: revise `Last verified` mensalmente. Entradas >90 dias sem verificação têm peso menor.
- **Iterar a skill**: ajuste `SKILL.md`/`examples.md` se notar falsos positivos (sugestões inoportunas) ou falsos negativos (oportunidades perdidas).

## Sync automático

GitHub Actions roda diariamente (6 UTC) e semanalmente (segunda 7 UTC) em `.github/workflows/catalog-sync.yml`. Para cada fonte habilitada em `config/registries.yaml`, um fetcher em `src/sync/fetchers/<id>.ts` extrai candidatos e o script faz upsert no Notion com `Status=pending-review` e `Auto-synced=true`. Curador humano revisa e promove pra `active`.

### Setup

1. Criar uma Notion integration com acesso ao database **AI Tools Catalog**.
2. Adicionar o token como secret `NOTION_TOKEN` no GitHub (Settings → Secrets → Actions).
3. Habilitar fontes em `config/registries.yaml` (mude `enabled: true`).
4. Local dry-run: `npm install && npm run sync:dry-run`.
5. Trigger manual no GitHub: Actions → Catalog sync → Run workflow.

### Adicionar nova fonte

1. Criar `src/sync/fetchers/<id>.ts` exportando `fetcher: Fetcher` (veja types em `src/sync/types.ts`).
2. Registrar em `ALL_FETCHERS` no `src/sync/index.ts`.
3. Adicionar entrada em `config/registries.yaml` com `enabled: true`.
4. Atualizar a tabela na página Notion **AI Tools — Sync Sources (Registries)**.

### Limitações

- Fetchers HTML (changelog, MCP registry, TAAFT, Futurepedia) são scrapers heurísticos — vão quebrar quando o site mudar layout. Tratam como best-effort.
- Itens descobertos sempre entram como `pending-review`. Nunca pulam direto pra `active`.
- Dedupe é por `Link` ou `Name` normalizado. Se uma fonte muda a URL canônica de um item, vai criar duplicata — humano filtra.

## Estrutura

```
.claude/skills/capim-ai-coach/
├── SKILL.md            # instruções + triggers + regra "perguntar antes"
├── catalog-schema.md   # schema do DB Notion + ID
└── examples.md         # ~10 exemplos (perguntar vs. recomendar)
```

## Limitações conhecidas

- Sem proatividade fora do Claude Code — não posta no Slack sozinho.
- Quem não usa Claude Code não recebe sugestões.
- Sugere tools pro usuário da sessão; não recomenda "o que fulano deveria usar".

Se quiser estender pra Slack proativo no futuro, dá pra adicionar uma camada cron + Slack por cima sem mexer na skill.
