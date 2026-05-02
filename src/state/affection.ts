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
