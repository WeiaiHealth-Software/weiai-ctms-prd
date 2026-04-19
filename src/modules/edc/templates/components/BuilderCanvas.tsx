import EmptyState from '../../../../components/common/EmptyState'
import type { BuilderField } from '../../form-engine/types'
import BuilderCanvasField from './BuilderCanvasField'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

type BuilderCanvasProps = {
  fields: BuilderField[]
  selectedFieldId: string | null
  onSelect: (fieldId: string) => void
  onDuplicateField: (fieldId: string) => void
  onDeleteField: (fieldId: string) => void
}

export default function BuilderCanvas({
  fields,
  selectedFieldId,
  onSelect,
  onDuplicateField,
  onDeleteField,
}: BuilderCanvasProps) {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  })

  return (
    <div ref={setNodeRef} className="min-h-full">
      {fields.length === 0 ? (
        <EmptyState title="暂无字段" description="请从左侧组件库拖拽组件到此处" />
      ) : (
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4 pb-32">
            {fields.map((field) => (
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
        </SortableContext>
      )}
    </div>
  )
}
