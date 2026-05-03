import type { PetState } from "../state/types.js";
import { listAll } from "../pets/registry.js";
import { SPONSOR_CACHE_MS } from "./config.js";

// Returns true if the user has a verified-sponsor cache that is still fresh.
// Falls back to FAMILIAR_SPONSOR=1 for local dev/testing.
export function isSponsorActive(state: PetState | null): boolean {
  if (process.env.FAMILIAR_SPONSOR === "1") return true;
  if (!state?.sponsorCheck) return false;
  if (!state.sponsorCheck.isSponsor) return false;
  const age = Date.now() - state.sponsorCheck.checkedAt;
  return age < SPONSOR_CACHE_MS;
}

// Mark a sponsor as verified — used by both the GitHub OAuth path
// (commands/activate.ts) and the Afdian code path (commands/activate-code.ts)
// so the two flows produce identical state.
export function markSponsor(
  state: PetState,
  opts: { viewerLogin: string | null; maintainer: string },
): void {
  state.sponsorCheck = {
    isSponsor: true,
    checkedAt: Date.now(),
    viewerLogin: opts.viewerLogin,
    maintainer: opts.maintainer,
  };
  const owned = new Set(state.unlockedSpecies);
  for (const sp of listAll()) owned.add(sp);
  state.unlockedSpecies = [...owned];
}
