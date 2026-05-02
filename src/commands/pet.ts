import { loadState, saveState } from "../state/store.js";
import { getPet } from "../pets/registry.js";
import { applyDelta } from "../state/affection.js";
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
  const pet = getPet(state.species);
  if (!pet) {
    console.log("宠物丢了，请运行：npx familiar reset");
    return;
  }

  const variant = resolveVariant(pet, state.variantId);
  const colored = spriteWithPalette(pet.large, variant.largePalette);

  const finalFrameIndex = pet.personality.moodToFrame[state.mood];
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
    petName: state.name,
    affection: state.affection,
    recentQuotes: state.recentQuotes,
    context: ctx,
    useApi: opts.useApi ?? true,
  });

  console.log(`\n  ${state.name}: ${line}`);
  console.log(`\n  亲密度 ${state.affection}/100 · ${affectionLabel(state.affection)} · 款式 ${variant.displayName}`);

  state.affection = applyDelta(state.affection, 1);
  state.totalInteractions += 1;
  state.lastInteractionAt = new Date().toISOString();
  state.recentQuotes = [line, ...state.recentQuotes].slice(0, 10);
  saveState(state);
}
