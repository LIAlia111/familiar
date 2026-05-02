import type { Pet } from "../types.js";
import { pigLargeSprite } from "./sprite.js";
import { pigSmallSprite } from "./small.js";
import { pigPersonality } from "./personality.js";
import { pigVariants } from "./variants.js";

export const pigPet: Pet = {
  species: "pig",
  large: pigLargeSprite,
  small: pigSmallSprite,
  variants: pigVariants,
  defaultVariantId: "pink",
  personality: pigPersonality,
};
