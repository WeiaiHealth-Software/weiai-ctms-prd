# weiai-ctms-prd
Weiai Healthcare Clinical Trial Management System

## Project Structure

```text
.
├─ public/               # static assets served directly
├─ src/
│  ├─ assets/            # static assets imported by source code
│  ├─ components/        # reusable UI and layout components
│  ├─ constants/         # shared constants
│  ├─ mock/              # mock data
│  ├─ pages/             # page-level modules
│  ├─ router/            # route definitions
│  ├─ store/             # Zustand stores
│  ├─ App.tsx
│  └─ main.tsx
├─ index.html            # Vite entry HTML (must be in project root)
└─ vite.config.ts
```

## EDC 电子数据采集系统

```txt
新建项目
  │
  ▼
【未配置】 isConfigForm=false
  │  列表按钮：配置项目
  │  详情按钮：配置表单（跳转配置页）
  │
  ▼  配置完 Step2 点「保存完成配置」
【筹备中】 isConfigForm=true
  │  列表按钮：查看详情
  │  详情按钮：▶ 开始项目
  │
  ▼  点「开始项目」
【进行中】 isConfigForm=true
  │  列表按钮：查看详情
  │  详情按钮：+新增受试者  /  ■ 结束项目
  │
  ▼  点「结束项目」
【已结束】 isConfigForm=true
     列表按钮：查看详情
     详情按钮：项目已结束（不可操作）
```