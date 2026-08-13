/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

type StatusFilter = 'all' | 'ongoing' | 'finished';
type ProjectStatus = 'ongoing' | 'finished';
type SubTab = 'iwrs' | 'edc';

interface ProjectBase {
  id: string;
  code: string;
  name: string;
  status: ProjectStatus;
  badge?: { label: string; tone: 'blue' | 'emerald'; }[];
}

interface IwrsMetrics {
  label: string;
  value: string;
  accent?: 'blue' | 'rose' | 'default';
  suffix?: string;
}

interface EdcMetrics {
  label: string;
  value: string;
  accent?: 'emerald' | 'rose' | 'default';
}

interface BothSystemProject extends ProjectBase {
  kind: 'both';
  iwrsMetrics: IwrsMetrics[];
  edcMetrics: EdcMetrics[];
}

interface OnlyIwrsProject extends ProjectBase {
  kind: 'iwrs';
  iwrsMetrics: IwrsMetrics[];
}

interface OnlyEdcProject extends ProjectBase {
  kind: 'edc';
  edcMetrics: EdcMetrics[];
}

type Project = BothSystemProject | OnlyIwrsProject | OnlyEdcProject;

const PROJECTS: Project[] = [
  {
    id: 'p001',
    code: 'PROJ-2026-001',
    name: '阿兹海默症 III 期多中心临床试验',
    status: 'ongoing',
    kind: 'both',
    iwrsMetrics: [
      { label: '预约待处理', value: '18', accent: 'rose' },
      { label: '分配入组概览', value: '12', accent: 'blue', suffix: '/50' }
    ],
    edcMetrics: [
      { label: '访视中', value: '10', accent: 'emerald' },
      { label: '表单录入', value: '45%', accent: 'emerald' },
      { label: '待办质疑', value: '4', accent: 'rose' }
    ]
  },
  {
    id: 'p018',
    code: 'PROJ-2027-018',
    name: '某靶向药 I 期剂量递增试验',
    status: 'ongoing',
    kind: 'iwrs',
    badge: [{ label: '仅 IWRS', tone: 'blue' }],
    iwrsMetrics: [
      { label: '预约待处理', value: '6', accent: 'rose' },
      { label: '分配入组概览', value: '3', accent: 'blue', suffix: '/24' }
    ]
  },
  {
    id: 'p042',
    code: 'PROJ-2025-042',
    name: '某创新药真实世界研究',
    status: 'finished',
    kind: 'edc',
    badge: [{ label: '仅 EDC', tone: 'emerald' }],
    edcMetrics: [
      { label: '总受试者', value: '120' },
      { label: '表单录入', value: '100%' },
      { label: '待办质疑', value: '0' }
    ]
  }
];

type ProjectKind = 'both' | 'iwrs' | 'edc';

interface ProjectListProps {
  onNavigateToDetail?: (kind: ProjectKind) => void;
}

const statusBadgeClass: Record<ProjectStatus, string> = {
  ongoing: 'px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] rounded-full font-bold',
  finished: 'px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-200 text-[10px] rounded-full font-bold'
};

const statusLabel: Record<ProjectStatus, string> = {
  ongoing: '进行中',
  finished: '已结束'
};

export const ProjectList: React.FC<ProjectListProps> = ({ onNavigateToDetail }) => {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [keyword, setKeyword] = useState('');
  const [tabState, setTabState] = useState<Record<string, SubTab>>({ p001: 'iwrs' });

  const filtered = useMemo(() => {
    return PROJECTS.filter(p => {
      if (filter !== 'all' && p.status !== filter) return false;
      if (keyword.trim()) {
        const k = keyword.trim().toLowerCase();
        if (!p.code.toLowerCase().includes(k) && !p.name.toLowerCase().includes(k)) return false;
      }
      return true;
    });
  }, [filter, keyword]);

  const setSubTab = (pid: string, tab: SubTab) =>
    setTabState(prev => ({ ...prev, [pid]: tab }));

  const getSubTab = (pid: string): SubTab => tabState[pid] ?? 'iwrs';

  const renderIwrsBlock = (metrics: IwrsMetrics[], finished: boolean, kind: ProjectKind) => {
    const btnClass = finished
      ? 'w-full py-2 bg-gray-50 text-gray-500 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-100 transition flex justify-center items-center gap-1'
      : 'w-full py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-xs font-bold hover:bg-blue-100 transition flex justify-center items-center gap-1';

    const valueClass = (a?: IwrsMetrics['accent']) => {
      if (finished) return 'text-gray-500';
      if (a === 'rose') return 'text-rose-500';
      if (a === 'blue') return 'text-blue-600';
      return 'text-gray-700';
    };

    return (
      <div className="p-4 pt-5 bg-white">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {metrics.map((m, idx) => (
            <div key={m.label + idx} className={`text-center ${idx > 0 ? 'border-l border-gray-100' : ''}`}>
              <div className="text-[10px] text-gray-400 mb-1">{m.label}</div>
              <div className={`text-sm font-bold ${valueClass(m.accent)}`}>
                {m.value}{m.suffix && <span className="text-[10px] text-gray-400 font-normal">{m.suffix}</span>}
              </div>
            </div>
          ))}
        </div>
        <button className={btnClass} onClick={() => onNavigateToDetail?.(kind)}>
          进入项目详情 <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    );
  };

  const renderEdcBlock = (metrics: EdcMetrics[], finished: boolean, kind: ProjectKind) => {
    const btnClass = finished
      ? 'w-full py-2 bg-gray-50 text-gray-500 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-100 transition flex justify-center items-center gap-1'
      : 'w-full py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-xs font-bold hover:bg-emerald-100 transition flex justify-center items-center gap-1';

    const valueClass = (a?: EdcMetrics['accent']) => {
      if (finished) return 'text-gray-500';
      if (a === 'emerald') return 'text-emerald-600';
      if (a === 'rose') return 'text-rose-500';
      return 'text-gray-700';
    };

    return (
      <div className="p-4 pt-5 bg-white">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {metrics.map((m, idx) => (
            <div key={m.label + idx} className={`text-center ${idx > 0 ? 'border-l border-gray-100' : ''}`}>
              <div className="text-[10px] text-gray-400 mb-1">{m.label}</div>
              <div className={`text-sm font-bold ${valueClass(m.accent)}`}>{m.value}</div>
            </div>
          ))}
        </div>
        <button className={btnClass} onClick={() => onNavigateToDetail?.(kind)}>
          进入项目详情 <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    );
  };

  const tabs: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'ongoing', label: '进行中' },
    { key: 'finished', label: '已结束' }
  ];

  const renderBothProject = (p: BothSystemProject) => {
    const active = getSubTab(p.id);
    const finished = p.status === 'finished';
    return (
      <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 pb-2">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-900 text-base">{p.code}</h3>
            <span className={statusBadgeClass[p.status]}>{statusLabel[p.status]}</span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-1">{p.name}</p>
        </div>

        <div className="flex px-1 pt-2 items-end">
          <div
            className={`relative transition-all duration-300 border border-b-0 rounded-t-lg px-4 py-1.5 text-xs mr-1 cursor-pointer
              ${active === 'iwrs'
                ? "bg-white text-gray-900 font-bold border-gray-200 border-t-[3px] border-t-blue-500 z-30 after:content-[''] after:absolute after:-bottom-[1px] after:left-0 after:right-0 after:h-[2px] after:bg-white"
                : 'bg-gray-100 text-gray-500 border-gray-200 z-10'}`}
            onClick={() => setSubTab(p.id, 'iwrs')}
          >
            IWRS 系统
          </div>
          <div
            className={`relative transition-all duration-300 border border-b-0 rounded-t-lg px-4 py-1.5 text-xs mr-1 cursor-pointer
              ${active === 'edc'
                ? "bg-white text-gray-900 font-bold border-gray-200 border-t-[3px] border-t-emerald-500 z-30 after:content-[''] after:absolute after:-bottom-[1px] after:left-0 after:right-0 after:h-[2px] after:bg-white"
                : 'bg-gray-100 text-gray-500 border-gray-200 z-10'}`}
            onClick={() => setSubTab(p.id, 'edc')}
          >
            EDC 系统
          </div>
        </div>

        <div className="border-t border-gray-200 -mt-[1px] relative z-20">
          {active === 'iwrs' && renderIwrsBlock(p.iwrsMetrics, finished, p.kind)}
          {active === 'edc' && renderEdcBlock(p.edcMetrics, finished, p.kind)}
        </div>
      </div>
    );
  };

  const renderSingleProject = (p: OnlyIwrsProject | OnlyEdcProject) => {
    const toneClass = p.kind === 'iwrs'
      ? 'bg-blue-400'
      : 'bg-emerald-400';
    const borderClass = p.kind === 'iwrs'
      ? 'border border-blue-100'
      : 'border border-emerald-100';
    const finished = p.status === 'finished';

    return (
      <div key={p.id} className={`bg-white rounded-2xl shadow-sm ${borderClass} overflow-hidden relative`}>
        <div className={`absolute top-0 left-0 w-1 h-full ${toneClass}`}></div>
        <div className="p-4 pb-3 border-b border-gray-50 pl-5">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-base">{p.code}</h3>
              {p.badge?.map(b => (
                <span
                  key={b.label}
                  className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                    b.tone === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {b.label}
                </span>
              ))}
            </div>
            <span className={statusBadgeClass[p.status]}>{statusLabel[p.status]}</span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-1">{p.name}</p>
        </div>

        <div className="pl-5">
          {p.kind === 'iwrs' && renderIwrsBlock(p.iwrsMetrics, finished, p.kind)}
          {p.kind === 'edc' && renderEdcBlock(p.edcMetrics, finished, p.kind)}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden">
      <div className="px-5 pt-4 pb-2 shrink-0 sticky top-0 bg-[#f8fafc] z-40 space-y-3">
        {/* <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索项目编号或名称..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}

        <div className="flex bg-slate-100 p-1 rounded-xl">
          {tabs.map(t => (
            <div
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`flex-1 text-center py-1.5 rounded-lg text-[13px] transition-all cursor-pointer ${
                filter === t.key
                  ? 'bg-white text-blue-600 font-bold shadow-sm'
                  : 'text-slate-500 font-medium'
              }`}
            >
              {t.label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 mt-4 space-y-5 pb-4">
        {filtered.length === 0 && (
          <div className="text-center text-slate-400 text-sm mt-16 pb-10">暂无符合条件的项目</div>
        )}
        {filtered.map(p =>
          p.kind === 'both' ? renderBothProject(p) : renderSingleProject(p)
        )}
      </div>
    </div>
  );
};
