import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { confirm } from "@inquirer/prompts";
import { atomicWrite } from "../util/safe-write.js";

const settingsPath = (): string => join(homedir(), ".claude", "settings.json");

interface HookEntry {
  hooks?: Array<{ command?: string }>;
}

function hasFamiliarCommand(entry: HookEntry, cmd: string): boolean {
  return entry.hooks?.some((h) => h.command === cmd) ?? false;
}

export async function runUninstall(): Promise<void> {
  if (!existsSync(settingsPath())) {
    console.log("(no Claude Code settings to clean up)");
    return;
  }

  let settings: Record<string, unknown> & {
    statusLine?: { command?: string };
    hooks?: { SessionStart?: HookEntry[]; Stop?: HookEntry[] };
  };
  try {
    settings = JSON.parse(readFileSync(settingsPath(), "utf8"));
  } catch (e) {
    console.log(
      `⚠ Could not parse ~/.claude/settings.json (${(e as Error).message}).`,
    );
    console.log("  Manually remove `statusLine` and `hooks.SessionStart/Stop` familiar entries.");
    return;
  }

  if (settings.statusLine?.command === "familiar-statusline") {
    delete settings.statusLine;
  }

  if (settings.hooks?.SessionStart) {
    settings.hooks.SessionStart = settings.hooks.SessionStart.filter(
      (e) => !hasFamiliarCommand(e, "familiar hook SessionStart"),
    );
    if (settings.hooks.SessionStart.length === 0) delete settings.hooks.SessionStart;
  }
  if (settings.hooks?.Stop) {
    settings.hooks.Stop = settings.hooks.Stop.filter(
      (e) => !hasFamiliarCommand(e, "familiar hook Stop"),
    );
    if (settings.hooks.Stop.length === 0) delete settings.hooks.Stop;
  }
  if (settings.hooks && Object.keys(settings.hooks).length === 0) delete settings.hooks;

  atomicWrite(settingsPath(), JSON.stringify(settings, null, 2));
  console.log("✓ Removed familiar entries from Claude Code settings.");

  const wipe = await confirm({
    message: "Also delete pet state at ~/.familiar/?",
    default: false,
  });
  if (wipe) {
    console.log("(state file preserved — delete manually if needed)");
  }
  console.log("\nGoodbye 🦫\n");
}
