import { loadState, saveState } from "../state/store.js";
import { getPet } from "../pets/registry.js";
import { select } from "@inquirer/prompts";

export async function runSkinCommand(opts: { sponsorUnlocked: boolean }): Promise<void> {
  const state = loadState();
  if (!state) {
    console.log("familiar 还没装宠物 —— 运行：npx familiar install");
    return;
  }
  const pet = getPet(state.species);
  if (!pet) {
    console.log("宠物丢了。");
    return;
  }

  const choices = pet.variants.map((v) => {
    const locked = v.tier === "sponsor" && !opts.sponsorUnlocked;
    return {
      name: locked ? `${v.displayName}  🔒 (sponsor only)` : v.displayName,
      value: v.id,
      disabled: locked ? "需要赞助解锁" : false,
    };
  });

  const variantId = await select({
    message: `Pick a skin for ${state.name}:`,
    choices,
    default: state.variantId ?? pet.defaultVariantId,
  });

  state.variantId = variantId;
  saveState(state);

  const v = pet.variants.find((x) => x.id === variantId);
  console.log(`\n✓ Skin changed to ${v?.displayName}.`);
  console.log("  Run /pet or check the statusline to see them.\n");
}
