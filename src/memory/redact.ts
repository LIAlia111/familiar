// Redacts likely-secrets before sending text to the Claude API.
// CLAUDE.md and memory/ files often contain API keys, tokens, hostnames.
// This is best-effort defense — no regex catches everything, but common
// patterns are blocked from leaving the user's machine.

const PATTERNS: Array<{ name: string; re: RegExp }> = [
  { name: "anthropic-key", re: /sk-ant-[A-Za-z0-9_-]{20,}/g },
  { name: "openai-key", re: /sk-[A-Za-z0-9_-]{20,}/g },
  { name: "github-token", re: /gh[pousr]_[A-Za-z0-9]{20,}/g },
  { name: "aws-key", re: /AKIA[0-9A-Z]{16}/g },
  { name: "bearer", re: /Bearer\s+[A-Za-z0-9._-]{20,}/g },
  { name: "url-credentials", re: /[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^\s/:@]+:[^\s/@]+@[^\s]+/g },
  { name: "private-key-block", re: /-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]+?-----END [A-Z ]+PRIVATE KEY-----/g },
  { name: "password-assignment", re: /\b(?:password|passwd|secret|token|api[_-]?key)\s*[:=]\s*["']?[A-Za-z0-9+/=_-]{12,}["']?/gi },
  { name: "telegram-chat-id", re: /chat[_-]?id\s*[:=]\s*\d{6,}/gi },
];

export function redact(text: string): string {
  let out = text;
  for (const { name, re } of PATTERNS) {
    out = out.replace(re, `[REDACTED:${name}]`);
  }
  return out;
}
