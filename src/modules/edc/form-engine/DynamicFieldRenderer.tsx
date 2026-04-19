import type { BuilderField } from './types'
import DateField from './fields/DateField'
import DynamicListField from './fields/DynamicListField'
import EyeGridField from './fields/EyeGridField'
import MatrixField from './fields/MatrixField'
import NumberField from './fields/NumberField'
import RadioField from './fields/RadioField'
import SectionField from './fields/SectionField'
import SelectField from './fields/SelectField'
import TextareaField from './fields/TextareaField'
import TextField from './fields/TextField'

type DynamicFieldRendererProps = {
  field: BuilderField
  value: any
  readOnly?: boolean
  error?: string
  onChange: (value: any) => void
}

export default function DynamicFieldRenderer({
  field,
  value,
  readOnly,
  error,
  onChange,
}: DynamicFieldRendererProps) {
  switch (field.type) {
    case 'section':
      return <SectionField title={field.sectionTitle || field.label} />

    case 'text':
      return (
        <TextField
          label={field.label}
          value={value || ''}
          placeholder={field.placeholder}
          required={field.required}
          readOnly={readOnly}
          error={error}
          onChange={onChange}
        />
      )

    case 'number':
      return (
        <NumberField
          label={field.label}
          value={value || ''}
          placeholder={field.placeholder}
          required={field.required}
          readOnly={readOnly}
          error={error}
          onChange={onChange}
        />
      )

    case 'date':
      return (
        <DateField
          label={field.label}
          value={value || ''}
          required={field.required}
          readOnly={readOnly}
          error={error}
          onChange={onChange}
        />
      )

    case 'select':
      return (
        <SelectField
          label={field.label}
          value={value || ''}
          required={field.required}
          options={field.options || []}
          readOnly={readOnly}
          error={error}
          onChange={onChange}
        />
      )

    case 'radio':
      return (
        <RadioField
          label={field.label}
          value={value || ''}
          required={field.required}
          options={field.options || []}
          readOnly={readOnly}
          onChange={onChange}
        />
      )

    case 'textarea':
      return (
        <TextareaField
          label={field.label}
          value={value || ''}
          placeholder={field.placeholder}
          required={field.required}
          readOnly={readOnly}
          error={error}
          onChange={onChange}
        />
      )

    case 'eyeGrid':
      return (
        <EyeGridField
          label={field.label}
          rows={field.rows || []}
          value={value || {}}
          readOnly={readOnly}
          onChange={onChange}
        />
      )

    case 'matrix':
      return (
        <MatrixField
          label={field.label}
          rows={field.rows || []}
          cols={field.cols || []}
          value={value || {}}
          readOnly={readOnly}
          onChange={onChange}
        />
      )

    case 'dynamicList':
      return (
        <DynamicListField
          label={field.label}
          columns={field.columns || []}
          value={value || []}
          readOnly={readOnly}
          onChange={onChange}
        />
      )

    default:
      return null
  }
}
