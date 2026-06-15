---
name: familiar 关键路径
description: familiar 项目的 npm 包、GitHub repo、私有后台工具、关键源文件位置、env var 配置
type: reference
originSessionId: d72a7f46-abb8-4035-ab3d-9fd2678da1fe
---
**公开资源：**
- npm 包：https://www.npmjs.com/package/claude-familiar
- GitHub repo：https://github.com/LIAlia111/familiar
- 最新 Release：https://github.com/LIAlia111/familiar/releases/tag/v0.3.3
- 爱发电赞助页：https://afdian.com/a/Lief-ai

**项目代码：**
- 项目根目录：`/root/lief-projects/familiar/`
- 入口：`src/cli/index.ts`
- 状态管理：`src/state/`（v2 schema + migrate + sanitize）
- 宠物定义：`src/pets/<species>/`（每种宠物一个文件夹，personality.ts 含 ~125 句模板）
- 赞助验证：`src/sponsor/`（oauth + check + state + code/HMAC + config）
- 命令处理：`src/commands/`
- Brain：`src/brain/client.ts`（spawn `claude -p` 走老大 Max 账号）
- 状态栏：`src/statusline/render.ts`（speech bubble + 20s ambient 轮播）
- 测试：`tests/`

**老大本机的 env var（在 ~/.bashrc 已设）：**
- `FAMILIAR_MEMORY_DIR=$HOME/.claude/projects/-/memory` — 让小嘉宝读老大的 Claude Code memory
- `FAMILIAR_BRAIN=cli`（默认值，不用显式设）— 用 claude CLI 而不是 SDK

**全部 env vars 文档：**
- `FAMILIAR_HOME` — 状态目录（默认 ~/.familiar）
- `FAMILIAR_MODEL` — Claude 模型 override
- `FAMILIAR_MEMORY_DIR` — opt-in 记忆目录
- `FAMILIAR_BRAIN` — `cli`（默认）/`api`/`template`
- `FAMILIAR_GITHUB_CLIENT_ID` — fork 时 override OAuth App
- `FAMILIAR_SPONSOR_TARGET` — fork 时 override 维护者
- `FAMILIAR_SPONSOR=1` — 本地开发跳过赞助验证

**私有后台工具（NEVER 推到 GitHub）：**
- 目录：`/root/.familiar-admin/`（mode 0700）
- `credentials.json`（mode 0600）：爱发电 user_id + token
- `grant.js`：根据 GitHub 用户名生成激活码（用法：`node grant.js <github_login>`）

**npm 发布凭证：**
- `~/.npmrc`（mode 0600）：Granular Access Token，scope=All packages，bypass 2FA enabled
- npm 用户名：`lialia111`

**GitHub OAuth App（公开 Client ID 嵌在代码里）：**
- Client ID：`Ov23liB9dut0OQ6GZc2t`（在 `src/sponsor/config.ts`）
- 没有 Client Secret（Device Flow 不需要）

**沟通渠道：**
- Telegram chat_id（老大）：`6295174398`
- 老大 GitHub：`LIAlia111`，提交 author 用 noreply 邮箱 `155314889+LIAlia111@users.noreply.github.com`

**Release 历史（一天 5 个 minor/patch）：**
- v0.2.0 — 首次公开发布（GitHub OAuth + 多宠物 schema + 35 皮肤）
- v0.2.1 — FAMILIAR_MEMORY_DIR 接通
- v0.3.0 — 用 claude CLI 替换 Anthropic SDK 当默认 brain
- v0.3.1 — 每只宠物模板扩到 ~125 句
- v0.3.2 — 状态栏 speech bubble
- v0.3.3 — 状态栏 ambient 20s 轮播

**重要 commit 历史已清理：**
- 所有提交 author 用 noreply 邮箱（之前 filter-branch 清过）
- git 历史里 `/root/.jarvis_memory/` 路径引用已被 filter-branch 替换为 `./scripts/prototypes/`，并 force-pushed
