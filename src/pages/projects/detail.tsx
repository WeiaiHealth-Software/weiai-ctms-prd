import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHeaderStore } from '../../store/useHeaderStore';
import { ENROLLMENT_DATA, type EnrollmentRow } from '../../mock/projects';
import { useProjectsStore } from '../../store/useProjectsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { AVAILABLE_DIMENSIONS } from '../../constants/dimensions';
import { ArrowLeft, Search, Filter, Plus, Eye, AlarmClock, Rocket, AlertTriangle, Settings, Hospital, Sparkles, ChevronDown, History, Cpu, Layers, X, ChevronRightIcon } from 'lucide-react';
import Drawer from '../../components/overlay/Drawer';
import SectionCard from '../../components/common/SectionCard';
import Select from '../../components/form/Select';

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

type AiMessageRole = 'assistant' | 'user';

type AiMessage = {
  id: string;
  role: AiMessageRole;
  content: string;
  tag?: string;
  time: string;
};

type AiMode = 'default' | 'analysis';

type AiEngine = 'WEyeAI' | 'DeepSeek' | 'Qwen';

type AiQuickAction = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  mode?: AiMode;
  prefillOnly?: boolean;
};

const ANALYSIS_PROMPT_TEMPLATE = `请基于当前项目数据做一次分析，并按“结论 / 依据 / 建议动作”输出：
1. 分析目标：
2. 重点规则或筛选条件：
3. 关注时间范围：
4. 异常阈值：
5. 希望重点关注的指标：`;

const createAiMessage = (role: AiMessageRole, content: string, tag?: string): AiMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
  tag,
  time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
});

const parseAgeValue = (age: string) => {
  const match = age.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
};

const parseIndicatorValue = (indicator: string) => {
  const value = Number(String(indicator).replace(/[^\d.-]/g, ''));
  return Number.isNaN(value) ? null : value;
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
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMode, setAiMode] = useState<AiMode>('default');
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
  const [aiEngine, setAiEngine] = useState<AiEngine>('WEyeAI');
  const [aiEngineMenuOpen, setAiEngineMenuOpen] = useState(false);
  const [aiHistoryOpen, setAiHistoryOpen] = useState(false);
  const [aiHistoryTab, setAiHistoryTab] = useState<'all' | 'engine' | 'star'>('all');
  const [aiHistoryQuery, setAiHistoryQuery] = useState('');
  const [aiQuickActionsCollapsed, setAiQuickActionsCollapsed] = useState(false);
  const aiEngineMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!project) return;
    setTitle('项目详情', project.title, [{ text: project.code, color: 'slate' }]);
  }, [project, setTitle]);

  useEffect(() => {
    if (!aiEngineMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      const el = aiEngineMenuRef.current;
      if (!el) return;
      if (el.contains(e.target as Node)) return;
      setAiEngineMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAiEngineMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [aiEngineMenuOpen]);

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

  const status = project?.status ?? '初始化';
  const ended = status === '已结束';
  const readyToStart = status === '未开始';
  const configSnapshot = project?.configSnapshot;
  const analytics = useMemo(() => {
    const enrolled = data.filter((row) => row.status === 'enrolled').length;
    const failed = data.filter((row) => row.status === 'failed').length;
    const pending = data.filter((row) => row.status === 'pending').length;
    const progress = project?.totalCount ? Math.round((project.currentCount / project.totalCount) * 100) : 0;

    const genderCounts = data.reduce(
      (acc, row) => {
        if (row.tags.includes('男')) acc.male += 1;
        if (row.tags.includes('女')) acc.female += 1;
        return acc;
      },
      { male: 0, female: 0 }
    );

    const ageValues = data.map((row) => parseAgeValue(row.age)).filter((value): value is number => value !== null);
    const avgAge = ageValues.length ? (ageValues.reduce((sum, value) => sum + value, 0) / ageValues.length).toFixed(1) : '--';

    const indicatorValues = data
      .map((row) => parseIndicatorValue(row.indicator))
      .filter((value): value is number => value !== null);
    const avgIndicator = indicatorValues.length
      ? `${(indicatorValues.reduce((sum, value) => sum + value, 0) / indicatorValues.length).toFixed(2)}D`
      : '--';

    const doctorStats = Object.entries(
      data.reduce<Record<string, number>>((acc, row) => {
        const key = row.doctor || '未标注';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]);

    const topTags = Object.entries(
      data.reduce<Record<string, number>>((acc, row) => {
        row.tags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return {
      enrolled,
      failed,
      pending,
      progress,
      avgAge,
      avgIndicator,
      genderCounts,
      doctorStats,
      topDoctor: doctorStats[0]?.[0] || '暂无',
      topDoctorCount: doctorStats[0]?.[1] || 0,
      topTags,
      sampleSize: data.length
    };
  }, [data, project?.currentCount, project?.totalCount]);
  const safeProjectTitle = project?.title ?? '当前项目';
  const safeCurrentCount = project?.currentCount ?? 0;
  const safeTotalCount = project?.totalCount ?? 0;


  const quickActions = useMemo<AiQuickAction[]>(
    () => [
      {
        id: 'summary',
        title: '项目速览',
        description: '快速总结项目定位、进度与当前重点',
        prompt: `请用简洁方式总结一下项目“${safeProjectTitle}”的核心信息，并给我三个当前最值得关注的点。`
      },
      {
        id: 'progress',
        title: '入组进度',
        description: '聚焦入组、待处理与目标达成情况',
        prompt: '请结合当前项目进度、待处理数据和项目目标，给我一个入组进度判断与下周建议。'
      },
      {
        id: 'risk',
        title: '风险提示',
        description: '识别当前最需要人工跟进的项目风险',
        prompt: '请识别当前项目最需要关注的执行风险，并按优先级输出风险点和建议动作。'
      },
      {
        id: 'analysis',
        title: '数据分析',
        description: '自动填入通用分析提示词模板',
        prompt: ANALYSIS_PROMPT_TEMPLATE,
        mode: 'analysis',
        prefillOnly: true
      }
    ],
    [safeProjectTitle]
  );

  useEffect(() => {
    if (!project) return;
    setAiMessages([
      createAiMessage(
        'assistant',
        `我是 WEyeAI 科研助手，可以回答项目执行问题，也可以基于当前页面数据做分析。\n当前项目整体进度约 ${analytics.progress}%，已累计入组 ${safeCurrentCount}/${safeTotalCount} 例。若你需要结构化分析，点击“数据分析”即可载入模板。`,
        '欢迎'
      )
    ]);
    setAiInput('');
    setAiMode('default');
  }, [project, safeCurrentCount, safeTotalCount, analytics.progress]);

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

  const buildAiReply = (prompt: string, mode: AiMode) => {
    const normalizedPrompt = prompt.toLowerCase();
    const topTagSummary = analytics.topTags.length
      ? analytics.topTags.map(([tag, count]) => `${tag}(${count})`).join('、')
      : '暂无明显标签聚类';

    if (mode === 'analysis' || /分析|规则|阈值|数据/.test(normalizedPrompt)) {
      return `以下为基于当前项目信息与页面示例受试者数据生成的分析 Demo：\n\n1. 结论\n- 项目累计入组 ${project.currentCount}/${project.totalCount}，整体进度约 ${analytics.progress}%。页面示例数据中，已入组 ${analytics.enrolled} 例，待处理 ${analytics.pending} 例，未入组/失败 ${analytics.failed} 例。\n- 当前样本人群平均年龄约 ${analytics.avgAge} 岁，平均屈光度约 ${analytics.avgIndicator}，高频标签为 ${topTagSummary}。\n- 推荐来源以 ${analytics.topDoctor} 为主，共出现 ${analytics.topDoctorCount} 次，适合优先复盘该来源的筛查质量与转化效率。\n\n2. 依据\n- 项目主目标以受试者持续入组和随机分配执行为核心，因此“待处理预约”和“失败样本”会直接影响推进节奏。\n- 如果你的规则关注年龄、屈光度或医生来源，当前页面数据已经可以支持做首轮验证和异常筛查。\n\n3. 建议动作\n- 先明确规则：例如“筛查 7-10 岁且屈光度低于 -1.50D 的高潜人群”或“统计某医生来源的失败率”。\n- 再指定输出格式：建议用“结论 / 证据 / 下一步动作”，便于直接给研究负责人或 CRC 使用。\n- 如需更精确，可在模板中补充时间范围、异常阈值、目标人群，我会按该规则继续生成分析结果。`;
    }

    if (/进度|入组|招募|推进/.test(normalizedPrompt)) {
      return `当前项目更适合按“总体进度 + 待处理队列 + 下一步动作”来看：\n\n- 总体进度：已累计入组 ${project.currentCount}/${project.totalCount}，约完成 ${analytics.progress}%。\n- 页面示例数据：已入组 ${analytics.enrolled} 例，待处理 ${analytics.pending} 例，失败 ${analytics.failed} 例。\n- 建议优先级：先消化待处理预约，再复盘失败样本的共性原因，避免影响后续入组转化。\n- 管理建议：下周可以围绕高产出来源 ${analytics.topDoctor} 做一次定向筛查策略复盘。`;
    }

    if (/风险|预警|异常|问题/.test(normalizedPrompt)) {
      return `当前建议重点关注以下风险：\n\n- 执行风险：页面示例数据中仍存在 ${analytics.pending} 条待处理记录，若处理滞后，可能影响筛查到入组的转化速度。\n- 数据风险：失败/未入组样本 ${analytics.failed} 条，建议核对是否集中在某类纳排条件或推荐来源。\n- 运营风险：来源分布目前对 ${analytics.topDoctor} 依赖较高，后续可适当平衡来源结构，降低单一渠道波动对项目推进的影响。\n\n建议动作：先建立一份“待处理 + 失败原因”周报，再把 AI 助手输出作为项目例会的辅助材料。`;
    }

    return `这个项目可以从三个层面快速理解：\n\n- 项目定位：${project.title}，当前状态为“${status}”，核心关注点是项目执行与受试者管理并行推进。\n- 当前进展：累计入组 ${project.currentCount}/${project.totalCount}，整体进度约 ${analytics.progress}%。\n- 页面数据观察：示例数据中已入组 ${analytics.enrolled} 例，推荐来源以 ${analytics.topDoctor} 为主，高频标签为 ${topTagSummary}。\n\n如果你愿意，我下一步可以继续从“项目摘要”“风险提示”或“数据分析”任一方向展开。`;
  };

  const submitAiPrompt = (customPrompt?: string, tag?: string, forcedMode?: AiMode) => {
    const prompt = (customPrompt ?? aiInput).trim();
    if (!prompt) return;

    const nextMode = forcedMode ?? aiMode;
    const reply = buildAiReply(prompt, nextMode);

    setAiMessages((prev) => [
      ...prev,
      createAiMessage('user', prompt, tag),
      createAiMessage('assistant', reply, nextMode === 'analysis' ? '分析结果' : 'AI 回答')
    ]);
    setAiInput('');
    setAiMode('default');
  };

  const handleQuickAction = (action: AiQuickAction) => {
    setAiPanelOpen(true);
    if (action.prefillOnly) {
      setAiMode(action.mode || 'default');
      setAiInput(action.prompt);
      setAiMessages((prev) => [
        ...prev,
        createAiMessage(
          'assistant',
          '已为你填入通用数据分析模板。你只需要补充分析规则、时间范围或异常阈值，就可以直接发送。',
          '模板已载入'
        )
      ]);
      return;
    }

    submitAiPrompt(action.prompt, action.title, action.mode);
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
    <div className={`space-y-6 p-6 ${aiPanelOpen ? 'xl:pr-[560px]' : ''}`}>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <button
          onClick={() => navigate('/index/projects')}
          className="flex items-center text-sm text-slate-500 hover:text-brand-600 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> 返回项目列表
        </button>
        <section className="flex flex-wrap gap-2 xl:justify-end">
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
          {/* <button
            type="button"
            onClick={() => setAiPanelOpen((value) => !value)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs justify-center font-bold rounded-lg shadow-lg border transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
              aiPanelOpen
                ? 'border-violet-200 bg-violet-50 text-violet-700 shadow-violet-200/60'
                : 'border-brand-200 bg-brand-600 text-white shadow-brand-500/30 hover:bg-brand-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {aiPanelOpen ? '收起 AI 助手' : '项目 AI 助手'}
          </button> */}
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

      <div className="space-y-6">
        <div className="space-y-6 min-w-0">
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
                      <Hospital className="w-4 h-4 mr-1.5" />
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

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-slate-900">受试者列表</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full md:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="搜索受试者姓名..."
                className="w-full h-10 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
            <div className="relative w-full sm:w-44">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <Filter className="w-4 h-4 text-slate-400" />
              </div>
              <Select
                value={filter}
                onChange={(v) => setFilter(v as TableFilter)}
                options={[
                  { value: 'all', label: '全部' },
                  { value: 'participated', label: '已入组' },
                  { value: 'not_participated', label: '未入组' },
                  { value: 'match_failed', label: '匹配失败' },
                  { value: 'pending', label: '待处理' }
                ]}
                className="w-full"
                triggerClassName="h-10 pl-9 pr-10 bg-slate-50 hover:bg-slate-50 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto" id="data-table-wrapper">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
              <tr>
                {!blindMode && <th className="px-6 py-4 whitespace-nowrap text-center">筛选号</th>}
                <th className="px-6 py-4 whitespace-nowrap text-center">受试者编号</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">姓名</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">年龄</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">屈光度</th>
                {!blindMode && <th className="px-6 py-4 whitespace-nowrap text-center">分组</th>}
                {!blindMode && <th className="px-6 py-4 whitespace-nowrap text-center">维度标签</th>}
                <th className="px-6 py-4 whitespace-nowrap text-center">推荐医生</th>
                {project.isFission && !blindMode && <th className="px-6 py-4 whitespace-nowrap text-center">裂变状态</th>}
                <th className="px-6 py-4 whitespace-nowrap text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rows.map((r, idx) => (
                <tr key={`${r.id}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                  {!blindMode && <td className="px-6 py-4 font-mono font-medium text-slate-600 text-center">{r.screenId}</td>}
                  <td className="px-6 py-4 font-mono font-medium text-slate-600 text-center">{r.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800 text-center">{r.name}</td>
                  <td className="px-6 py-4 text-slate-600 text-center">{r.age}</td>
                  <td className="px-6 py-4 text-slate-600 text-center font-mono">{r.indicator}</td>
                  {!blindMode && (
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">{renderGroup(r)}</div>
                    </td>
                  )}
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
        </div>

        {aiPanelOpen && (
          <aside className="mt-6 xl:!mt-0 xl:fixed xl:top-20 xl:right-3 xl:w-[520px] xl:h-[calc(100vh-5rem)] xl:bg-white xl:border-l xl:border-slate-200">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.10)] xl:rounded-none xl:border-0 xl:shadow-none">
              <div className="border-b border-slate-100 bg-white px-5 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-700">
                      <Sparkles className="h-3.5 w-3.5" />
                      基于 WEyeAI 大模型
                    </div>
                    <h3 className="mt-3 text-2xl font-black text-slate-900">欢迎使用 WEyeAI 科研助手</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      支持项目问答、执行建议和数据分析，当前为高保真原型 Demo。
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiPanelOpen(false)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

 
              </div>

              <div className="border-b border-slate-100 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900">快捷问答</div>
                    {!aiQuickActionsCollapsed && (
                      <div className="mt-1 text-xs text-slate-500">优先覆盖项目问答、执行建议与数据分析</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!aiQuickActionsCollapsed && (
                      <div className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">4 个模板</div>
                    )}
                    <button
                      type="button"
                      onClick={() => setAiQuickActionsCollapsed((v) => !v)}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      <span>{aiQuickActionsCollapsed ? '展开' : '收起'}</span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${aiQuickActionsCollapsed ? '' : 'rotate-180'}`} />
                    </button>
                  </div>
                </div>
                {!aiQuickActionsCollapsed && (
                  <div className="mt-3 grid gap-3">
                    {quickActions.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => handleQuickAction(action)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/50"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-bold text-slate-900">{action.title}</div>
                          <span className="text-xs font-bold text-violet-600">{action.prefillOnly ? '填充模板' : '立即提问'}</span>
                        </div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">{action.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 no-scrollbar">
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-3 text-xs leading-5 text-slate-500">
                  你可以直接提问“这个项目下周应该优先做什么”，或者点击“数据分析”后补充规则再发送。
                </div>
                {aiMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[92%] rounded-3xl px-4 py-3 shadow-sm ${
                        message.role === 'user'
                          ? 'bg-brand-600 text-white rounded-br-md'
                          : 'border border-slate-200 bg-white text-slate-700 rounded-bl-md'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                        <span>{message.role === 'user' ? '你' : 'AI 助手'}</span>
                        {message.tag && (
                          <span
                            className={`rounded-full px-2 py-0.5 ${
                              message.role === 'user' ? 'bg-white/15 text-white/90' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {message.tag}
                          </span>
                        )}
                        <span className={message.role === 'user' ? 'text-white/70' : 'text-slate-400'}>{message.time}</span>
                      </div>
                      <div className={`mt-2 whitespace-pre-wrap text-sm leading-6 ${message.role === 'user' ? 'text-white' : 'text-slate-700'}`}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 bg-white px-5 py-4">
                {aiMode === 'analysis' && (
                  <div className="mb-3 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-xs leading-5 text-violet-700">
                    已载入通用数据分析模板。建议只补充“分析规则、时间范围、异常阈值”三项后直接发送。
                  </div>
                )}
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-3">
                  <textarea
                    value={aiInput}
                    onChange={(event) => setAiInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        submitAiPrompt();
                      }
                    }}
                    rows={aiMode === 'analysis' ? 7 : 4}
                    placeholder={
                      aiMode === 'analysis'
                        ? '补充你的分析规则，例如：筛查 7-10 岁、屈光度低于 -1.50D 的受试者，并输出异常名单和建议动作'
                        : '请输入项目问题，例如：请总结当前项目进度并给出下周行动建议'
                    }
                    className="w-full resize-none bg-transparent px-1 py-1 text-sm leading-6 text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  />
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div ref={aiEngineMenuRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setAiEngineMenuOpen((v) => !v)}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                        >
                          {aiEngine === 'WEyeAI' ? (
                            <Sparkles className="h-4 w-4 text-violet-600" />
                          ) : aiEngine === 'DeepSeek' ? (
                            <Cpu className="h-4 w-4 text-slate-600" />
                          ) : (
                            <Layers className="h-4 w-4 text-slate-600" />
                          )}
                          <span>{aiEngine === 'WEyeAI' ? 'WEyeAI' : aiEngine === 'DeepSeek' ? 'DeepSeek' : '千问'}</span>
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </button>
                        {aiEngineMenuOpen && (
                          <div className="absolute bottom-full mb-2 left-0 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
                            <button
                              type="button"
                              onClick={() => {
                                setAiEngine('WEyeAI');
                                setAiEngineMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Sparkles className="h-4 w-4 text-violet-600" />
                              <span className="font-bold">WEyeAI</span>
                              <span className="text-xs text-slate-400 ml-auto">默认</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAiEngine('DeepSeek');
                                setAiEngineMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Cpu className="h-4 w-4 text-slate-600" />
                              <span className="font-bold">DeepSeek</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAiEngine('Qwen');
                                setAiEngineMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Layers className="h-4 w-4 text-slate-600" />
                              <span className="font-bold">千问</span>
                            </button>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setAiHistoryOpen(true)}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        <History className="h-4 w-4 text-slate-500" />
                        <span>历史记录</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => submitAiPrompt()}
                      className="inline-flex items-center rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-brand-500/30 transition-colors hover:bg-brand-700"
                    >
                      发送
                    </button>
                  </div>
                  <div className="mt-2 text-[11px] leading-5 text-slate-400">
                    Demo 返回内容基于当前项目资料与示例数据自动生成
                  </div>
                </div>
              </div>
              {aiHistoryOpen && (
                <div className="absolute inset-0 z-50 flex flex-col bg-white">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                    <div className="text-lg font-black text-slate-900">聊天历史记录</div>
                    <button
                      type="button"
                      onClick={() => setAiHistoryOpen(false)}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="px-5 pt-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAiHistoryTab('all')}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          aiHistoryTab === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        所有聊天
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiHistoryTab('engine')}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          aiHistoryTab === 'engine' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        WEyeAI 聊天
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiHistoryTab('star')}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          aiHistoryTab === 'star' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        收藏
                      </button>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input
                          value={aiHistoryQuery}
                          onChange={(e) => setAiHistoryQuery(e.target.value)}
                          placeholder="搜索"
                          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto px-5 py-4">
                    <div className="space-y-3">
                      {[
                        { title: '受试者入组进度分析', desc: '请总结当前入组节奏，并给出下周行动建议', time: '3 小时前' },
                        { title: '筛查失败原因归因', desc: '统计未入组样本的主要原因与建议动作', time: '3 天前' },
                        { title: '数据分析模板', desc: '按规则筛查高风险受试者并输出异常名单', time: '2026/06/07' }
                      ]
                        .filter((x) => {
                          const q = aiHistoryQuery.trim();
                          if (!q) return true;
                          return x.title.includes(q) || x.desc.includes(q);
                        })
                        .map((item) => (
                          <button
                            key={item.title}
                            type="button"
                            onClick={() => {
                              setAiHistoryOpen(false);
                              submitAiPrompt(item.desc, '历史记录', aiMode);
                            }}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left hover:bg-slate-50"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-sm font-black text-slate-900 truncate">{item.title}</div>
                              <div className="text-xs text-slate-400">{item.time}</div>
                            </div>
                            <div className="mt-1 text-xs leading-5 text-slate-500">{item.desc}</div>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      <Drawer
        open={subjectDrawerOpen}
        title="受试者详情"
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
