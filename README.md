# Capim AI Coach

Skill organizacional do Claude Code que sugere proativamente tools de AI (skills, MCPs, plugins, features do Claude Code; Cowork; produtos off-the-shelf) curadas pela Capim, conforme o contexto do prompt do usuário.

## Como funciona

1. A skill `capim-ai-coach` está em `.claude/skills/capim-ai-coach/`.
2. Em qualquer sessão Claude Code que tenha a skill instalada, o Claude lê a `description` e ativa a skill quando o prompt sugere oportunidade de usar uma tool.
3. Antes de recomendar, a skill obriga o Claude a fazer 1–3 perguntas curtas se o contexto (tarefa, papel/stack, restrições) ainda não estiver claro.
4. Com contexto, a skill busca o catálogo no Notion (DB **AI Tools Catalog**) via Notion MCP e recomenda 1–2 tools com formato padronizado.

Sugestões são pro próprio usuário da sessão (não pra terceiros).

## Setup

### 1. Configurar o Notion

- Crie um database chamado **AI Tools Catalog** com o schema descrito em `.claude/skills/capim-ai-coach/catalog-schema.md`.
- Popule com 8–10 tools iniciais (mistura de skills do Claude Code, MCPs, recursos do Cowork, e 2–3 third-party de registries como TAAFT/Futurepedia).
- Cole o database ID em `catalog-schema.md` (substituindo `TODO_PASTE_NOTION_DATABASE_ID_HERE`).
- Garanta que a integração Notion da Capim (usada pelo Notion MCP) tem acesso ao database.

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
