import { loadState, saveState } from "../state/store.js";
import { getPet } from "../pets/registry.js";
import { select } from "@inquirer/prompts";

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

  state.activeSpecies = sp;
  saveState(state);
  console.log(`\n✓ Active pet: ${getPet(sp)?.personality.displayName}\n`);
}
