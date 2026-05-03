import { loadState, saveState, getActivePet } from "../state/store.js";
import { input } from "@inquirer/prompts";

export async function runRenameCommand(opts: { nameArg?: string } = {}): Promise<void> {
  const state = loadState();
  if (!state) {
    console.log("familiar 还没装宠物 —— 运行：npx familiar install");
    return;
  }
  const active = getActivePet(state);
  if (!active) {
    console.log("active 宠物丢了。");
    return;
  }

  const name =
    opts.nameArg !== undefined
      ? opts.nameArg
      : await input({ message: "New name:", default: active.name });

  const trimmed = name.trim();
  if (!trimmed) {
    console.log("名字不能为空。");
    return;
  }

  active.name = trimmed;
  saveState(state);
  console.log(`\n✓ Renamed to ${trimmed}.\n`);
}
