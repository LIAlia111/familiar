import { getPet } from "../pets/registry.js";
import { renderSprite } from "../render/halfblock.js";
import type { Species } from "../state/types.js";

export function runSkinsPreviewCommand(speciesArg?: string): void {
  const species = (speciesArg ?? "cat") as Species;
  const pet = getPet(species);
  if (!pet) {
    console.log(`Unknown pet: ${species}. Try: cat or capybara.`);
    return;
  }

  console.log(`\n  ✦ ${pet.personality.displayName} — all skins\n`);

  for (const variant of pet.variants) {
    const tag = variant.tier === "sponsor" ? "🔒 sponsor" : "🆓 free";
    console.log(`  [${variant.id}] ${variant.displayName}  ${tag}`);
    console.log();
    const frame = pet.large.frames[0];
    console.log(renderSprite({ pixels: frame.pixels, palette: variant.largePalette }));
  }
}
