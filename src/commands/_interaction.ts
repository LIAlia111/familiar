import { loadState, saveState, getActivePet } from "../state/store.js";
import { getPet } from "../pets/registry.js";
import { applyAction, type ActionKind } from "../state/affection.js";
import { affectionLabel } from "../state/affection.js";
import { speak } from "../brain/speak.js";
import { DefaultBackend } from "../memory/default.js";
import { resolveVariant, spriteWithPalette } from "../pets/variant-render.js";
import { playAnimation } from "../render/animation.js";
import type { TemplateKey } from "../pets/types.js";

export interface InteractionOpts {
  cwd: string;
  kind: ActionKind;
  templateKey: TemplateKey;
  trigger: string;
  showAnimation: boolean;
  useApi?: boolean;
}

// Shared engine for /pet, /feed, /play. Centralizes the load → apply → speak
// → save dance so each command file only declares what's different.
export async function runInteraction(opts: InteractionOpts): Promise<void> {
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

  if (opts.showAnimation) {
    const variant = resolveVariant(pet, active.variantId);
    const colored = spriteWithPalette(pet.large, variant.largePalette);
    const finalFrame = pet.personality.moodToFrame[active.mood];
    await playAnimation({ sprite: colored, finalFrameIndex: finalFrame, cycles: 2, frameDelayMs: 250 });
  }

  const ctx = await new DefaultBackend({ cwd: opts.cwd }).fetchContext();

  const line = await speak({
    personality: pet.personality,
    templateKey: opts.templateKey,
    trigger: opts.trigger,
    petName: active.name,
    affection: active.affection,
    recentQuotes: active.recentQuotes,
    context: ctx,
    useApi: opts.useApi ?? true,
  });

  console.log(`\n  ${active.name}: ${line}`);

  const result = applyAction(active, opts.kind);
  if (result.onCooldown && !result.dailyBonusApplied) {
    console.log(`  （${cooldownMessage(opts.kind)}，等会再来吧 ♡）`);
  } else if (result.delta > 0) {
    console.log(`  ${result.reason}`);
  }
  console.log(`  亲密度 ${active.affection}/100 · ${affectionLabel(active.affection)}`);

  active.totalInteractions += 1;
  active.lastInteractionAt = new Date().toISOString();
  active.recentQuotes = [line, ...active.recentQuotes].slice(0, 10);
  saveState(state);
}

function cooldownMessage(kind: ActionKind): string {
  switch (kind) {
    case "pet":
      return "刚摸过了";
    case "feed":
      return "刚喂过了";
    case "play":
      return "刚玩过了";
  }
}
