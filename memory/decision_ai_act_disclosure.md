---
name: AI Act Article 50 透明度合规方案
description: claude-familiar npm 包·欧盟 AI Act Article 50 合规改造方案·2026-08-02 强制生效·等老大拍板
type: decision
---

# AI Act Article 50 透明度合规方案

> 来源：u20260602_217 待办（早报命中）
> 调研日：2026-06-02
> 强制日：**2026-08-02**（剩 ~2 个月）
> 状态：⏸️ 方案备好·src 改动需老大审核·publish 必报备

## 法规要点（Article 50）

- **适用**：chatbot / virtual assistant / 系统与人互动 → 必须告知用户在和 AI 互动
- **时机**：第一次互动**前**或对话最开头
- **例外**：从语境**显而易见**是 AI（门槛比想象中高）
- 还覆盖：生成内容标记 / 情绪识别披露 / deepfake 披露

## familiar 风险评估

| 部分 | 风险 | 理由 |
|---|---|---|
| 包名 `claude-familiar` | 🟡 低 | "Claude" 暗示 AI·算半披露 |
| 静态 sprite 像素动画 | 🟢 无 | 不构成 AI 互动 |
| `brain/speak.ts` 调 API 生成台词 | 🔴 中 | 动态 AI 生成·明确合规需求 |
| `commands/_interaction.ts` 用户互动 | 🟡 中 | 取决于是否触发 AI 生成 |

## 合规方案（3 档·按改动量）

### 方案 A：最小改动·仅 README + activate 横幅（推荐）

1. **README 加 "AI Disclosure" 章节**：
   ```
   ## AI Disclosure (EU AI Act Article 50)
   familiar uses Claude AI to generate dynamic dialogue.
   When you see your pet speak, that text may be AI-generated.
   ```
2. **`familiar activate` / `familiar claim` 首次输出加一行**：
   ```
   🤖 Powered by Claude AI — your pet's dialogue is AI-generated
   ```
3. 改动文件：`README.md` + `src/commands/activate.ts` + `src/commands/claim.ts`（~10 行）
4. 影响：低·不动核心逻辑
5. publish：bump 0.3.x → 0.4.0（minor）

### 方案 B：方案 A + speak.ts 首次返回加 prefix

- 第一次 `speak()` 返回前缀 `[AI]` 或加 metadata 标记
- 优点：每次 AI 生成都自带标记
- 缺点：改用户体验·宠物台词观感变化
- 风险：可能影响包评分

### 方案 C：完整合规（生成内容机器可读标记）

- 实现 Article 50 第 2 款「生成内容机器可读标记」
- 在 brain/speak.ts 返回的台词加水印或元数据
- 改动大·过度合规·非聊天机器人不强制

## 推荐

**方案 A**·~2 个月缓冲足够老大审核 + publish 0.4.0。

## 待老大决策

- ✅ 走方案 A 吗？
- ✅ README + 横幅文案要不要老大亲拟？
- ✅ bump 到 0.4.0 还是 0.3.5？
- ✅ publish 前要不要先发 PR 评估社区反应？

## 不做项（出于风险）

- 🚫 不擅自改 src/（lief-projects/CLAUDE.md 红线）
- 🚫 不擅自 publish（familiar/CLAUDE.md 红线）
- 🚫 不擅自改 package.json description（影响 npm 搜索）

## 参考

- https://artificialintelligenceact.eu/article/50/
- https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content
