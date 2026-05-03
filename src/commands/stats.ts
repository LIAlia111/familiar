import { loadState } from "../state/store.js";
import { getPet, listAll } from "../pets/registry.js";
import { affectionLabel } from "../state/affection.js";
import { SPECIES_ICON } from "../util/constants.js";
import {
  countMaxedPets,
  earnedSponsorSlots,
  hasUnclaimedSponsorSlot,
  unlockedVariantIds,
} from "../state/unlocks.js";
import { resolveVariant } from "../pets/variant-render.js";
import type { Species } from "../state/types.js";

function heartBar(affection: number): string {
  const filled = Math.min(5, Math.floor(affection / 20));
  return "♥".repeat(filled) + "♡".repeat(5 - filled);
}

function daysSince(iso: string): number {
  const d = (Date.now() - new Date(iso).getTime()) / 86_400_000;
  return Math.max(0, Math.floor(d));
}

export function runStatsCommand(opts: { sponsorUnlocked: boolean }): void {
  const state = loadState();
  if (!state) {
    console.log("familiar 还没装宠物 —— 运行：npx claude-familiar install");
    return;
  }

  console.log();

  for (const sp of listAll() as Species[]) {
    const pet = getPet(sp);
    if (!pet) continue;
    const entry = state.pets[sp];
    const icon = SPECIES_ICON[sp];
    const isUnlocked = state.unlockedSpecies.includes(sp);
    const isActive = sp === state.activeSpecies;

    if (!entry) {
      const tag = isUnlocked ? "未领养" : "🔒 未解锁";
      console.log(`  ${icon} ${pet.personality.displayName}  · ${tag}`);
      continue;
    }

    const variant = resolveVariant(pet, entry.variantId);
    const unlocked = unlockedVariantIds(pet, entry.affection, opts.sponsorUnlocked);
    const flag = isActive ? "★" : " ";
    console.log(
      `${flag} ${icon} ${entry.name} (${pet.personality.displayName} — ${variant.displayName})`,
    );
    console.log(
      `    亲密度  ${heartBar(entry.affection)}  ${entry.affection}/100 · ${affectionLabel(entry.affection)}`,
    );
    console.log(`    心情    ${entry.mood}`);
    console.log(`    互动    ${entry.totalInteractions} 次`);
    console.log(`    陪伴    ${daysSince(entry.createdAt)} 天`);
    console.log(`    皮肤    ${unlocked.size}/${pet.variants.length} 已解锁`);
    if (entry.recentQuotes[0]) {
      console.log(`    最近    "${entry.recentQuotes[0]}"`);
    }
    console.log();
  }

  // 全局进度
  const maxed = countMaxedPets(state);
  const earned = earnedSponsorSlots(state);
  const claimed = Math.max(0, state.unlockedSpecies.length - 2);
  const unclaimed = hasUnclaimedSponsorSlot(state);

  console.log("📊 进度");
  console.log(`  满级宠物：${maxed} 只`);
  console.log(`  赞助槽：已赚 ${earned} · 已领 ${claimed}${unclaimed ? "  ✨ 可领新宠物 → familiar claim" : ""}`);
  if (opts.sponsorUnlocked) {
    console.log("  💎 赞助身份已激活（全部宠物 + 全部皮肤）");
  } else if (state.sponsorCheck?.viewerLogin) {
    const ageDays = daysSince(new Date(state.sponsorCheck.checkedAt).toISOString());
    console.log(`  上次验证：${ageDays} 天前 (${state.sponsorCheck.viewerLogin})`);
  }
  console.log();
}
