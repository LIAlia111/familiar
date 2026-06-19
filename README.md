# familiar

> A pixel-art pet companion for [Claude Code](https://docs.anthropic.com/claude/claude-code) CLI. Lives in your statusline. Reacts to your sessions. Grows with you.

> Running in production inside [JARVIS](https://jarvis.liaolief.com) — a real AI assistant system with 6 Claude Code sessions, 100+ skills, and 1600+ memory files.

[![npm version](https://img.shields.io/npm/v/claude-familiar.svg)](https://www.npmjs.com/package/claude-familiar)
[![npm downloads](https://img.shields.io/npm/dw/claude-familiar.svg)](https://www.npmjs.com/package/claude-familiar)
[![license](https://img.shields.io/npm/l/claude-familiar.svg)](./LICENSE)
[![node](https://img.shields.io/node/v/claude-familiar.svg)](https://nodejs.org)

## Install

```bash
npx claude-familiar install
```

You'll be asked to pick a starter pet and name them. Then restart Claude Code (or open a new session) and your pet appears in the statusline — alive, opinionated, and already reading your `CLAUDE.md`.

If familiar makes your sessions better, a ⭐ on [GitHub](https://github.com/LIAlia111/familiar) helps others find it.

## The story

I built familiar while developing [JARVIS](https://jarvis.liaolief.com) — my personal AI assistant system running 6 Claude Code sessions, 30+ hooks, and 100+ skills. After months of solo sessions, I wanted something that *acknowledged* the work, not just executed it. The first version was a three-line statusline hack. It grew into this.

## Why familiar?

Other Claude Code pet projects either require [Kitty graphics protocol](https://sw.kovidgoyal.net/kitty/graphics-protocol/) (excluding most terminals) or stay text-only without real personality.

`familiar` is the first companion that:

- Works in **any terminal** with 24-bit ANSI color (Tabby, Windows Terminal, iTerm, kitty, WezTerm, even basic SSH)
- Has **real personality** — replies powered by your own Claude Code login (`claude -p` under the hood). No extra API key, no extra cost beyond your existing plan.
- Has **persistent memory** — reads `CLAUDE.md` and `~/.claude/projects/-/memory/` so the pet knows your project
- **Open-core**: 2 free pets + premium pet pack via sponsorship

## familiar vs OpenClaw

[OpenClaw](https://github.com/OpenClaw) is a powerful self-hosted agent framework. It's infrastructure — you deploy it, maintain it, route tasks through it.

`familiar` is the opposite end of the spectrum:

| | familiar | OpenClaw |
|---|---|---|
| What it is | Companion living in your statusline | Self-hosted agent orchestration framework |
| Setup | `npx claude-familiar install` (30 seconds) | Docker / self-hosted server |
| API key | None — uses your existing Claude Code login | Requires separate API configuration |
| Purpose | Emotional layer: personality, memory, presence | Workflow layer: task routing, agent pipelines |
| Overhead | ~0 — runs inside Claude Code | Separate process / server |

**tl;dr** — If you want to build agent pipelines, use OpenClaw. If you want a companion that knows your project and greets you in the statusline, use `familiar`. They don't compete; some people use both.

## Requirements

- [Claude Code CLI](https://docs.anthropic.com/claude/claude-code) installed and signed in
- Node.js 18+
- Any modern terminal with 24-bit ANSI color support

### Mobile (Termius / iSH / etc.)

The statusline and proactive hooks work great on mobile SSH clients like Termius. The `/pet` large pixel art is best viewed on desktop or in landscape mode — phones in portrait will compress or wrap the 32-column sprite. Statusline-only experience is fine on any screen size.

## Commands

| Command | What it does |
| --- | --- |
| `/pet` | Summon your pet — large pixel art + personality dialogue |
| `/feed` | Feed them (boosts affection, 1h cooldown) |
| `/play` | Play with them (boosts affection) |
| `/pet-stats` | View detailed stats |
| `/pet-reset` | Start over with a new pet |

## Pets

**Free tier (everyone gets these)**

- 🐱 **Cat** — lazy, aloof, secretly clingy
- 🦫 **Capybara** — zen, unfazed, low-key wise

**Sponsor tier (Premium Pet Pack)**

- 🐉 **Dragon** — tsundere, occasionally chuunibyou
- 👻 **Ghost** — quiet, mysterious, occasionally spooky
- 🦑 **Octopus** — curious, chatty, fidgety
- 🐼 **Panda** — lazy, food-motivated, comically unbothered
- 🐷 **Pig** — innocent, food-loving, cheerful

[Become a sponsor →](https://github.com/sponsors/LIAlia111)  ·  [国内赞助（爱发电）→](https://afdian.com/a/Lief-ai)

Sponsoring unlocks all 7 pets + priority support. Core engine stays free and open-source forever.

### Activating sponsor status

**GitHub Sponsors** — automatic verification:

```bash
familiar activate
```

Opens a GitHub Device Flow login. `familiar` verifies your sponsorship via the GitHub GraphQL API. No tokens stored locally; result is cached for 30 days.

**爱发电（Afdian）** — manual activation code:

After sponsoring at [afdian.com/a/Lief-ai](https://afdian.com/a/Lief-ai), DM me your GitHub username and I'll send back an activation code:

```bash
familiar activate-code <your-code>
```

### For maintainers and forks

If you fork this project, override the GitHub OAuth client ID and sponsor target:

```bash
export FAMILIAR_GITHUB_CLIENT_ID=Iv1.your-oauth-app-id
export FAMILIAR_SPONSOR_TARGET=your-github-login
```

Register your OAuth App at https://github.com/settings/developers with **device flow enabled**.

## How affection works

Your pet's affection grows from `0` (陌生) to `100` (灵魂伴侣) based on how you interact:

- `/pet` — `+1`
- `/feed` — `+3` (1h cooldown)
- `/play` — `+2`
- Long Claude session (>1h) — `+5` per hour
- 24h no interaction — `-2` (gentle decay)

Your pet's mood updates based on Claude Code state — they react to errors, completions, rate limits, and idle time.

## MCP Server

`familiar` ships a built-in [MCP](https://modelcontextprotocol.io/) server so Claude Code (and any MCP-compatible client) can query and interact with your pet programmatically.

### Setup

Add to your `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "familiar": {
      "type": "stdio",
      "command": "familiar",
      "args": ["mcp"]
    }
  }
}
```

Then restart Claude Code. The server starts on-demand over stdio — no daemon, no ports.

### Available tools

| Tool | Description |
| --- | --- |
| `familiar_status` | Get pet name, species, affection (0–100), mood, last interaction |
| `familiar_speak` | Ask the pet to say something (personality-driven, LLM or template) |
| `familiar_interact` | Pet / feed / play — raises affection, respects cooldowns |
| `familiar_remember` | Persist a free-text memory note to `~/.familiar/memory.json` |

### Example

Once connected, Claude Code can call:

```
familiar_status → { "name": "Mochi", "affection": 72, "relationship": "挚友", ... }
familiar_speak  → "Mochi: 今天终于做完了，不容易。"
```

### Use alongside AWS Bedrock MCP

`familiar` plays nicely with other MCP servers. Run it next to AWS Labs' [`bedrock-kb-retrieval-mcp-server`](https://github.com/awslabs/mcp/tree/main/src/bedrock-kb-retrieval-mcp-server) to keep your pet on the statusline while Claude Code queries a Bedrock-backed knowledge base:

```json
{
  "mcpServers": {
    "familiar": {
      "type": "stdio",
      "command": "familiar",
      "args": ["mcp"]
    },
    "awslabs.bedrock-kb-retrieval-mcp-server": {
      "command": "uvx",
      "args": ["awslabs.bedrock-kb-retrieval-mcp-server@latest"],
      "env": {
        "AWS_PROFILE": "your-profile-name",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

The same pattern works for other Bedrock servers (`bedrock-agentcore-mcp-server`, `aws-bedrock-custom-model-import-mcp-server`) — your pet stays put while AWS tools land in the same chat session.

## Uninstall

```bash
npx claude-familiar uninstall
```

This removes the statusline + hooks from your Claude Code settings. Pet state in `~/.familiar/` is preserved by default.

## Configuration

Pet state lives at `~/.familiar/state.json` — safe to inspect, edit, or back up.

Environment variables:

- `FAMILIAR_HOME` — override the state directory (default: `~/.familiar`)
- `FAMILIAR_MODEL` — override the Claude model used for personality replies (default: same model your Claude Code uses)
- `FAMILIAR_MEMORY_DIR` — opt-in: a directory of `.md` files the pet reads to personalize replies (e.g. `~/.claude/projects/-/memory/`). Each file is redacted before being sent to the model. Default: disabled.
- `FAMILIAR_BRAIN` — pick how the pet generates replies:
  - `cli` (default) — spawn `claude -p`, reuse your Claude Code login. No API key required.
  - `api` — call the Anthropic SDK directly using `ANTHROPIC_API_KEY`.
  - `template` — disable the LLM entirely; pet always falls back to its hand-written lines.

## Privacy & Independence

> **tl;dr** — familiar has no backend. Your code, your conversations, and your pet data never leave your machine.

Unlike cloud-based AI companions or code tools that silently route your content through external servers:

- **No remote backend, no analytics.** familiar doesn't phone home. There is no familiar server. Check the source — it's all on GitHub.
- **Personality runs on your own Claude Code session.** When your pet replies, it spawns `claude -p` using your existing signed-in account. No separate API key, no familiar-owned endpoint — the same model, the same account, the same privacy guarantees you already have with Claude Code.
- **Pet state is local only.** Everything lives in `~/.familiar/` on your machine. Nothing is synced anywhere, no profile is created, no usage data is transmitted.
- **Memory is opt-in and stays local.** `FAMILIAR_MEMORY_DIR` is disabled by default. If you enable it, your `.md` files are read locally and redacted before being included in a prompt — they go to the same model you're already using, never to a familiar server (there isn't one).
- **Open source, auditable.** The entire codebase is on [GitHub](https://github.com/LIAlia111/familiar). You can read exactly what runs when you install it.

**Why this matters:** Some AI coding tools have been found to silently route project files to remote servers without clear consent. familiar was built on the opposite principle — it adds personality and presence without adding any new trust surface. If you already trust Claude Code, you already trust familiar.

## Author

Built by [Lief](https://github.com/LIAlia111) · [Portfolio](https://lief.liaolief.com) · made while building [JARVIS](https://jarvis.liaolief.com)

## License

MIT — see [LICENSE](./LICENSE).
