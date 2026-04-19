import { Copy, GripVertical, Trash2 } from 'lucide-react'
import type { BuilderField } from '../../form-engine/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DynamicFieldRenderer from '../../form-engine/DynamicFieldRenderer'

type BuilderCanvasFieldProps = {
  field: BuilderField
  active?: boolean
  onSelect: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export default function BuilderCanvasField({
  field,
  active,
  onSelect,
  onDuplicate,
  onDelete,
}: BuilderCanvasFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
    data: {
      type: 'canvas-item',
      field,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-xl border-2 transition-colors bg-white ${
        active ? 'border-blue-500 shadow-sm' : 'border-transparent hover:border-blue-200'
      }`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      {/* Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center cursor-grab opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50 hover:bg-slate-100 rounded-l-xl z-10"
      >
        <GripVertical className="w-4 h-4 text-slate-400" />
      </div>

      {/* Toolbar */}
      <div className="absolute right-2 -top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-white border border-slate-200 px-1 py-1 rounded-lg shadow-sm">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDuplicate()
          }}
          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
          title="复制"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md"
          title="删除"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 pl-8 pointer-events-none">
        <DynamicFieldRenderer
          field={field}
          value={undefined}
          readOnly={true}
          onChange={() => {}}
        />
      </div>
      
      {/* Overlay to catch clicks instead of inputs */}
      <div className="absolute inset-0 z-0" />
    </div>
  )
}
