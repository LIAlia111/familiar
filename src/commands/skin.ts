import { loadState, saveState, getActivePet } from "../state/store.js";
import { getPet } from "../pets/registry.js";
import { select } from "@inquirer/prompts";
import { unlockedVariantIds, SKIN_UNLOCK_LEVELS } from "../state/unlocks.js";
import { AFDIAN_URL, SPONSOR_MAINTAINER } from "../sponsor/config.js";

export interface SkinOpts {
  sponsorUnlocked: boolean;
  variantArg?: string;
}

export async function runSkinCommand(opts: SkinOpts): Promise<void> {
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

  let variantId: string;

  if (opts.variantArg) {
    if (!pet.variants.find((v) => v.id === opts.variantArg)) {
      console.log(`✗ ${active.name} 没有 ${opts.variantArg} 这款。可选: ${pet.variants.map((v) => v.id).join(", ")}`);
      return;
    }
    variantId = opts.variantArg;
  } else {
    const choices = pet.variants.map((v, i) => {
      const isUnlocked = unlocked.has(v.id);
      const required = SKIN_UNLOCK_LEVELS[i] ?? 100;
      const tag = isUnlocked ? "" : `🔒 等级 ${required} 解锁 / 赞助跳过`;
      return {
        name: tag ? `${v.displayName}  ${tag}` : v.displayName,
        value: v.id,
        disabled: isUnlocked ? false : tag,
      };
    });
    variantId = await select({
      message: `Pick a skin for ${active.name}:`,
      choices,
      default: active.variantId ?? pet.defaultVariantId,
    });
  }

  if (!unlocked.has(variantId)) {
    console.log("\n✗ 这款皮肤还没解锁。");
    console.log("  · 升级到对应等级解锁");
    console.log(`  · 或赞助：https://github.com/sponsors/${SPONSOR_MAINTAINER}`);
    console.log(`    或国内：${AFDIAN_URL}\n`);
    return;
  }

  active.variantId = variantId;
  saveState(state);

  const v = pet.variants.find((x) => x.id === variantId);
  console.log(`\n✓ Skin changed to ${v?.displayName}.\n`);
}
