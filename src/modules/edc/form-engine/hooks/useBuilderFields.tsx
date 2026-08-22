import { useState } from 'react'
import type { BuilderField, BuilderFieldType } from '../types'
import { createFieldByType } from '../utils/createFieldByType'

export function useBuilderFields(initialFields: BuilderField[]) {
  const [fields, setFields] = useState<BuilderField[]>(initialFields)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(initialFields[0]?.id || null)

  const addField = (type: BuilderFieldType, sectionId?: string | null) => {
    const newField = createFieldByType(type)
    if (sectionId) {
      newField.sectionId = sectionId
    }
    setFields((prev) => [...prev, newField])
    setSelectedFieldId(newField.id)
    return newField
  }

  const addFields = (newFields: BuilderField[]) => {
    if (!newFields.length) return
    setFields((prev) => [...prev, ...newFields])
    setSelectedFieldId(newFields[0].id)
  }

  const updateField = (fieldId: string, patch: Partial<BuilderField>) => {
    setFields((prev) =>
      prev.map((field) => (field.id === fieldId ? { ...field, ...patch } : field))
    )
  }

  const deleteField = (fieldId: string) => {
    setFields((prev) => {
      const target = prev.find(f => f.id === fieldId)
      let next: BuilderField[]
      if (target?.type === 'section') {
        next = prev.filter((field) => field.id !== fieldId && field.sectionId !== fieldId)
      } else {
        next = prev.filter((field) => field.id !== fieldId)
      }
      if (selectedFieldId === fieldId) {
        setSelectedFieldId(next[0]?.id || null)
      }
      return next
    })
  }

  const deleteSection = (sectionId: string) => deleteField(sectionId)

  const duplicateField = (fieldId: string) => {
    setFields((prev) => {
      const index = prev.findIndex((field) => field.id === fieldId)
      if (index < 0) return prev

      const source = prev[index]
      let appended: BuilderField[]

      if (source.type === 'section') {
        const sectionCopy: BuilderField = {
          ...source,
          id: `${source.id}_copy_${Math.random().toString(36).slice(2, 5)}`,
          key: `${source.key}_copy`,
          label: `${source.label}（副本）`,
          sectionTitle: source.sectionTitle ? `${source.sectionTitle}（副本）` : undefined,
        }
        const childCopies = prev
          .filter((f) => f.sectionId === source.id)
          .map((f) => ({
            ...f,
            id: `${f.id}_copy_${Math.random().toString(36).slice(2, 5)}`,
            key: `${f.key}_copy`,
            label: f.label,
            sectionId: sectionCopy.id,
          }))
        appended = [sectionCopy, ...childCopies]
      } else {
        const copied: BuilderField = {
          ...source,
          id: `${source.id}_copy_${Math.random().toString(36).slice(2, 5)}`,
          key: `${source.key}_copy`,
          label: `${source.label}（副本）`,
        }
        appended = [copied]
      }

      const next = [...prev]
      const insertAt = source.type === 'section'
        ? (() => {
            let i = index + 1
            while (i < next.length && next[i].sectionId === source.id) i++
            return i
          })()
        : index + 1
      next.splice(insertAt, 0, ...appended)
      setSelectedFieldId(appended[0].id)
      return next
    })
  }

  const duplicateSection = (sectionId: string) => duplicateField(sectionId)

  const toggleSectionCollapse = (sectionId: string) => {
    updateField(sectionId, { collapsed: !fields.find(f => f.id === sectionId)?.collapsed })
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

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    setFields((prev) => {
      const index = prev.findIndex((f) => f.id === sectionId)
      if (index < 0 || prev[index].type !== 'section') return prev

      const children = prev.filter((f) => f.sectionId === sectionId)
      const blockLength = 1 + children.length
      let nextIndex: number
      if (direction === 'up') {
        nextIndex = index - 1
        if (nextIndex < 0) return prev
        const cursor = prev[nextIndex]
        if (cursor.type === 'section') {
          const cursorChildren = prev.filter((f) => f.sectionId === cursor.id)
          nextIndex = nextIndex - cursorChildren.length
        }
      } else {
        nextIndex = index + blockLength
        if (nextIndex >= prev.length) return prev
      }

      const block: BuilderField[] = [prev[index], ...children]
      const others = prev.filter((f) => f.id !== sectionId && f.sectionId !== sectionId)
      const next = [...others]
      next.splice(nextIndex, 0, ...block)
      return next
    })
  }

  const addFieldToSection = (type: BuilderFieldType, sectionId: string) => addField(type, sectionId)

  const selectedField = fields.find((field) => field.id === selectedFieldId) || null

  return {
    fields,
    setFields,
    selectedFieldId,
    selectedField,
    setSelectedFieldId,
    addField,
    addFields,
    updateField,
    deleteField,
    deleteSection,
    duplicateField,
    duplicateSection,
    moveField,
    moveSection,
    toggleSectionCollapse,
    addFieldToSection,
  }
}
