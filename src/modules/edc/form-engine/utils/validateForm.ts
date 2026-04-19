import type { BuilderField, DynamicFormErrors, DynamicFormValue } from '../types'

function isEmptyValue(value: any) {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0

  if (typeof value === 'object') {
    const values = Object.values(value)
    if (values.length === 0) return true

    return values.every((item) => {
      if (item === null || item === undefined) return true
      if (typeof item === 'string') return item.trim() === ''
      if (Array.isArray(item)) return item.length === 0
      if (typeof item === 'object') {
        return Object.values(item).every((nested) =>
          typeof nested === 'string' ? nested.trim() === '' : !nested
        )
      }
      return !item
    })
  }

  return false
}

export function validateForm(fields: BuilderField[], formData: DynamicFormValue): DynamicFormErrors {
  const errors: DynamicFormErrors = {}

  fields.forEach((field) => {
    if (field.type === 'section') return
    if (!field.required) return

    const value = formData[field.key]
    if (isEmptyValue(value)) {
      errors[field.key] = `${field.label}为必填项`
    }
  })

  return errors
}
