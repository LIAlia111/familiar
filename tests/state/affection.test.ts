import { describe, it, expect } from "vitest";
import { applyDelta, decayForAbsence, affectionLabel } from "../../src/state/affection.js";

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

  it("labels affection ranges in Chinese", () => {
    expect(affectionLabel(0)).toBe("陌生");
    expect(affectionLabel(30)).toBe("认识");
    expect(affectionLabel(50)).toBe("朋友");
    expect(affectionLabel(70)).toBe("亲密");
    expect(affectionLabel(90)).toBe("挚友");
    expect(affectionLabel(100)).toBe("灵魂伴侣");
  });
});
