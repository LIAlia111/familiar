import type { Pet } from "./types.js";
import type { Species } from "../state/types.js";
import { catPet } from "./cat/index.js";
import { capybaraPet } from "./capybara/index.js";

const FREE: Pet[] = [catPet, capybaraPet];

export function getPet(species: Species): Pet | undefined {
  return FREE.find((p) => p.species === species);
}

export function listAvailable(): Species[] {
  return FREE.map((p) => p.species);
}
