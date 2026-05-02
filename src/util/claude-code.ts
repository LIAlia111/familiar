import { execSync } from "node:child_process";
import { DEFAULT_MODEL } from "./constants.js";

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
      modelId: obj.model?.id ?? DEFAULT_MODEL,
      transcriptPath: obj.transcript_path,
      sessionId: obj.session_id,
    };
  } catch {
    return { cwd: process.cwd(), modelId: DEFAULT_MODEL };
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
