import { runInteraction } from "./_interaction.js";

export async function runPetCommand(opts: { cwd: string; useApi?: boolean }): Promise<void> {
  await runInteraction({
    cwd: opts.cwd,
    kind: "pet",
    templateKey: "ambient_random",
    trigger: "user invoked /pet",
    showAnimation: true,
    useApi: opts.useApi,
  });
}
