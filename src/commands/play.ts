import { runInteraction } from "./_interaction.js";

export async function runPlayCommand(opts: { cwd: string; useApi?: boolean }): Promise<void> {
  await runInteraction({
    cwd: opts.cwd,
    kind: "play",
    templateKey: "play",
    trigger: "user played with the pet",
    showAnimation: false,
    useApi: opts.useApi,
  });
}
