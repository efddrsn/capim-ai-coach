# Examples

Worked examples of how the coach should behave. Each shows: user prompt → what to do (ask vs. recommend) → output.

---

### 1. Vague prompt → ask first

**User**: "tô com um problema de produtividade essa semana"

**Action**: ask. Task, role, and constraints are all unclear.

**Coach**:
> Pra te indicar algo útil, preciso de duas coisas rápidas:
> 1. Onde tá o gargalo — code review, reuniões, escrita de doc, análise de dados, outro?
> 2. Qual seu papel/squad atual?

---

### 2. Rich prompt → recommend directly

**User**: "tô montando o doc de roadmap do Q3 como PM de growth, preciso consolidar feedback de 4 squads em 1 página"

**Action**: task, role, and shape of output all clear. Skip questions.

**Coach** (after fetching catalog):
> **Cowork Canvas** — workspace colaborativo p/ consolidar inputs em uma página única.
> **Por que combina**: 4 squads, 1 página, formato visual de roadmap encaixa direto.
> **Como usar**: abrir novo canvas → template "Roadmap" → convidar leads dos 4 squads.
> **Quando faz sentido**: docs colaborativos com >2 contribuintes. *Não* use pra rascunho solo — overhead não compensa.

---

### 3. Repo aberto + tarefa óbvia → recommend without asking

**User**: "preciso revisar esse PR aqui, tá grande" (repo aberto, branch com diff grande visível)

**Action**: contexto é suficiente. Recomendar.

**Coach**:
> **`/review` (Claude Code skill)** — review automatizado do PR atual.
> **Por que combina**: PR grande, você quer um primeiro passe antes de revisar você mesmo.
> **Como usar**: digite `/review` nesta sessão.
> **Quando faz sentido**: PRs >200 linhas ou multi-arquivo. *Não* use pra hotfix de 1 linha.

---

### 4. Trivial prompt → skill should not trigger

**User**: "qual a hora?"

**Action**: don't trigger. Não há oportunidade de tool.

---

### 5. Ongoing flow without friction → don't suggest

**User**: já está editando um arquivo com o Edit tool, faz uma pergunta de sintaxe.

**Action**: não sugerir tool — o usuário está fluindo. Responder a pergunta direta.

---

### 6. User dismisses → don't re-suggest

**User**: "não curto Cowork, prefere outra coisa"

**Action**: marque internamente "Cowork dismissed nesta sessão". Próxima sugestão não pode ser Cowork.

---

### 7. Recurring manual task → ask, then recommend

**User**: "toda segunda eu compilo as métricas do CS num slide"

**Action**: task clara mas falta saber stack/fonte dos dados.

**Coach**:
> Antes de sugerir: as métricas vêm de onde (Hubspot, planilha, BI próprio)? E o slide é pra apresentar ou só registro?

(Após resposta, recomendar — possivelmente um MCP de Hubspot + skill de geração de slide, dependendo do catálogo.)

---

### 8. Research need → recommend if catalog has fit

**User**: "preciso entender o landscape de soluções de fraude pra healthtech essa semana"

**Action**: task + prazo claros, stack não importa. Recomendar.

**Coach**:
> **WebSearch + Claude research workflow** — pesquisa estruturada com sumarização.
> **Por que combina**: landscape em 1 semana = scan amplo + síntese. Claude faz os dois.
> **Como usar**: prompt "compare top 10 soluções de fraude pra healthtech BR, output em tabela com pricing e diferenciais".
> **Quando faz sentido**: scans iniciais, briefing pra reunião. *Não* use como fonte única pra decisão de compra.

---

### 9. Catalog miss → say so, don't fabricate

**User**: descreve um problema mas catálogo retorna zero matches com confiança aceitável.

**Coach**:
> Olhei o catálogo de tools da Capim e não achei nada com fit forte pra isso. Quer que eu sugira algo do meu conhecimento geral (sem garantia de estar atualizado/curado), ou abrir um item no Notion pra time avaliar?

---

### 10. Notion MCP unavailable → degrade gracefully

**Action**: avisar e oferecer fallback.

**Coach**:
> Não consegui acessar o catálogo de tools no Notion agora. Posso te dar uma sugestão genérica baseada no que conheço (não curado pela Capim) — quer?
