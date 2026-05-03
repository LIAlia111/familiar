// HMAC-based activation code for offline sponsor verification.
//
// Threat model: this gates COSMETIC content (pet skins / extra species).
// The shared secret is by design embedded in this open source code —
// anyone reading the repo can generate codes. That is acceptable for
// cosmetic gates: real sponsors get codes via Afdian, freeloaders cheat
// themselves out of the support relationship. This is NOT for security-
// sensitive content.
//
// Code format: `<github_login>:<12-hex-hmac>`
// Example: `lialiaall:a1b2c3d4e5f6`

import { createHmac } from "node:crypto";

const SHARED_SECRET = "familiar-v1-cosmetic-unlock-2026-public";

function normalize(login: string): string {
  return login.toLowerCase().trim();
}

function hashFor(login: string): string {
  return createHmac("sha256", SHARED_SECRET)
    .update(normalize(login))
    .digest("hex")
    .slice(0, 12);
}

export function generateActivationCode(githubLogin: string): string {
  return `${normalize(githubLogin)}:${hashFor(githubLogin)}`;
}

export interface CodeVerification {
  valid: boolean;
  login?: string;
}

export function verifyActivationCode(code: string): CodeVerification {
  const parts = code.trim().split(":");
  if (parts.length !== 2) return { valid: false };
  const [login, providedHash] = parts;
  if (!login || !providedHash) return { valid: false };
  const expected = hashFor(login);
  if (providedHash.toLowerCase() === expected) {
    return { valid: true, login: normalize(login) };
  }
  return { valid: false };
}
