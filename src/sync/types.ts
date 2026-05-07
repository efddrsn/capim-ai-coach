export type ToolType =
  | "Claude Code"
  | "Anthropic API"
  | "Claude Apps"
  | "Cowork"
  | "Third-party";

export type ToolSubtype =
  | "Skill" | "MCP" | "Plugin" | "Slash Command" | "Hook" | "IDE Integration"
  | "Subagent" | "Agent SDK" | "CLI Feature" | "API Feature" | "SDK" | "Model"
  | "Connector" | "App" | "Capability" | "Tool" | "Workflow";

export type SourceId =
  | "manual" | "anthropic-docs" | "claude-code-changelog" | "mcp-registry"
  | "awesome-mcp" | "github" | "taaft" | "futurepedia" | "product-hunt-ai"
  | "cowork-changelog";

export interface CandidateTool {
  name: string;
  type: ToolType;
  subtype: ToolSubtype;
  description: string;
  link: string;
  docs?: string;
  howToUse?: string;
  goodFor?: string[];
  personas?: string[];
  vendor?: string;
  source: SourceId;
}

export interface Fetcher {
  id: SourceId;
  fetch(): Promise<CandidateTool[]>;
}
