import { useMemo, useState } from 'react'
import type { BuilderField, DynamicFormValue } from '../types'
import { buildInitialFormData } from '../utils/buildInitialFormData'

export function useDynamicForm(fields: BuilderField[]) {
  const initialData = useMemo(() => buildInitialFormData(fields), [fields])
  const [formData, setFormData] = useState<DynamicFormValue>(initialData)

  const updateFieldValue = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const resetForm = () => {
    setFormData(buildInitialFormData(fields))
  }

  const syncWithFields = () => {
    setFormData(buildInitialFormData(fields))
  }

  return {
    formData,
    setFormData,
    updateFieldValue,
    resetForm,
    syncWithFields,
  }
}
