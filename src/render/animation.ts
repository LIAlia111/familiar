import { renderSprite } from "./halfblock.js";
import type { AnimatedSprite } from "../pets/types.js";

export interface PlayOpts {
  sprite: AnimatedSprite;
  finalFrameIndex: number;
  cycles: number;
  frameDelayMs: number;
  out?: NodeJS.WriteStream;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function playAnimation(opts: PlayOpts): Promise<void> {
  const out = opts.out ?? process.stdout;
  const { sprite, cycles, frameDelayMs, finalFrameIndex } = opts;

  // Skip animation when stdout isn't a real terminal — cursor-up escapes
  // don't redraw and we'd spam the entire output buffer instead.
  const isTTY = "isTTY" in out && out.isTTY === true;
  if (!isTTY) {
    out.write(renderSprite(sprite.frames[finalFrameIndex]));
    return;
  }

  const linesPerFrame = Math.ceil(sprite.frames[0].pixels.length / 2);
  let firstDraw = true;

  for (let c = 0; c < cycles; c++) {
    for (let f = 0; f < sprite.frames.length; f++) {
      if (!firstDraw) {
        out.write(`\x1b[${linesPerFrame}A`);
        out.write(`\x1b[J`);
      }
      out.write(renderSprite(sprite.frames[f]));
      firstDraw = false;
      await sleep(frameDelayMs);
    }
  }

  if (!firstDraw) {
    out.write(`\x1b[${linesPerFrame}A`);
    out.write(`\x1b[J`);
  }
  out.write(renderSprite(sprite.frames[finalFrameIndex]));
}
