import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { BuilderField, DynamicFormErrors, DynamicFormValue } from './types'
import DynamicFieldRenderer from './DynamicFieldRenderer'
import { classNames } from '../../../lib/classNames'

type DynamicFormRendererProps = {
  fields: BuilderField[]
  formData: DynamicFormValue
  errors?: DynamicFormErrors
  readOnly?: boolean
  onChange: (key: string, value: any) => void
}

export default function DynamicFormRenderer({
  fields,
  formData,
  errors = {},
  readOnly,
  onChange,
}: DynamicFormRendererProps) {
  const { sections, orphanFields } = useMemo(() => {
    const sections: BuilderField[] = []
    const orphans: BuilderField[] = []
    fields.forEach((f) => {
      if (f.type === 'section') sections.push(f)
      else if (!f.sectionId) orphans.push(f)
    })
    return { sections, orphanFields: orphans }
  }, [fields])

  const childFieldsBySectionId = useMemo(() => {
    const map = new Map<string, BuilderField[]>()
    sections.forEach((s) => map.set(s.id, []))
    fields.forEach((f) => {
      if (f.type !== 'section' && f.sectionId && map.has(f.sectionId)) {
        map.get(f.sectionId)!.push(f)
      }
    })
    return map
  }, [sections, fields])

  const [localCollapsed, setLocalCollapsed] = useState<Record<string, boolean>>({})
  const isCollapsed = (s: BuilderField) => localCollapsed[s.id] ?? !!s.collapsed
  const toggle = (s: BuilderField) =>
    setLocalCollapsed((prev) => ({ ...prev, [s.id]: !isCollapsed(s) }))

  return (
    <div className="space-y-5">
      {sections.map((section) => {
        const childFields = childFieldsBySectionId.get(section.id) || []
        const collapsed = isCollapsed(section)
        return (
          <div
            key={section.id}
            className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
          >
            {/* Section Header (展示态，无任何编辑按钮) */}
            <div
              className="flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-indigo-50/60 via-indigo-50/30 to-transparent border-b border-slate-100 cursor-pointer select-none"
              onClick={() => toggle(section)}
            >
              <span className="inline-block w-1.5 h-7 rounded-sm bg-indigo-500 shrink-0" />

              <div className="text-base font-bold text-slate-800 truncate tracking-tight">
                {section.sectionTitle || section.label || '未命名模块'}
              </div>

              <span className={classNames(
                'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold shrink-0',
                'bg-white text-indigo-600 border border-indigo-100 shadow-sm'
              )}>
                {childFields.length} 项
              </span>

              <div className="flex-1" />

              <button
                type="button"
                className={classNames(
                  'shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition',
                  'text-slate-500 hover:text-indigo-600 hover:bg-white/90'
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  toggle(section)
                }}
              >
                <ChevronDown className={classNames(
                  'w-4.5 h-4.5 transition-transform',
                  collapsed && '-rotate-90'
                )} />
              </button>
            </div>

            {/* Section Body */}
            {!collapsed && (
              <div className="p-5 space-y-4">
                {childFields.map((field) => (
                  <div key={field.id} id={`field-${field.id}`}>
                    <DynamicFieldRenderer
                      field={field}
                      value={formData[field.key]}
                      error={errors[field.key]}
                      readOnly={readOnly}
                      onChange={(value) => onChange(field.key, value)}
                    />
                  </div>
                ))}
                {childFields.length === 0 && (
                  <div className="py-6 text-xs text-slate-400 text-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60">
                    本模块暂无可填写字段
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Orphan Fields (不在任何模块容器里的散字段) */}
      {orphanFields.map((field) => (
        <div key={field.id} id={`field-${field.id}`}>
          <DynamicFieldRenderer
            field={field}
            value={formData[field.key]}
            error={errors[field.key]}
            readOnly={readOnly}
            onChange={(value) => onChange(field.key, value)}
          />
        </div>
      ))}
    </div>
  )
}
