import { describe, it, expect } from "vitest";
import { parseSessionInput } from "../../src/util/claude-code.js";

describe("Claude Code utilities", () => {
  it("parses session info from stdin JSON", () => {
    const json = JSON.stringify({
      session_id: "abc",
      cwd: "/some/path",
      transcript_path: "/some/path/transcript.jsonl",
      model: { id: "claude-sonnet-4-6" },
    });
    const parsed = parseSessionInput(json);
    expect(parsed.cwd).toBe("/some/path");
    expect(parsed.modelId).toBe("claude-sonnet-4-6");
  });

  it("returns sensible defaults for invalid JSON", () => {
    const parsed = parseSessionInput("not json");
    expect(parsed.cwd).toBe(process.cwd());
  });
});
