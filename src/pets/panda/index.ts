import type { Pet } from "../types.js";
import { pandaLargeSprite } from "./sprite.js";
import { pandaSmallSprite } from "./small.js";
import { pandaPersonality } from "./personality.js";
import { pandaVariants } from "./variants.js";

export const pandaPet: Pet = {
  species: "panda",
  large: pandaLargeSprite,
  small: pandaSmallSprite,
  variants: pandaVariants,
  defaultVariantId: "classic",
  personality: pandaPersonality,
};
