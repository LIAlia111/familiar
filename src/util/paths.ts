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
