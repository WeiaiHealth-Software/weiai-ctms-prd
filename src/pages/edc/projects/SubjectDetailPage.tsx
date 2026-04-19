import { ArrowLeft, Edit, Save, AlertCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import SectionCard from '../../components/common/SectionCard'
import { projectSubjects } from '../../data/subjects'
import { subjectVisits } from '../../data/visits'
import { defaultTemplateFields } from '../../data/mockTemplateSchema'
import VisitTimeline from '../../modules/projects/components/VisitTimelines'
import DynamicFormRenderer from '../../modules/form-engine/DynamicFormRenderer'
import { buildInitialFormData } from '../../modules/form-engine/utils/buildInitialFormData'
import EmptyState from '../../components/common/EmptyState'

export default function SubjectDetailPage() {
  const { projectId, subjectId } = useParams()
  const [selectedVisitId, setSelectedVisitId] = useState('v2')
  const [readOnly, setReadOnly] = useState(true)

  const subjects = projectId ? projectSubjects[projectId] || [] : []
  const subject = useMemo(() => subjects.find((s) => s.id === subjectId) || null, [subjects, subjectId])

  const [formData, setFormData] = useState(() => buildInitialFormData(defaultTemplateFields))

  const currentVisit = subjectVisits.find((item) => item.id === selectedVisitId)

  const sections = useMemo(() => {
    return defaultTemplateFields.filter(f => f.type === 'section')
  }, [])

  if (!subject) {
    return <EmptyState title="未找到受试者" description="请检查路由参数或受试者数据是否存在" />
  }

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(`field-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="space-y-4">
      <Link
        to={`/projects/${projectId}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700"
      >
        <ArrowLeft className="w-4 h-4" />
        返回受试者列表
      </Link>

      <div className="flex items-start gap-6 relative">
        {/* 左侧：固定 320px */}
        <div className="w-[320px] shrink-0 sticky top-0 h-[calc(100vh-8rem)] overflow-y-auto space-y-4 pr-1 pb-4">
          <div className="bg-blue-600 text-white rounded-2xl p-5 shadow-sm">
            <div className="text-xs text-blue-100">当前受试者</div>
            <div className="mt-2 text-2xl font-bold">{subject.initials}</div>
            <div className="mt-1 text-sm text-blue-100">{subject.screeningNo}</div>
            
            <div className="mt-5 pt-5 border-t border-blue-500/50 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-blue-200">随机号</span>
                <span className="font-medium">{subject.randomNo}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-blue-200">来源</span>
                <span className="font-medium">{subject.source}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-blue-200">中心</span>
                <span className="font-medium">{subject.center}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-blue-200">入组日期</span>
                <span className="font-medium">{subject.enrollDate}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-blue-200">下次访视</span>
                <span className="font-medium">{subject.nextVisitDate}</span>
              </div>
            </div>
          </div>

          <SectionCard title="访视阶段">
            <VisitTimeline
              visits={subjectVisits}
              selectedVisitId={selectedVisitId}
              onSelect={setSelectedVisitId}
            />
          </SectionCard>
        </div>

        {/* 中间：自适应剩余空间 */}
        <div className="flex-1 min-w-0 space-y-6 pb-12">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between sticky top-0 z-20">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {currentVisit?.name || '访视'} 数据采集表
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {readOnly ? (
                <>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium mr-2">
                    只读模式
                  </div>
                  <button className="h-9 px-4 rounded-xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    提出质疑
                  </button>
                  <button
                    onClick={() => setReadOnly(false)}
                    className="h-9 px-4 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    编辑表单
                  </button>
                </>
              ) : (
                <>
                  <div className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium mr-2">
                    编辑模式
                  </div>
                  <button
                    onClick={() => setReadOnly(true)}
                    className="h-9 px-4 rounded-xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    取消编辑
                  </button>
                  <button className="h-9 px-4 rounded-xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    暂存
                  </button>
                  <button
                    onClick={() => setReadOnly(true)}
                    className="h-9 px-4 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    保存表单
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <DynamicFormRenderer
              fields={defaultTemplateFields}
              formData={formData}
              readOnly={readOnly}
              onChange={(key: any, value: any) => setFormData((prev) => ({ ...prev, [key]: value }))}
            />
          </div>
        </div>

        {/* 右侧：固定 320px，目录 */}
        <div className="w-[320px] shrink-0 sticky top-0 h-[calc(100vh-8rem)] overflow-y-auto pb-4">
          <SectionCard title="目录">
            <div className="space-y-1 mt-2">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleScrollTo(sec.id)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  {sec.label || sec.sectionTitle}
                </button>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
