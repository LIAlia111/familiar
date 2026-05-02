import type { Pet } from "../types.js";
import { catLargeSprite } from "./sprite.js";
import { catSmallSprite } from "./small.js";
import { catPersonality } from "./personality.js";
import { catVariants } from "./variants.js";

export const catPet: Pet = {
  species: "cat",
  large: catLargeSprite,
  small: catSmallSprite,
  variants: catVariants,
  defaultVariantId: "orange",
  personality: catPersonality,
};
