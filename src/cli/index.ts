import { runPetCommand } from "../commands/pet.js";
import { runInstall } from "./install.js";
import { runUninstall } from "./uninstall.js";
import { runHook } from "../hooks/handlers.js";
import type { HookEvent } from "../hooks/proactive.js";

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
      console.log("Usage: familiar <install|uninstall|pet>");
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
