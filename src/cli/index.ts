import { runPetCommand } from "../commands/pet.js";
import { runSkinCommand } from "../commands/skin.js";
import { runSkinsPreviewCommand } from "../commands/skins-preview.js";
import { runSwitchCommand } from "../commands/switch.js";
import { runRenameCommand } from "../commands/rename.js";
import { runClaimCommand } from "../commands/claim.js";
import { runInstall } from "./install.js";
import { runUninstall } from "./uninstall.js";
import { runHook } from "../hooks/handlers.js";
import type { HookEvent } from "../hooks/proactive.js";

function isSponsorUnlocked(): boolean {
  return process.env.FAMILIAR_SPONSOR === "1" || !!process.env.FAMILIAR_PREMIUM_KEY;
}

const USAGE =
  "Usage: familiar <install|uninstall|pet|skin|skins [species] [variant]|switch|rename|claim|hook>";

async function main(): Promise<void> {
  const cmd = process.argv[2];
  switch (cmd) {
    case "install":
      await runInstall();
      break;
    case "uninstall":
      await runUninstall();
      break;
    case "pet":
      await runPetCommand({ cwd: process.cwd() });
      break;
    case "skin":
      await runSkinCommand({ sponsorUnlocked: isSponsorUnlocked() });
      break;
    case "skins":
      runSkinsPreviewCommand(process.argv[3], process.argv[4]);
      break;
    case "switch":
      await runSwitchCommand();
      break;
    case "rename":
      await runRenameCommand();
      break;
    case "claim":
      await runClaimCommand();
      break;
    case "hook": {
      const event = process.argv[3] as HookEvent;
      if (event !== "SessionStart" && event !== "Stop") {
        console.error("hook requires SessionStart or Stop");
        process.exit(1);
      }
      await runHook(event);
      break;
    }
    default:
      console.log(USAGE);
      process.exit(1);
  }
}

main().catch((e) => {
  if (process.env.DEBUG === "familiar") {
    console.error(e);
  } else {
    console.error(`familiar error: ${(e as Error).message ?? String(e)}`);
  }
  process.exit(1);
});
