import type { BuilderField, DynamicFormValue } from '../types'

export function buildInitialFormData(fields: BuilderField[]): DynamicFormValue {
  const result: DynamicFormValue = {}

  fields.forEach((field) => {
    if (field.type === 'section') return

    if (field.type === 'eyeGrid') {
      result[field.key] = {}
      ;(field.rows || []).forEach((row) => {
        result[field.key][row] = { od: '', os: '' }
      })
      return
    }

    if (field.type === 'matrix') {
      result[field.key] = {}
      ;(field.rows || []).forEach((row) => {
        result[field.key][row] = {}
        ;(field.cols || []).forEach((col) => {
          result[field.key][row][col] = ''
        })
      })
      return
    }

    if (field.type === 'dynamicList') {
      result[field.key] = [
        Object.fromEntries((field.columns || []).map((col) => [col, ''])),
      ]
      return
    }

    result[field.key] = ''
  })

  return result
}
