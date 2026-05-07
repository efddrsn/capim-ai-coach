import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { createPending, findMatch, listExisting } from "./notion.ts";
import type { Fetcher } from "./types.ts";
import { fetcher as claudeCodeChangelog } from "./fetchers/claude-code-changelog.ts";
import { fetcher as mcpRegistry } from "./fetchers/mcp-registry.ts";
import { fetcher as awesomeMcp } from "./fetchers/awesome-mcp.ts";

const ALL_FETCHERS: Record<string, Fetcher> = {
  "claude-code-changelog": claudeCodeChangelog,
  "mcp-registry": mcpRegistry,
  "awesome-mcp": awesomeMcp,
  // Add more fetchers here as you implement them.
};

interface RegistryConfig {
  sources: { id: string; name: string; enabled: boolean; cadence: string }[];
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const cadenceFilter = process.env.CADENCE; // "daily" | "weekly" | undefined (= all)

  const config = parse(readFileSync("config/registries.yaml", "utf-8")) as RegistryConfig;
  const enabled = config.sources.filter(
    (s) => s.enabled && (!cadenceFilter || s.cadence === cadenceFilter),
  );

  console.log(`Fetching ${enabled.length} sources (cadence=${cadenceFilter ?? "all"}, dry-run=${dryRun})`);

  const existing = await listExisting();
  console.log(`Found ${existing.length} existing entries in Notion`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const source of enabled) {
    const fetcher = ALL_FETCHERS[source.id];
    if (!fetcher) {
      console.warn(`No fetcher implemented for "${source.id}" — skipping.`);
      continue;
    }

    try {
      const candidates = await fetcher.fetch();
      console.log(`[${source.id}] ${candidates.length} candidates`);

      for (const c of candidates) {
        if (findMatch(c, existing)) {
          skipped++;
          continue;
        }
        await createPending(c, dryRun);
        created++;
      }
    } catch (err) {
      errors++;
      console.error(`[${source.id}] error:`, err);
    }
  }

  console.log(`\nDone. created=${created} skipped=${skipped} errors=${errors}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
