import type { Chattiness } from "../state/types.js";
import type { TemplateKey } from "../pets/types.js";

export type HookEvent = "SessionStart" | "Stop";

export interface DecideOpts {
  lastInteractionAt: string;
  chattiness: Chattiness;
  now: Date;
}

const HOURS_FOR_LONG_ABSENCE = 24;

export function decideTrigger(event: HookEvent, opts: DecideOpts): TemplateKey | null {
  const last = new Date(opts.lastInteractionAt).getTime();
  const hoursAgo = (opts.now.getTime() - last) / 3_600_000;

  if (event === "SessionStart") {
    return hoursAgo >= HOURS_FOR_LONG_ABSENCE
      ? "session_return_long_absence"
      : "session_start_morning";
  }

  if (event === "Stop") {
    if (opts.chattiness === "quiet") return null;
    return "task_completion";
  }

  return null;
}
