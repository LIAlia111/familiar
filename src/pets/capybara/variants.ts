import type { ColorVariant } from "../types.js";

// Capybara palette indices (large):
//   1 = outline   2 = body   3 = belly   4 = face accent
//   5 = eye       6 = shadow 7 = nose
// Small (statusline):
//   1 = outline   2 = body   3 = belly   4 = eye

export const capybaraVariants: ColorVariant[] = [
  {
    id: "brown",
    displayName: "Brown 棕色",
    tier: "free",
    largePalette: {
      1: [52, 28, 8],
      2: [138, 85, 40],
      3: [182, 125, 65],
      4: [218, 170, 105],
      5: [12, 12, 12],
      6: [92, 52, 18],
      7: [252, 192, 132],
    },
    smallPalette: {
      1: [55, 30, 10],
      2: [140, 88, 42],
      3: [218, 170, 105],
      4: [15, 15, 15],
    },
  },
  {
    id: "honey",
    displayName: "Honey 蜜色",
    tier: "free",
    largePalette: {
      1: [110, 75, 25],
      2: [225, 165, 70],
      3: [250, 215, 145],
      4: [255, 235, 190],
      5: [20, 20, 20],
      6: [165, 110, 45],
      7: [255, 230, 180],
    },
    smallPalette: {
      1: [110, 75, 25],
      2: [225, 165, 70],
      3: [250, 215, 145],
      4: [20, 20, 20],
    },
  },
  {
    id: "charcoal",
    displayName: "Charcoal 炭灰",
    tier: "sponsor",
    largePalette: {
      1: [25, 25, 25],
      2: [70, 70, 75],
      3: [110, 110, 120],
      4: [160, 160, 170],
      5: [10, 10, 10],
      6: [40, 40, 45],
      7: [180, 180, 190],
    },
    smallPalette: {
      1: [25, 25, 25],
      2: [70, 70, 75],
      3: [160, 160, 170],
      4: [10, 10, 10],
    },
  },
  {
    id: "rose",
    displayName: "Rose 玫瑰金",
    tier: "sponsor",
    largePalette: {
      1: [120, 65, 70],
      2: [225, 145, 150],
      3: [245, 195, 200],
      4: [255, 220, 225],
      5: [20, 20, 20],
      6: [165, 90, 100],
      7: [255, 215, 220],
    },
    smallPalette: {
      1: [120, 65, 70],
      2: [225, 145, 150],
      3: [245, 195, 200],
      4: [20, 20, 20],
    },
  },
  {
    id: "sand",
    displayName: "Sand 沙色",
    tier: "sponsor",
    largePalette: {
      1: [130, 110, 70],
      2: [220, 195, 145],
      3: [245, 225, 180],
      4: [255, 240, 205],
      5: [20, 20, 20],
      6: [170, 145, 95],
      7: [255, 230, 195],
    },
    smallPalette: {
      1: [130, 110, 70],
      2: [220, 195, 145],
      3: [245, 225, 180],
      4: [20, 20, 20],
    },
  },
];
