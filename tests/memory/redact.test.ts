import { describe, it, expect } from "vitest";
import { redact } from "../../src/memory/redact.js";

describe("redact", () => {
  it("redacts Anthropic API keys", () => {
    const out = redact("My key: sk-ant-api03-abcdefghij1234567890");
    expect(out).not.toContain("sk-ant-api03");
    expect(out).toContain("[REDACTED:anthropic-key]");
  });

  it("redacts GitHub tokens", () => {
    const out = redact("token: ghp_abcdefghijklmnopqrstuvwxyz1234567890");
    expect(out).not.toContain("ghp_abcdef");
    expect(out).toContain("[REDACTED:github-token]");
  });

  it("redacts URLs with credentials", () => {
    const out = redact("db: postgres://admin:secretpass@db.host/mydb");
    expect(out).not.toContain("secretpass");
    expect(out).toContain("[REDACTED:url-credentials]");
  });

  it("redacts password assignments", () => {
    const out = redact('password = "myverylongpassword123"');
    expect(out).not.toContain("myverylongpassword");
    expect(out).toContain("[REDACTED:password-assignment]");
  });

  it("redacts Telegram chat IDs", () => {
    const out = redact("chat_id: 1234567890");
    expect(out).not.toContain("1234567890");
    expect(out).toContain("[REDACTED:telegram-chat-id]");
  });

  it("preserves non-secret text", () => {
    const text = "Building a CLI tool with TypeScript and Node.js.";
    expect(redact(text)).toBe(text);
  });

  it("redacts BEGIN PRIVATE KEY blocks", () => {
    const text = "-----BEGIN RSA PRIVATE KEY-----\nABCDEFG123\n-----END RSA PRIVATE KEY-----";
    expect(redact(text)).toContain("[REDACTED:private-key-block]");
  });
});
