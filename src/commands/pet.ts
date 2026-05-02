import { loadState, saveState, getActivePet } from "../state/store.js";
import { getPet } from "../pets/registry.js";
import { applyAction } from "../state/affection.js";
import { speak } from "../brain/speak.js";
import { DefaultBackend } from "../memory/default.js";
import { affectionLabel } from "../state/affection.js";
import { playAnimation } from "../render/animation.js";
import { resolveVariant, spriteWithPalette } from "../pets/variant-render.js";

export async function runPetCommand(opts: { cwd: string; useApi?: boolean }): Promise<void> {
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

  const variant = resolveVariant(pet, active.variantId);
  const colored = spriteWithPalette(pet.large, variant.largePalette);

  const finalFrameIndex = pet.personality.moodToFrame[active.mood];
  await playAnimation({
    sprite: colored,
    finalFrameIndex,
    cycles: 2,
    frameDelayMs: 250,
  });

  const memoryBackend = new DefaultBackend({ cwd: opts.cwd });
  const ctx = await memoryBackend.fetchContext();

  const line = await speak({
    personality: pet.personality,
    templateKey: "ambient_random",
    trigger: "user invoked /pet",
    petName: active.name,
    affection: active.affection,
    recentQuotes: active.recentQuotes,
    context: ctx,
    useApi: opts.useApi ?? true,
  });

  console.log(`\n  ${active.name}: ${line}`);
  console.log(`\n  亲密度 ${active.affection}/100 · ${affectionLabel(active.affection)} · 款式 ${variant.displayName}`);

  const result = applyAction(active, "pet");
  if (result.onCooldown && !result.dailyBonusApplied) {
    console.log("  （刚摸过了，等会再来吧 ♡）");
  } else if (result.delta > 0) {
    console.log(`  ${result.reason}`);
  }
  active.totalInteractions += 1;
  active.lastInteractionAt = new Date().toISOString();
  active.recentQuotes = [line, ...active.recentQuotes].slice(0, 10);
  saveState(state);
}
