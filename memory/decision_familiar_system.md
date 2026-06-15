---
name: decision_familiar_system
description: familiar 系统设计演进史·MCP v1 设计+完成+npm 暂缓+Skills Over MCP 机会·合并自原 3 个文件·2026-05-18 整理
type: decision
status: archived
last_updated: 2026-05-18
---

## 系统总览

**familiar** = 公开 npm 桌宠 `claude-familiar@0.3.3`·老大跳槽 AI 工程师作品集·GitHub Sponsor + 爱发电双路径变现中。

**当前阶段**：MCP v1 已 build 通过 + 测试通过·**npm publish 暂缓·等老大授权**。

## 当前架构

### MCP v1 设计（2026-05-16 拍板·当日实现完成）

- 用户配置（最终形态）：
  ```json
  { "mcpServers": { "familiar": { "command": "npx", "args": ["-y", "claude-familiar", "mcp"] } } }
  ```
- 项目路径：`/root/lief-projects/familiar/`
- 新增文件：`src/mcp/server.ts` + `src/mcp/tools.ts`
- 新增依赖：`@modelcontextprotocol/sdk`
- CLI 改动：`src/cli/index.ts` 加 `mcp` 子命令入口
- 估计代码量：~150-200 行新代码

### 4 个 MCP Tool

1. `familiar_status` → 宠物名、好感度(0-100)、关系标签、上次互动时间（复用 `state/store.ts`）
2. `familiar_speak` → 宠物当前想说的话（复用 `brain/speak.ts`，template 模式）
3. `familiar_interact` → 触发互动 (pet/feed/play) → 好感度变化 → 宠物反应（复用 `state/affection.ts`）
4. `familiar_remember` → 存记忆到 `~/.config/familiar/memory.json`（新建 file backend）

### 当前阻塞·待老大决策

- **MCP v1 npm 发布**：build/握手通过·待老大授权（Lief 模式拦截 npm publish 命令）
- **Skills Over MCP 方向**：是否把 familiar skill 打包成 MCP server 分发（生态窗口期）

## 演进记录（正序·早→晚·最新在底·v2.4）
### 2026-05-16 09:00 · Skills Over MCP 生态机会窗口（早·早报后讨论）（早报后讨论·当天最早事件）

合并自原 `project_skills_over_mcp_familiar_opportunity.md`（方向决策性质 = decision·新规则归入）：

> ## Skills Over MCP · familiar 的机会窗口
>
> **背景**（2026-05-16 早报 + 老大讨论）：
>
> 社区开始用 MCP server 分发 Claude Code Skills。原来装 skill 要 `npx skills add <url>`，现在可以打包成 MCP server，用户只配一行地址即可。npm + MCP 路径正在被验证。
>
> **直接打到 familiar**：
>
> familiar 已有 `claude-familiar` npm 包（GitHub Sponsor 变现中）。StatusLine skill 就是这个方向。下一步可以：
> 1. 把 familiar 的 skill(s) 打包成 MCP server 发布
> 2. 让 Claude Code 用户一行配置安装 familiar 全套
> 3. 蹭上当前生态热度（窗口期：现在）
>
> **讨论结论**：待老大决策——是否做 familiar MCP 分发版。进了升级队列 `u20260516_frontier_01`。
>
> **How to apply**：下次老大在任何入口提到「familiar MCP」「skill 分发」「familiar 下一步」时，直接 recall 这条。


### 2026-05-16 19:15 · MCP v1 完成（jarvis-b 实现）

合并自原 `project_familiar_mcp_v1_spec.md`（spec 性质 = 设计决定·新规则归入 decision）：

> ## familiar MCP server v1 · 设计规格
>
> **目标**：claude-familiar 加 `mcp` 子命令，用户加一行配置即可用。
>
> **用户配置（最终形态）**：
> ```json
> { "mcpServers": { "familiar": { "command": "npx", "args": ["-y", "claude-familiar", "mcp"] } } }
> ```
>
> **新增文件**：
> ```
> /root/lief-projects/familiar/src/mcp/
>   server.ts   ← stdio MCP 服务入口（用 @modelcontextprotocol/sdk）
>   tools.ts    ← 4 个 tool 定义
> ```
>
> **4 个 Tool**：
> 1. `familiar_status` → 宠物名、好感度(0-100)、关系标签、上次互动时间（复用 state/store.ts）
> 2. `familiar_speak` → 宠物当前想说的话（复用 brain/speak.ts，template 模式）
> 3. `familiar_interact` → 触发互动(pet/feed/play)→好感度变化→宠物反应（复用 state/affection.ts）
> 4. `familiar_remember` → 存记忆到 ~/.config/familiar/memory.json（新建 file backend）
>
> **新增依赖**：`@modelcontextprotocol/sdk`
>
> **CLI 改动**：`src/cli/index.ts` 加 `mcp` 子命令入口
>
> **估计代码量**：~150-200 行新代码
>
> **完成后**：
> - npm version patch + npm publish
> - README 加 MCP 配置那一行
> - 在 JARVIS 本地测试 familiar mcp 工作
>
> **项目路径**：`/root/lief-projects/familiar/`

→ 实现验证见 `episode_familiar_mcp_v1_done_0516.md`（build 87ms 通过·MCP 握手通过·tools/list 返回 4 个）



### 2026-05-16 22:00 · MCP npm 发布暂缓决策（晚·当晚老大问发哪后定）（最晚事件·当晚老大问发哪后定）

合并自原 `decision_familiar_mcp_npm_defer_0516.md`：

> ## 决策：familiar MCP v1 暂不发布 npm（2026-05-16）
>
> **状态**：familiar MCP v1 build 通过、测试通过，但 npm publish 暂缓。
>
> **原因**：
> - 老大问「发布到哪里」时才意识到 npm 是公网发布（任何人可安装）
> - 老大说「先不发」——需要再确认再发布
> - Lief 模式拦截了 npm publish 命令（需要明确授权）
>
> **待确认**：
> - 什么时候发布（等 README 补充 MCP 配置说明后？）
> - 版本号（v0.3.4 patch？还是 v0.4.0 minor？）
> - 老大亲自授权后再执行
>
> **发布命令**（老大确认后让 b 跑）：
> ```bash
> cd /root/lief-projects/familiar
> npm version patch
> npm publish
> ```


## 相关文件

- 设计经验 → `feedback_familiar.md`（一天 5 版踩坑·6 条规则）
- 项目状态 → `project_familiar_status.md`（npm 0.3.3·小嘉宝·tests）
- 外部资源 → `reference_familiar.md`（npm/GitHub/env vars/私有后台/release 历史）
- 实现事件 → `episode_familiar_mcp_v1_done_0516.md`（MCP v1 完成）
- 跨系统关联 → `feedback_pet_vs_jarvis.md`（贾维斯身份·不是宠物）
