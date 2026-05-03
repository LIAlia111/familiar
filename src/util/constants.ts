import type { Species } from "../state/types.js";

export const DEFAULT_MODEL = "claude-sonnet-4-6";

// Statusline icons — chosen for max font compatibility (Unicode 6.0 / 2010 era).
// Newer codepoints like 🦫 (U+1F9AB / 2018) and 🦑 (U+1F991 / 2016) render as
// "?" on older terminal fonts, so we substitute close matches.
export const SPECIES_ICON: Record<Species, string> = {
  cat: "🐱",
  capybara: "🐮", // displays as Cow (sprite was redesigned with horns); internal id kept as "capybara"
  dragon: "🐉",
  ghost: "👻",
  octopus: "🐙", // proper octopus (was 🦑 squid — also more accurate)
  panda: "🐼",
  pig: "🐷",
};
