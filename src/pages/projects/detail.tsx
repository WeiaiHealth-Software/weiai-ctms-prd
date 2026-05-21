import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHeaderStore } from '../../store/useHeaderStore';
import { ENROLLMENT_DATA, type EnrollmentRow } from '../../mock/projects';
import { useProjectsStore } from '../../store/useProjectsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { AVAILABLE_DIMENSIONS } from '../../constants/dimensions';
import { ArrowLeft, Search, Filter, Plus, Eye, AlarmClock, Rocket, AlertTriangle, Settings } from 'lucide-react';
import Drawer from '../../components/overlay/Drawer';
import SectionCard from '../../components/common/SectionCard';

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

  const projects = useProjectsStore((s) => s.projects);
  const updateProjectStatus = useProjectsStore((s) => s.updateProjectStatus);
  const isAdmin = useAuthStore((s) => s.role === 'admin');
  const project = useMemo(() => projects.find((p) => p.id === projectId), [projectId, projects]);
  const data = useMemo(() => ENROLLMENT_DATA[projectId || ''] || [], [projectId]);

  const [filter, setFilter] = useState<TableFilter>('all');
  const [search, setSearch] = useState('');
  const [blindMode, setBlindMode] = useState(false);
  const [criteriaOpen, setCriteriaOpen] = useState(false);
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [subjectDrawerOpen, setSubjectDrawerOpen] = useState(false);
  const [activeSubject, setActiveSubject] = useState<EnrollmentRow | null>(null);

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
      <div>
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

  const status = project.status;
  const ended = status === '已结束';
  const readyToStart = status === '未开始';
  const configSnapshot = project.configSnapshot;

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

  const openSubject = (r: EnrollmentRow) => {
    setActiveSubject(r);
    setSubjectDrawerOpen(true);
  };

  const closeSubject = () => {
    setSubjectDrawerOpen(false);
    setActiveSubject(null);
  };

  const renderActions = (r: EnrollmentRow) => {
    if (r.status === 'failed') {
      return (
        <button className="text-slate-400 hover:text-brand-600 font-medium text-sm" onClick={() => openSubject(r)}>
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
        <button className="text-slate-400 hover:text-brand-600 font-medium text-sm" onClick={() => openSubject(r)}>
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
          <button className="text-slate-400 hover:text-brand-600 font-medium text-sm" onClick={() => openSubject(r)}>
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
          <button className="text-slate-400 hover:text-brand-600 font-medium text-sm" onClick={() => openSubject(r)}>
            详情
          </button>
        </div>
      );
    }

    return (
      <button className="text-slate-400 hover:text-brand-600 font-medium text-sm" onClick={() => openSubject(r)}>
        详情
      </button>
    );
  };

  return (
    <div className="space-y-6 p-6">
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
          {isAdmin && (
            <button
              type="button"
              onClick={() => setConfigModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs justify-center font-bold rounded-lg shadow-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Settings className="w-4 h-4" />
              配置详情
            </button>
          )}
          {readyToStart && (
            <button
              type="button"
              onClick={() => setStartModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs justify-center font-bold rounded-lg shadow-lg border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Rocket className="w-4 h-4" />
              启动项目
            </button>
          )}
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
              {status === '进行中' ? (
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="flex justify-center items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded border border-emerald-200">
                    进行中
                  </span>
                </div>
              ) : status === '未开始' ? (
                <span className="flex justify-center items-center gap-2 px-2 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded border border-orange-200">
                  待启动
                </span>
              ) : status === '初始化' ? (
                <span className="flex justify-center items-center gap-2 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-200">
                  初始化
                </span>
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
                {!blindMode && <th className="px-6 py-4 font-semibold text-center">筛选号</th>}
                <th className="px-6 py-4 font-semibold text-center">受试者编号</th>
                <th className="px-6 py-4 font-semibold">姓名</th>
                <th className="px-6 py-4 font-semibold text-center">年龄</th>
                <th className="px-6 py-4 font-semibold text-center">屈光度</th>
                {!blindMode && <th className="px-6 py-4 font-semibold text-center">分组</th>}
                {!blindMode && <th className="px-6 py-4 font-semibold text-center">维度标签</th>}
                <th className="px-6 py-4 font-semibold text-center">推荐医生</th>
                {project.isFission && !blindMode && <th className="px-6 py-4 font-semibold text-center">裂变状态</th>}
                <th className="px-6 py-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {rows.map((r, idx) => (
                <tr key={`${r.id}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                  {!blindMode && <td className="px-6 py-4 font-mono font-medium text-slate-600 text-center">{r.screenId}</td>}
                  <td className="px-6 py-4 font-mono font-medium text-slate-600 text-center">{r.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800 text-center">{r.name}</td>
                  <td className="px-6 py-4 text-slate-600 text-center">{r.age}</td>
                  <td className="px-6 py-4 text-slate-600 text-center font-mono">{r.indicator}</td>
                  {!blindMode && <td className="px-6 py-4 text-center"><div className="flex justify-center">{renderGroup(r)}</div></td>}
                  {!blindMode && (
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-1 flex-wrap justify-center">
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
                  <td className="px-6 py-4 font-medium text-slate-600 text-center">{r.doctor || '--'}</td>
                  {project.isFission && !blindMode && (
                    <td className="px-6 py-4 text-center">
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

      <Drawer
        open={subjectDrawerOpen}
        title="受试者详情"
        subtitle={activeSubject ? `受试者编号：${activeSubject.id}` : undefined}
        onClose={closeSubject}
        width={760}
      >
        {activeSubject && (
          <div className="space-y-5">
            <SectionCard title="基础信息">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-slate-500 font-bold mb-1">姓名</div>
                  <div className="font-bold text-slate-800">{activeSubject.name}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold mb-1">年龄</div>
                  <div className="font-bold text-slate-800">{activeSubject.age}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold mb-1">屈光度</div>
                  <div className="font-bold text-slate-800 font-mono">{activeSubject.indicator}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold mb-1">推荐医生</div>
                  <div className="font-bold text-slate-800">{activeSubject.doctor || '--'}</div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="编号信息">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-slate-500 font-bold mb-1">筛选号</div>
                  <div className="font-bold text-slate-800 font-mono">{activeSubject.screenId || '--'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold mb-1">受试者编号</div>
                  <div className="font-bold text-slate-800 font-mono">{activeSubject.id || '--'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold mb-1">随机号</div>
                  <div className="font-bold text-slate-800 font-mono">{activeSubject.randomId || '--'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold mb-1">产品号</div>
                  <div className="font-bold text-slate-800 font-mono">{renderDrugId(activeSubject) || '--'}</div>
                </div>
                {project.isFission && (
                  <>
                    <div>
                      <div className="text-xs text-slate-500 font-bold mb-1">产品号（Stage 1）</div>
                      <div className="font-bold text-slate-800 font-mono">{activeSubject.drugIdStage1 || '--'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-bold mb-1">产品号（Stage 2）</div>
                      <div className="font-bold text-slate-800 font-mono">{activeSubject.drugIdStage2 || '--'}</div>
                    </div>
                  </>
                )}
              </div>
            </SectionCard>

            <SectionCard title="分组信息">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-slate-500 font-bold mb-1">研究组</div>
                  <div className="flex items-center gap-2">{renderGroup(activeSubject)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold mb-1">裂变状态</div>
                  {project.isFission ? (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${STAGE_BADGE[activeSubject.stage || '--']}`}
                    >
                      {activeSubject.stage || '--'}
                    </span>
                  ) : (
                    <span className="text-slate-400">--</span>
                  )}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="维度信息">
              <div className="space-y-4">
                <div className="flex gap-1 flex-wrap">
                  {activeSubject.tags.length ? (
                    activeSubject.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-lg border border-slate-200 text-xs text-slate-600 bg-white">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">--</span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {AVAILABLE_DIMENSIONS.map((d) => {
                    let value = '--';
                    if (d.id === 'gender') {
                      value = activeSubject.tags.find(t => t === '男' || t === '女') ?? '--';
                    } else if (d.id === 'age') {
                      value = activeSubject.tags.find(t => t.includes('岁')) ?? '--';
                    } else if (d.id === 'diopter') {
                      const num = Number(String(activeSubject.indicator).replace(/[^\d.-]/g, ''));
                      if (!Number.isNaN(num)) {
                        if (num >= -1.0 && num <= -0.5) value = '-1.0~-0.5';
                        else if (num >= -0.4 && num <= 0) value = '-0.4~0';
                      }
                    }
                    return (
                      <div key={d.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-xs font-bold text-slate-500">{d.name}</div>
                        <div className="mt-1 font-bold text-slate-800">{value}</div>
                        <div className="mt-1 text-[11px] text-slate-500 leading-relaxed">{d.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </SectionCard>
          </div>
        )}
      </Drawer>

      {startModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-brand-50 rounded-full mb-5 border border-brand-100">
                <AlertTriangle className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-800 mb-2">确认启动项目？</h3>
              <p className="text-center text-slate-500 mb-6 text-sm leading-relaxed">
                确认启动 <span className="font-bold text-slate-700">"{project.title}"</span> 项目。
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStartModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStartModalOpen(false);
                    updateProjectStatus(project.id, '进行中');
                  }}
                  className="flex-1 px-4 py-2.5 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all active:scale-95"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {configModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-lg font-black text-slate-800">项目配置详情</div>
                <div className="text-xs text-slate-500 mt-0.5 font-mono">{project.code}</div>
              </div>
              <button
                type="button"
                onClick={() => setConfigModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100"
              >
                关闭
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-auto">
              {!configSnapshot ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-600 text-sm">
                  当前项目暂无配置快照（仅在创建完成时会记录一份配置详情）。
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="text-xs text-slate-500 font-bold mb-1">创建时间</div>
                      <div className="text-sm font-bold text-slate-800">{new Date(configSnapshot.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="text-xs text-slate-500 font-bold mb-1">匹配模式</div>
                      <div className="text-sm font-bold text-slate-800">{configSnapshot.matchMode === 'random' ? '随机分配' : '自由分配'}</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="text-xs text-slate-500 font-bold mb-1">样本量</div>
                      <div className="text-sm font-bold text-slate-800">{configSnapshot.totalCount}</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 text-sm font-black text-slate-800">基础信息</div>
                    <div className="p-5 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-slate-500 font-bold mb-1">项目名称</div>
                        <div className="font-bold text-slate-800">{configSnapshot.basicInfo.name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-bold mb-1">项目码</div>
                        <div className="font-bold text-slate-800 font-mono">{configSnapshot.basicInfo.code}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-bold mb-1">随机码前缀</div>
                        <div className="font-bold text-slate-800">{configSnapshot.basicInfo.randomPrefix}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-bold mb-1">产品码前缀</div>
                        <div className="font-bold text-slate-800">{configSnapshot.basicInfo.productPrefix}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-bold mb-1">是否共享数据</div>
                        <div className="font-bold text-slate-800">{configSnapshot.basicInfo.isShared ? '共享' : '不共享'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-bold mb-1">是否双盲</div>
                        <div className="font-bold text-slate-800">{configSnapshot.basicInfo.isBlind ? '开启' : '关闭'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 text-sm font-black text-slate-800">维度选择</div>
                    <div className="p-5">
                      <div className="flex flex-wrap gap-2">
                        {(configSnapshot.selectedDimensions.length ? configSnapshot.selectedDimensions : ['默认']).map((id) => {
                          const d = AVAILABLE_DIMENSIONS.find((x) => x.id === id);
                          const label = d ? d.name : id;
                          return (
                            <span
                              key={id}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border bg-brand-50 text-brand-700 border-brand-100"
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                      <div className="mt-3 text-xs text-slate-500">
                        因子组合：<span className="font-mono">{configSnapshot.dimensionFactors.length}</span> 种
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 text-sm font-black text-slate-800">分组配置（Stage 1）</div>
                    <div className="p-5 space-y-3">
                      {configSnapshot.groups.map((g) => (
                        <div key={g.id} className="rounded-2xl border border-slate-200 overflow-hidden">
                          <div className="px-4 py-3 bg-white flex items-center justify-between">
                            <div className="font-black text-slate-800">{g.name}</div>
                            <div className="text-xs font-bold text-slate-500">
                              人数 <span className="text-slate-800">{g.count}</span>
                            </div>
                          </div>
                          <div className="px-4 pb-4">
                            <div className="text-xs text-slate-500 font-bold mb-2">产品</div>
                            <div className="text-sm font-bold text-slate-800">{g.medicine}</div>
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              {Object.entries(g.factors).map(([k, v]) => (
                                <div key={k} className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                                  <span className="text-xs font-bold text-slate-600">{k}</span>
                                  <span className="text-xs font-black text-slate-800">{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {configSnapshot.isFissionMode && (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                      <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 text-sm font-black text-slate-800">裂变配置（Stage 2）</div>
                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                            <div className="text-xs text-slate-500 font-bold mb-1">平衡策略</div>
                            <div className="text-sm font-bold text-slate-800">
                              {configSnapshot.fissionConfig.balanceStrategy === 'simple'
                                ? '简单随机'
                                : configSnapshot.fissionConfig.balanceStrategy === 'dimension'
                                  ? '维度平衡'
                                  : '主动分配'}
                            </div>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                            <div className="text-xs text-slate-500 font-bold mb-1">入组时长门槛</div>
                            <div className="text-sm font-bold text-slate-800">{configSnapshot.fissionConfig.days} 天</div>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                            <div className="text-xs text-slate-500 font-bold mb-1">医学指标备注</div>
                            <div className="text-sm font-bold text-slate-800">{configSnapshot.fissionConfig.medicalNote || '—'}</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {Object.entries(configSnapshot.fissionRules).map(([groupId, rule]) => {
                            const group = configSnapshot.groups.find((g) => g.id === groupId);
                            const title = group ? group.name : groupId;
                            return (
                              <div key={groupId} className="rounded-2xl border border-slate-200 overflow-hidden">
                                <div className="px-4 py-3 bg-white flex items-center justify-between">
                                  <div className="font-black text-slate-800">针对 {title}</div>
                                  <div className="text-xs font-bold text-slate-500">
                                    子组 <span className="text-slate-800">{rule.subGroups.length}</span>
                                  </div>
                                </div>
                                <div className="px-4 pb-4 space-y-2">
                                  {rule.subGroups.map((sg) => (
                                    <div key={sg.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                                      <div className="min-w-0">
                                        <div className="text-sm font-black text-slate-800 truncate">{sg.name}</div>
                                        <div className="text-xs text-slate-500 truncate">{sg.medicine}</div>
                                      </div>
                                      <div className="text-xs font-black text-slate-800">{sg.count} 人</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
