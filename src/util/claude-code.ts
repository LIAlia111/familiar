import { execSync } from "node:child_process";

export interface SessionInput {
  cwd: string;
  modelId: string;
  transcriptPath?: string;
  sessionId?: string;
}

export function parseSessionInput(raw: string): SessionInput {
  try {
    const obj = JSON.parse(raw);
    return {
      cwd: obj.cwd ?? process.cwd(),
      modelId: obj.model?.id ?? "claude-sonnet-4-6",
      transcriptPath: obj.transcript_path,
      sessionId: obj.session_id,
    };
  } catch {
    return { cwd: process.cwd(), modelId: "claude-sonnet-4-6" };
  }
}

export function isClaudeCodeInstalled(): boolean {
  try {
    execSync("claude --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
