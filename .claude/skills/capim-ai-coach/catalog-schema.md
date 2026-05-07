# AI Tools Catalog — Notion schema

## Database

- **Name**: `AI Tools Catalog`
- **Database ID**: `a51ef42eec804de9ba870eff9fe8587d`
- **Data source ID** (use for `notion-query-database-view` / `notion-fetch`): `2cd369c1-d5f3-4b8b-adfa-847676702da5`
- **URL**: https://www.notion.so/a51ef42eec804de9ba870eff9fe8587d
- **Parent page**: `👾 Projetos IA`

## Properties

| Property          | Type           | Notes |
| ----------------- | -------------- | ----- |
| `Name`            | Title          | Display name. |
| `Type`            | Select         | `Claude Code`, `Anthropic API`, `Claude Apps`, `Cowork`, `Third-party`. |
| `Subtype`         | Select         | `Skill`, `MCP`, `Plugin`, `Slash Command`, `Hook`, `IDE Integration`, `Subagent`, `Agent SDK`, `CLI Feature`, `API Feature`, `SDK`, `Model`, `Connector`, `App`, `Capability`, `Tool`, `Workflow`. |
| `Description`     | Rich text      | 1–3 sentences in plain language. |
| `Good for`        | Multi-select   | Use-case tags (`code-review`, `research`, `roadmap`, `data-viz`, `writing`, `meeting-notes`, `planning`, `design`, `prototyping`, `docs`, `debugging`, `testing`, `security`, `devops`, `automation`, `integration`, `agent-building`, `long-context`, `tool-use`, `caching`, `multimodal`, `speech`, `spreadsheets`, `slides`, `CRM`, `support`, `sales`, `recruiting`, `HR`, `finance`, `data-analysis`, `refactor`). |
| `Personas`        | Multi-select   | `eng`, `pm`, `design`, `lideranca`, `ops`, `data`, `cs`, `sales`, `marketing`, `finance`, `people`, `all`. |
| `Vendor`          | Select         | `Anthropic`, `Cowork`, `OpenAI`, `Google`, `Microsoft`, `Meta`, `Community`, `Notion`, `Slack`, `GitHub`, `Linear`, `HubSpot`, `Figma`, `Vercel`, `Other`. |
| `Link`            | URL            | Primary product/install URL. |
| `Docs`            | URL            | Documentation link. |
| `How to use`      | Rich text      | First concrete step: command, snippet, or 2–3 bullets. |
| `When NOT to use` | Rich text      | Anti-patterns. The coach uses this to filter out bad matches. |
| `Pricing`         | Select         | `Free`, `Freemium`, `Paid`, `Included in Claude`, `Included in Anthropic API`, `Open source`, `Unknown`. |
| `Status`          | Select         | `active` (recommend), `beta`, `deprecated` (never recommend), `pending-review` (added by sync, needs human curation), `experimental`. |
| `Maturity`        | Select         | `GA`, `Beta`, `Preview`, `Experimental`, `Unknown`. |
| `Last verified`   | Date           | When a human last confirmed it works. >90 days lowers confidence. |
| `Source`          | Select         | Where this entry came from: `manual`, `anthropic-docs`, `claude-code-changelog`, `mcp-registry`, `awesome-mcp`, `github`, `taaft`, `futurepedia`, `product-hunt-ai`, `cowork-changelog`. |
| `Auto-synced`     | Checkbox       | True = added/updated by automated sync. Human should review before promoting to `active`. |
| `Tool ID`         | Auto-increment | Prefix `AIT`. Stable identifier. |

## Querying from the skill

Preferred call: `notion-query-database-view` with the data source URL `collection://2cd369c1-d5f3-4b8b-adfa-847676702da5` and filters
- `Status = active`
- optionally `Type` ∈ relevant types for the user's situation
- optionally `Good for` contains tag matching the user's task

Fallback: `notion-fetch` on the data source ID, then filter client-side.

## Adding a new entry

Anyone at Capim can add a row in Notion. Set `Last verified = today`, `Status = active` (or `beta`), `Source = manual`, `Auto-synced = false`.

## Sync sources

Registries that the auto-sync consumes are tracked separately in the Notion page **AI Tools — Sync Sources (Registries)** under `👾 Projetos IA`. They are NOT in this database — they're inputs to the pipeline that populates this database.
