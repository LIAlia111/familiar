import type { Pet } from "../types.js";
import { octopusLargeSprite } from "./sprite.js";
import { octopusSmallSprite } from "./small.js";
import { octopusPersonality } from "./personality.js";
import { octopusVariants } from "./variants.js";

export const octopusPet: Pet = {
  species: "octopus",
  large: octopusLargeSprite,
  small: octopusSmallSprite,
  variants: octopusVariants,
  defaultVariantId: "magenta",
  personality: octopusPersonality,
};
