import type { Pet } from "../types.js";
import { catLargeSprite } from "./sprite.js";
import { catSmallSprite } from "./small.js";
import { catPersonality } from "./personality.js";

export const catPet: Pet = {
  species: "cat",
  large: catLargeSprite,
  small: catSmallSprite,
  personality: catPersonality,
};
