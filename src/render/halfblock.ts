import type { Sprite, RGB } from "../pets/types.js";

const RESET = "\x1b[0m";
const fg = ([r, g, b]: RGB) => `\x1b[38;2;${r};${g};${b}m`;
const bg = ([r, g, b]: RGB) => `\x1b[48;2;${r};${g};${b}m`;

export function renderSprite(sprite: Sprite): string {
  const { pixels, palette } = sprite;
  const rows = pixels.length;
  let out = "";

  for (let y = 0; y < rows - 1; y += 2) {
    const top = pixels[y];
    const bot = pixels[y + 1];
    for (let x = 0; x < top.length; x++) {
      const t = top[x];
      const b = bot[x];
      if (t === 0 && b === 0) {
        out += " ";
      } else if (t === 0) {
        const c = palette[b];
        out += `${bg(c)}${fg([0, 0, 0])}▄${RESET}`;
      } else if (b === 0) {
        const c = palette[t];
        out += `${fg(c)}▀${RESET}`;
      } else {
        const tc = palette[t];
        const bc = palette[b];
        out += `${bg(bc)}${fg(tc)}▀${RESET}`;
      }
    }
    out += "\n";
  }
  return out;
}
