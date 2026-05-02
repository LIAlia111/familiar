import { runPetCommand } from "../commands/pet.js";
import { runSkinCommand } from "../commands/skin.js";
import { runSkinsPreviewCommand } from "../commands/skins-preview.js";
import { runInstall } from "./install.js";
import { runUninstall } from "./uninstall.js";
import { runHook } from "../hooks/handlers.js";
import type { HookEvent } from "../hooks/proactive.js";

function isSponsorUnlocked(): boolean {
  // Premium pet pack sets this env var on install. For now this is the
  // simplest gate — a real activation flow comes with the premium package.
  return process.env.FAMILIAR_SPONSOR === "1" || !!process.env.FAMILIAR_PREMIUM_KEY;
}

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
      runSkinsPreviewCommand(process.argv[3]);
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
      console.log("Usage: familiar <install|uninstall|pet|skin|skins [species]>");
      process.exit(1);
  }
}

main().catch((e) => {
  // Don't leak stack traces / absolute paths. Set DEBUG=familiar to see them.
  if (process.env.DEBUG === "familiar") {
    console.error(e);
  } else {
    console.error(`familiar error: ${(e as Error).message ?? String(e)}`);
  }
  process.exit(1);
});
