import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock dependencies before importing activate
vi.mock("../../src/sponsor/config.js", () => ({
  GITHUB_CLIENT_ID: "Iv1.placeholder-replace-me",
  SPONSOR_MAINTAINER: "LIAlia111",
  SPONSOR_CACHE_MS: 2592000000,
  AFDIAN_URL: "https://afdian.com/a/Lief-ai",
}));

vi.mock("../../src/state/store.js", () => ({
  loadState: () => ({
    pet: { name: "test", affection: 50 },
    unlockedSpecies: ["cat"],
  }),
  saveState: vi.fn(),
}));

// deviceAuth should NOT be called when placeholder is detected
vi.mock("../../src/sponsor/oauth.js", () => ({
  deviceAuth: vi.fn().mockRejectedValue(new Error("should not be called")),
}));

import { runActivateCommand } from "../../src/commands/activate.js";
import { deviceAuth } from "../../src/sponsor/oauth.js";

describe("activate command — placeholder guard", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("prints error and returns early when GITHUB_CLIENT_ID is placeholder", async () => {
    await runActivateCommand();

    // Should print the unconfigured-OAuth message
    const calls = consoleSpy.mock.calls.map((c) => c.join(" "));
    expect(calls.some((c) => c.includes("未配置 GitHub OAuth"))).toBe(true);
  });

  it("never calls deviceAuth (OAuth) when placeholder is detected", async () => {
    await runActivateCommand();
    expect(deviceAuth).not.toHaveBeenCalled();
  });
});
