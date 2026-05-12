# UI 设计规范（草案）

目标：把“页面骨架、间距、颜色、组件状态”收敛成统一标准，后续新增/改造页面时只需要对齐本规范即可保持一致。

## 1. 全局原则

- 页面结构优先：先统一“页面骨架”，再统一“组件细节”
- 组件一致性优先：同类组件（按钮、输入框、表格、弹窗）在不同页面表现一致
- 克制的装饰：阴影、渐变与动画只做轻量增强，不喧宾夺主

## 2. 设计令牌（Tailwind）

### 2.1 品牌色（brand）

来自 `tailwind.config.js` 的 `colors.brand`：

- 主按钮/主色文字：`text-brand-600` / `bg-brand-600`
- 主按钮 hover：`hover:bg-brand-700`
- 主色浅底：`bg-brand-50`、描边：`border-brand-100`

### 2.2 圆角、边框、阴影

- 卡片圆角：`rounded-2xl`
- 轻弹窗圆角：`rounded-3xl`
- 卡片边框：`border border-slate-100`
- 分割线：`border-slate-100`（轻）/ `border-slate-200`（中）
- 卡片阴影：`shadow-sm`

### 2.3 页面间距

- 页面容器：`p-6 space-y-6`
- 卡片内边距：筛选卡 `p-5`；表格卡通常不需要 `p`，使用表格 `px-6 py-4` 控制
- 区块间距：`gap-3`（按钮组）/ `gap-4`（筛选项）/ `space-y-4`（卡片内纵向）

## 3. 常规表格页（推荐标准）

表格页= 工具栏（筛选/搜索/Action 同块）+ 表格主体。页面结构推荐如下：

```
Page（p-6 space-y-6）
  SpecCard（浅蓝背景+蓝色边框+标题+无序列表）
  ToolbarCard（bg-white rounded-2xl shadow-sm border border-slate-100 p-4）
  TableCard（bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden）
```

### 3.1 组件规范卡（SpecCard）

- 位置：每个组件示例顶部必须有一张规范卡
- 容器：`rounded-2xl border border-brand-200 bg-brand-50/60 p-4`
- 标题：`text-sm font-bold text-brand-700`
- 内容：无序列表（list-disc），用于写该组件开发约束与注意事项

### 3.2 工具栏（ToolbarCard）

- 容器：`bg-white rounded-2xl shadow-sm border border-slate-100 p-4`
- 布局：左侧筛选（如状态 Tab），右侧搜索/重置/新增
- Action（新增）必须位于最右侧，和左侧查询区用竖线分割：`h-8 w-px bg-slate-200`
- 搜索输入框：`pl-9` + 搜索图标绝对定位
- 主操作按钮（新增/搜索）：`bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold`
- 次按钮（重置）：`border border-slate-200 text-slate-600 hover:bg-slate-50`

### 3.3 表格主体（TableCard）

- 容器：`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden`
- Table：`w-full text-left border-collapse whitespace-nowrap`
- 表头行：`bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider`
- 表头单元格：`px-6 py-4 font-semibold`
- 表体：`divide-y divide-slate-100 text-sm`
- Hover：行 `hover:bg-slate-50/80 transition-colors`
- 空态：`py-12 text-center text-slate-400`

### 3.4 操作列（Actions）

- 所有操作项：必须是 `cursor-pointer`
- 第一个操作（如“查看详情/编辑”）：按钮式，浅色主题背景 + 主题色文字
  - 推荐：`cursor-pointer px-3 py-2 rounded-md bg-brand-50 hover:bg-brand-100 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors`
- 删除操作：纯 link，无背景
  - 推荐：`cursor-pointer text-sm font-medium text-red-500 hover:text-red-600 transition-colors`
- 删除必须二次确认：点击删除后弹出确认弹窗，确认后才执行删除逻辑

## 4. 弹窗（Modal）推荐标准

用于“新增/编辑”这类表单：

- 遮罩：`bg-slate-900/35 backdrop-blur-sm`
- 容器：`bg-white rounded-3xl shadow-2xl border border-slate-200`
- 标题区：左标题+说明，右侧关闭按钮（胶囊按钮）
- 表单两列：`grid grid-cols-1 md:grid-cols-2 gap-4`；第一行整行字段建议单独一行
- 底部按钮：右侧对齐，取消（次按钮）+ 确认（主按钮）

## 5. 实施建议

- 新页面默认从“常规表格页标准”起步，不在每个页面发明新样式
- 老页面逐步迁移：优先迁移筛选区/按钮/表格卡三块
- 组件示例页（UI 组件规范）作为落地参考：有争议以示例为准，再回写 DESIGN.md
