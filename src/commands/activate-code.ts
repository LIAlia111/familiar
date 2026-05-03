import { loadState, saveState } from "../state/store.js";
import { verifyActivationCode } from "../sponsor/code.js";
import type { Species } from "../state/types.js";

const ALL_SPECIES: Species[] = ["cat", "capybara", "dragon", "ghost", "octopus", "panda", "pig"];
const AFDIAN_URL = "https://afdian.com/a/Lief-ai";

export interface ActivateCodeOpts {
  codeArg?: string;
}

export async function runActivateCodeCommand(opts: ActivateCodeOpts): Promise<void> {
  const state = loadState();
  if (!state) {
    console.log("familiar 还没装宠物 —— 先运行：npx familiar install");
    return;
  }

  if (!opts.codeArg) {
    console.log("\n用法: familiar activate-code <code>");
    console.log(`赞助页面: ${AFDIAN_URL}\n`);
    return;
  }

  const result = verifyActivationCode(opts.codeArg);
  if (!result.valid || !result.login) {
    console.log("\n✗ 激活码无效。");
    console.log(`赞助页面: ${AFDIAN_URL}\n`);
    return;
  }

  const unlocked = new Set<Species>(state.unlockedSpecies);
  for (const s of ALL_SPECIES) unlocked.add(s);
  state.unlockedSpecies = [...unlocked];
  state.sponsorCheck = {
    isSponsor: true,
    checkedAt: Date.now(),
    viewerLogin: result.login,
    maintainer: "afdian",
  };
  saveState(state);

  console.log(`\n✓ 激活成功（@${result.login}）`);
  console.log("  全部 7 只宠物 + 35 款皮肤已解锁 ♥\n");
}
