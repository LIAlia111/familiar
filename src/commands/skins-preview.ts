import { getPet } from "../pets/registry.js";
import { renderSprite } from "../render/halfblock.js";
import type { Species } from "../state/types.js";

export function runSkinsPreviewCommand(speciesArg?: string, variantArg?: string): void {
  const species = (speciesArg ?? "cat") as Species;
  const pet = getPet(species);
  if (!pet) {
    console.log(`Unknown pet: ${species}. Try: cat or capybara.`);
    return;
  }

  // If a variant id is given, show the big 32×32 version of just that one.
  if (variantArg) {
    const variant = pet.variants.find((v) => v.id === variantArg);
    if (!variant) {
      console.log(`Unknown variant: ${variantArg}.`);
      console.log(`Available: ${pet.variants.map((v) => v.id).join(", ")}`);
      return;
    }
    console.log(`\n  ✦ ${pet.personality.displayName} — ${variant.displayName}\n`);
    const frame = pet.large.frames[0];
    console.log(renderSprite({ pixels: frame.pixels, palette: variant.largePalette }));
    return;
  }

  // No variant given — small-icon gallery of all variants.
  console.log(`\n  ✦ ${pet.personality.displayName} — all skins\n`);
  for (const variant of pet.variants) {
    const tag = variant.tier === "sponsor" ? "🔒 sponsor" : "🆓 free";
    console.log(`  [${variant.id}] ${variant.displayName}  ${tag}`);
    console.log();
    const frame = pet.small.frames[0];
    console.log(renderSprite({ pixels: frame.pixels, palette: variant.smallPalette }));
  }
  console.log(`  Big version: familiar skins ${species} <variant-id>`);
  console.log(`  Pick one:    familiar skin\n`);
}
