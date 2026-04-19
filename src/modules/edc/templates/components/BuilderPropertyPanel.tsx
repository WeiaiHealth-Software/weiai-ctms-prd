import SectionCard from '../../../../components/common/SectionCard'
import InputBlock from '../../../../components/form/InputBlock'
import type { BuilderField } from '../../form-engine/types'

type BuilderPropertyPanelProps = {
  field: BuilderField | null
  onChange: (fieldId: string, patch: Partial<BuilderField>) => void
}

export default function BuilderPropertyPanel({
  field,
  onChange,
}: BuilderPropertyPanelProps) {
  if (!field) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <div className="text-sm font-medium text-slate-700">请选择 schema 字段</div>
        <div className="text-xs text-slate-400 mt-2">选择后可在此编辑字段属性</div>
      </div>
    )
  }

  const update = (patch: Partial<BuilderField>) => onChange(field.id, patch)

  return (
    <div className="space-y-5">
      <SectionCard title="字段基础属性">
        <div className="space-y-4">
          <InputBlock label="字段名称" value={field.label} onChange={(value) => update({ label: value })} />
          <InputBlock label="字段 Key" value={field.key} onChange={(value) => update({ key: value })} />

          {field.type === 'section' ? (
            <InputBlock
              label="区块标题"
              value={field.sectionTitle || ''}
              onChange={(value) => update({ sectionTitle: value, label: value })}
            />
          ) : (
            <>
              <InputBlock
                label="占位提示"
                value={field.placeholder || ''}
                onChange={(value) => update({ placeholder: value })}
              />

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={!!field.required}
                  onChange={(e) => update({ required: e.target.checked })}
                />
                是否必填
              </label>
            </>
          )}
        </div>
      </SectionCard>

      {(field.type === 'select' || field.type === 'radio') && (
        <SectionCard title="选项配置">
          <div className="space-y-3">
            {(field.options || []).map((option, index) => (
              <input
                key={index}
                value={option}
                onChange={(e) => {
                  const next = [...(field.options || [])]
                  next[index] = e.target.value
                  update({ options: next })
                }}
                className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
              />
            ))}

            <button
              onClick={() => update({ options: [...(field.options || []), `选项${(field.options || []).length + 1}`] })}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + 添加选项
            </button>
          </div>
        </SectionCard>
      )}

      {(field.type === 'eyeGrid' || field.type === 'matrix') && (
        <SectionCard title="行配置">
          <textarea
            value={(field.rows || []).join('，')}
            onChange={(e) =>
              update({
                rows: e.target.value
                  .split(/,|，/)
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500 min-h-24"
          />

          {field.type === 'matrix' && (
            <div className="mt-4">
              <div className="text-sm text-slate-700 mb-2">列配置</div>
              <textarea
                value={(field.cols || []).join('，')}
                onChange={(e) =>
                  update({
                    cols: e.target.value
                      .split(/,|，/)
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500 min-h-24"
              />
            </div>
          )}
        </SectionCard>
      )}

      {field.type === 'dynamicList' && (
        <SectionCard title="列表列配置">
          <textarea
            value={(field.columns || []).join('，')}
            onChange={(e) =>
              update({
                columns: e.target.value
                  .split(/,|，/)
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500 min-h-24"
          />
        </SectionCard>
      )}
    </div>
  )
}
