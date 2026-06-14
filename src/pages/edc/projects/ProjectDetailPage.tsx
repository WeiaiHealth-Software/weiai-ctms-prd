import { ArrowLeft, Download, MoreHorizontal, RotateCcw, Search, UserPlus } from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
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

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const setTitle = useHeaderStore(state => state.setTitle)
  const projects = useEdcProjectStore(state => state.projects)
  const [showSubjectDrawer, setShowSubjectDrawer] = useState(false)
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
  const visitOptions = ['全部访视', '基线', '3M', '6M', '9M', '12M']
  const subjectStatusOptions = ['全部状态', '筛选中', '已入组', '随访中', '提前退出']
  const visitSelectOptions = visitOptions.map((option) => ({ value: option, label: option }))
  const subjectStatusSelectOptions = subjectStatusOptions.map((option) => ({ value: option, label: option }))

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
      <div className="space-y-6 p-6">
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

      <SubjectDrawer
        open={showSubjectDrawer}
        onClose={() => setShowSubjectDrawer(false)}
        project={project}
      />
    </>
  )
}
