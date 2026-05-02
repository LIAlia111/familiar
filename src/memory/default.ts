import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { MemoryBackend, MemoryContext } from "./backend.js";

export interface DefaultBackendOpts {
  cwd: string;
  memoryDir?: string;
}

const SUMMARY_MAX = 800;

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
    return raw.length > SUMMARY_MAX ? raw.slice(0, SUMMARY_MAX) : raw;
  }

  private readMemoryDir(): string[] {
    const dir = this.opts.memoryDir;
    if (!dir || !existsSync(dir) || !statSync(dir).isDirectory()) return [];
    const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
    return files.map((f) => readFileSync(join(dir, f), "utf8").trim());
  }
}
