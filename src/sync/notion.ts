import { Client } from "@notionhq/client";
import type { CandidateTool } from "./types.ts";

const DATABASE_ID = "a51ef42eec804de9ba870eff9fe8587d";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export interface ExistingEntry {
  pageId: string;
  name: string;
  link: string | null;
}

export async function listExisting(): Promise<ExistingEntry[]> {
  const out: ExistingEntry[] = [];
  let cursor: string | undefined;
  do {
    const res = await notion.databases.query({
      database_id: DATABASE_ID,
      start_cursor: cursor,
      page_size: 100,
    });
    for (const p of res.results) {
      if (!("properties" in p)) continue;
      const props = p.properties as Record<string, any>;
      const name = props.Name?.title?.[0]?.plain_text ?? "";
      const link = props.Link?.url ?? null;
      out.push({ pageId: p.id, name, link });
    }
    cursor = res.has_more ? res.next_cursor ?? undefined : undefined;
  } while (cursor);
  return out;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

export function findMatch(
  candidate: CandidateTool,
  existing: ExistingEntry[],
): ExistingEntry | undefined {
  return existing.find(
    (e) =>
      (e.link && candidate.link && normalize(e.link) === normalize(candidate.link)) ||
      normalize(e.name) === normalize(candidate.name),
  );
}

export async function createPending(c: CandidateTool, dryRun: boolean): Promise<void> {
  const props: Record<string, any> = {
    Name: { title: [{ text: { content: c.name } }] },
    Type: { select: { name: c.type } },
    Subtype: { select: { name: c.subtype } },
    Description: { rich_text: [{ text: { content: c.description.slice(0, 2000) } }] },
    Link: c.link ? { url: c.link } : undefined,
    Docs: c.docs ? { url: c.docs } : undefined,
    "How to use": c.howToUse
      ? { rich_text: [{ text: { content: c.howToUse.slice(0, 2000) } }] }
      : undefined,
    "Good for": c.goodFor?.length
      ? { multi_select: c.goodFor.map((name) => ({ name })) }
      : undefined,
    Personas: c.personas?.length
      ? { multi_select: c.personas.map((name) => ({ name })) }
      : undefined,
    Vendor: c.vendor ? { select: { name: c.vendor } } : undefined,
    Status: { select: { name: "pending-review" } },
    Source: { select: { name: c.source } },
    "Auto-synced": { checkbox: true },
    "Last verified": { date: { start: new Date().toISOString().slice(0, 10) } },
  };

  for (const k of Object.keys(props)) if (props[k] === undefined) delete props[k];

  if (dryRun) {
    console.log(`[dry-run] would create: ${c.name} (${c.source})`);
    return;
  }

  await notion.pages.create({
    parent: { database_id: DATABASE_ID },
    properties: props,
  });
  console.log(`created: ${c.name} (${c.source})`);
}
