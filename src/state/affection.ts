import type { PetEntry } from "./types.js";

const HOUR = 60 * 60 * 1000;
const HALF_HOUR = 30 * 60 * 1000;

export const COOLDOWNS = {
  petMs: HALF_HOUR,
  feedMs: HOUR,
  playMs: HALF_HOUR,
} as const;

export const REWARDS = {
  pet: 1,
  feed: 3,
  play: 2,
  longSessionPerHour: 5,
  dailyBonus: 2,
} as const;

export function applyDelta(current: number, delta: number): number {
  return Math.max(0, Math.min(100, current + delta));
}

export function decayForAbsence(hours: number): number {
  if (hours < 24) return 0;
  if (hours < 168) return -2;
  return -10;
}

export function affectionLabel(value: number): string {
  if (value <= 20) return "陌生";
  if (value <= 40) return "认识";
  if (value <= 60) return "朋友";
  if (value <= 80) return "亲密";
  if (value <= 95) return "挚友";
  return "灵魂伴侣";
}

// Returns the YYYY-MM-DD string for "today" in the user's local timezone.
export function todayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export type ActionKind = "pet" | "feed" | "play";

export interface ActionResult {
  delta: number;
  reason: string;
  onCooldown: boolean;
  dailyBonusApplied: boolean;
}

// Computes the affection delta for an action and updates the pet entry's
// cooldowns + daily-bonus marker. Returns the resulting state for messaging.
//
// Pure-ish: mutates `pet` (caller must persist) but does not write to disk.
export function applyAction(
  pet: PetEntry,
  kind: ActionKind,
  now: Date = new Date(),
): ActionResult {
  const nowMs = now.getTime();
  const cooldownField = `${kind}UntilMs` as const;
  const onCooldown = (pet.cooldowns[cooldownField] ?? 0) > nowMs;

  let base = 0;
  if (!onCooldown) {
    if (kind === "pet") base = REWARDS.pet;
    else if (kind === "feed") base = REWARDS.feed;
    else if (kind === "play") base = REWARDS.play;
  }

  let dailyBonus = 0;
  let dailyBonusApplied = false;
  const today = todayKey(now);
  if (pet.cooldowns.dailyBonusDate !== today) {
    dailyBonus = REWARDS.dailyBonus;
    dailyBonusApplied = true;
    pet.cooldowns.dailyBonusDate = today;
  }

  const totalDelta = base + dailyBonus;
  pet.affection = applyDelta(pet.affection, totalDelta);

  if (!onCooldown) {
    if (kind === "pet") pet.cooldowns.petUntilMs = nowMs + COOLDOWNS.petMs;
    else if (kind === "feed") pet.cooldowns.feedUntilMs = nowMs + COOLDOWNS.feedMs;
    else if (kind === "play") pet.cooldowns.playUntilMs = nowMs + COOLDOWNS.playMs;
  }

  let reason: string;
  if (onCooldown) {
    reason = `${kind} on cooldown — no base reward`;
  } else {
    reason = `+${base} (${kind})`;
  }
  if (dailyBonusApplied) reason += ` +${dailyBonus} (daily bonus)`;

  return { delta: totalDelta, reason, onCooldown, dailyBonusApplied };
}
