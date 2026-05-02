import type { Pet } from "../types.js";
import { ghostLargeSprite } from "./sprite.js";
import { ghostSmallSprite } from "./small.js";
import { ghostPersonality } from "./personality.js";
import { ghostVariants } from "./variants.js";

export const ghostPet: Pet = {
  species: "ghost",
  large: ghostLargeSprite,
  small: ghostSmallSprite,
  variants: ghostVariants,
  defaultVariantId: "blue",
  personality: ghostPersonality,
};
