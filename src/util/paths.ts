import { homedir } from "node:os";
import { join } from "node:path";

const HOME = process.env.FAMILIAR_HOME ?? join(homedir(), ".familiar");
const STATE_FILE = join(HOME, "state.json");
const CONFIG_FILE = join(HOME, "config.json");

export const familiarHome = (): string => process.env.FAMILIAR_HOME ?? HOME;
export const stateFile = (): string =>
  process.env.FAMILIAR_HOME ? join(process.env.FAMILIAR_HOME, "state.json") : STATE_FILE;
export const configFile = (): string =>
  process.env.FAMILIAR_HOME ? join(process.env.FAMILIAR_HOME, "config.json") : CONFIG_FILE;

// Optional opt-in: a directory of `.md` files the pet reads to personalize
// its replies (e.g. user profile, project notes). Defaults to disabled —
// users set FAMILIAR_MEMORY_DIR to point at any directory they want.
// Supports leading `~/` for home-relative paths.
export const memoryDir = (): string | undefined => {
  const v = process.env.FAMILIAR_MEMORY_DIR;
  if (!v) return undefined;
  if (v === "~") return homedir();
  if (v.startsWith("~/")) return join(homedir(), v.slice(2));
  return v;
};
