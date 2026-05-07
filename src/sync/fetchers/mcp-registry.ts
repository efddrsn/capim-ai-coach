import type { CandidateTool, Fetcher } from "../types.ts";

// Official registry. Currently HTML-only; if a JSON endpoint appears, prefer that.
const URL = "https://modelcontextprotocol.io/servers";

async function fetchRegistry(): Promise<CandidateTool[]> {
  const html = await fetch(URL).then((r) => r.text());

  // Heuristic parse: cards with name + description + link.
  // Adjust selectors when the site updates layout.
  const cards = [...html.matchAll(/<a[^>]+href="(\/servers\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];

  const seen = new Set<string>();
  const candidates: CandidateTool[] = [];
  for (const m of cards) {
    const href = m[1];
    if (seen.has(href)) continue;
    seen.add(href);

    const inner = stripTags(m[2]).trim().slice(0, 200);
    const name = inner.split(/\s{2,}|—|–/)[0]?.trim() || href.split("/").pop() || href;
    if (!name || name.length > 80) continue;

    candidates.push({
      name,
      type: "Claude Code",
      subtype: "MCP",
      description: inner || `MCP server discovered at ${href}`,
      link: `https://modelcontextprotocol.io${href}`,
      docs: `https://modelcontextprotocol.io${href}`,
      goodFor: ["integration"],
      vendor: "Community",
      source: "mcp-registry",
    });
  }
  return candidates.slice(0, 100);
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
}

export const fetcher: Fetcher = {
  id: "mcp-registry",
  fetch: fetchRegistry,
};
