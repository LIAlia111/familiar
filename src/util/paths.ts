import { homedir } from "node:os";
import { join } from "node:path";

export const familiarHome = (): string =>
  process.env.FAMILIAR_HOME ?? join(homedir(), ".familiar");

export const stateFile = (): string => join(familiarHome(), "state.json");
export const configFile = (): string => join(familiarHome(), "config.json");
