import type { CandidateTool, Fetcher } from "../types.ts";

const URL = "https://docs.claude.com/en/release-notes/claude-code";

async function fetchChangelog(): Promise<CandidateTool[]> {
  const html = await fetch(URL).then((r) => r.text());

  // Extract H2/H3 blocks that look like new features.
  // The release notes page lists features per release. We pull each <h3> as a candidate
  // and let the human curate which become catalog entries.
  const sections = [...html.matchAll(/<h3[^>]*>(.*?)<\/h3>([\s\S]*?)(?=<h3|<h2|$)/g)];

  const candidates: CandidateTool[] = [];
  for (const m of sections.slice(0, 20)) {
    const name = stripTags(m[1]).trim();
    const body = stripTags(m[2]).trim().slice(0, 400);
    if (!name || name.length > 80) continue;

    candidates.push({
      name: `[CC] ${name}`,
      type: "Claude Code",
      subtype: "CLI Feature",
      description: body || `New in Claude Code: ${name}`,
      link: URL,
      docs: URL,
      vendor: "Anthropic",
      source: "claude-code-changelog",
    });
  }
  return candidates;
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ");
}

export const fetcher: Fetcher = {
  id: "claude-code-changelog",
  fetch: fetchChangelog,
};
