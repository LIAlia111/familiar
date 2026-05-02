# familiar — Design Document

> A pixel-art pet companion that lives inside Claude Code CLI, reacts to your coding sessions, and grows with you over time.

**Status**: Design draft
**Date**: 2026-05-02
**Author**: [Lief](https://github.com/LIAlia111)

---

## 1. Overview

`familiar` is a cross-terminal pixel-art companion for Claude Code CLI. It lives in the Claude Code statusline (above the input bar), reacts to what Claude is doing, has emotions and an affection system, remembers context from your project, and speaks to you proactively at meaningful moments.

The name comes from a witch's familiar — a magical companion creature. It captures the relationship between a developer and their AI assistant: a constant companion that knows you and grows with you.

### Why familiar?

Existing Claude Code pet projects (`claude-pet`, `codachi`, `claude-code-tamagotchi`) either require Kitty graphics protocol (excluding most terminals like Tabby, Windows Terminal, basic SSH clients) or stay text-only without real personality.

`familiar` is the first companion that:
- Works on **any terminal** (pure ANSI half-block + 24-bit color, no special protocol)
- Has **real personality** powered by the user's own Claude account
- Has **persistent memory** that reads project context
- Has a clean **open-core business model** without compromising the open source spirit

---

## 2. Goals & Non-Goals

### Goals

- Run on any terminal that supports 24-bit ANSI color (Tabby, Windows Terminal, iTerm, kitty, WezTerm, basic SSH — everything)
- Beautiful 32×32 pixel-art creatures rendered with Unicode half-block characters
- Reactive to Claude Code state (idle / thinking / coding / error / rate-limit / completion)
- Persistent affection system (0–100), mood, and last-interaction tracking
- Memory system that reads `CLAUDE.md` and `~/.claude/projects/-/memory/` so the pet "knows" your project
- Proactive speech at meaningful moments, with user-configurable chattiness
- One-line npm install: `npx familiar install`
- Sustainable open-core revenue model that respects open source norms

### Non-Goals

- No GUI / desktop app — terminal only
- No multiplayer / cloud sync of pet (in v1)
- No requirement on Kitty graphics protocol
- No support for Windows CMD / PowerShell without ANSI true color

---

## 3. Architecture

```
┌──────────────────────────────────────────────────┐
│             Claude Code CLI Session              │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │  Conversation area                         │  │
│  │  ───────────────                           │  │
│  │  [/pet command output: large pixel art +   │  │
│  │   pet dialogue appears here on demand]     │  │
│  │                                            │  │
│  │  [Hook-driven proactive lines also appear  │  │
│  │   here at meaningful moments]              │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │  Statusline (always visible)               │  │
│  │  [🐱] mimi  ♥♥♥♥♡  · thinking…             │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │  > input bar                               │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### Components

| Component | Responsibility |
|-----------|----------------|
| **Statusline renderer** | Reads pet state, outputs small icon + status line each time Claude Code refreshes statusline |
| **Slash command handler** | Implements `/pet`, `/feed`, `/play`, `/pet-stats`, `/pet-reset` |
| **State manager** | Reads/writes `~/.familiar/state.json` (affection, mood, last-interaction, name, species) |
| **Hook listeners** | Subscribed to Claude Code lifecycle events (SessionStart, Stop, error, idle) for proactive speech |
| **Brain (Claude API client)** | Calls user's own Claude account/API to generate personality-flavored speech |
| **Memory backend** | Pluggable interface — default reads `CLAUDE.md` + `memory/` files; can be swapped for custom backends |
| **Sprite library** | 32×32 pixel-art frames per species, per mood, per animation state |
| **Premium loader** | Detects optional premium pet pack and exposes additional species |

### Plugin Interface (Open Core)

```
familiar (open source npm package)
  ├── core engine
  ├── 2 default pets (cat, capybara)
  ├── default memory backend (file-reader)
  └── plugin contracts:
       ├── MemoryBackend  ← e.g., custom vector store backends
       └── PetPack        ← e.g., premium pet pack (closed source)
```

The premium pet pack is a separately-distributed closed-source npm package that conforms to the `PetPack` interface. Sponsors receive a download URL and activation key.

The same `MemoryBackend` interface lets any developer plug in their own backend (Mem0, Pinecone, Weaviate, custom RAG, etc.) — the personal memory edition is just another `MemoryBackend` implementation.

---

## 4. Features

### 4.1 Display Modes

**Small (statusline)** — always visible

```
[🐱] mimi  ♥♥♥♥♡  thinking… · 1.2k tok
```

- 8×8 pixel icon (rendered as 4-line emoji or compact half-block sprite)
- Pet name
- Affection bar (5 hearts)
- Current Claude state label
- Token count (optional)

Total width budget: ~80 characters

**Large (`/pet` command)** — on demand

```
   ▄▄▄▄▄▄▄▄
  ██▀░░░▀██
 █▌◆ • • ◆▐█      mimi: 主人，今天又写了 3.2k token，
 █▌  ───  ▐█      你都不歇歇的吗？(˘ ³˘)♥
  ▀█████▀
   █ █ █ █

   ♥♥♥♥♡  亲密度 78/100
   心情：满足
```

- Full 32×32 pixel art (renders as 32 columns × 16 lines via half-blocks)
- Multi-line dialogue from the pet
- Stats panel (affection bar, mood, last interaction)
- Animation cycle plays for ~3 seconds

### 4.2 Animation

| Mode | Mechanism |
|------|-----------|
| **Small (statusline)** | Frame rotation — each statusline refresh shows the next frame in a loop. Pet "blinks" or "breathes" naturally as you interact with Claude. |
| **Large (`/pet`)** | Full animation loop — the command output is a multi-frame animated sequence (idle → blink → smile → idle). Plays for a few seconds before settling on a static frame. |

No background process, no Kitty protocol, no terminal-fighting hacks.

### 4.3 Affection System

| Range | Label | Visual |
|-------|-------|--------|
| 0–20 | 陌生 | ♡♡♡♡♡ |
| 21–40 | 认识 | ♥♡♡♡♡ |
| 41–60 | 朋友 | ♥♥♡♡♡ |
| 61–80 | 亲密 | ♥♥♥♡♡ |
| 81–95 | 挚友 | ♥♥♥♥♡ |
| 96–100 | 灵魂伴侣 | ♥♥♥♥♥ |

**Affection changes:**

| Event | Δ Affection |
|-------|------------:|
| `/pet` interaction | +1 |
| `/feed` | +3 (cooldown 1h) |
| `/play` | +2 |
| Long Claude session (>1h) | +5 (per hour) |
| Successful tool/code completion | +2 |
| Error or rate-limit while pet is on | -1 |
| User insults Claude in prompt | -2 |
| 24h no interaction | -2 |
| 7 days no interaction | -10 |

Affection caps at 100 and never goes below 0. Decay is gentle so casual users don't lose progress.

### 4.4 Memory System

The pet's "brain" reads context from three layers:

| Layer | Source | Purpose |
|-------|--------|---------|
| **State** | `~/.familiar/state.json` | Affection, mood, name, species, last-interaction timestamp, recent quotes |
| **Project** | `CLAUDE.md` (project + user level) | What the user is working on, their conventions, tech stack |
| **History** | `~/.claude/projects/-/memory/*.md` | Long-term user preferences and project memories |
| **External** *(plugin)* | `MemoryBackend` impl | Custom memory backend (e.g., personal vector store) |

When the pet speaks, the active `MemoryBackend` provides relevant context to the Claude API call so the pet's reply feels grounded — e.g., "you've been working on `familiar` for 3 hours, take a break."

### 4.5 Speaking System

**Three speaking surfaces:**

1. **Statusline** — short ambient mood text (e.g., `thinking…`, `bored…`, `happy~`). Updated every refresh.
2. **`/pet` command** — full dialogue (3–5 lines) when user explicitly invokes
3. **Proactive (hook-driven)** — pet inserts a single line into the conversation at meaningful moments

**Proactive speech triggers:**

| Trigger | Hook | Sample line |
|---------|------|-------------|
| First open of the day | `SessionStart` | "早安主人 ☀️ 今天写代码吗？" |
| Returning after long absence (>24h) | `SessionStart` | "好久不见，我都长出灰了…" |
| Successful task completion | `Stop` | "干得漂亮！🎉" |
| Error after 3+ retries | `PostToolUse` | "别气，慢慢来。" |
| Rate-limit hit | error event | "歇会吧，我陪着你。" |
| Long continuous session (>2h) | timer | "主人，要不要伸个懒腰？" |
| Random ambient (low probability) | timer | "（在啃尾巴）" |

**Chattiness configuration:** `quiet` / `normal` (default) / `chatty`

- `quiet` — only proactive on critical events (error, return after absence)
- `normal` — all of the above except random ambient
- `chatty` — everything including random ambient

### 4.6 Brain (Personality Generation)

The pet's personality replies are generated by **the user's own Claude account or API key**. Whatever model the user is logged into Claude Code with, that's what the pet uses.

- No additional API key required for the user
- No revenue split issues — user pays for their own usage
- Whatever model gets upgraded (Sonnet → Opus → next-gen), the pet inherits

**Cost minimization tactics:**

- Pre-defined templates for common situations (no API call)
- API call only for rich/contextual moments (e.g., return-after-absence with project awareness)
- Template + last-N-messages cache deduped per session
- User-configurable max API calls per hour

---

## 5. Pet Catalog

Each species has a distinct visual style and built-in personality. The personality is **tied to the species** — choosing a pet means choosing its temperament. (No separate personality picker; this keeps each pet's identity strong.)

| # | Species | Personality | Sample Voice |
|---|---------|-------------|--------------|
| 1 | 🐱 **Cat** | Lazy, aloof but secretly clingy | "(伸懒腰) 主人来了？我才不是想你了" |
| 2 | 🦫 **Capybara** | Zen, unfazed, low-key wise | "在水里泡着呢…要不要也来歇歇" |
| 3 | 🐉 **Dragon** | Tsundere, occasionally chuunibyou | "本龙在此！哼…等你很久了" |
| 4 | 👻 **Ghost** | Quiet, mysterious, occasionally spooky | "…在你身后看了一会儿…" |
| 5 | 🦑 **Octopus** | Curious, chatty, fidgety | "这个！这个！这个 token 是什么意思！" |
| 6 | 🐼 **Panda** | Lazy, food-motivated, comically unbothered | "唔…又写代码呀…要吃竹子吗" |
| 7 | 🐷 **Pig** | Innocent, food-loving, cheerful | "主人主人！今天写得好好哦~ 🌸" |

### Visual specification

- Canvas: 32×32 pixels per frame
- Render: Unicode half-block characters (▀ ▄) + 24-bit ANSI color
- Animation frames per pet: 4 (idle → blink → smile → quirk-specific)
- Total file size budget per pet: < 8KB (sprite data only)

---

## 6. Commands

| Command | Behavior |
|---------|----------|
| `/pet` | Summons the pet — shows large pixel art + personality dialogue grounded in current context |
| `/feed` | Feeds the pet — boosts affection (+3), 1-hour cooldown, pet shows happy animation |
| `/play` | Plays a small game with the pet — boosts affection (+2), pet does a celebration animation |
| `/pet-stats` | Shows detailed stats (affection, mood, last interaction, total interactions, age) |
| `/pet-reset` | Resets the pet — confirms first, wipes state, lets user pick species + name again |

In-pet menu (within `/pet` interactive flow):
- Rename
- Switch species (if multiple owned)
- Toggle chattiness
- Toggle proactive speech

---

## 7. Open Core & Sponsor Tier

### Free tier (open source)

- Full engine, statusline, animation, affection system, memory system, speaking system, all 5 commands
- **2 pets included**: Cat + Capybara
- All future engine updates and bug fixes

### Sponsor tier

- All of the above
- **Premium Pet Pack** — adds Dragon, Ghost, Octopus, Panda, Pig (5 additional pets)
- Priority issue support
- Sponsor recognition in README (optional)

### Implementation

- The 5 premium pet sprites + personality prompts ship as a separately-distributed **closed-source npm package** (`familiar-premium-pets`)
- Sponsors receive a download URL + activation key after sponsoring
- The open source `familiar` package detects the premium pack via the `PetPack` plugin interface and unlocks those species
- The premium pack is small (sprite data + prompt strings), not core logic — bypassing the activation check would just mean re-creating the sprite data, which has no IP teeth

### Sponsor channels

- GitHub Sponsors (primary)
- Patreon (secondary, monthly)
- 爱发电 (for Chinese sponsors)

Pricing target: ~$3–5/month or one-time small donation. Symbolic, not gatekeeping.

---

## 8. Tech Stack & Distribution

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Language | TypeScript | Standard for npm CLI tools, fast startup |
| Runtime | Node.js 18+ | Native to Claude Code ecosystem |
| Distribution | npm | One-line install matches developer expectation |
| Storage | Local JSON (`~/.familiar/state.json`) | No DB needed, easy to inspect, easy to back up |
| Rendering | Pure ANSI escape codes (24-bit color + Unicode half-blocks) | Works on every modern terminal |
| Personality | User's existing Claude account/API | Zero extra setup for user |

### Install flow

```bash
npx familiar install
```

The installer:
1. Detects whether Claude Code is installed (errors clearly if not)
2. Reads `~/.claude/settings.json`
3. Adds `statusLine` command pointing to the familiar statusline binary
4. Prompts user to pick a starter pet (Cat / Capybara) and name them
5. Optionally prompts for premium activation key (skip → continue with free tier)
6. Writes default config to `~/.familiar/config.json`
7. Done — restart Claude Code or open a new session to see the pet

### Uninstall flow

```bash
npx familiar uninstall
```

Removes the statusline entry, asks whether to keep state file (defaults to keeping, in case user reinstalls).

---

## 9. MVP Scope & Roadmap

### MVP (target: 1–2 days)

- [x] Pixel art for all 7 pets (drafts)
- [ ] Statusline renderer (small mode)
- [ ] `/pet` command with large mode + animation
- [ ] State manager (affection, mood, name)
- [ ] Default memory backend (reads `CLAUDE.md` + `memory/`)
- [ ] Hook integration: SessionStart, Stop
- [ ] Personality call to user's Claude account
- [ ] 2 free pets active (Cat, Capybara)
- [ ] `npx familiar install` flow
- [ ] README + minimal docs

### V1 (target: ~1 week)

- [ ] All 5 commands (`/feed`, `/play`, `/pet-stats`, `/pet-reset`)
- [ ] Full speaking system with chattiness levels
- [ ] All proactive speech triggers
- [ ] Premium pet pack distribution mechanism
- [ ] Sponsor activation flow
- [ ] Animation refinement
- [ ] Per-pet personality polish

### V2 (later)

- [ ] Custom memory backend examples (community-contributed plugins)
- [ ] Cloud sync (optional)
- [ ] Pet-to-pet visiting (multiple sessions, shared pets)
- [ ] More pets (community contributions or DLC)
- [ ] Custom personality prompts (sponsor feature)

---

## 10. Success Criteria

| Metric | Target (3 months post-launch) |
|--------|-------------------------------|
| GitHub stars | 500+ |
| Weekly npm downloads | 1,000+ |
| Sponsors | 20+ |
| Issues closed | >80% within a week |
| Pet survival rate (users who keep using after 30 days) | >40% |

---

## 11. Open Questions / Future Decisions

- Animation frame format: inline TS arrays vs external sprite files (decide during impl)
- Pet "death" mechanic: at affection 0, does the pet leave? (current design says no — too punishing)
- Multiple pets simultaneously? (v1 says one at a time)
- Mobile / web mirror? (out of scope — Claude Code is terminal-only anyway)

---

*End of design document.*
