# AI Tools Catalog — Notion schema

## Database

- **Name**: `AI Tools Catalog`
- **Database ID**: `TODO_PASTE_NOTION_DATABASE_ID_HERE`

To find the ID: open the database as a full page in Notion → copy the URL → the 32-char hex segment after the workspace slug is the ID. Paste it above and commit.

## Properties

| Property          | Type           | Required | Notes                                                                                  |
| ----------------- | -------------- | -------- | -------------------------------------------------------------------------------------- |
| `Name`            | Title          | yes      | Display name of the tool.                                                              |
| `Type`            | Select         | yes      | One of: `claude-code-skill`, `mcp`, `plugin`, `feature`, `cowork`, `third-party`.      |
| `Description`     | Rich text      | yes      | 1–3 sentences. What it does, in plain language.                                        |
| `Good for`        | Multi-select   | yes      | Use cases: e.g. `code-review`, `research`, `roadmap`, `data-viz`, `writing`, `meeting-notes`. Add tags freely. |
| `Personas`        | Multi-select   | no       | Orientative only (not a hard filter): `eng`, `pm`, `design`, `lideranca`, `ops`, `data`. |
| `Link`            | URL            | yes      | Docs, install page, or product URL.                                                    |
| `How to use`      | Rich text      | yes      | First concrete step: command, snippet, or 2–3 bullets.                                 |
| `When NOT to use` | Rich text      | no       | Anti-patterns. If present, the coach will use this to filter out bad matches.          |
| `Last verified`   | Date           | yes      | When a human last confirmed it works. Stale entries (>90 days) lower confidence.       |
| `Status`          | Select         | yes      | `active` (recommend), `beta` (recommend with caveat), `deprecated` (never recommend).  |

## Querying from the skill

Preferred call: `notion-query-database-view` with filters
- `Status = active`
- optionally `Type` ∈ relevant types for the user's situation
- optionally `Good for` contains tag matching the user's task

Fallback: `notion-fetch` on the database ID, then filter client-side.

## Adding a new entry

Anyone at Capim can add a row in Notion. Minimum required fields above. Set `Last verified = today` and `Status = active` (or `beta`).
