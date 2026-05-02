import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadState, saveState, defaultState } from "../../src/state/store.js";

describe("state store", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "familiar-"));
    process.env.FAMILIAR_HOME = dir;
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
    delete process.env.FAMILIAR_HOME;
  });

  it("returns null when no state file exists", () => {
    expect(loadState()).toBeNull();
  });

  it("saves and reloads a default state", () => {
    const s = defaultState({ species: "cat", name: "mimi" });
    saveState(s);
    const loaded = loadState();
    expect(loaded?.activeSpecies).toBe("cat");
    expect(loaded?.pets.cat?.name).toBe("mimi");
    expect(loaded?.pets.cat?.affection).toBe(20);
  });

  it("creates familiar home directory if missing", () => {
    saveState(defaultState({ species: "capybara", name: "kapi" }));
    expect(loadState()).not.toBeNull();
  });
});
