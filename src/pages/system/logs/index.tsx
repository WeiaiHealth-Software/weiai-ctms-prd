import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useHeaderStore } from '@/store/useHeaderStore';
import LogDetailDrawer from './LogDetailDrawer.tsx';
import { buildMockSystemLogs } from './logMockData.ts';
import {
  getDefaultDateRange,
  parseDateTime,
  RESULT_BADGE_CLASS,
  ROW_HIGHLIGHT_CLASS,
  RISK_BADGE_CLASS,
  TYPE_BADGE_CLASS,
  TYPE_OPTIONS,
  type LogRow
} from './logUtils.ts';

export const SystemLogs: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const rows = useMemo(() => buildMockSystemLogs(), []);
  const defaultDateRange = useMemo(() => getDefaultDateRange(rows), [rows]);

  const [typeFilter, setTypeFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [startDate, setStartDate] = useState(defaultDateRange.startDate);
  const [endDate, setEndDate] = useState(defaultDateRange.endDate);
  const [activeLog, setActiveLog] = useState<LogRow | null>(null);

  useEffect(() => {
    setTitle('日志管理', '仅开发者账户可访问。查看最近 7 天系统日志、数据操作日志与登录审计日志，支持审计追踪', [
      { text: '开发者账户', color: 'indigo' }
    ]);
  }, [setTitle]);

  const filtered = useMemo(() => {
    const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const end = endDate ? new Date(`${endDate}T23:59:59`) : null;
    const keyword = keywordFilter.trim();
    const moduleKey = moduleFilter.trim();
    const operatorKey = operatorFilter.trim();

    return rows.filter(row => {
      if (typeFilter && row.type !== typeFilter) return false;
      if (moduleKey && !row.module.includes(moduleKey)) return false;

      if (operatorKey) {
        const operatorMatch = row.operatorName.includes(operatorKey) || row.operatorAccount.includes(operatorKey);
        if (!operatorMatch) return false;
      }

      if (keyword) {
        const matched =
          row.summary.includes(keyword) ||
          row.ip.includes(keyword) ||
          row.objectName.includes(keyword) ||
          row.relatedNumber.includes(keyword) ||
          row.traceId.includes(keyword);
        if (!matched) return false;
      }

      const time = parseDateTime(row.time);
      if (start && time < start) return false;
      if (end && time > end) return false;
      return true;
    });
  }, [rows, typeFilter, moduleFilter, operatorFilter, keywordFilter, startDate, endDate]);

  const stats = useMemo(() => {
    const highRiskCount = filtered.filter(row => row.riskLevel === '高风险').length;
    const failedCount = filtered.filter(row => row.result === '失败').length;
    return {
      highRiskCount,
      failedCount
    };
  }, [filtered]);

  const hasActiveFilters =
    Boolean(typeFilter) ||
    Boolean(moduleFilter.trim()) ||
    Boolean(operatorFilter.trim()) ||
    Boolean(keywordFilter.trim()) ||
    startDate !== defaultDateRange.startDate ||
    endDate !== defaultDateRange.endDate;

  const resetFilters = () => {
    setTypeFilter('');
    setModuleFilter('');
    setOperatorFilter('');
    setKeywordFilter('');
    setStartDate(defaultDateRange.startDate);
    setEndDate(defaultDateRange.endDate);
  };

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-end">
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-500 mb-1">日志类型</label>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">全部</option>
                {TYPE_OPTIONS.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-500 mb-1">模块</label>
              <input
                type="text"
                placeholder="如：档案管理"
                value={moduleFilter}
                onChange={e => setModuleFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-500 mb-1">操作人</label>
              <input
                type="text"
                placeholder="账号/姓名"
                value={operatorFilter}
                onChange={e => setOperatorFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-500 mb-1">关键字</label>
              <input
                type="text"
                placeholder="患者名/档案号/IP"
                value={keywordFilter}
                onChange={e => setKeywordFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">开始日期</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">结束日期</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-sm text-slate-500">
              当前共 <span className="font-semibold text-slate-700">{filtered.length}</span> 条日志，重点追踪
              <span className="mx-1 font-semibold text-red-500">{stats.highRiskCount}</span> 条高风险、
              <span className="mx-1 font-semibold text-red-500">{stats.failedCount}</span> 条失败记录。
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
              >
                重置
              </button>
              <button className="px-5 py-2 rounded-xl bg-brand-600 text-sm font-bold text-white hover:bg-brand-700 shadow-sm flex items-center gap-2">
                <Search className="w-4 h-4" /> 筛选
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-4 font-semibold">时间</th>
                  <th className="px-5 py-4 font-semibold">类型</th>
                  <th className="px-5 py-4 font-semibold">模块</th>
                  <th className="px-5 py-4 font-semibold">操作人</th>
                  <th className="px-5 py-4 font-semibold">动作</th>
                  <th className="px-5 py-4 font-semibold">IP / 终端</th>
                  <th className="px-5 py-4 font-semibold">结果</th>
                  <th className="px-5 py-4 font-semibold">风险等级</th>
                  <th className="px-5 py-4 font-semibold text-right">操作</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map(row => {
                  const rowHighlight = row.result === '失败' ? 'bg-red-50/50' : ROW_HIGHLIGHT_CLASS[row.riskLevel];

                  return (
                    <tr key={row.id} className={`${rowHighlight} hover:bg-slate-50/90 transition-colors`}>
                      <td className="px-5 py-4 align-top">
                        <div className="text-slate-600 font-mono">{row.time.slice(0, 10)}</div>
                        <div className="text-xs text-slate-400 font-mono mt-1">{row.time.slice(11)}</div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${TYPE_BADGE_CLASS[row.type]}`}
                        >
                          {row.type}
                        </span>
                      </td>

                      <td className="px-5 py-4 align-top text-slate-700">{row.module}</td>

                      <td className="px-5 py-4 align-top">
                        <div className="font-semibold text-slate-700">{row.operatorName}</div>
                        <div className="text-xs text-slate-400 mt-1">
                          {row.operatorAccount} · {row.operatorRole}
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top text-slate-700">{row.action}</td>

                      <td className="px-5 py-4 align-top">
                        <div className="font-mono text-slate-500">{row.ip}</div>
                        <div className="text-xs text-slate-400 mt-1">{row.terminal}</div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${RESULT_BADGE_CLASS[row.result]}`}
                        >
                          {row.result}
                        </span>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${RISK_BADGE_CLASS[row.riskLevel]}`}
                        >
                          {row.riskLevel}
                        </span>
                      </td>

                      <td className="px-5 py-4 align-top text-right">
                        <button
                          onClick={() => setActiveLog(row)}
                          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                        >
                          查看详情
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-14 text-center text-slate-400">
                      <div className="space-y-2">
                        <div>当前筛选条件下没有找到日志</div>
                        {hasActiveFilters && (
                          <button
                            onClick={resetFilters}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                          >
                            恢复最近 7 天默认显示
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <LogDetailDrawer open={Boolean(activeLog)} log={activeLog} onClose={() => setActiveLog(null)} />
    </>
  );
};
