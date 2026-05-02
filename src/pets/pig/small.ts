import type { AnimatedSprite, Palette } from "../types.js";

const palette: Palette = { 1: [160, 60, 80], 2: [255, 175, 185], 3: [15, 15, 15] };
const _ = 0; const Op = 1, Pk = 2, Bl = 3;

const idle: number[][] = [
  [_, Op, Op, _, _, Op, Op, _],
  [Op, Pk, Pk, Op, Op, Pk, Pk, Op],
  [Op, Pk, Bl, Pk, Pk, Bl, Pk, Op],
  [Op, Pk, Pk, Pk, Pk, Pk, Pk, Op],
  [Op, Pk, Bl, Pk, Pk, Bl, Pk, Op],
  [Op, Pk, Pk, Pk, Pk, Pk, Pk, Op],
  [_, Op, Op, _, _, Op, Op, _],
  [_, _, _, _, _, _, _, _],
];

const blink = idle;

export const pigSmallSprite: AnimatedSprite = {
  frames: [
    { pixels: idle, palette },
    { pixels: blink, palette },
  ],
};
