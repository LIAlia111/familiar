import { runPetCommand } from "../commands/pet.js";
import { runFeedCommand } from "../commands/feed.js";
import { runPlayCommand } from "../commands/play.js";
import { runStatsCommand } from "../commands/stats.js";
import { runSkinCommand } from "../commands/skin.js";
import { runSkinsPreviewCommand } from "../commands/skins-preview.js";
import { runSwitchCommand } from "../commands/switch.js";
import { runRenameCommand } from "../commands/rename.js";
import { runClaimCommand } from "../commands/claim.js";
import { runActivateCommand } from "../commands/activate.js";
import { runActivateCodeCommand } from "../commands/activate-code.js";
import { runInstall } from "./install.js";
import { runUninstall } from "./uninstall.js";
import { runHook } from "../hooks/handlers.js";
import { runMcpServer } from "../mcp/server.js";
import type { HookEvent } from "../hooks/proactive.js";
import { loadState } from "../state/store.js";
import { isSponsorActive } from "../sponsor/state.js";

function isSponsorUnlocked(): boolean {
  return isSponsorActive(loadState());
}

const USAGE =
  "Usage: familiar <install|uninstall|pet|feed|play|stats|skin|skins [species] [variant]|switch|rename|claim|activate|activate-code <code>|hook>";

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
    case "feed":
      await runFeedCommand({ cwd: process.cwd() });
      break;
    case "play":
      await runPlayCommand({ cwd: process.cwd() });
      break;
    case "stats":
      runStatsCommand({ sponsorUnlocked: isSponsorUnlocked() });
      break;
    case "skin":
      await runSkinCommand({
        sponsorUnlocked: isSponsorUnlocked(),
        variantArg: process.argv[3],
      });
      break;
    case "skins":
      runSkinsPreviewCommand(process.argv[3], process.argv[4]);
      break;
    case "switch":
      await runSwitchCommand({ speciesArg: process.argv[3], nameArg: process.argv[4] });
      break;
    case "rename":
      await runRenameCommand({ nameArg: process.argv[3] });
      break;
    case "claim":
      await runClaimCommand();
      break;
    case "activate":
      await runActivateCommand();
      break;
    case "activate-code":
      await runActivateCodeCommand({ codeArg: process.argv[3] });
      break;
    case "mcp":
      await runMcpServer();
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
