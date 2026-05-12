import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Plus, Search } from 'lucide-react';
import { useHeaderStore } from '@/store/useHeaderStore';

type TabKey = 'table' | 'modal' | 'buttons';

type DemoRow = {
  id: number;
  code: string;
  name: string;
  status: '进行中' | '已结束';
  owner: string;
  createdAt: string;
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'table', label: '表格页' },
  { key: 'modal', label: '弹窗' },
  { key: 'buttons', label: '按钮' }
];

export const UiSpec: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const [tab, setTab] = useState<TabKey>('table');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<DemoRow | null>(null);

  useEffect(() => {
    setTitle('UI 组件规范', '统一页面骨架与常用组件样式；争议以本页示例为准并回写 DESIGN.md', [
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
    ],
    modal: [
      '弹窗分为：标题区、表单区、底部按钮区三段结构。',
      '标题区包含标题、描述和关闭操作，避免把关闭放到底部。',
      '底部按钮固定右对齐：取消（次按钮）+ 确认（主按钮）。',
      '表单优先单列，必要时用两列栅格并保持字段对齐。'
    ],
    buttons: [
      '主按钮统一使用 brand-600，hover 使用 brand-700。',
      '次按钮统一使用浅边框 + slate 字色，hover 仅轻微背景变化。',
      '同一区域按钮高度与字号保持一致，禁止混用多个尺寸。',
      '危险操作按钮仅用于删除等高风险动作，使用红色语义。'
    ]
  } as const;

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2">
        <div className="flex items-center gap-2">
          {tabs.map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={
                tab === t.key
                  ? 'px-4 py-2 rounded-xl text-sm font-bold bg-brand-600 text-white shadow-sm'
                  : 'px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50'
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

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
              <button className="flex-1 lg:flex-none px-4 py-2 rounded-lg text-sm font-bold bg-white text-brand-800 shadow-sm border border-slate-200/50">
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

      {tab !== 'table' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
            <h3 className="text-sm font-bold text-brand-700">
              {tab === 'modal' ? '弹窗组件开发规范' : '按钮组件开发规范'}
            </h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-brand-700/90 space-y-1">
              {(tab === 'modal' ? rulesByTab.modal : rulesByTab.buttons).map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="text-sm text-slate-500">该组件示例待补充</div>
          </div>
        </div>
      )}
    </div>
  );
};
