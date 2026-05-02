import type { Pet } from "../types.js";
import { dragonLargeSprite } from "./sprite.js";
import { dragonSmallSprite } from "./small.js";
import { dragonPersonality } from "./personality.js";
import { dragonVariants } from "./variants.js";

export const dragonPet: Pet = {
  species: "dragon",
  large: dragonLargeSprite,
  small: dragonSmallSprite,
  variants: dragonVariants,
  defaultVariantId: "violet",
  personality: dragonPersonality,
};
