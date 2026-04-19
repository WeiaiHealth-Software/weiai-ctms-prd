import InputBlock from '../../../../components/form/InputBlock'
import SelectBlock from '../../../../components/form/SelectBlock'

type TemplateMeta = {
  name: string
  type: string
  visit: string
  version: string
  status: string
}

type TemplateMetaFormProps = {
  value: TemplateMeta
  onChange: (value: TemplateMeta) => void
}

export default function TemplateMetaForm({ value, onChange }: TemplateMetaFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-800">
        模板基础信息
      </div>
      <div className="p-4 space-y-4">
        <InputBlock
          label="模板名称"
          value={value.name}
          onChange={(name) => onChange({ ...value, name })}
        />
        <SelectBlock
          label="模板类型"
          value={value.type}
          onChange={(type) => onChange({ ...value, type })}
          options={['基线访视', '随访访视', '安全性表单', '筛选表单']}
        />
        <SelectBlock
          label="绑定访视"
          value={value.visit}
          onChange={(visit) => onChange({ ...value, visit })}
          options={['V0 基线期', 'V1 3M', 'V2 6M', 'V3 9M', 'V4 12M']}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputBlock
            label="版本号"
            value={value.version}
            onChange={(version) => onChange({ ...value, version })}
          />
          <SelectBlock
            label="模板状态"
            value={value.status}
            onChange={(status) => onChange({ ...value, status })}
            options={['草稿', '启用中']}
          />
        </div>
      </div>
    </div>
  )
}
