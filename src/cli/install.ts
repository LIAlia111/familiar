import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { input, select } from "@inquirer/prompts";
import { isClaudeCodeInstalled } from "../util/claude-code.js";
import { defaultState, saveState } from "../state/store.js";
import { listAvailable, getPet } from "../pets/registry.js";
import { familiarHome } from "../util/paths.js";

const settingsPath = (): string => join(homedir(), ".claude", "settings.json");

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
  const name = await input({ message: "Name your pet:", default: starterPet.personality.defaultName });

  saveState(defaultState({ species, name }));

  if (!existsSync(familiarHome())) mkdirSync(familiarHome(), { recursive: true });
  const claudeDir = join(homedir(), ".claude");
  if (!existsSync(claudeDir)) mkdirSync(claudeDir, { recursive: true });

  const settings = existsSync(settingsPath())
    ? JSON.parse(readFileSync(settingsPath(), "utf8"))
    : {};
  settings.statusLine = {
    type: "command",
    command: "familiar-statusline",
  };

  // Register hooks for proactive speech
  settings.hooks = settings.hooks ?? {};
  settings.hooks.SessionStart = settings.hooks.SessionStart ?? [];
  settings.hooks.Stop = settings.hooks.Stop ?? [];

  const sessionHook = { hooks: [{ type: "command", command: "familiar hook SessionStart" }] };
  const stopHook = { hooks: [{ type: "command", command: "familiar hook Stop" }] };

  if (!JSON.stringify(settings.hooks.SessionStart).includes("familiar hook SessionStart")) {
    settings.hooks.SessionStart.push(sessionHook);
  }
  if (!JSON.stringify(settings.hooks.Stop).includes("familiar hook Stop")) {
    settings.hooks.Stop.push(stopHook);
  }

  writeFileSync(settingsPath(), JSON.stringify(settings, null, 2));

  console.log(`\n✓ ${name} is ready! Restart Claude Code to see them in your statusline.`);
  console.log("  Try /pet to chat with them anytime.\n");
}
