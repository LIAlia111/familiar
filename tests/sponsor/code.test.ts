import { describe, it, expect } from "vitest";
import { generateActivationCode, verifyActivationCode } from "../../src/sponsor/code.js";

describe("activation code", () => {
  it("round-trips a valid code", () => {
    const code = generateActivationCode("LIAlia111");
    const result = verifyActivationCode(code);
    expect(result.valid).toBe(true);
    expect(result.login).toBe("lialia111");
  });

  it("normalizes case and whitespace before hashing", () => {
    const a = generateActivationCode("LIAlia111");
    const b = generateActivationCode("  lialia111 ");
    expect(a).toBe(b);
  });

  it("rejects malformed input", () => {
    expect(verifyActivationCode("").valid).toBe(false);
    expect(verifyActivationCode("nohash").valid).toBe(false);
    expect(verifyActivationCode("a:b:c").valid).toBe(false);
    expect(verifyActivationCode(":hashonly").valid).toBe(false);
    expect(verifyActivationCode("login:").valid).toBe(false);
  });

  it("rejects a tampered hash", () => {
    const code = generateActivationCode("alice");
    const tampered = code.slice(0, -2) + "ff";
    expect(verifyActivationCode(tampered).valid).toBe(false);
  });

  it("rejects a code minted for a different login", () => {
    const code = generateActivationCode("alice");
    const [, hash] = code.split(":");
    const swapped = `bob:${hash}`;
    expect(verifyActivationCode(swapped).valid).toBe(false);
  });
});
