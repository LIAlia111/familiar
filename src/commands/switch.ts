import { loadState, saveState, newPetEntry } from "../state/store.js";
import { getPet } from "../pets/registry.js";
import { input, select } from "@inquirer/prompts";

export async function runSwitchCommand(): Promise<void> {
  const state = loadState();
  if (!state) {
    console.log("familiar 还没装宠物 —— 运行：npx familiar install");
    return;
  }

  const choices = state.unlockedSpecies.map((sp) => {
    const pet = getPet(sp);
    const entry = state.pets[sp];
    const name = entry?.name ?? pet?.personality.defaultName ?? sp;
    const label = entry
      ? `${pet?.personality.displayName} (${name}) · 亲密度 ${entry.affection}`
      : `${pet?.personality.displayName} (${name}) · 未领养`;
    return {
      name: sp === state.activeSpecies ? `★ ${label}  (当前)` : label,
      value: sp,
    };
  });

  const sp = await select({
    message: "Switch active pet to:",
    choices,
    default: state.activeSpecies,
  });

  // Adopt unowned species on first switch — prevents the "active pet missing" dead end.
  if (!state.pets[sp]) {
    const pet = getPet(sp);
    const defaultName = pet?.personality.defaultName ?? sp;
    const name = await input({ message: `给 ${pet?.personality.displayName} 起名:`, default: defaultName });
    state.pets[sp] = newPetEntry({ name: name.trim() || defaultName });
  }

  state.activeSpecies = sp;
  saveState(state);
  console.log(`\n✓ Active pet: ${getPet(sp)?.personality.displayName}\n`);
}
