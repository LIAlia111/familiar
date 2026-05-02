import { execSync } from "node:child_process";
import { homedir } from "node:os";
import { isAbsolute, resolve } from "node:path";
import { DEFAULT_MODEL } from "./constants.js";

export interface SessionInput {
  cwd: string;
  modelId: string;
  transcriptPath?: string;
  sessionId?: string;
}

// Reject cwd values that aren't absolute or that try to escape via `..`.
// Falls back to process.cwd() on rejection.
function safeCwd(raw: unknown): string {
  if (typeof raw !== "string" || raw.length === 0) return process.cwd();
  if (!isAbsolute(raw)) return process.cwd();
  // Resolve to canonical form and reject if it tries to escape via traversal.
  const resolved = resolve(raw);
  if (resolved.includes("\0")) return process.cwd();
  return resolved;
}

export function parseSessionInput(raw: string): SessionInput {
  try {
    const obj = JSON.parse(raw);
    return {
      cwd: safeCwd(obj.cwd),
      modelId: typeof obj.model?.id === "string" ? obj.model.id : DEFAULT_MODEL,
      transcriptPath: typeof obj.transcript_path === "string" ? obj.transcript_path : undefined,
      sessionId: typeof obj.session_id === "string" ? obj.session_id : undefined,
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

// Exposed for the home-directory check in install.
export const userHome = (): string => homedir();
