export type Species = "cat" | "capybara" | "dragon" | "ghost" | "octopus" | "panda" | "pig";

export type Mood = "happy" | "content" | "neutral" | "bored" | "sad" | "excited" | "sleepy";

export type ClaudeState = "idle" | "thinking" | "coding" | "error" | "rate_limit" | "completion";

export type Chattiness = "quiet" | "normal" | "chatty";

export interface PetState {
  schemaVersion: 1;
  species: Species;
  name: string;
  affection: number; // 0-100
  mood: Mood;
  createdAt: string; // ISO timestamp
  lastInteractionAt: string; // ISO timestamp
  totalInteractions: number;
  recentQuotes: string[]; // last 10 things the pet said, dedupe source
  cooldowns: {
    feedUntil?: string;
    playUntil?: string;
  };
}

export interface PetConfig {
  schemaVersion: 1;
  chattiness: Chattiness;
  proactiveEnabled: boolean;
  maxApiCallsPerHour: number;
  premiumActivationKey?: string;
}
