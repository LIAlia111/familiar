import type { Pet } from "../types.js";
import { capybaraLargeSprite } from "./sprite.js";
import { capybaraSmallSprite } from "./small.js";
import { capybaraPersonality } from "./personality.js";

export const capybaraPet: Pet = {
  species: "capybara",
  large: capybaraLargeSprite,
  small: capybaraSmallSprite,
  personality: capybaraPersonality,
};
