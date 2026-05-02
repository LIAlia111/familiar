import { describe, it, expect } from "vitest";
import { decideTrigger } from "../../src/hooks/proactive.js";

describe("decideTrigger", () => {
  it("returns session_start_morning when last interaction was today", () => {
    const now = new Date("2026-05-02T10:00:00Z");
    const last = new Date("2026-05-02T08:00:00Z").toISOString();
    expect(
      decideTrigger("SessionStart", { lastInteractionAt: last, chattiness: "normal", now }),
    ).toBe("session_start_morning");
  });

  it("returns session_return_long_absence when last was >24h ago", () => {
    const now = new Date("2026-05-02T10:00:00Z");
    const last = new Date("2026-04-30T10:00:00Z").toISOString();
    expect(
      decideTrigger("SessionStart", { lastInteractionAt: last, chattiness: "normal", now }),
    ).toBe("session_return_long_absence");
  });

  it("returns task_completion on Stop", () => {
    const now = new Date();
    const last = new Date(now.getTime() - 60_000).toISOString();
    expect(decideTrigger("Stop", { lastInteractionAt: last, chattiness: "normal", now })).toBe(
      "task_completion",
    );
  });

  it("returns null on Stop when chattiness is quiet", () => {
    const now = new Date();
    const last = new Date(now.getTime() - 60_000).toISOString();
    expect(
      decideTrigger("Stop", { lastInteractionAt: last, chattiness: "quiet", now }),
    ).toBeNull();
  });
});
