import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useHeaderStore } from '@/store/useHeaderStore';

type LogRow = {
  id: number;
  time: string;
  type: '系统日志' | '数据操作日志' | '登录审计';
  module: string;
  operator: string;
  ip: string;
  content: string;
  result: '成功' | '失败';
};

const TYPE_OPTIONS: Array<LogRow['type']> = ['系统日志', '数据操作日志', '登录审计'];

const TYPE_BADGE_CLASS: Record<LogRow['type'], string> = {
  系统日志: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  数据操作日志: 'bg-sky-50 text-sky-700 border-sky-100',
  登录审计: 'bg-amber-50 text-amber-700 border-amber-100'
};

const pad2 = (n: number) => String(n).padStart(2, '0');
const formatDate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const parseDateTime = (s: string) => new Date(s.replace(' ', 'T'));

export const SystemLogs: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const [typeFilter, setTypeFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [rows] = useState<LogRow[]>([
    {
      id: 1,
      time: '2026-05-11 09:12:03',
      type: '登录审计',
      module: '认证授权',
      operator: 'wangwei_admin',
      ip: '10.10.1.23',
      content: '账号登录：登录成功',
      result: '成功'
    },
    {
      id: 2,
      time: '2026-05-11 09:25:18',
      type: '数据操作日志',
      module: '用户管理',
      operator: 'wangwei_admin',
      ip: '10.10.1.23',
      content: '新增用户：lijing_crc',
      result: '成功'
    },
    {
      id: 3,
      time: '2026-05-11 10:02:44',
      type: '数据操作日志',
      module: '中心管理',
      operator: 'liuyang_admin',
      ip: '10.10.3.11',
      content: '编辑中心：上海眼病防治中心',
      result: '成功'
    },
    {
      id: 4,
      time: '2026-05-11 10:17:09',
      type: '系统日志',
      module: '任务调度',
      operator: 'system',
      ip: '127.0.0.1',
      content: '定时任务执行：数据归档（EDC）',
      result: '成功'
    },
    {
      id: 5,
      time: '2026-05-11 11:08:31',
      type: '系统日志',
      module: '存储服务',
      operator: 'system',
      ip: '127.0.0.1',
      content: '对象存储写入失败：bucket=ctms-attachments',
      result: '失败'
    }
  ]);

  useEffect(() => {
    setTitle('日志管理', '仅开发者账户可访问。查看系统日志、数据操作日志与登录审计日志，支持筛选检索', [
      { text: '开发者账户', color: 'indigo' }
    ]);
  }, [setTitle]);

  useEffect(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    setStartDate(formatDate(start));
    setEndDate(formatDate(now));
  }, []);

  const filtered = useMemo(() => {
    const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const end = endDate ? new Date(`${endDate}T23:59:59`) : null;
    const keyword = keywordFilter.trim();
    const moduleKey = moduleFilter.trim();
    const operatorKey = operatorFilter.trim();

    return rows.filter(r => {
      if (typeFilter && r.type !== typeFilter) return false;
      if (moduleKey && !r.module.includes(moduleKey)) return false;
      if (operatorKey && !r.operator.includes(operatorKey)) return false;
      if (keyword && !(r.content.includes(keyword) || r.ip.includes(keyword))) return false;

      const t = parseDateTime(r.time);
      if (start && t < start) return false;
      if (end && t > end) return false;
      return true;
    });
  }, [rows, typeFilter, moduleFilter, operatorFilter, keywordFilter, startDate, endDate]);

  const resetFilters = () => {
    setTypeFilter('');
    setModuleFilter('');
    setOperatorFilter('');
    setKeywordFilter('');
    setStartDate('');
    setEndDate('');
  };

  return (
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
              {TYPE_OPTIONS.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-500 mb-1">模块</label>
            <input
              type="text"
              placeholder="如：用户管理"
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
              placeholder="内容/IP"
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">时间</th>
                <th className="px-6 py-4 font-semibold">类型</th>
                <th className="px-6 py-4 font-semibold">模块</th>
                <th className="px-6 py-4 font-semibold">操作人</th>
                <th className="px-6 py-4 font-semibold">IP</th>
                <th className="px-6 py-4 font-semibold">内容</th>
                <th className="px-6 py-4 font-semibold text-right">结果</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-mono">{r.time}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${TYPE_BADGE_CLASS[r.type]}`}
                    >
                      {r.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{r.module}</td>
                  <td className="px-6 py-4 text-slate-700">{r.operator}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono">{r.ip}</td>
                  <td className="px-6 py-4 text-slate-700 max-w-[520px] truncate">{r.content}</td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={
                        r.result === '成功'
                          ? 'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border bg-red-50 text-red-600 border-red-100'
                      }
                    >
                      {r.result}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    没有找到符合条件的日志
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
