export function makeBlink(eyeValue: number, eyeReplace: number) {
  return (base: number[][]): number[][] =>
    base.map((row) => row.map((px) => (px === eyeValue ? eyeReplace : px)));
}

export function deriveStretch(base: number[][]): number[][] {
  return [base[0], ...base.slice(0, base.length - 1)];
}
