---
name: familiar 桌宠设计经验
description: 做 claude-familiar 一天迭代 5 个版本积累的产品+架构经验：模板 vs LLM 的权衡、env var 区分公私版、状态栏要会动
type: feedback
originSessionId: d72a7f46-abb8-4035-ab3d-9fd2678da1fe
---
**规则 1：高频路径用模板，低频路径用 LLM。**

**Why:** 一开始我误以为"自由生成 = 更好"，结果 hook 默认 useApi:false 是对的——每次 Claude 答完话都调一次 LLM，会有 15s 延迟 + 烧配额 + 队列堆积。老大一句话点醒："不如加多一点回复模板，随便加 100 句"——加到 ~125 句后，状态栏循环 6+ 分钟才重复一次，机械感消失。

**How to apply:** 设计 LLM 应用的"陪伴"功能时，先问"这个触发频率多高？"。每次都触发的（hook、心跳、polling）必须用模板/确定性逻辑；用户主动触发的（slash command、按钮）才用 LLM。永远给"零成本路径"作为兜底。

---

**规则 2：公开开源版 + 老大专属配置 = 用 env var 分开。**

**Why:** 老大反复强调"github 那个版本和我专属版本要分开"。最初想 fork 一个私有分支，但维护成本高。最终方案：公开版加 env var 开关（默认关），老大本地 ~/.bashrc 设这个开关 → 同一份代码两种行为。例：FAMILIAR_MEMORY_DIR 默认空 → 公开用户不读 memory；老大设了 → 他的小嘉宝读他的 memory 文件。

**How to apply:** 任何"公开版功能" + "老大专属增强"的场景，第一选择是 env var/config flag，不要 fork 分支。env var 名字带项目前缀（FAMILIAR_*）避免冲突。

---

**规则 3：Claude Code 应用直接 spawn `claude -p`，不用 Anthropic SDK。**

**Why:** 任何已经在 Claude Code 环境里跑的工具，用户必然已登录 Claude Code（Pro/Max/API key 都行）。`claude -p "<prompt>"` 直接复用这个登录态，无需任何 API key 配置，也不需要让用户开 ANTHROPIC_API_KEY。familiar 之前默认走 Anthropic SDK，没 API key 时静默 fallback 到模板，README 上写的"no extra API key"是空头支票。改成 spawn `claude -p` 后立刻兑现承诺。

**How to apply:** 写"插件级"Claude Code 工具时，brain 优先 `claude -p`，再 fallback 到 SDK。注意 `claude -p` 启动慢（~15s 首次冷启动），所以高频路径仍要用模板。

---

**规则 4：状态栏要"会动"才有陪伴感。**

**Why:** 状态栏一开始只显示 `🐉 名字 Lv.X ♥♡♡♡♡` 这种死信息，老大问"为什么状态栏不会说话"。加上 speech bubble 显示 recentQuotes[0] 后还是"被钉死的同一句话"，于是又加了 20 秒 ambient 轮播。最终效果：每 20 秒小嘉宝在状态栏说一句新的，呼吸感强。

**How to apply:** "陪伴型"产品的常驻 UI 元素必须有"低频呼吸"动画/轮播，不能是死的。轮播用确定性算法（时间桶 + 模 N），无状态、零成本、无后台进程。

---

**规则 5：开源项目第一步是"复制素材到项目目录"，不是写代码。**

**Why:** 我让 extract-sprites.mjs 直接读 `/root/.jarvis_memory/pet_preview*.py`，路径进了 git 历史，被 push 到公开仓库。后来用 filter-branch 重写 + force push 才清干净，44 处污染 + force-rewrite v0.2.0 tag。

**How to apply:** 任何要进 git 的代码/计划/脚本，引用的外部素材必须先复制到项目目录，再用相对路径引用。NEVER 在 git tracked 文件里出现 `/root/.{私人项目}/`、`~/.{私人项目}/` 之类的绝对路径。

---

**规则 6：npm 发包前必须做的两件事。**

**Why:** 老大第一次发 npm 时踩了两个坑：（1）想用 `familiar` 这个包名，被 jrmykolyn 占了（2022 年废弃但占着）；（2）生成了 Classic Automation token，不支持 bypass 2FA，发包 403。

**How to apply:**
1. 包名先 `curl -sI https://registry.npmjs.org/<name>` 查 200/404
2. 被占了走 `claude-` 前缀（跟 Claude Code 生态明示关联，比 scope 包更专业）
3. token 必须用 Granular Access Token + 勾选 "bypass 2FA"，不是 Classic
