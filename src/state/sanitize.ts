import type { PetState, Species } from "./types.js";

const KNOWN_SPECIES: Species[] = [
  "cat",
  "capybara",
  "dragon",
  "ghost",
  "octopus",
  "panda",
  "pig",
];

const MAX_RECENT_QUOTES = 50;
const MAX_AFFECTION = 100;
const MIN_AFFECTION = 0;
const MAX_COOLDOWN_FUTURE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Hardens a freshly-loaded state.json against tampering and corruption.
// Mutates in place and returns the same object.
export function sanitizeState(state: PetState): PetState {
  const now = Date.now();

  // unlockedSpecies: drop unknown species, dedupe, ensure starter pair
  const validUnlocked = (state.unlockedSpecies ?? []).filter((s): s is Species =>
    KNOWN_SPECIES.includes(s as Species),
  );
  state.unlockedSpecies = Array.from(new Set(["cat", "capybara", ...validUnlocked])) as Species[];

  // pets: clamp affection, bound recentQuotes, sanitize cooldowns
  for (const sp of Object.keys(state.pets)) {
    if (!KNOWN_SPECIES.includes(sp as Species)) {
      delete state.pets[sp as Species];
      continue;
    }
    const entry = state.pets[sp as Species];
    if (!entry) continue;

    if (typeof entry.affection !== "number" || !Number.isFinite(entry.affection)) {
      entry.affection = MIN_AFFECTION;
    }
    entry.affection = Math.max(MIN_AFFECTION, Math.min(MAX_AFFECTION, entry.affection));

    if (!Array.isArray(entry.recentQuotes)) entry.recentQuotes = [];
    if (entry.recentQuotes.length > MAX_RECENT_QUOTES) {
      entry.recentQuotes = entry.recentQuotes.slice(0, MAX_RECENT_QUOTES);
    }

    entry.cooldowns = entry.cooldowns ?? {};
    for (const key of ["petUntilMs", "feedUntilMs", "playUntilMs"] as const) {
      const v = entry.cooldowns[key];
      if (typeof v !== "number" || !Number.isFinite(v) || v > now + MAX_COOLDOWN_FUTURE_MS) {
        entry.cooldowns[key] = undefined;
      }
    }
  }

  // sponsorCheck: drop if checkedAt is in the future or > 1 year old
  if (state.sponsorCheck) {
    const sc = state.sponsorCheck;
    if (
      typeof sc.checkedAt !== "number" ||
      sc.checkedAt > now ||
      now - sc.checkedAt > 365 * 24 * 60 * 60 * 1000
    ) {
      state.sponsorCheck = undefined;
    }
  }

  // activeSpecies must point at an existing entry; fall back to first owned pet
  if (!state.pets[state.activeSpecies]) {
    const owned = Object.keys(state.pets) as Species[];
    state.activeSpecies = owned[0] ?? "cat";
  }

  return state;
}
