import { loadState, saveState, newPetEntry } from "../state/store.js";
import { getPet, listAll } from "../pets/registry.js";
import { hasUnclaimedSponsorSlot, earnedSponsorSlots, countMaxedPets } from "../state/unlocks.js";
import { select, input } from "@inquirer/prompts";
import type { Species } from "../state/types.js";

// User-facing flow to claim a sponsor pet that was earned by maxing multiple pets.
export async function runClaimCommand(): Promise<void> {
  const state = loadState();
  if (!state) {
    console.log("familiar 还没装宠物 —— 运行：npx familiar install");
    return;
  }

  const maxed = countMaxedPets(state);
  const earned = earnedSponsorSlots(state);
  const claimed = state.unlockedSpecies.length - 2;

  console.log(`\n  满级宠物: ${maxed}`);
  console.log(`  已赚取赞助槽: ${earned}`);
  console.log(`  已领取: ${claimed}`);

  if (!hasUnclaimedSponsorSlot(state)) {
    console.log("\n暂时没有可领取的赞助宠物。继续把现有宠物养到 100 满级吧 ♡\n");
    return;
  }

  const lockedSponsor = listAll().filter((sp: Species) => !state.unlockedSpecies.includes(sp));
  const choices = lockedSponsor.map((sp) => {
    const pet = getPet(sp);
    return { name: `${pet?.personality.displayName} (${pet?.personality.defaultName})`, value: sp };
  });

  const sp = await select({
    message: "选一只赞助宠物领养：",
    choices,
  });

  const pet = getPet(sp);
  if (!pet) return;

  const name = await input({
    message: `给 ${pet.personality.displayName} 起名：`,
    default: pet.personality.defaultName,
  });

  state.unlockedSpecies.push(sp);
  state.pets[sp] = newPetEntry({ name: name.trim() || pet.personality.defaultName });
  saveState(state);

  console.log(`\n✓ ${name} 加入了你的家族 ♥`);
  console.log("  Switch to them anytime: familiar switch\n");
}
