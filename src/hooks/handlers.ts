import { readFileSync } from "node:fs";
import { loadState, saveState, getActivePet } from "../state/store.js";
import { getPet } from "../pets/registry.js";
import { speak } from "../brain/speak.js";
import { DefaultBackend } from "../memory/default.js";
import { decideTrigger, type HookEvent } from "./proactive.js";
import { parseSessionInput } from "../util/claude-code.js";

const DEFAULT_CHATTINESS = "normal" as const;

function readStdin(): string {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

export async function runHook(event: HookEvent): Promise<void> {
  const state = loadState();
  if (!state) return;
  const active = getActivePet(state);
  const pet = getPet(state.activeSpecies);
  if (!active || !pet) return;

  const session = parseSessionInput(readStdin());
  const trigger = decideTrigger(event, {
    lastInteractionAt: active.lastInteractionAt,
    chattiness: DEFAULT_CHATTINESS,
    now: new Date(),
  });
  if (!trigger) return;

  const backend = new DefaultBackend({ cwd: session.cwd });
  const ctx = await backend.fetchContext();

  const line = await speak({
    personality: pet.personality,
    templateKey: trigger,
    trigger: `hook:${event}`,
    petName: active.name,
    affection: active.affection,
    recentQuotes: active.recentQuotes,
    context: ctx,
    useApi: false,
  });

  console.log(`\n  ${active.name}: ${line}\n`);

  active.recentQuotes = [line, ...active.recentQuotes].slice(0, 10);
  active.lastInteractionAt = new Date().toISOString();
  saveState(state);
}
