---
name: familiar 项目状态
description: 老大第一个公开开源作品，v0.3.3 已发布到 npm 作为 claude-familiar，作为 AI 工程师跳槽作品集。已从"上架"演进到"真正活的桌宠"
type: project
originSessionId: d72a7f46-abb8-4035-ab3d-9fd2678da1fe
---
**familiar** 是老大第一个公开的 AI 工程师跳槽作品集项目。

**当前状态（2026-05-03 晚）：**
- npm 版本 `claude-familiar@0.3.3`（一天发了 6 个版本：0.2.0→0.2.1→0.3.0→0.3.1→0.3.2→0.3.3）
- GitHub: https://github.com/LIAlia111/familiar （public，5 个 release tags）
- 安装命令: `npx claude-familiar install`
- 62/62 tests passing
- README 有 4 个 badge（npm version / downloads / license / node）
- 10 个 GitHub topics + npm 主页链接 + 完整 release notes

**核心特性：**
- 7 宠物 × 5 皮肤 = 35 cosmetic variants（cat/capybara 免费，dragon/ghost/octopus/panda/pig 赞助）
- 跨终端 ANSI 半块渲染（不依赖 Kitty graphics protocol）
- 多宠物 schema v2 + 冷却系统 + 等级解锁
- 双赞助路径：GitHub Sponsors（OAuth Device Flow 自动验证）+ 爱发电（HMAC 激活码）
- **每只宠物 ~125 句模板**（按使用频率分配：task_completion 30 句、ambient_random 20 句等）
- **状态栏会说话**（recentQuotes[0] 显示，新说的话停 20 秒，之后 ambient 每 20 秒切一句）
- **可读 memory**（FAMILIAR_MEMORY_DIR 开关，默认关）
- **优先用 Claude Code 已登录账号**（FAMILIAR_BRAIN=cli 默认，无需 API key）

**老大的小嘉宝（dragon 宠物）当前在他这台机器上：**
- 名字：小嘉宝（出生 2026-05-03）
- 已激活赞助身份（FAMILIAR_BRAIN=cli + FAMILIAR_MEMORY_DIR=~/.claude/projects/-/memory/）
- 主动 /pet 时会用老大的 Max 账号 + memory 现场生成傲娇龙台词

**Why:** 老大职业目标是从 AI 设计师跳到 AI 应用工程师（25-35K，深圳创业公司），需要"已上架、能装、活的"开源项目而不是 PPT demo。本项目同时是个真实可用的桌宠产品。

**How to apply:** 后续涉及 familiar 的工作记得：
1. 老大已经把这当作品集主推，HR 可见性优先
2. 任何破坏性改动（API、命令名、state schema）必须提供迁移路径
3. 项目隔离规则适用 —— 改 familiar 时不要顺手改其他项目
4. 公开版（github/npm）和老大本地版是同一份代码，但通过 env var（如 FAMILIAR_MEMORY_DIR）做"老大专属配置"，不污染公开版
5. 如果加新功能，优先做"零成本"模板路径，再加"灵魂"LLM 路径作为可选
