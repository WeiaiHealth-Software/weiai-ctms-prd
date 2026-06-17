# IWRS / EDC 合规差距分析与改造计划（基于当前仓库现状）

本文将 [regulatory-requirements-cn.md](file:///workspace/docs/regulatory-requirements-cn.md) 的要求落到“当前代码仓库”的现状上，输出差距清单与改造路线图，便于你把系统从“演示原型”升级为“可支持受监管临床试验的验证型系统”。

## 1. 当前仓库现状摘要（从代码可见的事实）

### 1.1 工程形态

- 单体前端：Vite + React + TS（见 [package.json](file:///workspace/package.json#L1-L42)）
- 路由：HashRouter（见 [main.tsx](file:///workspace/src/main.tsx#L1-L13)、[router/index.tsx](file:///workspace/src/router/index.tsx#L1-L60)）
- 无后端工程、无数据库、无 API client/service 层统一封装（从仓库结构可见）

### 1.2 EDC 功能实现形态

- 具备“动态表单引擎 + 模板构建器”雏形：
  - 表单渲染： [DynamicFormRenderer.tsx](file:///workspace/src/modules/edc/form-engine/DynamicFormRenderer.tsx#L1-L34)
  - 字段分发： [DynamicFieldRenderer.tsx](file:///workspace/src/modules/edc/form-engine/DynamicFieldRenderer.tsx#L1-L145)
  - 初始值生成： [buildInitialFormData.ts](file:///workspace/src/modules/edc/form-engine/utils/buildInitialFormData.ts#L1-L39)
  - 构建器页面： [TemplateBuilderPage.tsx](file:///workspace/src/pages/edc/templates/TemplateBuilderPage.tsx#L24-L305)
- 数据主要来自 mock：如 `defaultTemplateFields`（见 [mockTemplateSchema.ts](file:///workspace/src/data/edc/mockTemplateSchema.ts#L1-L107)）

### 1.3 权限/审计/签名/备份的缺失（决定性差距）

- 认证/授权仅为演示级：`useAuthStore` 只保存一个 role 字符串，无登录、无唯一账号、无会话（见 [useAuthStore.ts](file:///workspace/src/store/useAuthStore.ts#L1-L13)）
- 关键数据部分存 localStorage：主站 projects store 将数据写入浏览器本地（见 [useProjectsStore.ts](file:///workspace/src/store/useProjectsStore.ts#L1-L55)）
- 无“不可篡改稽查轨迹（Audit Trail）”、无电子签名、无锁库、无备份恢复机制（代码中未见相关模块）

结论：以现状直接用于受监管临床试验，不满足 GCP 对电子数据系统“验证、稽查轨迹、权限、安全、备份”等核心要求；当前更适合作为 UI/交互与流程原型。

## 2. 合规差距清单（按监管关注点分组）

下述“差距”并非要把所有条目一次性做到位；可按风险分级逐步实现。但任何进入真实临床试验的版本，必须先补齐“高风险/关键数据/盲态”相关能力。

### 2.1 计算机化系统验证（CSV）与受控过程

- 缺少 URS/风险评估/验证方案/测试记录/验证总结（VSR）
- 缺少变更控制、发布管理、偏差处理、CAPA、周期性回顾（Periodic Review）机制
- 缺少 SOP：账号管理、权限审批、备份恢复、应急预案、系统退役、数据迁移等

### 2.2 身份、权限与职责分离（RBAC）

- 缺少唯一账号与强认证（密码策略、MFA、禁用/离职回收）
- 缺少角色与权限矩阵（申办者/CRO/中心/研究者/CRC/CRA/DM/统计/稽查/管理员）
- 缺少管理员权限与业务审批权限的分离（防止同一人既能改数据又能改规则/日志）

### 2.3 稽查轨迹（Audit Trail）与数据版本化

- 缺少字段级/记录级审计：谁在何时修改了什么、原值是什么、为何修改
- 缺少配置审计：eCRF/随机化方案/权限变更/导出/揭盲等关键行为日志
- 缺少审计导出能力（供稽查与核查）

### 2.4 电子签名（eSignature）与锁库（DB Lock）

- 缺少签署意图（录入完成/医学确认/数据管理确认/锁库确认）
- 缺少签署证据（签署人身份、时间戳、签署后不可否认/防篡改）
- 缺少锁库/解锁审批与留痕

### 2.5 EDC 数据管理流程（Query/SDV/监查）

- 缺少 Query 全生命周期管理（提出/回复/关闭/重开/指派/时限）
- 缺少 SDV/SDR 标记、监查报表、中心/受试者/访视维度的数据质量视图
- 缺少数据导出一致性与元数据输出（版本、字典、审计信息）

### 2.6 IWRS/IRT 领域能力（盲态、随机化、供应）

- 当前仓库未见随机化算法、分层区组、揭盲流程、药物供应链与责任链能力
- 缺少随机化列表/种子/算法版本化与访问控制
- 缺少紧急揭盲与常规揭盲分离、揭盲审计与导出

### 2.7 安全、隐私与合规运维

- 缺少服务端安全基线（TLS、存储加密、密钥管理、日志留存、漏洞管理）
- 缺少数据分类分级、脱敏策略、最小必要原则落地
- 缺少备份/恢复演练与灾备指标（RPO/RTO）
- 若未来涉及云与外包：缺少供应商质量协议、审计支持条款与责任边界

## 3. 改造建议：目标架构（从“原型”到“可验证系统”）

建议把现有前端保留为“呈现层 + 配置 UI”，新增后端与受控数据层，使合规能力能够落在“不可绕过”的服务端。

### 3.1 推荐的逻辑分层

- 前端（保留当前仓库）
  - 负责页面与交互、表单渲染、构建器 UI
  - 所有“受控数据”（eCRF schema、受试者数据、审计、签名）通过 API 获取与提交
- 后端（新增服务）
  - 身份与访问控制：账号、组织、角色、权限审批流
  - 业务域服务：EDC（CRF/访视/Query/锁库/导出），IWRS（随机化/揭盲/供应）
  - 审计服务：统一不可篡改审计（append-only）与导出
  - 文件/证据服务：签名证据、附件、核证副本
- 数据层
  - 事务型数据库（业务数据）
  - 审计日志存储（追加写、WORM/对象存储/防篡改策略）
  - 备份与灾备

## 4. 分阶段实施计划（按合规风险优先级）

### Phase 0：合规定义与 CSV 启动（先把“证据链”建立起来）

- 输出 URS：把法规条款映射成可测试需求（EDC/IWRS 分开）
- 输出风险评估：识别关键数据/关键流程/盲态相关高风险项
- 输出验证总计划（VMP）与测试策略（IQ/OQ/PQ 或等效拆分）
- 建立变更控制流程（含版本命名、发布审批、回滚策略、偏差/CAPA）

### Phase 1：身份、权限与审计“底座”先行（所有后续能力都依赖它）

- 账号体系：唯一账号、密码策略、（可选）MFA、禁用与回收
- 组织与角色：申办者/CRO/中心/用户；RBAC 权限矩阵与审批流
- 统一审计：登录、权限变更、数据变更、导出、揭盲、锁库等事件全留痕
- 时间戳策略：统一时间源与时区策略，避免客户端可控时间戳

### Phase 2：EDC 核心合规闭环（让“数据产生—修改—签署—锁库”可验证）

- eCRF/访视/表单 Schema 服务端存储与版本化（前端构建器只编辑，不直接作为“最终证据源”）
- 数据录入 API：字段级校验与 edit checks（关键校验必须在服务端）
- 数据修改与 Reason for Change：强制填写修改理由、保留原值、生成审计
- 电子签名：签署意图、签署记录、签后防篡改；与锁库/解锁流程打通
- Query/SDV：基础的质疑与监查工作流
- 导出：带元数据与审计信息的可复核导出（并记录导出审计）

### Phase 3：IWRS/IRT 能力（盲态与供应链）

- 随机化引擎：分层/区组/比例等；算法实现与参数受控、可复现性证明
- 揭盲：紧急揭盲与常规揭盲分离；权限与审批；每次揭盲可导出审计
- 供应链（如适用）：批次、库存、发放、回收、销毁、偏差与 CAPA

### Phase 4：安全、隐私与运维合规（等保/隐私与持续运行）

- 落实等级保护（按部署与数据定级决定二级/三级）：安全加固、测评与整改闭环
- 数据分类分级与脱敏：日志脱敏、导出脱敏、最小必要、访问控制
- 备份/恢复/灾备：定期演练并留存演练记录；明确 RPO/RTO
- 供应商与外包：质量协议、审计支持、第三方访问控制

## 5. 结合当前代码的“可复用资产”与“需重做资产”

### 5.1 建议保留与强化

- 动态表单渲染与字段组件：可作为 EDC 前端渲染层继续演进（见 [DynamicFormRenderer.tsx](file:///workspace/src/modules/edc/form-engine/DynamicFormRenderer.tsx#L1-L34)）
- 模板构建器 UI：可继续作为 eCRF 配置界面（见 [TemplateBuilderPage.tsx](file:///workspace/src/pages/edc/templates/TemplateBuilderPage.tsx#L24-L305)）

### 5.2 建议从“演示”改为“受控后端”的部分

- 所有数据持久化：从 mock/localStorage 迁移为服务端数据库（例如 [useProjectsStore.ts](file:///workspace/src/store/useProjectsStore.ts#L1-L55) 目前是 localStorage）
- 权限与审计：从前端 store 演示（如 [useAuthStore.ts](file:///workspace/src/store/useAuthStore.ts#L1-L13)）升级为后端强制执行与可导出证据
- 关键校验：从纯前端校验升级为服务端校验（避免绕过）

## 6. 交付物清单（你可以用来对外“证明合规”）

- 产品与系统文档：System Description、数据字典、权限矩阵、接口文档、审计与导出说明
- 质量体系文件：SOP（账号/权限/备份/变更/偏差/CAPA/供应商/退役）、培训记录
- CSV 包：URS、风险评估、测试方案与记录、缺陷与 CAPA、VSR
- 安全合规包：等保测评报告（如适用）、漏洞与补丁记录、应急预案与演练记录

