import EmptyState from '../../../../components/common/EmptyState'
import type { BuilderField } from '../../form-engine/types'
import BuilderCanvasField from './BuilderCanvasField'
import BuilderCanvasSection from './BuilderCanvasSection'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

type BuilderCanvasProps = {
  fields: BuilderField[]
  selectedFieldId: string | null
  onSelect: (fieldId: string) => void
  onDuplicateField: (fieldId: string) => void
  onDeleteField: (fieldId: string) => void
  onDuplicateSection?: (sectionId: string) => void
  onDeleteSection?: (sectionId: string) => void
  onToggleSectionCollapse?: (sectionId: string) => void
  onAddFieldToSection?: (sectionId: string) => void
}

export default function BuilderCanvas({
  fields,
  selectedFieldId,
  onSelect,
  onDuplicateField,
  onDeleteField,
  onDuplicateSection,
  onDeleteSection,
  onToggleSectionCollapse,
  onAddFieldToSection,
}: BuilderCanvasProps) {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  })

  const sections = fields.filter((f) => f.type === 'section')
  const orphanFields = fields.filter((f) => f.type !== 'section' && !f.sectionId)

  // 用于 SortableContext 的 flat id 列表：按「section1 + children」「section2 + children」...「orphans」顺序
  const sortableIds: string[] = []
  sections.forEach((s) => {
    sortableIds.push(s.id)
  })
  orphanFields.forEach((f) => sortableIds.push(f.id))

  return (
    <div ref={setNodeRef} className="min-h-full">
      {fields.length === 0 ? (
        <EmptyState title="暂无字段" description="请从左侧组件库拖拽组件到此处" />
      ) : (
        <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-5 pb-32">
            {sections.map((section) => {
              const children = fields.filter((f) => f.sectionId === section.id)
              return (
                <BuilderCanvasSection
                  key={section.id}
                  section={section}
                  children={children}
                  active={selectedFieldId === section.id}
                  anyChildActive={!!selectedFieldId && children.some((c) => c.id === selectedFieldId)}
                  onSelect={() => onSelect(section.id)}
                  onSelectChild={(id) => onSelect(id)}
                  onDuplicate={() => (onDuplicateSection || onDuplicateField)(section.id)}
                  onDelete={() => (onDeleteSection || onDeleteField)(section.id)}
                  onDuplicateChild={onDuplicateField}
                  onDeleteChild={onDeleteField}
                  onAddFieldInside={() => onAddFieldToSection && onAddFieldToSection(section.id)}
                  onToggleCollapse={() => onToggleSectionCollapse && onToggleSectionCollapse(section.id)}
                />
              )
            })}

            {orphanFields.length > 0 && (
              <div className="space-y-4">
                {sections.length > 0 && (
                  <div className="text-xs text-slate-400 px-1 flex items-center gap-2 pt-1">
                    <span className="flex-1 h-px bg-slate-200" />
                    <span>画布外字段（未归属模块）</span>
                    <span className="flex-1 h-px bg-slate-200" />
                  </div>
                )}
                {orphanFields.map((field) => (
                  <BuilderCanvasField
                    key={field.id}
                    field={field}
                    active={selectedFieldId === field.id}
                    onSelect={() => onSelect(field.id)}
                    onDuplicate={() => onDuplicateField(field.id)}
                    onDelete={() => onDeleteField(field.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </SortableContext>
      )}
    </div>
  )
}
