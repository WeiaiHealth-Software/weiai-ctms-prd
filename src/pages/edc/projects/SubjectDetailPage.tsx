import { ArrowLeft, AlertCircle, Edit, Save } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SectionCard from '../../../components/common/SectionCard'
import { projectSubjects } from '../../../data/edc/subjects'
import { subjectVisits } from '../../../data/edc/visits'
import { defaultTemplateFields } from '../../../data/edc/mockTemplateSchema'
import VisitTimeline from '../../../modules/edc/projects/components/VisitTimelines'
import DynamicFormRenderer from '../../../modules/edc/form-engine/DynamicFormRenderer'
import { buildInitialFormData } from '../../../modules/edc/form-engine/utils/buildInitialFormData'
import { useHeaderStore } from '../../../store/useHeaderStore'

export default function SubjectDetailPage() {
  const { projectId, subjectId } = useParams()
  const setTitle = useHeaderStore(state => state.setTitle)
  const [selectedVisitId, setSelectedVisitId] = useState('v2')
  const [readOnly, setReadOnly] = useState(true)

  const subjects = projectId ? projectSubjects[projectId] || [] : []
  const subject = useMemo(() => subjects.find((s) => s.id === subjectId) || null, [subjects, subjectId])

  const [formData, setFormData] = useState(() => buildInitialFormData(defaultTemplateFields))

  const currentVisit = subjectVisits.find((item) => item.id === selectedVisitId)

  const sections = useMemo(() => {
    return defaultTemplateFields.filter(f => f.type === 'section')
  }, [])

  useEffect(() => {
    if (subject) {
      setTitle('受试者详情', `${subject.initials} · ${subject.screeningNo}`, [
        { text: '开发者账户', color: 'indigo' },
        { text: '超级管理员', color: 'purple' }
      ])
    }
  }, [setTitle, subject])

  if (!subject) {
    return <div className="p-6 text-sm text-slate-500">未找到受试者，请检查路由参数或受试者数据是否存在</div>
  }

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(`field-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="space-y-4 px-5 pb-8 pt-2">
      <Link
        to={`/index/edc/projects/${projectId}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700"
      >
        <ArrowLeft className="w-4 h-4" />
        返回受试者列表
      </Link>

      <div className="flex items-start gap-5">
        <div className="w-[292px] shrink-0 self-stretch space-y-3">
          <div className="rounded-2xl bg-blue-600 p-4 text-white shadow-sm">
            <div className="text-xs text-blue-100">当前受试者</div>
            <div className="mt-1.5 text-[2rem] font-bold leading-none">{subject.initials}</div>
            <div className="mt-2 text-sm text-blue-100">{subject.screeningNo}</div>
            
            <div className="mt-4 space-y-3 border-t border-blue-500/50 pt-4 text-sm">
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

          <div className="sticky top-4">
            <SectionCard title="访视阶段" contentClassName="px-4 py-3">
              <VisitTimeline
                visits={subjectVisits}
                selectedVisitId={selectedVisitId}
                onSelect={setSelectedVisitId}
              />
            </SectionCard>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-4 pb-12">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {currentVisit?.name || '访视'} 数据采集表
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {readOnly ? (
                <>
                  <div className="mr-2 inline-flex h-10 items-center rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-600">
                    只读模式
                  </div>
                  <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    提出质疑
                  </button>
                  <button
                    onClick={() => setReadOnly(false)}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    编辑表单
                  </button>
                </>
              ) : (
                <>
                  <div className="mr-2 inline-flex h-10 items-center rounded-xl bg-blue-50 px-4 text-sm font-medium text-blue-600">
                    编辑模式
                  </div>
                  <button
                    onClick={() => setReadOnly(true)}
                    className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    取消编辑
                  </button>
                  <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <Save className="w-4 h-4" />
                    暂存
                  </button>
                  <button
                    onClick={() => setReadOnly(true)}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    保存表单
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <DynamicFormRenderer
              fields={defaultTemplateFields}
              formData={formData}
              readOnly={readOnly}
              onChange={(key: any, value: any) => setFormData((prev) => ({ ...prev, [key]: value }))}
            />
          </div>
        </div>

        <div className="sticky top-4 w-[224px] shrink-0 self-start">
          <SectionCard title="目录" contentClassName="px-4 py-4">
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
