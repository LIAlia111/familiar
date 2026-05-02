import { renameSync, writeFileSync } from "node:fs";

// Atomic write: write to temp file, then rename. Crash-safe and avoids
// race conditions when two processes modify the same file.
export function atomicWrite(path: string, content: string, mode?: number): void {
  const tmp = `${path}.tmp.${process.pid}.${Date.now()}`;
  writeFileSync(tmp, content, mode ? { mode } : undefined);
  renameSync(tmp, path);
}
