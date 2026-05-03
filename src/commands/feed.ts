import { runInteraction } from "./_interaction.js";

export async function runFeedCommand(opts: { cwd: string; useApi?: boolean }): Promise<void> {
  await runInteraction({
    cwd: opts.cwd,
    kind: "feed",
    templateKey: "feed",
    trigger: "user fed the pet",
    showAnimation: false,
    useApi: opts.useApi,
  });
}
