import type { Species } from "../state/types.js";

export const DEFAULT_MODEL = "claude-sonnet-4-6";

export const SPECIES_ICON: Record<Species, string> = {
  cat: "🐱",
  capybara: "🦫",
  dragon: "🐉",
  ghost: "👻",
  octopus: "🦑",
  panda: "🐼",
  pig: "🐷",
};
