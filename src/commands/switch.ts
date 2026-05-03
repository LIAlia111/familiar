import { loadState, saveState, newPetEntry } from "../state/store.js";
import { getPet } from "../pets/registry.js";
import { input, select } from "@inquirer/prompts";
import type { Species } from "../state/types.js";

export interface SwitchOpts {
  // CLI arg: skip interactive picker if a valid species is given.
  // Useful on mobile where arrow-key input doesn't work.
  speciesArg?: string;
  nameArg?: string;
}

export async function runSwitchCommand(opts: SwitchOpts = {}): Promise<void> {
  const state = loadState();
  if (!state) {
    console.log("familiar 还没装宠物 —— 运行：npx familiar install");
    return;
  }

  let sp: Species;

  if (opts.speciesArg) {
    if (!state.unlockedSpecies.includes(opts.speciesArg as Species)) {
      console.log(`✗ ${opts.speciesArg} 还没解锁。已解锁: ${state.unlockedSpecies.join(", ")}`);
      return;
    }
    sp = opts.speciesArg as Species;
  } else {
    const choices = state.unlockedSpecies.map((s) => {
      const pet = getPet(s);
      const entry = state.pets[s];
      const name = entry?.name ?? pet?.personality.defaultName ?? s;
      const label = entry
        ? `${pet?.personality.displayName} (${name}) · 亲密度 ${entry.affection}`
        : `${pet?.personality.displayName} (${name}) · 未领养`;
      return {
        name: s === state.activeSpecies ? `★ ${label}  (当前)` : label,
        value: s,
      };
    });
    sp = await select({
      message: "Switch active pet to:",
      choices,
      default: state.activeSpecies,
    });
  }

  // Adopt unowned species on first switch.
  if (!state.pets[sp]) {
    const pet = getPet(sp);
    const defaultName = pet?.personality.defaultName ?? sp;
    let name: string;
    if (opts.nameArg !== undefined) {
      name = opts.nameArg.trim() || defaultName;
    } else {
      name = (
        await input({ message: `给 ${pet?.personality.displayName} 起名:`, default: defaultName })
      ).trim() || defaultName;
    }
    state.pets[sp] = newPetEntry({ name });
  }

  state.activeSpecies = sp;
  saveState(state);
  console.log(`\n✓ Active pet: ${getPet(sp)?.personality.displayName}\n`);
}
