export type Species = "cat" | "capybara" | "dragon" | "ghost" | "octopus" | "panda" | "pig";

export type Mood = "happy" | "content" | "neutral" | "bored" | "sad" | "excited" | "sleepy";

export type ClaudeState = "idle" | "thinking" | "coding" | "error" | "rate_limit" | "completion";

export type Chattiness = "quiet" | "normal" | "chatty";

// Per-pet state inside the multi-pet store.
export interface PetEntry {
  name: string;
  variantId?: string; // active skin; falls back to default
  affection: number; // 0-100
  mood: Mood;
  createdAt: string;
  lastInteractionAt: string;
  totalInteractions: number;
  recentQuotes: string[];
  cooldowns: {
    petUntilMs?: number;
    feedUntilMs?: number;
    playUntilMs?: number;
    dailyBonusDate?: string; // YYYY-MM-DD; daily bonus already given for this date
  };
}

// Cached sponsorship verification result.
export interface SponsorCheck {
  isSponsor: boolean;
  checkedAt: number; // ms timestamp
  viewerLogin: string | null; // GitHub login that was checked
  maintainer: string; // who they sponsor (locked at check time)
}

// v2 schema: multi-pet support.
export interface PetState {
  schemaVersion: 2;
  activeSpecies: Species;
  pets: Partial<Record<Species, PetEntry>>;
  unlockedSpecies: Species[]; // species the user can pick from in /pet-switch
  sponsorCheck?: SponsorCheck;
}

// v1 schema (legacy) — kept for migration.
export interface PetStateV1 {
  schemaVersion: 1;
  species: Species;
  name: string;
  variantId?: string;
  affection: number;
  mood: Mood;
  createdAt: string;
  lastInteractionAt: string;
  totalInteractions: number;
  recentQuotes: string[];
  cooldowns: {
    feedUntil?: string;
    playUntil?: string;
  };
}

