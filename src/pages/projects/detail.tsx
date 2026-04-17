import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHeaderStore } from '../../store/useHeaderStore';
import { ENROLLMENT_DATA, PROJECTS, type EnrollmentRow } from '../../mock/projects';
import { ArrowLeft, Search, Filter, Plus, Eye, AlarmClock } from 'lucide-react';

type TableFilter =
  | 'all'
  | 'participated'
  | 'not_participated'
  | 'match_success'
  | 'match_failed'
  | 'pending';

const STAGE_BADGE: Record<string, string> = {
  'Stage 1': 'bg-amber-100 text-amber-700 border-amber-200',
  'Stage 2': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  '--': 'bg-slate-100 text-slate-600 border-slate-200'
};

export const ProjectDetail: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const setTitle = useHeaderStore((s) => s.setTitle);

  const project = useMemo(() => PROJECTS.find((p) => p.id === projectId), [projectId]);
  const data = useMemo(() => ENROLLMENT_DATA[projectId || ''] || [], [projectId]);

  const [filter, setFilter] = useState<TableFilter>('all');
  const [search, setSearch] = useState('');
  const [blindMode, setBlindMode] = useState(false);
  const [criteriaOpen, setCriteriaOpen] = useState(false);

  useEffect(() => {
    if (!project) return;
    setTitle('项目详情', project.title, [{ text: project.code, color: 'slate' }]);
  }, [project, setTitle]);

  const rows = useMemo(() => {
    let rows = [...data];
    const q = search.trim().toLowerCase();

    if (filter === 'participated') rows = rows.filter((r) => r.status === 'enrolled');
    if (filter === 'not_participated') rows = rows.filter((r) => r.status !== 'enrolled');
    if (filter === 'match_success') rows = rows.filter((r) => r.status === 'enrolled');
    if (filter === 'match_failed') rows = rows.filter((r) => r.status === 'failed');
    if (filter === 'pending') rows = rows.filter((r) => r.status === 'pending');

    if (q) rows = rows.filter((r) => r.name.toLowerCase().includes(q));

    rows.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return 0;
    });

    return rows;
  }, [data, filter, search]);

  if (!project) {
    return (
      <div className="animate-fade-in">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="text-lg font-bold text-slate-800 mb-2">未找到该项目</div>
          <button
            className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold"
            onClick={() => navigate('/index/projects')}
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  const ended = project.status === '已结束';

  const renderDrugId = (r: EnrollmentRow) => {
    if (!project.isFission || !r.isFissioned || !r.drugIdStage1 || !r.drugIdStage2) return r.drugId;
    return (
      <span className="inline-flex items-center gap-1">
        <span className="text-slate-400 line-through">{r.drugIdStage1}</span>
        <span className="text-slate-300">→</span>
        <span className="text-brand-600 font-bold">{r.drugIdStage2}</span>
      </span>
    );
  };

  const renderGroup = (r: EnrollmentRow) => {
    if (!r.subGroup) {
      return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${r.groupClass}`}>{r.group}</span>;
    }
    return (
      <div className="flex flex-col items-start gap-1">
        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 opacity-70">
          {r.group}
        </span>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
          ↳ {r.subGroup}
        </span>
      </div>
    );
  };

  const renderActions = (r: EnrollmentRow) => {
    if (r.status === 'failed') {
      return (
        <button className="text-slate-400 hover:text-brand-600 font-medium text-sm" onClick={() => alert('查看详情')}>
          查看详情
        </button>
      );
    }
    if (r.status === 'pending') {
      return (
        <button
          className={`font-bold text-sm px-3 py-1 rounded-lg border ${
            ended
              ? 'text-slate-300 bg-slate-100 border-slate-200 cursor-not-allowed'
              : 'text-brand-600 bg-brand-50 border-brand-200 hover:text-brand-700'
          }`}
          disabled={ended}
          onClick={() => alert('处理预约')}
        >
          处理预约
        </button>
      );
    }

    if (!project.isFission) {
      return (
        <button className="text-slate-400 hover:text-brand-600 font-medium text-sm" onClick={() => alert('查看详情')}>
          查看详情
        </button>
      );
    }

    if (r.isFissioned) {
      return (
        <div className="flex items-center justify-end gap-3">
          <button className="text-slate-300 cursor-not-allowed font-medium text-xs flex items-center gap-1 px-2 py-1" disabled>
            已裂变
          </button>
          <button className="text-slate-400 hover:text-brand-600 font-medium text-sm" onClick={() => alert('详情')}>
            详情
          </button>
        </div>
      );
    }

    if (r.stage === 'Stage 1') {
      return (
        <div className="flex items-center justify-end gap-3">
          <button
            className={`font-bold text-xs flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
              ended
                ? 'text-slate-300 bg-slate-100 border-slate-200 cursor-not-allowed'
                : 'text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-100 hover:text-indigo-700'
            }`}
            disabled={ended}
            onClick={() => alert('裂变')}
          >
            裂变
          </button>
          <button className="text-slate-400 hover:text-brand-600 font-medium text-sm" onClick={() => alert('详情')}>
            详情
          </button>
        </div>
      );
    }

    return (
      <button className="text-slate-400 hover:text-brand-600 font-medium text-sm" onClick={() => alert('详情')}>
        详情
      </button>
    );
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/index/projects')}
          className="flex items-center text-sm text-slate-500 hover:text-brand-600 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> 返回项目列表
        </button>
        <section className="flex gap-2">
          {project.isFission && !ended && (
            <button className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors mr-3 animate-pulse">
              <AlarmClock className="w-4 h-4" />
              <span>裂变时间已到</span>
            </button>
          )}
          <button
            onClick={() => setBlindMode((v) => !v)}
            className="flex items-center text-xs text-indigo-600 bg-white border border-indigo-600 rounded-lg px-2 py-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            <span>盲态切换</span>
          </button>
          <button
            onClick={() => alert('录入受试者')}
            disabled={ended}
            className={`flex px-4 py-2 text-xs justify-center font-bold rounded-lg shadow-lg flex items-center transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
              ended
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                : 'text-white bg-brand-600 hover:bg-brand-700 shadow-brand-500/30'
            }`}
          >
            <Plus className="w-4 h-4 mr-1.5" /> 录入受试者
          </button>
        </section>
      </div>

      <div className="relative bg-white rounded-2xl px-10 py-12 border border-slate-100 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -mr-10 -mt-10 opacity-50 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-800">{project.title}</h2>
            </div>
            <div className="flex items-center gap-4 text-slate-500 text-sm mb-4 font-mono flex-wrap">
              {project.status === '进行中' ? (
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="flex justify-center items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded border border-emerald-200">
                    进行中
                  </span>
                </div>
              ) : (
                <span className="flex justify-center items-center gap-2 px-2 py-1 bg-slate-50 text-slate-500 text-xs font-bold rounded border border-slate-200">
                  已结束
                </span>
              )}
              <span className="px-2.5 py-1 bg-brand-50 text-brand-600 text-xs font-bold rounded-md border border-brand-100 tracking-wider">
                项目码: {project.code}
              </span>
              {project.isFission && (
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-md border border-indigo-100 tracking-wider">
                  ⎇ 裂变项目
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-slate-500 text-sm mb-4 font-mono flex-wrap">
              {project.leader && (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md border border-slate-200 tracking-wider">
                  项目负责人: {project.leader}
                </span>
              )}
              {project.collab && (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md border border-slate-200 tracking-wider">
                  协作医生: {project.collab}
                </span>
              )}
              {project.crc && (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md border border-slate-200 tracking-wider">
                  CRC: {project.crc}
                </span>
              )}
            </div>

            <p className="text-slate-600 max-w-4xl leading-relaxed">
              {project.isFission ? project.fissionDescription || project.description : project.description}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 min-w-[240px]">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">关联中心</h4>
            <ul className="space-y-3">
              {(project.centers || []).map((c) => (
                <li key={c} className="flex items-center text-sm font-medium text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-brand-500 mr-2"></span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-800">纳入标准 | 排除标准</h3>
          <button
            onClick={() => setCriteriaOpen((v) => !v)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            aria-expanded={criteriaOpen}
          >
            <span className={`transition-transform inline-block ${criteriaOpen ? 'rotate-180' : ''}`}>⌄</span>
          </button>
        </div>
        {criteriaOpen && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              {(project.inclusionCriteria || []).map((c) => (
                <div
                  key={c}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-slate-700"
                >
                  {c}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {(project.exclusionCriteria || []).map((c) => (
                <div key={c} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-slate-700">
                  {c}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {project.isFission && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 bg-amber-50/30 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-100 rounded text-amber-600">⎇</div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">裂变规则配置</h3>
                <p className="text-xs text-slate-500">当前项目的多阶段随机化逻辑</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded border border-amber-200">主动触发模式</span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-500 mb-1">触发机制</div>
                <div className="text-sm font-bold text-slate-800">主动触发</div>
                <div className="text-xs text-slate-500 mt-1">工作人员确认后执行裂变</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-500 mb-1">平衡策略</div>
                <div className="text-sm font-bold text-slate-800">简单随机 / 维度平衡</div>
                <div className="text-xs text-slate-500 mt-1">按阶段与子组规则分配</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-500 mb-1">阶段结构</div>
                <div className="text-sm font-bold text-slate-800">Stage 1 → Stage 2</div>
                <div className="text-xs text-slate-500 mt-1">第二阶段支持裂变子组</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-lg font-bold text-slate-900">受试者列表</div>
            <div className="text-sm text-slate-500 mt-1">筛选、匹配与裂变状态追踪</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="搜索受试者姓名..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <Filter className="w-4 h-4 text-slate-400" />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as TableFilter)}
                className="pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              >
                <option value="all">全部</option>
                <option value="participated">已入组</option>
                <option value="not_participated">未入组</option>
                <option value="match_failed">匹配失败</option>
                <option value="pending">待处理</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100" id="data-table-wrapper">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider">
                {!blindMode && <th className="px-6 py-4 font-semibold">筛选号</th>}
                <th className="px-6 py-4 font-semibold">受试者编号</th>
                {!blindMode && <th className="px-6 py-4 font-semibold">随机号</th>}
                {!blindMode && <th className="px-6 py-4 font-semibold">产品号</th>}
                <th className="px-6 py-4 font-semibold">姓名</th>
                <th className="px-6 py-4 font-semibold">年龄</th>
                <th className="px-6 py-4 font-semibold">指标</th>
                {!blindMode && <th className="px-6 py-4 font-semibold">分组</th>}
                {!blindMode && <th className="px-6 py-4 font-semibold">维度标签</th>}
                <th className="px-6 py-4 font-semibold">推荐医生</th>
                {project.isFission && !blindMode && <th className="px-6 py-4 font-semibold">裂变状态</th>}
                <th className="px-6 py-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {rows.map((r, idx) => (
                <tr key={`${r.id}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                  {!blindMode && <td className="px-6 py-4 font-mono font-medium text-slate-600">{r.screenId}</td>}
                  <td className="px-6 py-4 font-mono font-medium text-slate-600">{r.id}</td>
                  {!blindMode && <td className="px-6 py-4 font-mono text-slate-600">{r.randomId}</td>}
                  {!blindMode && <td className="px-6 py-4 font-mono text-slate-600">{renderDrugId(r)}</td>}
                  <td className="px-6 py-4 font-semibold text-slate-800">{r.name}</td>
                  <td className="px-6 py-4 text-slate-600">{r.age}</td>
                  <td className="px-6 py-4 text-slate-600">{r.indicator}</td>
                  {!blindMode && <td className="px-6 py-4">{renderGroup(r)}</td>}
                  {!blindMode && (
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {r.tags.length ? (
                          r.tags.map((t) => (
                            <span key={t} className="px-1.5 py-0.5 rounded border border-slate-200 text-xs text-slate-500">
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">--</span>
                        )}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 font-medium text-slate-600">{r.doctor || '--'}</td>
                  {project.isFission && !blindMode && (
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${STAGE_BADGE[r.stage || '--']}`}>
                        {r.stage || '--'}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 text-right">{renderActions(r)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
