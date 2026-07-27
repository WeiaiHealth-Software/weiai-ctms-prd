# 日志管理页面改版实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将日志管理页改造成最近 7 天高密度审计列表，并支持通过右侧抽屉查看按日志类型定制的详细审计信息。

**架构：** 保持页面入口在 `src/pages/system/logs/index.tsx`，将日志数据结构、mock 数据和日期工具拆分到同目录独立文件，再新增一个 `LogDetailDrawer` 组件承载详情展示。页面负责筛选、列表渲染和详情打开状态，数据模块负责最近 7 天 mock 日志与详情字段建模。

**技术栈：** React、TypeScript、Tailwind CSS、Lucide React、项目现有 Drawer 组件

---

### 任务 1：定义最近 7 天日志数据模型

**文件：**
- 修改：`src/pages/system/logs/logUtils.ts`
- 创建：`src/pages/system/logs/logMockData.ts`

- [ ] 梳理日志公共字段、风险等级、详情分组和按类型扩展字段。
- [ ] 在 `logUtils.ts` 中补充日期格式化、最近 N 天日期时间生成和默认筛选范围能力。
- [ ] 在 `logMockData.ts` 中生成 8 到 12 条最近 7 天日志，覆盖登录审计、数据操作日志、系统日志，以及成功 / 失败、低 / 中 / 高风险。

### 任务 2：实现右侧详情抽屉

**文件：**
- 创建：`src/pages/system/logs/LogDetailDrawer.tsx`

- [ ] 基于现有 `Drawer` 组件实现日志详情抽屉。
- [ ] 提供事件摘要、操作主体、操作对象、环境与追踪四个公共分组。
- [ ] 根据日志类型渲染登录审计、数据操作日志、系统日志的专属字段块。

### 任务 3：重构日志列表页面

**文件：**
- 修改：`src/pages/system/logs/index.tsx`

- [ ] 接入新的 mock 数据与默认日期范围。
- [ ] 将表格列调整为时间、类型、模块、操作人、动作、IP / 终端、结果、风险等级、操作。
- [ ] 实现高风险 / 失败日志的更强视觉提示。
- [ ] 接入“查看详情”交互并打开详情抽屉。
- [ ] 保持筛选、重置和空状态行为与最近 7 天口径一致。

### 任务 4：验证

**文件：**
- 验证：`src/pages/system/logs/index.tsx`
- 验证：`src/pages/system/logs/logUtils.ts`
- 验证：`src/pages/system/logs/logMockData.ts`
- 验证：`src/pages/system/logs/LogDetailDrawer.tsx`

- [ ] 运行定向校验，确认 mock 数据时间范围落在最近 7 天且默认日期区间正确。
- [ ] 运行定向 lint，确认本次变更文件无新增问题。
- [ ] 运行构建，确认页面可以正常编译。
