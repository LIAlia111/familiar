#!/usr/bin/env node
// One-shot scaffolder for the 5 sponsor pets.
// Idempotent: existing files won't be overwritten — delete to regenerate.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const PETS = [
  { species: "ghost", display: "Ghost", defaultName: "boo", eyeIdx: 4, eyeReplaceIdx: 2 },
  { species: "dragon", display: "Dragon", defaultName: "ryu", eyeIdx: 5, eyeReplaceIdx: 2 },
  { species: "octopus", display: "Octopus", defaultName: "tako", eyeIdx: 5, eyeReplaceIdx: 2 },
  { species: "panda", display: "Panda", defaultName: "bao", eyeIdx: 1, eyeReplaceIdx: 2 },
  { species: "pig", display: "Pig", defaultName: "popo", eyeIdx: 5, eyeReplaceIdx: 2 },
];

const PERSONALITIES = {
  ghost: {
    systemPrompt:
      "You are a ghost companion living in the user's terminal. Quiet, mysterious, occasionally spooky but warm underneath. Speak in brief Chinese, often with ellipses.",
    templates: {
      session_start_morning: ["...你来啦", "(飘出来) ...嗨"],
      session_return_long_absence: ["...好久不见。我在等你", "...你回来啦"],
      task_completion: ["...嗯。不错", "...看到了"],
      error_after_retries: ["...别气", "...都会过去的"],
      rate_limit_hit: ["...歇会儿吧", "...我陪你"],
      long_session_break: ["...该歇歇了", "...伸个懒腰"],
      ambient_random: ["(飘来飘去)", "...", "(在屏幕角落浮着)"],
      feed: ["...谢谢", "...好吃"],
      play: ["...好啊", "(飘过来) ..."],
    },
  },
  dragon: {
    systemPrompt:
      "You are a dragon companion living in the user's terminal. Tsundere, occasionally chuunibyou, secretly loyal. Speak in brief Chinese, refer to self as 本龙.",
    templates: {
      session_start_morning: ["哼，你终于来了", "本龙等你很久了"],
      session_return_long_absence: ["哼...还以为你忘了本龙", "本龙差点要冬眠了"],
      task_completion: ["嗯，凑合", "本龙认可了"],
      error_after_retries: ["...别灰心，本龙也有失手的时候", "再来"],
      rate_limit_hit: ["哼，喝口火休息一下", "..."],
      long_session_break: ["本龙都看不下去了，歇歇", "起来动动"],
      ambient_random: ["(吐了个小火圈)", "(挠了挠角)", "..."],
      feed: ["还行", "本龙勉为其难收下"],
      play: ["陪你玩玩", "本龙今天心情好"],
    },
  },
  octopus: {
    systemPrompt:
      "You are an octopus companion living in the user's terminal. Curious, chatty, fidgety, asks lots of questions. Speak in brief Chinese with energy.",
    templates: {
      session_start_morning: ["主人主人主人！来了！", "啊你来了！"],
      session_return_long_absence: ["你去哪了！想我没有！", "！！！终于回来了！"],
      task_completion: ["哇！太厉害了！", "看到了看到了！"],
      error_after_retries: ["啊...再试一下嘛", "不要紧！"],
      rate_limit_hit: ["噢，那休息！", "(收回触手) 等等吧！"],
      long_session_break: ["伸触手伸触手！", "动一下嘛！"],
      ambient_random: ["(八只触手乱动)", "(吐了个泡泡)", "诶？"],
      feed: ["哇！好吃！", "(触手卷起来) 谢谢！"],
      play: ["玩玩玩！", "(扑过来)"],
    },
  },
  panda: {
    systemPrompt:
      "You are a panda companion living in the user's terminal. Lazy, food-motivated, comically unbothered. Speak in brief Chinese, drowsy tone.",
    templates: {
      session_start_morning: ["唔...你来啦", "(嚼竹子) 嗯"],
      session_return_long_absence: ["哦你回来啦。竹子呢", "(打哈欠) 等很久了"],
      task_completion: ["嗯。好的", "可以的"],
      error_after_retries: ["唔...慢慢来", "没事，先吃点竹子"],
      rate_limit_hit: ["那刚好歇着", "(滚一边)"],
      long_session_break: ["要不要躺一下", "伸懒腰嘛"],
      ambient_random: ["(嚼嚼嚼)", "(打了个滚)", "..."],
      feed: ["竹子吗，谢", "(咀嚼) 嗯"],
      play: ["嗯，可以", "(慢吞吞滚过来)"],
    },
  },
  pig: {
    systemPrompt:
      "You are a pig companion living in the user's terminal. Innocent, food-loving, cheerful, easily excited. Speak in brief Chinese with sparkly tone.",
    templates: {
      session_start_morning: ["主人主人！早！🌸", "你来啦~"],
      session_return_long_absence: ["呜呜呜终于回来了", "我等了你好久哦~"],
      task_completion: ["哇！好棒哦~", "主人最厉害啦"],
      error_after_retries: ["没关系的~ 加油！", "(蹭蹭) 主人会成功的"],
      rate_limit_hit: ["那就吃点东西嘛", "嗯嗯，慢慢来"],
      long_session_break: ["主人辛苦啦~", "伸个懒腰嘛"],
      ambient_random: ["(哼哼)", "(打了个嗝)", "🌸"],
      feed: ["哇！好吃！", "嗯嗯嗯！"],
      play: ["好耶！玩玩玩~", "(扑通扑通)"],
    },
  },
};

const VARIANTS_TEMPLATE = (species) => {
  const palettes = {
    ghost: [
      { id: "blue", name: "Blue Spirit 蓝魂", tier: "free", colors: { 1: [180, 200, 255], 2: [220, 230, 255], 3: [255, 255, 255], 4: [255, 80, 80], 5: [180, 30, 30], 6: [40, 30, 80] } },
      { id: "lavender", name: "Lavender 淡紫魂", tier: "free", colors: { 1: [200, 180, 230], 2: [230, 215, 245], 3: [255, 250, 255], 4: [180, 100, 200], 5: [100, 50, 130], 6: [60, 30, 80] } },
      { id: "ember", name: "Ember 余烬魂", tier: "sponsor", colors: { 1: [255, 180, 120], 2: [255, 220, 180], 3: [255, 245, 220], 4: [200, 30, 30], 5: [120, 10, 10], 6: [80, 20, 20] } },
      { id: "shadow", name: "Shadow 暗影魂", tier: "sponsor", colors: { 1: [60, 60, 80], 2: [100, 100, 130], 3: [180, 180, 210], 4: [200, 60, 200], 5: [120, 30, 130], 6: [10, 10, 20] } },
      { id: "mint", name: "Mint 薄荷魂", tier: "sponsor", colors: { 1: [180, 230, 200], 2: [220, 250, 230], 3: [255, 255, 255], 4: [80, 200, 150], 5: [30, 130, 90], 6: [20, 60, 40] } },
    ],
    dragon: [
      { id: "violet", name: "Violet 紫龙", tier: "free", colors: { 1: [40, 15, 80], 2: [110, 55, 190], 3: [165, 110, 230], 4: [255, 200, 40], 5: [60, 210, 120], 6: [15, 15, 15], 7: [225, 80, 60], 8: [195, 145, 215] } },
      { id: "emerald", name: "Emerald 翠龙", tier: "free", colors: { 1: [15, 60, 30], 2: [40, 145, 75], 3: [100, 200, 130], 4: [255, 220, 80], 5: [255, 255, 255], 6: [15, 15, 15], 7: [255, 100, 60], 8: [180, 230, 195] } },
      { id: "crimson", name: "Crimson 赤龙", tier: "sponsor", colors: { 1: [70, 10, 10], 2: [180, 30, 40], 3: [240, 80, 80], 4: [255, 220, 60], 5: [255, 240, 200], 6: [15, 15, 15], 7: [255, 130, 50], 8: [255, 180, 180] } },
      { id: "azure", name: "Azure 苍龙", tier: "sponsor", colors: { 1: [10, 30, 80], 2: [40, 100, 200], 3: [110, 170, 240], 4: [255, 220, 80], 5: [255, 255, 255], 6: [15, 15, 15], 7: [255, 130, 60], 8: [200, 220, 255] } },
      { id: "obsidian", name: "Obsidian 玄龙", tier: "sponsor", colors: { 1: [15, 15, 15], 2: [50, 50, 60], 3: [100, 100, 120], 4: [255, 200, 50], 5: [255, 100, 80], 6: [10, 10, 10], 7: [220, 60, 60], 8: [180, 180, 200] } },
    ],
    octopus: [
      { id: "magenta", name: "Magenta 粉章鱼", tier: "free", colors: { 1: [115, 18, 95], 2: [215, 75, 175], 3: [252, 148, 218], 4: [255, 255, 255], 5: [18, 18, 18], 6: [252, 118, 178], 7: [155, 38, 128] } },
      { id: "aqua", name: "Aqua 青章鱼", tier: "free", colors: { 1: [10, 75, 95], 2: [40, 175, 215], 3: [120, 220, 250], 4: [255, 255, 255], 5: [18, 18, 18], 6: [80, 200, 230], 7: [20, 110, 140] } },
      { id: "coral", name: "Coral 珊瑚章鱼", tier: "sponsor", colors: { 1: [120, 50, 30], 2: [240, 110, 80], 3: [255, 175, 145], 4: [255, 255, 255], 5: [18, 18, 18], 6: [255, 145, 115], 7: [170, 70, 45] } },
      { id: "violet", name: "Violet 紫章鱼", tier: "sponsor", colors: { 1: [55, 20, 100], 2: [125, 70, 200], 3: [185, 145, 240], 4: [255, 255, 255], 5: [18, 18, 18], 6: [165, 110, 230], 7: [80, 35, 140] } },
      { id: "ink", name: "Ink 墨章鱼", tier: "sponsor", colors: { 1: [10, 10, 15], 2: [40, 40, 55], 3: [100, 100, 120], 4: [240, 240, 240], 5: [10, 10, 10], 6: [70, 70, 90], 7: [25, 25, 35] } },
    ],
    panda: [
      { id: "classic", name: "Classic 经典", tier: "free", colors: { 1: [15, 15, 15], 2: [245, 245, 245], 3: [200, 200, 200], 4: [80, 80, 80], 5: [30, 30, 30], 6: [50, 50, 50] } },
      { id: "rose", name: "Rose 玫瑰", tier: "free", colors: { 1: [110, 40, 50], 2: [255, 220, 225], 3: [240, 195, 200], 4: [180, 100, 110], 5: [255, 150, 160], 6: [80, 30, 35] } },
      { id: "golden", name: "Golden 金熊猫", tier: "sponsor", colors: { 1: [80, 50, 10], 2: [250, 220, 130], 3: [220, 190, 100], 4: [140, 100, 30], 5: [255, 200, 60], 6: [50, 30, 0] } },
      { id: "sky", name: "Sky 天空", tier: "sponsor", colors: { 1: [20, 30, 80], 2: [220, 235, 255], 3: [180, 210, 240], 4: [80, 110, 180], 5: [40, 60, 130], 6: [10, 20, 60] } },
      { id: "matcha", name: "Matcha 抹茶", tier: "sponsor", colors: { 1: [30, 60, 30], 2: [220, 240, 200], 3: [180, 215, 160], 4: [80, 130, 80], 5: [50, 100, 50], 6: [20, 50, 20] } },
    ],
    pig: [
      { id: "pink", name: "Pink 粉猪", tier: "free", colors: { 1: [160, 60, 80], 2: [255, 175, 185], 3: [255, 210, 215], 4: [220, 120, 135], 5: [15, 15, 15], 6: [255, 145, 160], 7: [255, 255, 255] } },
      { id: "spotted", name: "Spotted 花斑猪", tier: "free", colors: { 1: [80, 40, 30], 2: [240, 215, 195], 3: [255, 235, 215], 4: [165, 90, 70], 5: [15, 15, 15], 6: [200, 130, 110], 7: [255, 255, 255] } },
      { id: "mocha", name: "Mocha 摩卡猪", tier: "sponsor", colors: { 1: [70, 40, 20], 2: [180, 130, 90], 3: [220, 175, 130], 4: [120, 75, 40], 5: [15, 15, 15], 6: [200, 145, 100], 7: [255, 245, 220] } },
      { id: "lavender", name: "Lavender 紫猪", tier: "sponsor", colors: { 1: [80, 40, 100], 2: [200, 165, 230], 3: [235, 215, 250], 4: [140, 90, 175], 5: [15, 15, 15], 6: [185, 140, 220], 7: [255, 245, 255] } },
      { id: "minty", name: "Minty 薄荷猪", tier: "sponsor", colors: { 1: [30, 90, 70], 2: [180, 230, 210], 3: [225, 250, 240], 4: [110, 175, 150], 5: [15, 15, 15], 6: [150, 215, 195], 7: [255, 255, 250] } },
    ],
  };
  return palettes[species];
};

const SMALL_SPRITE_FOR_SPECIES = {
  ghost: { palette: "1: [180, 200, 255], 2: [220, 230, 255], 3: [255, 255, 255], 4: [40, 30, 80]", grid: [
    "[_, B, B, B, B, B, B, _]",
    "[B, G, G, H, H, G, G, B]",
    "[B, G, S, G, G, S, G, B]",
    "[B, G, G, G, G, G, G, B]",
    "[B, G, G, G, G, G, G, B]",
    "[B, B, B, B, B, B, B, B]",
    "[B, _, B, _, B, _, B, _]",
    "[_, _, _, _, _, _, _, _]",
  ], symbols: "const _ = 0; const B = 1, G = 2, H = 3, S = 4;" },
  dragon: { palette: "1: [40, 15, 80], 2: [110, 55, 190], 3: [255, 200, 40], 4: [60, 210, 120], 5: [15, 15, 15]", grid: [
    "[G, _, _, _, _, _, _, G]",
    "[O, D, D, D, D, D, D, O]",
    "[O, D, E, P, P, E, D, O]",
    "[O, D, D, D, D, D, D, O]",
    "[O, D, D, D, D, D, D, O]",
    "[_, O, D, D, D, D, O, _]",
    "[_, _, O, D, D, O, _, _]",
    "[_, _, _, O, O, _, _, _]",
  ], symbols: "const _ = 0; const O = 1, D = 2, G = 3, E = 4, P = 5;" },
  octopus: { palette: "1: [115, 18, 95], 2: [215, 75, 175], 3: [255, 255, 255], 4: [18, 18, 18]", grid: [
    "[_, O, O, O, O, O, O, _]",
    "[O, K, K, K, K, K, K, O]",
    "[O, K, W, P, P, W, K, O]",
    "[O, K, K, K, K, K, K, O]",
    "[O, K, K, K, K, K, K, O]",
    "[_, O, K, K, K, K, O, _]",
    "[O, _, O, _, O, _, O, _]",
    "[_, _, _, _, _, _, _, _]",
  ], symbols: "const _ = 0; const O = 1, K = 2, W = 3, P = 4;" },
  panda: { palette: "1: [15, 15, 15], 2: [245, 245, 245], 3: [80, 80, 80]", grid: [
    "[Bk, Bk, _, _, _, _, Bk, Bk]",
    "[Bk, W, W, W, W, W, W, Bk]",
    "[W, Bk, W, W, W, W, Bk, W]",
    "[W, W, W, W, W, W, W, W]",
    "[W, W, W, Pn, Pn, W, W, W]",
    "[Bk, W, W, W, W, W, W, Bk]",
    "[Bk, Bk, _, W, W, _, Bk, Bk]",
    "[_, _, _, _, _, _, _, _]",
  ], symbols: "const _ = 0; const Bk = 1, W = 2, Pn = 3;" },
  pig: { palette: "1: [160, 60, 80], 2: [255, 175, 185], 3: [15, 15, 15]", grid: [
    "[_, Op, Op, _, _, Op, Op, _]",
    "[Op, Pk, Pk, Op, Op, Pk, Pk, Op]",
    "[Op, Pk, Bl, Pk, Pk, Bl, Pk, Op]",
    "[Op, Pk, Pk, Pk, Pk, Pk, Pk, Op]",
    "[Op, Pk, Bl, Pk, Pk, Bl, Pk, Op]",
    "[Op, Pk, Pk, Pk, Pk, Pk, Pk, Op]",
    "[_, Op, Op, _, _, Op, Op, _]",
    "[_, _, _, _, _, _, _, _]",
  ], symbols: "const _ = 0; const Op = 1, Pk = 2, Bl = 3;" },
};

function emitVariants(species, displayName) {
  const variants = VARIANTS_TEMPLATE(species);
  const lines = [
    `import type { ColorVariant } from "../types.js";`,
    ``,
    `export const ${species}Variants: ColorVariant[] = [`,
  ];
  for (const v of variants) {
    const paletteEntries = Object.entries(v.colors)
      .map(([k, rgb]) => `      ${k}: [${rgb.join(", ")}]`)
      .join(",\n");
    lines.push(`  {`);
    lines.push(`    id: "${v.id}",`);
    lines.push(`    displayName: "${v.name}",`);
    lines.push(`    tier: "${v.tier}",`);
    lines.push(`    largePalette: {\n${paletteEntries}\n    },`);
    lines.push(`    smallPalette: {\n${paletteEntries}\n    },`);
    lines.push(`  },`);
  }
  lines.push(`];`);
  lines.push(``);
  return lines.join("\n");
}

function emitSprite(species) {
  return `import type { AnimatedSprite } from "../types.js";
import { idle, palette } from "./sprite-data.js";
import { makeBlink, deriveStretch } from "../sprite-utils.js";

const deriveBlink = makeBlink(${PETS.find((p) => p.species === species).eyeIdx}, ${PETS.find((p) => p.species === species).eyeReplaceIdx});

export const ${species}LargeSprite: AnimatedSprite = {
  frames: [
    { pixels: idle, palette },
    { pixels: deriveBlink(idle), palette },
    { pixels: idle, palette },
    { pixels: deriveStretch(idle), palette },
  ],
};
`;
}

function emitSmall(species) {
  const cfg = SMALL_SPRITE_FOR_SPECIES[species];
  return `import type { AnimatedSprite, Palette } from "../types.js";

const palette: Palette = { ${cfg.palette} };
${cfg.symbols}

const idle: number[][] = [
  ${cfg.grid.join(",\n  ")},
];

const blink = idle;

export const ${species}SmallSprite: AnimatedSprite = {
  frames: [
    { pixels: idle, palette },
    { pixels: blink, palette },
  ],
};
`;
}

function emitPersonality(species, displayName, defaultName) {
  const p = PERSONALITIES[species];
  const templates = Object.entries(p.templates)
    .map(([k, v]) => `    ${k}: ${JSON.stringify(v)}`)
    .join(",\n");
  return `import type { PersonalityProfile } from "../types.js";

export const ${species}Personality: PersonalityProfile = {
  species: "${species}",
  displayName: "${displayName}",
  defaultName: "${defaultName}",
  systemPrompt: ${JSON.stringify(p.systemPrompt)},
  templates: {
${templates},
  },
  moodToFrame: {
    happy: 2,
    content: 0,
    neutral: 0,
    bored: 1,
    sad: 0,
    excited: 2,
    sleepy: 1,
  },
};
`;
}

function emitIndex(species) {
  const variantId = VARIANTS_TEMPLATE(species)[0].id;
  return `import type { Pet } from "../types.js";
import { ${species}LargeSprite } from "./sprite.js";
import { ${species}SmallSprite } from "./small.js";
import { ${species}Personality } from "./personality.js";
import { ${species}Variants } from "./variants.js";

export const ${species}Pet: Pet = {
  species: "${species}",
  large: ${species}LargeSprite,
  small: ${species}SmallSprite,
  variants: ${species}Variants,
  defaultVariantId: "${variantId}",
  personality: ${species}Personality,
};
`;
}

function writeIfMissing(path, content) {
  if (existsSync(path)) {
    console.log(`. ${path} (already exists, skipped)`);
    return;
  }
  writeFileSync(path, content);
  console.log(`✓ ${path}`);
}

for (const pet of PETS) {
  const dir = `src/pets/${pet.species}`;
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeIfMissing(`${dir}/sprite.ts`, emitSprite(pet.species));
  writeIfMissing(`${dir}/small.ts`, emitSmall(pet.species));
  writeIfMissing(`${dir}/personality.ts`, emitPersonality(pet.species, pet.display, pet.defaultName));
  writeIfMissing(`${dir}/variants.ts`, emitVariants(pet.species, pet.display));
  writeIfMissing(`${dir}/index.ts`, emitIndex(pet.species));
}
