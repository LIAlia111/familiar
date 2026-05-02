import { existsSync, lstatSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { MemoryBackend, MemoryContext } from "./backend.js";
import { redact } from "./redact.js";

export interface DefaultBackendOpts {
  cwd: string;
  memoryDir?: string;
}

const SUMMARY_MAX = 800;
const PER_FILE_MAX = 4000;

export class DefaultBackend implements MemoryBackend {
  constructor(private opts: DefaultBackendOpts) {}

  async fetchContext(): Promise<MemoryContext> {
    return {
      projectSummary: this.readClaudeMd(),
      userPreferences: this.readMemoryDir(),
    };
  }

  private readClaudeMd(): string {
    const path = join(this.opts.cwd, "CLAUDE.md");
    if (!existsSync(path)) return "";
    const raw = readFileSync(path, "utf8");
    const sliced = raw.length > SUMMARY_MAX ? raw.slice(0, SUMMARY_MAX) : raw;
    return redact(sliced);
  }

  private readMemoryDir(): string[] {
    const dir = this.opts.memoryDir;
    if (!dir || !existsSync(dir)) return [];
    let st;
    try {
      st = statSync(dir);
    } catch {
      return [];
    }
    if (!st.isDirectory()) return [];

    const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
    const out: string[] = [];
    for (const f of files) {
      const full = join(dir, f);
      // Skip symlinks to avoid following into /dev or arbitrary paths.
      try {
        if (lstatSync(full).isSymbolicLink()) continue;
      } catch {
        continue;
      }
      const raw = readFileSync(full, "utf8").trim();
      const sliced = raw.length > PER_FILE_MAX ? raw.slice(0, PER_FILE_MAX) : raw;
      out.push(redact(sliced));
    }
    return out;
  }
}
