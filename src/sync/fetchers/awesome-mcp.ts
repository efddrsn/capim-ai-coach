import type { CandidateTool, Fetcher } from "../types.ts";

const README_URL = "https://raw.githubusercontent.com/punkpeye/awesome-mcp-servers/main/README.md";

async function fetchAwesome(): Promise<CandidateTool[]> {
  const md = await fetch(README_URL).then((r) => r.text());

  // Lines like: "- [name](url) - description"
  const linePattern = /^[\s*-]+\[([^\]]+)\]\(([^)]+)\)\s*[-–—:]\s*(.+)$/gm;

  const candidates: CandidateTool[] = [];
  for (const m of md.matchAll(linePattern)) {
    const name = m[1].trim();
    const link = m[2].trim();
    const description = m[3].trim().slice(0, 400);

    if (!link.startsWith("http")) continue;
    if (name.length > 80) continue;

    candidates.push({
      name,
      type: "Claude Code",
      subtype: "MCP",
      description,
      link,
      goodFor: ["integration"],
      vendor: "Community",
      source: "awesome-mcp",
    });
  }
  return candidates.slice(0, 200);
}

export const fetcher: Fetcher = {
  id: "awesome-mcp",
  fetch: fetchAwesome,
};
