import type { AnimatedSprite } from "../pets/types.js";

export function pickFrameIndex(sprite: AnimatedSprite, now: Date = new Date()): number {
  const seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  return seconds % sprite.frames.length;
}
