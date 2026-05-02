import { loadState, saveState, getActivePet } from "../state/store.js";
import { getPet } from "../pets/registry.js";
import { select } from "@inquirer/prompts";
import { unlockedVariantIds } from "../state/unlocks.js";

export async function runSkinCommand(opts: { sponsorUnlocked: boolean }): Promise<void> {
  const state = loadState();
  if (!state) {
    console.log("familiar 还没装宠物 —— 运行：npx familiar install");
    return;
  }
  const active = getActivePet(state);
  const pet = getPet(state.activeSpecies);
  if (!active || !pet) {
    console.log("active 宠物丢了。");
    return;
  }

  const unlocked = unlockedVariantIds(pet, active.affection, opts.sponsorUnlocked);

  const choices = pet.variants.map((v, i) => {
    const isUnlocked = unlocked.has(v.id);
    const requiredLvl = SKIN_UNLOCK_LEVELS[i];
    const tag = isUnlocked
      ? ""
      : opts.sponsorUnlocked
      ? `🔒 等级 ${requiredLvl} 解锁`
      : `🔒 等级 ${requiredLvl} 解锁 / 赞助跳过`;
    return {
      name: tag ? `${v.displayName}  ${tag}` : v.displayName,
      value: v.id,
      disabled: isUnlocked ? false : tag,
    };
  });

  const variantId = await select({
    message: `Pick a skin for ${active.name}:`,
    choices,
    default: active.variantId ?? pet.defaultVariantId,
  });

  active.variantId = variantId;
  saveState(state);

  const v = pet.variants.find((x) => x.id === variantId);
  console.log(`\n✓ Skin changed to ${v?.displayName}.`);
}

// Keep in sync with src/state/unlocks.ts
const SKIN_UNLOCK_LEVELS = [0, 40, 60, 80, 100];
