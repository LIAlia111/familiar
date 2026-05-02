import { describe, it, expect } from "vitest";
import { applyDelta, decayForAbsence, affectionLabel, applyAction, todayKey } from "../../src/state/affection.js";
import type { PetEntry } from "../../src/state/types.js";

function mkPet(): PetEntry {
  return {
    name: "x",
    affection: 50,
    mood: "neutral",
    createdAt: "2026-01-01",
    lastInteractionAt: "2026-01-01",
    totalInteractions: 0,
    recentQuotes: [],
    cooldowns: {},
  };
}

describe("affection mechanics", () => {
  it("applies positive delta but caps at 100", () => {
    expect(applyDelta(95, 10)).toBe(100);
  });

  it("applies negative delta but floors at 0", () => {
    expect(applyDelta(5, -10)).toBe(0);
  });

  it("returns no decay for absence under 24h", () => {
    expect(decayForAbsence(23)).toBe(0);
  });

  it("returns -2 for 24h absence", () => {
    expect(decayForAbsence(24)).toBe(-2);
  });

  it("returns -10 for 7-day absence", () => {
    expect(decayForAbsence(168)).toBe(-10);
  });

  it("/pet gives +1 first time", () => {
    const p = mkPet();
    const now = new Date("2026-05-03T10:00:00Z");
    const r = applyAction(p, "pet", now);
    // 1 (pet base) + 2 (daily bonus, first action of the day)
    expect(r.delta).toBe(3);
    expect(p.affection).toBe(53);
  });

  it("/pet on cooldown gives 0 base (only daily bonus once)", () => {
    const p = mkPet();
    const now = new Date("2026-05-03T10:00:00Z");
    applyAction(p, "pet", now);
    const r2 = applyAction(p, "pet", new Date(now.getTime() + 60_000)); // 1 min later
    expect(r2.onCooldown).toBe(true);
    // No base reward (cooldown), no daily bonus (already given today)
    expect(r2.delta).toBe(0);
  });

  it("/pet after 30min cooldown gives base again", () => {
    const p = mkPet();
    const now = new Date("2026-05-03T10:00:00Z");
    applyAction(p, "pet", now);
    const r2 = applyAction(p, "pet", new Date(now.getTime() + 31 * 60_000));
    expect(r2.onCooldown).toBe(false);
    expect(r2.delta).toBe(1); // +1, no second daily bonus
  });

  it("/feed gives +3 with 1h cooldown", () => {
    const p = mkPet();
    const now = new Date("2026-05-03T10:00:00Z");
    const r = applyAction(p, "feed", now);
    // +3 (feed) + 2 (daily bonus)
    expect(r.delta).toBe(5);
    const r2 = applyAction(p, "feed", new Date(now.getTime() + 30 * 60_000));
    expect(r2.onCooldown).toBe(true);
  });

  it("daily bonus applies once per day across all actions", () => {
    const p = mkPet();
    const now = new Date("2026-05-03T10:00:00Z");
    const r1 = applyAction(p, "pet", now);
    expect(r1.dailyBonusApplied).toBe(true);
    const r2 = applyAction(p, "feed", now);
    expect(r2.dailyBonusApplied).toBe(false);
  });

  it("todayKey rolls over at local midnight", () => {
    expect(todayKey(new Date(2026, 4, 3, 23, 59))).toBe("2026-05-03");
    expect(todayKey(new Date(2026, 4, 4, 0, 1))).toBe("2026-05-04");
  });

  it("labels affection ranges in Chinese", () => {
    expect(affectionLabel(0)).toBe("陌生");
    expect(affectionLabel(30)).toBe("认识");
    expect(affectionLabel(50)).toBe("朋友");
    expect(affectionLabel(70)).toBe("亲密");
    expect(affectionLabel(90)).toBe("挚友");
    expect(affectionLabel(100)).toBe("灵魂伴侣");
  });
});
