import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { confirm, input, select } from "@inquirer/prompts";
import { isClaudeCodeInstalled } from "../util/claude-code.js";
import { defaultState, saveState } from "../state/store.js";
import { listAvailable, getPet } from "../pets/registry.js";
import { familiarHome } from "../util/paths.js";
import { atomicWrite } from "../util/safe-write.js";

const settingsPath = (): string => join(homedir(), ".claude", "settings.json");

interface HookCmd {
  type?: string;
  command?: string;
}
interface HookEntry {
  hooks?: HookCmd[];
}

const FAMILIAR_STATUSLINE_CMD = "familiar-statusline";
const FAMILIAR_HOOK_PREFIX = "familiar hook ";

function hasFamiliarCommand(arr: HookEntry[], cmd: string): boolean {
  return arr.some((e) => e.hooks?.some((h: HookCmd) => h.command === cmd));
}

function loadSettings(): Record<string, unknown> {
  if (!existsSync(settingsPath())) return {};
  try {
    return JSON.parse(readFileSync(settingsPath(), "utf8"));
  } catch (e) {
    throw new Error(
      `Could not parse ~/.claude/settings.json (${(e as Error).message}). ` +
      "Fix the JSON syntax and re-run familiar install.",
    );
  }
}

export async function runInstall(): Promise<void> {
  console.log("\n✦ familiar — pixel pet for Claude Code\n");

  if (!isClaudeCodeInstalled()) {
    console.log("✗ Claude Code CLI not found.");
    console.log("  Install Claude Code first: https://docs.anthropic.com/claude/claude-code");
    process.exit(1);
  }

  const species = await select({
    message: "Pick your starter pet:",
    choices: listAvailable().map((s) => {
      const p = getPet(s);
      if (!p) throw new Error(`Pet ${s} not found in registry`);
      return { name: `${p.personality.displayName} (${p.personality.defaultName})`, value: s };
    }),
  });

  const starterPet = getPet(species);
  if (!starterPet) throw new Error(`Pet ${species} missing`);
  const name = await input({
    message: "Name your pet:",
    default: starterPet.personality.defaultName,
  });

  saveState(defaultState({ species, name }));

  if (!existsSync(familiarHome())) mkdirSync(familiarHome(), { recursive: true, mode: 0o700 });
  const claudeDir = join(homedir(), ".claude");
  if (!existsSync(claudeDir)) mkdirSync(claudeDir, { recursive: true });

  const settings = loadSettings() as Record<string, unknown> & {
    statusLine?: { type?: string; command?: string };
    hooks?: { SessionStart?: HookEntry[]; Stop?: HookEntry[] };
  };

  // Warn if another tool already owns statusLine.
  const existingStatusLine = settings.statusLine?.command;
  if (existingStatusLine && existingStatusLine !== FAMILIAR_STATUSLINE_CMD) {
    console.log(`\n⚠ ~/.claude/settings.json already has a statusLine: ${existingStatusLine}`);
    const overwrite = await confirm({
      message: "Overwrite it with familiar?",
      default: false,
    });
    if (!overwrite) {
      console.log("✗ Skipped statusLine setup. Pet state saved but not visible in Claude Code.");
      return;
    }
  }
  settings.statusLine = { type: "command", command: FAMILIAR_STATUSLINE_CMD };

  settings.hooks = settings.hooks ?? {};
  settings.hooks.SessionStart = settings.hooks.SessionStart ?? [];
  settings.hooks.Stop = settings.hooks.Stop ?? [];

  if (!hasFamiliarCommand(settings.hooks.SessionStart, `${FAMILIAR_HOOK_PREFIX}SessionStart`)) {
    settings.hooks.SessionStart.push({
      hooks: [{ type: "command", command: `${FAMILIAR_HOOK_PREFIX}SessionStart` }],
    });
  }
  if (!hasFamiliarCommand(settings.hooks.Stop, `${FAMILIAR_HOOK_PREFIX}Stop`)) {
    settings.hooks.Stop.push({
      hooks: [{ type: "command", command: `${FAMILIAR_HOOK_PREFIX}Stop` }],
    });
  }

  atomicWrite(settingsPath(), JSON.stringify(settings, null, 2));

  console.log(`\n✓ ${name} is ready! Restart Claude Code to see them in your statusline.`);
  console.log("  Try /pet to chat with them anytime.\n");
}
