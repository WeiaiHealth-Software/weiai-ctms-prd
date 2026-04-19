import { FileText } from 'lucide-react'
import { useNavigate } from 'react-router'
import SectionCard from '../../../../components/common/SectionCard'
import type { Template } from '../../../types/template'
import DynamicFormRenderer from '../../form-engine/DynamicFormRenderer'
import { defaultTemplateFields } from '../../../data/mockTemplateSchema'
import { buildInitialFormData } from '../../form-engine/utils/buildInitialFormData'

type TemplateDetailProps = {
  template: Template | null
}

export default function TemplateDetail({ template }: TemplateDetailProps) {
  const navigate = useNavigate()

  if (!template) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-10 py-16">
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <div className="mt-5 text-base font-semibold text-slate-800">暂无选中模板</div>
          <div className="mt-2 text-sm text-slate-400">从左侧模板列表中选择一个模板，查看结构预览与基础信息。</div>
        </div>
      </div>
    )
  }

  // Generate form data for preview based on the default fields
  const formData = buildInitialFormData(defaultTemplateFields)

  return (
    <div className="flex flex-col space-y-6">
      <div className="shrink-0">
        <SectionCard
          title="模板详情"
          extra={
            <div className="flex items-center gap-2">
              <button className="h-9 px-3 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">
                复制模板
              </button>
              <button
                onClick={() => navigate('/templates/builder')}
                className="h-9 px-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
              >
                编辑模板
              </button>
            </div>
          }
        >
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs text-slate-400">模板名称</div>
              <div className="mt-2 font-semibold text-slate-900">{template.name}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs text-slate-400">模板类型</div>
              <div className="mt-2 font-semibold text-slate-900">{template.type}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs text-slate-400">版本</div>
              <div className="mt-2 font-semibold text-slate-900">{template.version}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs text-slate-400">字段数</div>
              <div className="mt-2 font-semibold text-slate-900">{template.fields}</div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="h-12 px-5 border-b border-slate-100 flex items-center shrink-0 font-semibold text-slate-800">
          结构预览
        </div>
        <div className="p-6 pointer-events-none">
          <div className="max-w-3xl mx-auto">
            <DynamicFormRenderer
              fields={defaultTemplateFields}
              formData={formData}
              readOnly={true}
              onChange={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
