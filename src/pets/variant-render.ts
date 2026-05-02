import type { AnimatedSprite, ColorVariant, Pet } from "./types.js";

export function resolveVariant(pet: Pet, variantId?: string): ColorVariant {
  if (variantId) {
    const v = pet.variants.find((x) => x.id === variantId);
    if (v) return v;
  }
  const def = pet.variants.find((x) => x.id === pet.defaultVariantId);
  if (def) return def;
  // Last-resort fallback: first variant.
  return pet.variants[0];
}

// Returns a copy of the AnimatedSprite with the given palette applied to all frames.
export function spriteWithPalette(sprite: AnimatedSprite, palette: ColorVariant["largePalette"]): AnimatedSprite {
  return {
    frames: sprite.frames.map((f) => ({ pixels: f.pixels, palette })),
  };
}
