export type BuilderFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'radio'
  | 'textarea'
  | 'eyeGrid'
  | 'matrix'
  | 'dynamicList'
  | 'section'

export type BuilderField = {
  id: string
  type: BuilderFieldType
  label: string
  key: string
  required?: boolean
  placeholder?: string
  options?: string[]
  sectionTitle?: string
  rows?: string[]
  cols?: string[]
  columns?: string[]
}

export type DynamicFormValue = Record<string, any>
export type DynamicFormErrors = Record<string, string>
