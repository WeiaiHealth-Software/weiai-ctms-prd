# 表单组件 + Select/Tabs 基础组件 实现计划

> **目标：** 在“系统 UI 组件规范”页面新增“表单组件”Tab；封装可复用的 Tabs、Select、MultiSelect 组件（参考 HeroUI 交互与结构，不引入依赖）；同步更新 DESIGN.md。
>
> **架构：** 新增 3 个基础组件文件（Tabs/Select/MultiSelect），UI 规范页仅作为示例展示与规范沉淀；SelectBlock 从原生 select 升级为自定义 Select。
>
> **技术栈：** React + TypeScript + TailwindCSS + lucide-react

---

## 文件变更清单

- 新增：[Tabs.tsx](file:///Users/luffyzh/luffyzh/github/profit-projects/weiai-ctms-prd/src/components/common/Tabs.tsx)
- 新增：[Select.tsx](file:///Users/luffyzh/luffyzh/github/profit-projects/weiai-ctms-prd/src/components/form/Select.tsx)
- 新增：[MultiSelect.tsx](file:///Users/luffyzh/luffyzh/github/profit-projects/weiai-ctms-prd/src/components/form/MultiSelect.tsx)
- 修改：[SelectBlock.tsx](file:///Users/luffyzh/luffyzh/github/profit-projects/weiai-ctms-prd/src/components/form/SelectBlock.tsx)
- 修改：[ui-spec/index.tsx](file:///Users/luffyzh/luffyzh/github/profit-projects/weiai-ctms-prd/src/pages/ui-spec/index.tsx)
- 修改：[DESIGN.md](file:///Users/luffyzh/luffyzh/github/profit-projects/weiai-ctms-prd/DESIGN.md)

## 任务 1：封装 Tabs 组件（参考 HeroUI）

- [ ] 新增 `Tabs` 组件：`items` + `value` + `onChange` + `variant(primary/secondary)` + `disabled`
- [ ] 支持键盘左右切换（跳过 disabled）
- [ ] 在 UI 规范页顶部 Tab 导航替换为新 Tabs 组件

## 任务 2：封装 Select / MultiSelect 组件（参考 HeroUI）

- [ ] 新增 `Select`：触发器 + 下拉面板 + 选项；支持点击外部关闭、Esc 关闭、键盘上下/回车选择
- [ ] 新增 `MultiSelect`：多选列表 + 触发器内 Tag 回显；支持面板内勾选/取消、点击外部关闭、Esc 关闭
- [ ] 升级 `SelectBlock`：由原生 `<select>` 改用新 `Select`

## 任务 3：UI 规范页新增“表单组件”Tab

- [ ] 新增 Tab：放在“表格页”后
- [ ] 静态示例：Input/InputSearch、Radio/RadioButton、Checkbox/Switch、Select/MultiSelect、Textarea

## 任务 4：同步更新 DESIGN.md

- [ ] 增加“表单组件”章节：沉淀输入控件、单选/多选、Select/MultiSelect、Textarea 的样式与交互规范
- [ ] 增加基础组件说明：Tabs/Select/MultiSelect 的推荐用法与状态（disabled/focus/open）

## 验证

- [ ] TypeScript 诊断：无新增报错
- [ ] `npm run build`：构建通过

