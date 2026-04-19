import { useState } from 'react'
import type { BuilderField, BuilderFieldType } from '../types'
import { createFieldByType } from '../utils/createFieldByType'

export function useBuilderFields(initialFields: BuilderField[]) {
  const [fields, setFields] = useState<BuilderField[]>(initialFields)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(initialFields[0]?.id || null)

  const addField = (type: BuilderFieldType) => {
    const newField = createFieldByType(type)
    setFields((prev) => [...prev, newField])
    setSelectedFieldId(newField.id)
    return newField
  }

  const updateField = (fieldId: string, patch: Partial<BuilderField>) => {
    setFields((prev) =>
      prev.map((field) => (field.id === fieldId ? { ...field, ...patch } : field))
    )
  }

  const deleteField = (fieldId: string) => {
    setFields((prev) => {
      const next = prev.filter((field) => field.id !== fieldId)
      if (selectedFieldId === fieldId) {
        setSelectedFieldId(next[0]?.id || null)
      }
      return next
    })
  }

  const duplicateField = (fieldId: string) => {
    setFields((prev) => {
      const index = prev.findIndex((field) => field.id === fieldId)
      if (index < 0) return prev

      const source = prev[index]
      const copied: BuilderField = {
        ...source,
        id: `${source.id}_copy_${Math.random().toString(36).slice(2, 5)}`,
        key: `${source.key}_copy`,
        label: `${source.label}（副本）`,
      }

      const next = [...prev]
      next.splice(index + 1, 0, copied)
      setSelectedFieldId(copied.id)
      return next
    })
  }

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    setFields((prev) => {
      const index = prev.findIndex((field) => field.id === fieldId)
      if (index < 0) return prev

      const targetIndex = direction === 'up' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= prev.length) return prev

      const next = [...prev]
      const temp = next[index]
      next[index] = next[targetIndex]
      next[targetIndex] = temp
      return next
    })
  }

  const selectedField = fields.find((field) => field.id === selectedFieldId) || null

  return {
    fields,
    setFields,
    selectedFieldId,
    selectedField,
    setSelectedFieldId,
    addField,
    updateField,
    deleteField,
    duplicateField,
    moveField,
  }
}
