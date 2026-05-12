import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Bell, Home, Link2, Plus, Search, Settings, Trash2, User } from 'lucide-react';
import { useHeaderStore } from '@/store/useHeaderStore';
import Tabs from '@/components/common/Tabs';
import Select from '@/components/form/Select';
import MultiSelect from '@/components/form/MultiSelect';

type TabKey = 'system' | 'table' | 'form' | 'basics';

type DemoRow = {
  id: number;
  code: string;
  name: string;
  status: '进行中' | '已结束';
  owner: string;
  createdAt: string;
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'system', label: '系统 UI 规范' },
  { key: 'basics', label: '系统基础组件' },
  { key: 'table', label: '表格页' },
  { key: 'form', label: '表单组件' },
];

export const UiSpec: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const [tab, setTab] = useState<TabKey>('system');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<DemoRow | null>(null);

  useEffect(() => {
    setTitle('系统 UI 组件规范', '统一页面骨架与常用组件样式；争议以本页示例为准并回写 DESIGN.md', [
      { text: '规范', color: 'slate' }
    ]);
  }, [setTitle]);

  const demoRows = useMemo<DemoRow[]>(
    () => [
      { id: 1, code: 'XW09', name: '光刻微结构近视管理项目', status: '进行中', owner: '徐雷', createdAt: '2025-12-25' },
      { id: 2, code: 'CARDIO_01', name: '冠心病介入治疗术后心脏康复分级干预策略研究', status: '进行中', owner: '李主任', createdAt: '2024-06-30' },
      { id: 3, code: 'GLAUCOMA_PH3', name: '新型降眼压滴眼液在原发性开角型青光眼患者中的 III 期临床试验', status: '已结束', owner: '赵医生', createdAt: '2023-11-15' }
    ],
    []
  );

  const [rows, setRows] = useState<DemoRow[]>(demoRows);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [radioValue, setRadioValue] = useState<'A' | 'B' | 'C'>('A');
  const [radioButtonValue, setRadioButtonValue] = useState<'全部' | '进行中' | '已结束'>('全部');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [switchValue, setSwitchValue] = useState(true);
  const [selectValue, setSelectValue] = useState<string>('');
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>(['beijing', 'shanghai']);
  const [textareaValue, setTextareaValue] = useState('');

  const selectOptions = useMemo(
    () => [
      { value: 'beijing', label: '北京' },
      { value: 'shanghai', label: '上海' },
      { value: 'shenzhen', label: '深圳' },
      { value: 'hangzhou', label: '杭州' },
      { value: 'chengdu', label: '成都' }
    ],
    []
  );

  const openDelete = (row: DemoRow) => {
    setRowToDelete(row);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!rowToDelete) return;
    setRows(prev => prev.filter(r => r.id !== rowToDelete.id));
    setDeleteOpen(false);
    setRowToDelete(null);
  };

  const rulesByTab = {
    table: [
      '筛选区、搜索区、Action 区必须放在同一张工具栏卡片内。',
      'Action 固定在最右侧，左侧查询区域与右侧 Action 使用竖线分割。',
      '表格主体使用统一卡片样式：rounded-2xl + border-slate-100 + shadow-sm。',
      '操作列所有操作项使用 cursor-pointer；第一个操作为按钮式（浅底+主题色文字+px-3+py-2）。',
      '删除为纯 link（无背景），且必须二次弹窗确认。',
      '表头、表体、空态遵循 DESIGN.md 中的统一间距和字号。'
    ]
  } as const;

  const brandScale = [
    { key: 50, name: 'brand-50', hex: '#eff6ff', bg: 'bg-brand-50' },
    { key: 100, name: 'brand-100', hex: '#dbeafe', bg: 'bg-brand-100' },
    { key: 200, name: 'brand-200', hex: '#bfdbfe', bg: 'bg-brand-200' },
    { key: 300, name: 'brand-300', hex: '#93c5fd', bg: 'bg-brand-300' },
    { key: 400, name: 'brand-400', hex: '#60a5fa', bg: 'bg-brand-400' },
    { key: 500, name: 'brand-500', hex: '#3b82f6', bg: 'bg-brand-500' },
    { key: 600, name: 'brand-600', hex: '#2563eb', bg: 'bg-brand-600' },
    { key: 700, name: 'brand-700', hex: '#1d4ed8', bg: 'bg-brand-700' },
    { key: 800, name: 'brand-800', hex: '#1e40af', bg: 'bg-brand-800' },
    { key: 900, name: 'brand-900', hex: '#1e3a8a', bg: 'bg-brand-900' }
  ] as const;

  const secondaryPalettes = [
    {
      key: 'alert',
      label: '告警色（红）',
      name: 'red',
      steps: [
        { step: 50, bg: 'bg-red-50' },
        { step: 100, bg: 'bg-red-100' },
        { step: 200, bg: 'bg-red-200' },
        { step: 300, bg: 'bg-red-300' },
        { step: 400, bg: 'bg-red-400' },
        { step: 500, bg: 'bg-red-500' },
        { step: 600, bg: 'bg-red-600' },
        { step: 700, bg: 'bg-red-700' },
        { step: 800, bg: 'bg-red-800' },
        { step: 900, bg: 'bg-red-900' }
      ]
    },
    {
      key: 'warning',
      label: '警告色（橙）',
      name: 'amber',
      steps: [
        { step: 50, bg: 'bg-amber-50' },
        { step: 100, bg: 'bg-amber-100' },
        { step: 200, bg: 'bg-amber-200' },
        { step: 300, bg: 'bg-amber-300' },
        { step: 400, bg: 'bg-amber-400' },
        { step: 500, bg: 'bg-amber-500' },
        { step: 600, bg: 'bg-amber-600' },
        { step: 700, bg: 'bg-amber-700' },
        { step: 800, bg: 'bg-amber-800' },
        { step: 900, bg: 'bg-amber-900' }
      ]
    },
    {
      key: 'success',
      label: '成功色（绿）',
      name: 'emerald',
      steps: [
        { step: 50, bg: 'bg-emerald-50' },
        { step: 100, bg: 'bg-emerald-100' },
        { step: 200, bg: 'bg-emerald-200' },
        { step: 300, bg: 'bg-emerald-300' },
        { step: 400, bg: 'bg-emerald-400' },
        { step: 500, bg: 'bg-emerald-500' },
        { step: 600, bg: 'bg-emerald-600' },
        { step: 700, bg: 'bg-emerald-700' },
        { step: 800, bg: 'bg-emerald-800' },
        { step: 900, bg: 'bg-emerald-900' }
      ]
    },
    {
      key: 'gray',
      label: '灰色',
      name: 'slate',
      steps: [
        { step: 50, bg: 'bg-slate-50' },
        { step: 100, bg: 'bg-slate-100' },
        { step: 200, bg: 'bg-slate-200' },
        { step: 300, bg: 'bg-slate-300' },
        { step: 400, bg: 'bg-slate-400' },
        { step: 500, bg: 'bg-slate-500' },
        { step: 600, bg: 'bg-slate-600' },
        { step: 700, bg: 'bg-slate-700' },
        { step: 800, bg: 'bg-slate-800' },
        { step: 900, bg: 'bg-slate-900' }
      ]
    }
  ] as const;

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2">
        <Tabs
          value={tab}
          onChange={(k) => setTab(k as TabKey)}
          items={tabs.map(t => ({ key: t.key, label: t.label }))}
        />
      </div>

      {tab === 'system' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
            <h3 className="text-sm font-bold text-brand-700">系统 UI 规范</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-brand-700/90 space-y-1">
              <li>主题色与副色用于全系统：按钮、链接、选中态、徽标、状态等。</li>
              <li>布局结构采用左右布局：左侧菜单，右侧 Header + 主体内容区。</li>
              <li>菜单选中态遵循“二级有背景、一级无背景但变色”的层级规则。</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-800">主题色（brand）</h3>
                <div className="text-xs text-slate-500 font-mono">来源：tailwind.config.js / colors.brand</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
                {brandScale.map(c => (
                  <div key={c.key} className="space-y-1">
                    <div className={`h-10 rounded-lg border border-slate-200 ${c.bg}`}></div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono">
                      <span>{c.key}</span>
                      <span className="text-slate-400">{c.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.hex}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-bold text-slate-700">推荐默认</div>
                  <div className="mt-2 text-sm text-slate-600">
                    主按钮/主色文字：<span className="font-mono">brand-600</span>；hover：<span className="font-mono">brand-700</span>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-bold text-slate-700">浅底与描边</div>
                  <div className="mt-2 text-sm text-slate-600">
                    浅底：<span className="font-mono">brand-50</span>；描边：<span className="font-mono">brand-100/200</span>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-bold text-slate-700">链接/高亮</div>
                  <div className="mt-2 text-sm text-slate-600">
                    文案高亮优先用 <span className="font-mono">text-brand-600</span>，避免滥用纯蓝与下划线
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800">副色</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {secondaryPalettes.map(p => (
                  <div key={p.key} className="rounded-xl border border-slate-200 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-bold text-slate-700">{p.label}</div>
                      <div className="text-xs text-slate-500 font-mono">{p.name}-50 … {p.name}-900</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.steps.map(s => (
                        <div
                          key={s.step}
                          className={`h-8 w-8 rounded-lg border border-slate-200 ${s.bg}`}
                          title={`${p.name}-${s.step}`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-slate-600">
                      推荐：浅底 <span className="font-mono">{p.name}-50</span>，文字 <span className="font-mono">{p.name}-600</span>，强调/hover <span className="font-mono">{p.name}-700</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800">布局结构</h3>
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="flex h-44">
                  <div className="w-48 bg-slate-50 border-r border-slate-200 flex flex-col">
                    <div className="px-4 py-3 text-xs font-bold text-slate-600 border-b border-slate-200">菜单（左）</div>
                    <div className="p-4 space-y-2">
                      <div className="h-3 rounded bg-slate-200"></div>
                      <div className="h-3 rounded bg-slate-200 w-4/5"></div>
                      <div className="h-3 rounded bg-brand-200"></div>
                      <div className="h-3 rounded bg-slate-200 w-3/4"></div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col bg-white">
                    <div className="h-12 border-b border-slate-200 flex items-center justify-between px-4">
                      <div className="text-xs font-bold text-slate-600">Header（右上）</div>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-200"></div>
                        <div className="h-6 w-10 rounded bg-slate-100 border border-slate-200"></div>
                      </div>
                    </div>
                    <div className="flex-1 bg-slate-50/60 p-4">
                      <div className="text-xs font-bold text-slate-600">主体内容（右下）</div>
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        <div className="h-14 rounded-xl bg-white border border-slate-200"></div>
                        <div className="h-14 rounded-xl bg-white border border-slate-200"></div>
                        <div className="h-14 rounded-xl bg-white border border-slate-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-bold text-slate-700">左右布局</div>
                  <div className="mt-2 text-sm text-slate-600">左侧为菜单（可收起），右侧为内容区。</div>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-bold text-slate-700">右侧上下布局</div>
                  <div className="mt-2 text-sm text-slate-600">Header 固定在顶部，下面为主内容区。</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800">菜单样式</h3>
              <div className="rounded-xl border border-slate-200 p-4">
                <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                  <li>一级菜单：icon + 文案；有二级菜单时，右侧带折叠按钮（展开/收起）。</li>
                  <li>二级菜单：仅文案，不展示 icon。</li>
                  <li>选中态（一级/二级联动）：二级菜单使用浅底背景 + 主题色文案；对应一级菜单仅 icon 与文案变为主题色，无背景色。</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'table' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
            <h3 className="text-sm font-bold text-brand-700">表格页开发规范</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-brand-700/90 space-y-1">
              {rulesByTab.table.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex bg-slate-100/50 p-1 rounded-xl border border-slate-200/60 w-full lg:w-auto">
              <button className="flex-1 lg:flex-none px-4 py-2 rounded-lg text-sm font-bold bg-white text-brand-600 shadow-sm border border-slate-200/50">
                全部项目
              </button>
              <button className="flex-1 lg:flex-none px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200/50">
                进行中
              </button>
              <button className="flex-1 lg:flex-none px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200/50">
                已结束
              </button>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索项目名称或编号..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              <button
                type="button"
                className="px-5 py-2 rounded-xl bg-brand-600 text-sm font-bold text-white hover:bg-brand-700 shadow-sm"
              >
                搜索
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
              >
                重置
              </button>
              <div className="h-8 w-px bg-slate-200"></div>
              <button
                type="button"
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                新增项目
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">编号</th>
                    <th className="px-6 py-4 font-semibold">名称</th>
                    <th className="px-6 py-4 font-semibold">状态</th>
                    <th className="px-6 py-4 font-semibold">负责人</th>
                    <th className="px-6 py-4 font-semibold">创建日期</th>
                    <th className="px-6 py-4 font-semibold text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {rows.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border bg-brand-50 text-brand-600 border-brand-100">
                          {r.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-800 font-bold">{r.name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            r.status === '进行中'
                              ? 'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border bg-emerald-50 text-emerald-600 border-emerald-100'
                              : 'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border bg-slate-50 text-slate-600 border-slate-200'
                          }
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{r.owner}</td>
                      <td className="px-6 py-4 text-slate-500 font-mono">{r.createdAt}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            type="button"
                            className="cursor-pointer px-3 py-2 rounded-md bg-brand-50 hover:bg-brand-100 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                          >
                            查看详情
                          </button>
                          <button
                            type="button"
                            onClick={() => openDelete(r)}
                            className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {deleteOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-5">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-center text-slate-800 mb-2">确认删除？</h3>
                  <p className="text-center text-slate-500 mb-6 text-sm leading-relaxed">
                    将删除 <span className="font-bold text-slate-700">"{rowToDelete?.name}"</span>
                  </p>
                  <div className="flex gap-3 mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteOpen(false);
                        setRowToDelete(null);
                      }}
                      className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={confirmDelete}
                      className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all active:scale-95"
                    >
                      确认删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'form' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
            <h3 className="text-sm font-bold text-brand-700">表单组件</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-brand-700/90 space-y-1">
              <li>输入类控件统一使用 rounded-xl + border-slate-200；focus 统一为 brand ring。</li>
              <li>Select/MultiSelect 使用项目内封装组件（参考 HeroUI 交互），不使用原生 select。</li>
              <li>RadioButton 推荐使用分段按钮样式，和表格页筛选 Tab 保持一致。</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-8">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800">1. Input / InputSearch</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">Input</div>
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="请输入内容..."
                    className="w-full h-11 rounded-xl border border-slate-200 px-4 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                  />
                  <div className="text-xs text-slate-400 font-mono">value: {inputValue || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">InputSearch</div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="搜索关键字..."
                      className="w-full h-11 rounded-xl border border-slate-200 pl-9 pr-4 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                  <div className="text-xs text-slate-400 font-mono">value: {searchValue || '-'}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800">2. Radio / RadioButton</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">Radio</div>
                  <div className="flex flex-wrap items-center gap-4">
                    {(['A', 'B', 'C'] as const).map((v) => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          checked={radioValue === v}
                          onChange={() => setRadioValue(v)}
                          className="sr-only peer"
                        />
                        <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center peer-checked:border-brand-600">
                          <span className="w-2 h-2 rounded-full bg-brand-600 opacity-0 peer-checked:opacity-100" />
                        </span>
                        <span className="text-sm text-slate-700">选项 {v}</span>
                      </label>
                    ))}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">value: {radioValue}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">RadioButton</div>
                  <div className="flex bg-slate-100/50 p-1 rounded-xl border border-slate-200/60 w-full">
                    {(['全部', '进行中', '已结束'] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setRadioButtonValue(v)}
                        className={
                          radioButtonValue === v
                            ? 'flex-1 px-4 py-2 rounded-lg text-sm font-bold bg-white text-brand-600 shadow-sm border border-slate-200/50'
                            : 'flex-1 px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">value: {radioButtonValue}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800">3. Checkbox / Switch</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">Checkbox</div>
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checkboxValue}
                      onChange={(e) => setCheckboxValue(e.target.checked)}
                      className="sr-only peer"
                    />
                    <span className="w-5 h-5 rounded-md border border-slate-300 bg-white flex items-center justify-center peer-checked:border-brand-600 peer-checked:bg-brand-600">
                      <span className="text-white text-xs leading-none opacity-0 peer-checked:opacity-100">✓</span>
                    </span>
                    <span className="text-sm text-slate-700">我已阅读并同意</span>
                  </label>
                  <div className="text-xs text-slate-400 font-mono">value: {checkboxValue ? 'true' : 'false'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">Switch</div>
                  <button
                    type="button"
                    aria-pressed={switchValue}
                    onClick={() => setSwitchValue(v => !v)}
                    className={
                      switchValue
                        ? 'w-11 h-6 rounded-full bg-brand-600 relative transition-colors'
                        : 'w-11 h-6 rounded-full bg-slate-200 relative transition-colors'
                    }
                  >
                    <span
                      className={
                        switchValue
                          ? 'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform translate-x-5'
                          : 'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform translate-x-0'
                      }
                    />
                  </button>
                  <div className="text-xs text-slate-400 font-mono">value: {switchValue ? 'true' : 'false'}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800">4. Select / MultiSelect</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">Select</div>
                  <Select
                    value={selectValue}
                    onChange={setSelectValue}
                    options={selectOptions}
                    placeholder="请选择城市"
                  />
                  <div className="text-xs text-slate-400 font-mono">value: {selectValue || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">MultiSelect</div>
                  <MultiSelect
                    value={multiSelectValue}
                    onChange={setMultiSelectValue}
                    options={selectOptions}
                    placeholder="请选择多个城市"
                  />
                  <div className="text-xs text-slate-400 font-mono">value: {multiSelectValue.length ? multiSelectValue.join(', ') : '-'}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800">5. Textarea</h3>
              <div className="space-y-2">
                <textarea
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  placeholder="请输入多行内容..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                />
                <div className="text-xs text-slate-400 font-mono">len: {textareaValue.length}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'basics' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
            <h3 className="text-sm font-bold text-brand-700">系统基础组件</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-brand-700/90 space-y-1">
              <li>本页为“最小基础组件集合”，用于全系统统一样式与交互。</li>
              <li>所有示例为静态展示；需要复用时按 class 规范对齐即可。</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-800">图标（Lucide）</h3>
                <div className="text-xs text-slate-500 font-mono">lucide-react</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                  <li>统一采用 Lucide 图标（lucide-react），避免混用多套 icon 风格。</li>
                  <li>默认大小：16/18/20；菜单一级 icon 建议 20。</li>
                  <li>默认颜色：<span className="font-mono">text-slate-400</span>；激活/强调：<span className="font-mono">text-brand-600</span>。</li>
                </ul>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-bold text-slate-700 mb-3">常用示例</div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <Home size={20} />
                    <Settings size={20} />
                    <User size={20} />
                    <Bell size={20} />
                    <Search size={20} />
                    <Plus size={20} />
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-bold text-slate-700 mb-3">尺寸对比</div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <Home size={16} />
                    <Home size={18} />
                    <Home size={20} />
                    <Home size={24} />
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-bold text-slate-700 mb-3">状态对比</div>
                  <div className="flex items-center gap-3">
                    <Settings size={20} className="text-slate-400" />
                    <Settings size={20} className="text-brand-600" />
                    <Settings size={20} className="text-slate-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800">按钮（3 种）</h3>
              <div className="rounded-xl border border-slate-200 p-4">
                <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                  <li>普通按钮：白底灰边框；hover 后文字变主题色，背景变灰。</li>
                  <li>主题色按钮：主按钮，默认 <span className="font-mono">bg-brand-600</span>，hover <span className="font-mono">bg-brand-700</span>。</li>
                  <li>带 icon 的按钮：icon 在左，间距 <span className="font-mono">gap-2</span>，整体与主按钮一致。</li>
                </ul>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-brand-600 text-sm font-bold transition-colors"
                >
                  普通按钮
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-brand-600 bg-white text-brand-600 hover:bg-brand-50 text-sm font-bold transition-colors"
                >
                  Outlined 按钮
                </button>
                <button
                  type="button"
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 text-sm font-bold shadow-sm transition-colors"
                >
                  主题色按钮
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 text-sm font-bold shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  带 icon 的按钮
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800">文本（字体规范 / 标题大小）</h3>
              <div className="rounded-xl border border-slate-200 p-4">
                <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                  <li>正文：<span className="font-mono">text-sm text-slate-600</span></li>
                  <li>弱说明：<span className="font-mono">text-xs text-slate-500</span></li>
                  <li>强调正文：<span className="font-mono">text-sm font-bold text-slate-800</span></li>
                  <li>区块标题：<span className="font-mono">text-sm font-bold</span>；大标题（少用）：<span className="font-mono">text-xl font-bold</span></li>
                </ul>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <div className="text-xl font-bold text-slate-800">大标题（text-xl）</div>
                  <div className="text-sm font-bold text-slate-800">区块标题（text-sm）</div>
                  <div className="text-sm text-slate-600">正文文本：用于大多数内容描述与表单说明。</div>
                  <div className="text-xs text-slate-500">弱说明：用于注释、占位或次要信息。</div>
                </div>
                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <div className="text-sm font-bold text-slate-800">强调正文</div>
                  <div className="text-sm font-bold text-slate-800">重点字段：徐雷 / 进行中</div>
                  <div className="text-sm text-slate-600">普通字段：项目编号、日期、描述内容等。</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800">链接</h3>
              <div className="rounded-xl border border-slate-200 p-4">
                <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                  <li>a 标签链接：主题色文案 <span className="font-mono">text-brand-600</span>，hover <span className="font-mono">text-brand-700</span>，默认不强制下划线。</li>
                  <li>删除文本：危险语义 <span className="font-mono">text-red-500</span>，hover <span className="font-mono">text-red-600</span>；无背景。</li>
                </ul>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <a
                  href="/#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <Link2 className="w-4 h-4" />
                  示例链接（a 标签）
                </a>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  删除
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800">标签（Tag）</h3>
              <div className="rounded-xl border border-slate-200 p-4">
                <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                  <li>统一形态：<span className="font-mono">inline-flex px-2.5 py-1 rounded-md text-xs font-bold border</span></li>
                  <li>统一配色：浅底 <span className="font-mono">bg-*-50</span> + 字色 <span className="font-mono">text-*-600</span> + 描边 <span className="font-mono">border-*-100/200</span></li>
                </ul>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border bg-slate-50 text-slate-600 border-slate-200">灰</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border bg-brand-50 text-brand-600 border-brand-200">蓝</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border bg-yellow-50 text-yellow-700 border-yellow-200">黄</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border bg-orange-50 text-orange-700 border-orange-200">橙</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border bg-emerald-50 text-emerald-600 border-emerald-200">绿</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border bg-violet-50 text-violet-700 border-violet-200">紫</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border bg-red-50 text-red-700 border-red-200">红</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
