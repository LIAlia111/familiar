# familiar

> A pixel-art pet companion for [Claude Code](https://docs.anthropic.com/claude/claude-code) CLI. Lives in your statusline. Reacts to your sessions. Grows with you.

## Install

```bash
npx familiar install
```

You'll be asked to pick a starter pet and name them. Then restart Claude Code (or open a new session) and your pet appears in the statusline.

## Why familiar?

Other Claude Code pet projects either require [Kitty graphics protocol](https://sw.kovidgoyal.net/kitty/graphics-protocol/) (excluding most terminals) or stay text-only without real personality.

`familiar` is the first companion that:

- Works in **any terminal** with 24-bit ANSI color (Tabby, Windows Terminal, iTerm, kitty, WezTerm, even basic SSH)
- Has **real personality** — replies powered by your own Claude account, no extra API key
- Has **persistent memory** — reads `CLAUDE.md` and `~/.claude/projects/-/memory/` so the pet knows your project
- **Open-core**: 2 free pets + premium pet pack via sponsorship

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

## Uninstall

```bash
npx familiar uninstall
```

This removes the statusline + hooks from your Claude Code settings. Pet state in `~/.familiar/` is preserved by default.

## Configuration

Pet state lives at `~/.familiar/state.json` — safe to inspect, edit, or back up.

Environment variables:

- `FAMILIAR_HOME` — override the state directory (default: `~/.familiar`)
- `FAMILIAR_MODEL` — override the Claude model used for personality replies (default: same model your Claude Code uses)

## Author

Built by [Lief](https://github.com/LIAlia111).

## License

MIT — see [LICENSE](./LICENSE).
