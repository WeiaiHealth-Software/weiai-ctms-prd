import { ArrowLeft, BarChart3, ChevronDown, Cpu, Download, History, Layers, MoreHorizontal, RotateCcw, Search, Sparkles, UserPlus, X, type LucideIcon } from 'lucide-react'
import { useMemo, useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useEdcProjectStore } from '../../../store/useEdcProjectStore'
import { useHeaderStore } from '../../../store/useHeaderStore'
import SectionCard from '../../../components/common/SectionCard'
import Select from '../../../components/form/Select'
import StatCard from '../../../modules/edc/dashboard/StatCard'
import SubjectTable from '../../../modules/edc/projects/components/SubjectTable'
import SubjectDrawer from '../../../modules/edc/projects/drawers/SubjectDrawer'
import { projectSubjects } from '../../../data/edc/subjects'
import { classNames } from '../../../lib/classNames'
import { statusClassMap } from '../../../lib/statusMap'

type AiMessageRole = 'assistant' | 'user'

type AiMessage = {
  id: string
  role: AiMessageRole
  content: string
  tag?: string
  time: string
}

type AiMode = 'default' | 'analysis'

type AiEngine = 'WEyeAI' | 'DeepSeek' | 'Qwen'

type AiQuickAction = {
  id: string
  title: string
  description: string
  prompt: string
  icon: LucideIcon
  iconClassName: string
  mode?: AiMode
  prefillOnly?: boolean
}

const ANALYSIS_PROMPT_TEMPLATE = `请基于当前项目数据做一次分析，并按“结论 / 依据 / 建议动作”输出：
1. 分析目标：
2. 重点规则或筛选条件：
3. 关注时间范围：
4. 异常阈值：
5. 希望重点关注的指标：`

const createAiMessage = (role: AiMessageRole, content: string, tag?: string): AiMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
  tag,
  time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
})

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const setTitle = useHeaderStore(state => state.setTitle)
  const projects = useEdcProjectStore(state => state.projects)
  const [showSubjectDrawer, setShowSubjectDrawer] = useState(false)
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [aiMode, setAiMode] = useState<AiMode>('default')
  const [aiInput, setAiInput] = useState('')
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([])
  const [aiEngine, setAiEngine] = useState<AiEngine>('WEyeAI')
  const [aiEngineMenuOpen, setAiEngineMenuOpen] = useState(false)
  const [aiHistoryOpen, setAiHistoryOpen] = useState(false)
  const [aiHistoryTab, setAiHistoryTab] = useState<'all' | 'engine' | 'star'>('all')
  const [aiHistoryQuery, setAiHistoryQuery] = useState('')
  const [aiQuickActionsCollapsed, setAiQuickActionsCollapsed] = useState(false)
  const aiEngineMenuRef = useRef<HTMLDivElement | null>(null)
  const [subjectFilters, setSubjectFilters] = useState({
    keyword: '',
    visit: '全部访视',
    status: '全部状态',
  })
  const [appliedSubjectFilters, setAppliedSubjectFilters] = useState({
    keyword: '',
    visit: '全部访视',
    status: '全部状态',
  })

  const project = useMemo(() => projects.find((p) => p.id === projectId) || null, [projects, projectId])
  const subjects = projectId ? projectSubjects[projectId] || [] : []
  const filteredSubjects = useMemo(() => {
    const keyword = appliedSubjectFilters.keyword.trim().toLowerCase()

    return subjects.filter((subject) => {
      const matchKeyword =
        !keyword ||
        subject.screeningNo.toLowerCase().includes(keyword) ||
        subject.initials.toLowerCase().includes(keyword)
      const matchVisit =
        appliedSubjectFilters.visit === '全部访视' ||
        subject.currentVisit === appliedSubjectFilters.visit
      const matchStatus =
        appliedSubjectFilters.status === '全部状态' ||
        subject.status === appliedSubjectFilters.status

      return matchKeyword && matchVisit && matchStatus
    })
  }, [subjects, appliedSubjectFilters])
  const subjectStats = useMemo(() => ({
    screening: subjects.filter(subject => subject.status === '筛选中').length,
    enrolled: subjects.filter(subject => subject.status === '已入组').length,
    inFollowUp: subjects.filter(subject => subject.status === '随访中').length,
    exited: subjects.filter(subject => subject.status === '提前退出').length,
  }), [subjects])
  const aiInsights = useMemo(() => {
    const topSource = Object.entries(
      subjects.reduce<Record<string, number>>((acc, subject) => {
        const key = subject.source || '未标注'
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})
    ).sort((a, b) => b[1] - a[1])[0]

    const topCenter = Object.entries(
      subjects.reduce<Record<string, number>>((acc, subject) => {
        const key = subject.center || '未标注'
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})
    ).sort((a, b) => b[1] - a[1])[0]

    return {
      sampleSize: subjects.length,
      topSource: topSource?.[0] || '暂无',
      topSourceCount: topSource?.[1] || 0,
      topCenter: topCenter?.[0] || '暂无',
      topCenterCount: topCenter?.[1] || 0,
    }
  }, [subjects])

  const quickActions = useMemo<AiQuickAction[]>(() => ([
    {
      id: 'summary',
      title: '项目速览',
      description: '快速总结项目定位、进度与当前重点',
      prompt: `请用简洁方式总结一下项目“${project?.name ?? '当前项目'}”的核心信息，并给我三个当前最值得关注的点。`,
      icon: Layers,
      iconClassName: 'bg-violet-50 text-violet-600'
    },
    {
      id: 'quality',
      title: '数据质量',
      description: '关注筛选、随访与提前退出风险点',
      prompt: '请基于当前受试者状态分布，给出数据质量/执行风险提示，并提供建议动作。',
      icon: Search,
      iconClassName: 'bg-amber-50 text-amber-600'
    },
    {
      id: 'followup',
      title: '随访提醒',
      description: '聚焦即将到期与需要跟进的访视',
      prompt: '请给出本项目随访管理建议：优先要跟进哪些人群，如何组织 CRC 的执行清单。',
      icon: History,
      iconClassName: 'bg-sky-50 text-sky-600'
    },
    {
      id: 'analysis',
      title: '数据分析',
      description: '自动填入通用分析提示词模板',
      prompt: ANALYSIS_PROMPT_TEMPLATE,
      icon: BarChart3,
      iconClassName: 'bg-emerald-50 text-emerald-600',
      mode: 'analysis',
      prefillOnly: true
    }
  ]), [project?.name])

  useEffect(() => {
    if (!project) return
    setAiMessages([
      createAiMessage(
        'assistant',
        `我是 WEyeAI 科研助手，可以回答项目执行问题，也可以基于受试者数据做分析。\n当前页面示例数据：筛选中 ${subjectStats.screening}，已入组 ${subjectStats.enrolled}，随访中 ${subjectStats.inFollowUp}，提前退出 ${subjectStats.exited}。\n如果你要做结构化分析，点击“数据分析”会自动载入模板。`,
        '欢迎'
      )
    ])
    setAiInput('')
    setAiMode('default')
  }, [project, subjectStats.screening, subjectStats.enrolled, subjectStats.inFollowUp, subjectStats.exited])

  const buildAiReply = (prompt: string, mode: AiMode) => {
    const normalizedPrompt = prompt.toLowerCase()

    if (mode === 'analysis' || /分析|规则|阈值|数据/.test(normalizedPrompt)) {
      return `以下为基于当前页面受试者数据生成的分析 Demo：\n\n1. 结论\n- 当前受试者状态分布：筛选中 ${subjectStats.screening}，已入组 ${subjectStats.enrolled}，随访中 ${subjectStats.inFollowUp}，提前退出 ${subjectStats.exited}。\n- 来源以 ${aiInsights.topSource} 为主（${aiInsights.topSourceCount} 条），中心以 ${aiInsights.topCenter} 为主（${aiInsights.topCenterCount} 条）。\n\n2. 依据\n- 筛选中队列决定短期入组效率；提前退出会带来样本量风险与数据缺口。\n- 来源/中心集中度可用于评估运营依赖与资源倾斜。\n\n3. 建议动作\n- 先补充规则（时间范围/中心/来源/访视节点），再指定输出（异常名单/原因/动作）。\n- 建议把“筛选中 + 近期随访到期”作为 CRC 每周执行清单的核心。`
    }

    if (/随访|访视|到期|提醒/.test(normalizedPrompt)) {
      return `随访管理建议 Demo：\n\n- 优先队列：随访中 ${subjectStats.inFollowUp} 例 + 下一访视日期不为 “--” 的受试者。\n- 执行方式：按中心 ${aiInsights.topCenter} 先做集中跟进，再扩展到其他中心。\n- 输出建议：生成“本周到期访视清单 + 异常原因 + 责任人”三段式表格，方便例会推进。`
    }

    if (/质量|风险|退出|异常/.test(normalizedPrompt)) {
      return `数据质量/执行风险提示 Demo：\n\n- 风险 1：筛选中 ${subjectStats.screening} 例，若长期不转化可能拖慢入组节奏。\n- 风险 2：提前退出 ${subjectStats.exited} 例，建议复盘退出原因并建立预警。\n- 风险 3：来源/中心集中在 ${aiInsights.topSource} / ${aiInsights.topCenter}，需关注单点波动。\n\n建议动作：建立每周“筛选转化率 + 退出原因 + 随访到期率”三指标周报，并用 AI 助手生成会议纪要。`
    }

    return `项目速览 Demo：\n\n- 项目：${project?.name ?? '--'}（${project?.code ?? '--'}），状态：${project?.status ?? '--'}。\n- 受试者概览：筛选中 ${subjectStats.screening}，已入组 ${subjectStats.enrolled}，随访中 ${subjectStats.inFollowUp}，提前退出 ${subjectStats.exited}。\n- 数据来源：${aiInsights.topSource} 为主（${aiInsights.topSourceCount} 条），中心：${aiInsights.topCenter} 为主（${aiInsights.topCenterCount} 条）。\n\n你可以继续问：入组策略、随访执行清单、退出原因分析等。`
  }

  const submitAiPrompt = (customPrompt?: string, tag?: string, forcedMode?: AiMode) => {
    const prompt = (customPrompt ?? aiInput).trim()
    if (!prompt) return

    const nextMode = forcedMode ?? aiMode
    const reply = buildAiReply(prompt, nextMode)

    setAiMessages((prev) => ([
      ...prev,
      createAiMessage('user', prompt, tag),
      createAiMessage('assistant', reply, nextMode === 'analysis' ? '分析结果' : 'AI 回答')
    ]))
    setAiInput('')
    setAiMode('default')
  }

  const handleQuickAction = (action: AiQuickAction) => {
    setAiPanelOpen(true)
    if (action.prefillOnly) {
      setAiMode(action.mode || 'default')
      setAiInput(action.prompt)
      setAiMessages((prev) => ([
        ...prev,
        createAiMessage('assistant', '已为你填入通用数据分析模板。补充规则后直接发送即可。', '模板已载入')
      ]))
      return
    }

    submitAiPrompt(action.prompt, action.title, action.mode)
  }
  const visitOptions = ['全部访视', '基线', '3M', '6M', '9M', '12M']
  const subjectStatusOptions = ['全部状态', '筛选中', '已入组', '随访中', '提前退出']
  const visitSelectOptions = visitOptions.map((option) => ({ value: option, label: option }))
  const subjectStatusSelectOptions = subjectStatusOptions.map((option) => ({ value: option, label: option }))

  useEffect(() => {
    if (!aiEngineMenuOpen) return
    const onPointerDown = (e: MouseEvent) => {
      const el = aiEngineMenuRef.current
      if (!el) return
      if (el.contains(e.target as Node)) return
      setAiEngineMenuOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAiEngineMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [aiEngineMenuOpen])

  useEffect(() => {
    if (project) {
      setTitle('项目详情', `项目代码：${project.code}`, [
        { text: '开发者账户', color: 'indigo' },
        { text: '超级管理员', color: 'purple' }
      ])
    }
  }, [project, setTitle])

  if (!project) {
    return <div className="text-sm text-slate-500">未找到项目</div>
  }

  return (
    <>
      <div className={`space-y-6 p-6 ${aiPanelOpen ? 'xl:pr-[560px]' : ''}`}>
        <div className="space-y-6 min-w-0">
          <Link to="/index/edc/projects" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            返回项目列表
          </Link>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className={classNames('inline-flex px-2.5 py-1 rounded-full text-xs font-medium', statusClassMap[project.status])}>
                  {project.status}
                </div>
                <h2 className="mt-3 text-2xl font-bold text-slate-900">{project.name}</h2>
                <p className="mt-2 text-sm text-slate-500 max-w-4xl leading-6">{project.desc}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setAiPanelOpen((value) => !value)}
                  className={`h-10 px-4 rounded-xl text-sm font-medium flex items-center gap-2 border transition-colors ${
                    aiPanelOpen
                      ? 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'
                      : 'bg-violet-600 text-white border-violet-600 hover:bg-violet-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {aiPanelOpen ? '收起 AI 助手' : 'AI 助手'}
                </button>
                <button
                  onClick={() => setShowSubjectDrawer(true)}
                  className="h-10 px-4 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  新增受试者
                </button>
                <button className="h-10 px-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div>
                <div className="text-xs text-slate-400">项目编号</div>
                <div className="mt-1 text-sm font-semibold text-blue-700">{project.code}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">主要研究者</div>
                <div className="mt-1 text-sm font-semibold text-slate-800">{project.pi}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">参与中心</div>
                <div className="mt-1 text-sm font-semibold text-slate-800">{project.centers.length} 个</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">申办方</div>
                <div className="mt-1 text-sm font-semibold text-slate-800">{project.sponsor}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">当前入组人数</div>
                <div className="mt-1 text-2xl font-bold text-blue-700">{project.enrolled}</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <StatCard title="筛选中" value={String(subjectStats.screening)} hint="待确认是否入组" />
              <StatCard title="已入组" value={String(subjectStats.enrolled)} hint="基线完成，进入研究" />
              <StatCard title="随访中" value={String(subjectStats.inFollowUp)} hint="已有后续访视安排" />
              <StatCard title="提前退出" value={String(subjectStats.exited)} hint="已终止后续流程" />
            </div>

            <SectionCard
              title="受试者管理"
              contentClassName="p-0"
              extra={
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        value={subjectFilters.keyword}
                        onChange={(event) => setSubjectFilters((prev) => ({ ...prev, keyword: event.target.value }))}
                        placeholder="请输入筛选号或姓名"
                        className="h-9 w-56 rounded-xl border border-slate-200 bg-white pl-3 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                      />
                    </div>
                    <Select
                      value={subjectFilters.visit}
                      onChange={(value) => setSubjectFilters((prev) => ({ ...prev, visit: value }))}
                      options={visitSelectOptions}
                      className="min-w-32"
                      triggerClassName="h-9"
                    />
                    <Select
                      value={subjectFilters.status}
                      onChange={(value) => setSubjectFilters((prev) => ({ ...prev, status: value }))}
                      options={subjectStatusSelectOptions}
                      className="min-w-32"
                      triggerClassName="h-9"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const resetFilters = {
                          keyword: '',
                          visit: '全部访视',
                          status: '全部状态',
                        }
                        setSubjectFilters(resetFilters)
                        setAppliedSubjectFilters(resetFilters)
                      }}
                      className="h-9 px-3 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      重置
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppliedSubjectFilters(subjectFilters)}
                      className="h-9 px-3 rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      搜索
                    </button>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <button className="h-9 px-3 rounded-xl border border-blue-600 bg-white text-sm font-medium text-blue-600 hover:bg-blue-50 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    导出数据
                  </button>
                </div>
              }
            >
              <SubjectTable subjects={filteredSubjects} />
            </SectionCard>
          </div>
        </div>

        {aiPanelOpen && (
          <aside className="mt-6 xl:!mt-0 xl:fixed xl:top-20 xl:right-3 xl:w-[520px] xl:h-[calc(100vh-5rem)] xl:bg-white xl:border-l xl:border-slate-200">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.10)] xl:rounded-none xl:border-0 xl:shadow-none">
              <div className="border-b border-slate-100 bg-white px-5 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="mb-2 text-2xl font-bold text-slate-900">欢迎使用 WEyeAI 科研助手</h3>
                    <div className='flex items-center gap-2'>
                      <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-700">
                        <Sparkles className="h-3.5 w-3.5" />
                        基于 WEyeAI 大模型
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-500">支持项目问答与数据分析</p>
                    </div>
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
                      <div className="mt-1 text-xs text-slate-500">项目问答 / 数据质量 / 随访 / 分析</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!aiQuickActionsCollapsed && (
                      <div className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">{quickActions.length} 个模板</div>
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
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => handleQuickAction(action)}
                        className="h-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/50"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className={classNames('flex h-7 w-7 shrink-0 items-center justify-center rounded-xl', action.iconClassName)}>
                              <action.icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 text-sm font-bold text-slate-900">{action.title}</div>
                          </div>
                          <span className="shrink-0 text-xs font-bold text-brand-600">{action.prefillOnly ? '填充模板' : '立即提问'}</span>
                        </div>
                        <div className="mt-2 text-xs leading-5 text-slate-500">{action.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 no-scrollbar">
                {aiMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[92%] rounded-3xl px-4 py-3 shadow-sm ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'border border-slate-200 bg-white text-slate-700 rounded-bl-md'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                        <span>{message.role === 'user' ? '你' : 'AI 助手'}</span>
                        {message.tag && (
                          <span className={`rounded-full px-2 py-0.5 ${message.role === 'user' ? 'bg-white/15 text-white/90' : 'bg-slate-100 text-slate-500'}`}>
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
                        event.preventDefault()
                        submitAiPrompt()
                      }
                    }}
                    rows={aiMode === 'analysis' ? 4 : 3}
                    placeholder={aiMode === 'analysis' ? '补充你的分析规则后直接发送' : '请输入项目问题…'}
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
                                setAiEngine('WEyeAI')
                                setAiEngineMenuOpen(false)
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
                                setAiEngine('DeepSeek')
                                setAiEngineMenuOpen(false)
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Cpu className="h-4 w-4 text-slate-600" />
                              <span className="font-bold">DeepSeek</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAiEngine('Qwen')
                                setAiEngineMenuOpen(false)
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
                      className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition-colors hover:bg-blue-700"
                    >
                      发送
                    </button>
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
                        { title: '随访执行清单', desc: '给出随访管理建议：优先要跟进哪些人群', time: '3 小时前' },
                        { title: '数据质量风险提示', desc: '基于状态分布输出风险点与建议动作', time: '3 天前' },
                        { title: '数据分析模板', desc: '按规则筛查异常受试者并生成分析结果', time: '2026/06/07' }
                      ]
                        .filter((x) => {
                          const q = aiHistoryQuery.trim()
                          if (!q) return true
                          return x.title.includes(q) || x.desc.includes(q)
                        })
                        .map((item) => (
                          <button
                            key={item.title}
                            type="button"
                            onClick={() => {
                              setAiHistoryOpen(false)
                              submitAiPrompt(item.desc, '历史记录', aiMode)
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

      <SubjectDrawer
        open={showSubjectDrawer}
        onClose={() => setShowSubjectDrawer(false)}
        project={project}
      />
    </>
  )
}
