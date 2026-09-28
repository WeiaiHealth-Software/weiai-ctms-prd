# 截图资源说明

本文档 `惟爱科研管理系统-产品介绍文档.md` 中引用了以下 13 张截图，请按下方清单逐一截取后放入本目录（`docs/promotion/images/`）。

## 截图清单

| 序号 | 文件名 | 对应页面 / 路由 | 截图要点 |
|---|---|---|---|
| 01 | `01-dashboard.png` | `/#/index` Dashboard 系统总览 | 完整页面（含侧边栏菜单、头部、4张统计卡、数据完整度环形图、年龄性别分布图） |
| 02 | `02-iwrs-dimensions.png` | 创建向导 Step2 / `Step2Dimensions.tsx` | 维度选择卡片 + 已选维度配置预览两部分内容 |
| 03 | `03-edc-builder.png` | `/#/index/edc/templates/builder` 表单样板间构建器 | 三栏布局整体效果：左侧组件库、中间画布（带 Section+字段）、右侧属性面板 |
| 04 | `04-visit-timeline.png` | 受试者详情页 `SubjectDetailPage` | 左栏访视时间轴 + 中栏 CRF 表单 + 右栏目录导航，整体三栏 |
| 05 | `05-ai-assistant.png` | EDC 或 IWRS 项目详情页，打开 AI 助手 | 右侧 AI 助手面板展开状态：快捷问答 + 聊天区 + 模型切换 |
| 06 | `06-system-logs.png` | `/#/index/system/logs` 日志管理 | 日志列表 + 查询筛选区，可截图 1 条日志详情抽屉打开的效果 |
| 07 | `07-iwrs-project-list.png` | `/#/index/projects` IWRS 项目管理 | 顶部筛选 Tab + 搜索/新增工具栏 + 项目列表表格（至少 3 行数据） |
| 08 | `08-iwrs-wizard.png` | 创建向导顶部进度条 `ProjectWizard.tsx` | 4 步进度条（基础设置 / 维度选择 / 分组配置 / 裂变配置）处于第 2 或第 3 步的状态 |
| 09 | `09-iwrs-group-overview.png` | 项目详情页中部"分组与维度概览" | 至少 2 张分组卡片（实验组 + 对照组），展示性别/年龄/指标分布 + 因子匹配详情 |
| 10 | `10-iwrs-enrollment.png` | `SubjectEnrollmentDrawer` 受试者录入抽屉 | 抽屉内录入表单 + 下方匹配结果区域 |
| 11 | `11-edc-builder-3col.png` | `TemplateBuilderPage.tsx` 构建器 | 高清大图：Palette 组件库 + Canvas 动态画布 + Property 属性面板，三栏同框 |
| 12 | `12-edc-project-detail.png` | `/#/index/edc/projects/:projectId` | 项目头部 + 4 张筛选中/已入组/随访中/提前退出统计卡 + 受试者管理表格 |
| 13 | `13-edc-subject-visit.png` | `SubjectDetailPage.tsx` | 左栏：蓝色信息卡 + 访视时间轴；中栏：访视表单标题栏 + 只读/编辑按钮组 + 动态表单 |

## 截图建议规格

- 推荐尺寸：宽度 **1440px** 左右，长度根据页面滚动截取（fullPage）
- 格式：PNG，白底即可
- 数据：请使用合理的 **Mock 数据**（不要使用真实患者姓名/编号），可在对应的 mock 文件中临时填充更丰富的数据后再截图
  - IWRS 项目 Mock：`src/mock/projects.ts`、`src/store/useProjectsStore.ts`
  - EDC 项目 Mock：`src/data/edc/projects.ts`、`src/data/edc/subjects.ts`
  - EDC 模板 Mock：`src/data/edc/mockTemplateSchema.ts`
  - 日志 Mock：`src/pages/system/logs/logMockData.ts`

## 截图操作方式

在开发服务器（`npm run dev`，默认端口 5173）启动后：

1. 浏览器打开对应路由
2. 使用浏览器开发者工具的 **Device Toolbar** 设置 1440×900 或类似的桌面分辨率
3. 对于超过一屏的页面，使用浏览器扩展（如 **GoFullPage** / **FireShot**）或 Chrome 内置命令：
   - `⌘⇧P` → 输入 `Capture full size screenshot`
4. 保存为对应文件名，放入本目录即可

---

*如后续制作 PPT 版本，以上 13 张截图同样可复用。*
