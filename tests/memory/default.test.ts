import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DefaultBackend } from "../../src/memory/default.js";

describe("DefaultBackend", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "familiar-mem-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("reads CLAUDE.md when present", async () => {
    writeFileSync(join(dir, "CLAUDE.md"), "# My Project\nBuilding a CLI tool.\n");
    const backend = new DefaultBackend({ cwd: dir, memoryDir: undefined });
    const ctx = await backend.fetchContext();
    expect(ctx.projectSummary).toContain("CLI tool");
  });

  it("returns empty when CLAUDE.md missing", async () => {
    const backend = new DefaultBackend({ cwd: dir, memoryDir: undefined });
    const ctx = await backend.fetchContext();
    expect(ctx.projectSummary).toBe("");
  });

  it("reads memory directory bullets", async () => {
    const memDir = join(dir, "memory");
    mkdirSync(memDir);
    writeFileSync(join(memDir, "user.md"), "User prefers concise replies.");
    const backend = new DefaultBackend({ cwd: dir, memoryDir: memDir });
    const ctx = await backend.fetchContext();
    expect(ctx.userPreferences.join("")).toContain("concise");
  });
});
