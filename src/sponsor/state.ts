import type { PetState } from "../state/types.js";
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
