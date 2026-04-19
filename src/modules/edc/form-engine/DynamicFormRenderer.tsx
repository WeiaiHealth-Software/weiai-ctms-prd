import type { BuilderField, DynamicFormErrors, DynamicFormValue } from './types'
import DynamicFieldRenderer from './DynamicFieldRenderer'

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
  return (
    <div className="space-y-5">
      {fields.map((field) => (
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
