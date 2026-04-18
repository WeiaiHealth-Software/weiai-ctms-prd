import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHeaderStore } from '../../store/useHeaderStore';
import { CENTERS, type CenterStaff, type CenterProject } from '../../mock/centers';
import { ArrowLeft, Building2, FolderKanban, Pencil, Plus, User, Users } from 'lucide-react';
import classNames from 'classnames';

type TabKey = 'overview' | 'departments' | 'crcs';

const renderProgress = (currentCount: number, totalCount: number, status: CenterProject['status']) => {
  const pct = totalCount ? Math.min(100, Math.round((currentCount / totalCount) * 100)) : 0;
  const barClass = status === '已结束' ? 'bg-slate-400' : 'bg-brand-500';
  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-slate-500 font-medium">
        <span>本中心进度</span>
        <span className="text-slate-700 font-bold">
          {currentCount} <span className="text-slate-400">/ {totalCount}</span>
        </span>
      </div>
      <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className={classNames('h-2 rounded-full transition-all duration-700', barClass)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const Table: React.FC<{
  title: string;
  ctaText: string;
  rows: CenterStaff[];
}> = ({ title, ctaText, rows }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="text-[15px] font-bold text-slate-900">{title}</div>
          <div className="text-xs text-slate-500 mt-1">支持按中心维度配置人员与权限</div>
        </div>
        <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {ctaText}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-white text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="px-6 py-4 font-bold">姓名</th>
              <th className="px-6 py-4 font-bold">账号名称</th>
              <th className="px-6 py-4 font-bold">手机号</th>
              <th className="px-6 py-4 font-bold">创建时间</th>
              <th className="px-6 py-4 font-bold text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {rows.length ? (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-slate-800">{r.name}</div>
                        {r.roleTag && (
                          <span className={classNames('px-2 py-0.5 rounded text-[10px] font-bold border', r.roleTag.className)}>
                            {r.roleTag.text}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">{r.username}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{r.phone}</td>
                  <td className="px-6 py-4 text-slate-500">{r.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button className="text-brand-600 hover:text-brand-700 text-sm font-bold">编辑</button>
                      <button className="text-red-500 hover:text-red-600 text-sm font-bold">删除</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const CenterDetail: React.FC = () => {
  const { centerId } = useParams();
  const navigate = useNavigate();
  const setTitle = useHeaderStore((s) => s.setTitle);

  const center = useMemo(() => CENTERS.find((c) => c.id === centerId), [centerId]);

  const [tab, setTab] = useState<TabKey>('overview');
  const [activeDept, setActiveDept] = useState<string>('');

  useEffect(() => {
    if (!center) return;
    setTitle('中心详情', center.name, [{ text: '中心管理员', color: 'emerald' }]);
  }, [center, setTitle]);

  useEffect(() => {
    if (!center?.departments?.length) return;
    setActiveDept((prev) => prev || center.departments[0].id);
  }, [center]);

  if (!center) {
    return (
      <div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="text-lg font-bold text-slate-800 mb-2">未找到该中心</div>
          <button className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold" onClick={() => navigate('/index/centers')}>
            返回列表
          </button>
        </div>
      </div>
    );
  }

  const doctors = (center.doctors[activeDept] || []) as CenterStaff[];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/index/centers')} className="flex items-center text-sm text-slate-500 hover:text-brand-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> 返回中心列表
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 flex gap-8 items-start">
          <div className="w-[220px] shrink-0">
            <img src={center.coverImage} alt={center.name} className="w-full h-[140px] object-cover rounded-2xl border border-slate-200" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <div className="text-2xl font-black text-slate-900 tracking-wide truncate">{center.name}</div>
                <div className="text-sm text-slate-500 mt-2 leading-relaxed max-w-4xl">{center.description}</div>
              </div>
              <button className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500">
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-bold">科室数量</div>
                  <div className="text-sm font-black text-slate-900">{center.stats.departments} 个</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-bold">医生数量</div>
                  <div className="text-sm font-black text-slate-900">{center.stats.doctors} 人</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-bold">CRC 数量</div>
                  <div className="text-sm font-black text-slate-900">{center.stats.crcs} 人</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-bold">关联项目</div>
                  <div className="text-sm font-black text-slate-900">{center.stats.projects} 个</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200/60 w-fit">
            <button
              className={classNames(
                'px-5 py-2 rounded-lg text-sm font-bold transition-all',
                tab === 'overview' ? 'bg-white shadow-sm border border-slate-200/50 text-brand-600' : 'text-slate-500 hover:text-slate-700'
              )}
              onClick={() => setTab('overview')}
            >
              项目概览
            </button>
            <button
              className={classNames(
                'px-5 py-2 rounded-lg text-sm font-bold transition-all',
                tab === 'departments' ? 'bg-white shadow-sm border border-slate-200/50 text-brand-600' : 'text-slate-500 hover:text-slate-700'
              )}
              onClick={() => setTab('departments')}
            >
              科室管理
            </button>
            <button
              className={classNames(
                'px-5 py-2 rounded-lg text-sm font-bold transition-all',
                tab === 'crcs' ? 'bg-white shadow-sm border border-slate-200/50 text-brand-600' : 'text-slate-500 hover:text-slate-700'
              )}
              onClick={() => setTab('crcs')}
            >
              CRC 管理
            </button>
          </div>
        </div>

        <div className="p-6">
          {tab === 'overview' && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-800">本中心关联项目</div>
              {center.projects.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {center.projects.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-600 border border-brand-100 text-[10px] font-bold tracking-wider">
                              {p.code}
                            </span>
                            <span
                              className={classNames(
                                'px-2 py-0.5 rounded-md border text-[10px] font-bold',
                                p.status === '进行中'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-50 text-slate-500 border-slate-200'
                              )}
                            >
                              {p.status}
                            </span>
                          </div>
                          <div className="mt-2 text-[15px] font-black text-slate-900 leading-snug">{p.name}</div>
                        </div>
                        <button className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500">
                          <span className="text-sm font-black">→</span>
                        </button>
                      </div>

                      {renderProgress(p.currentCount, p.totalCount, p.status)}

                      {p.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {p.tags.map((t) => (
                            <span key={t} className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-400">
                  暂无关联项目
                </div>
              )}
            </div>
          )}

          {tab === 'departments' && (
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                  <div className="text-sm font-bold text-slate-900">科室列表</div>
                </div>
                <div className="p-4 space-y-2">
                  {center.departments.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setActiveDept(d.id)}
                      className={classNames(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-left',
                        activeDept === d.id ? 'bg-brand-50 border-brand-200' : 'bg-white border-slate-100 hover:bg-slate-50'
                      )}
                    >
                      <div className={classNames('w-9 h-9 rounded-2xl border flex items-center justify-center', d.colorClass)}>
                        <i className={classNames(d.icon, 'text-[18px]')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-800 truncate">{d.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">点击查看成员</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-4 pt-2">
                  <button className="w-full py-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/30 hover:bg-slate-50 text-slate-500 font-bold text-sm flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    新增科室
                  </button>
                </div>
              </div>

              <Table title="医生列表" ctaText="新增医生" rows={doctors} />
            </div>
          )}

          {tab === 'crcs' && <Table title="CRC 列表" ctaText="新增 CRC" rows={center.crcs} />}
        </div>
      </div>
    </div>
  );
};

