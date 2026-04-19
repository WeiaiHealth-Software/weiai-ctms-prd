import type { Template } from '../../../types/template'
import { classNames } from '../../../lib/classNames'
import { statusClassMap } from '../../../lib/statusMap'

type TemplateListProps = {
  templates: Template[]
  selectedTemplateId: string | null
  onSelect: (id: string) => void
}

export default function TemplateList({
  templates,
  selectedTemplateId,
  onSelect,
}: TemplateListProps) {
  return (
    <div className="space-y-3">
      {templates.map((tpl) => {
        const active = selectedTemplateId === tpl.id

        return (
          <button
            key={tpl.id}
            onClick={() => onSelect(tpl.id)}
            className={classNames(
              'w-full text-left rounded-2xl border p-4 transition',
              active ? 'border-blue-300 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-slate-900">{tpl.name}</div>
              <span className={classNames('px-2 py-0.5 rounded-full text-xs', statusClassMap[tpl.status])}>
                {tpl.status}
              </span>
            </div>
            <div className="mt-2 text-sm text-slate-500">{tpl.type}</div>
            <div className="mt-3 text-xs text-slate-400">
              {tpl.version} · {tpl.fields} 个字段 · 更新于 {tpl.updatedAt}
            </div>
          </button>
        )
      })}
    </div>
  )
}
