import type { Mood, Species } from "../state/types.js";

export type RGB = [number, number, number];
export type PixelGrid = number[][]; // 0 = transparent, 1+ = palette index
export type Palette = Record<number, RGB>;

export interface Sprite {
  pixels: PixelGrid;
  palette: Palette;
}

export interface AnimatedSprite {
  frames: Sprite[]; // multiple frames for idle/blink/smile/quirk
}

export interface PersonalityProfile {
  species: Species;
  displayName: string;
  defaultName: string; // suggested pet name on first install
  systemPrompt: string; // appended to Claude API call
  templates: Record<TemplateKey, string[]>; // pre-defined responses
  moodToFrame: Record<Mood, number>; // which large frame index per mood
}

export type TemplateKey =
  | "session_start_morning"
  | "session_return_long_absence"
  | "task_completion"
  | "error_after_retries"
  | "rate_limit_hit"
  | "long_session_break"
  | "ambient_random"
  | "feed"
  | "play";

export interface Pet {
  species: Species;
  large: AnimatedSprite; // 32×32 frames
  small: AnimatedSprite; // 8×8 statusline frames
  personality: PersonalityProfile;
}
