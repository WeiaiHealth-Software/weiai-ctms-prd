import { Copy, ChevronDown, ChevronRight, Plus, GripVertical, Trash2 } from 'lucide-react'
import type { BuilderField } from '../../form-engine/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DynamicFieldRenderer from '../../form-engine/DynamicFieldRenderer'
import BuilderCanvasField from './BuilderCanvasField'

type BuilderCanvasSectionProps = {
  section: BuilderField
  children: BuilderField[]
  active: boolean
  anyChildActive: boolean
  onSelect: () => void
  onSelectChild: (fieldId: string) => void
  onDuplicate: () => void
  onDelete: () => void
  onDuplicateChild: (fieldId: string) => void
  onDeleteChild: (fieldId: string) => void
  onAddFieldInside: () => void
  onToggleCollapse: () => void
}

export default function BuilderCanvasSection({
  section,
  children,
  active,
  anyChildActive,
  onSelect,
  onSelectChild,
  onDuplicate,
  onDelete,
  onDuplicateChild,
  onDeleteChild,
  onAddFieldInside,
  onToggleCollapse,
}: BuilderCanvasSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    data: {
      type: 'canvas-section',
      field: section,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  }

  const collapsed = !!section.collapsed
  const borderColor = active
    ? 'border-blue-500 ring-2 ring-blue-100'
    : anyChildActive
      ? 'border-blue-300'
      : 'border-slate-200 hover:border-slate-300'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-2xl bg-white shadow-sm group transition-shadow ${
        isDragging ? 'shadow-lg' : ''
      } border-2 ${borderColor}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-50/70 via-indigo-50/40 to-slate-50/60 rounded-t-[0.85rem] border-b border-slate-100/80">
        {/* Drag handle (编辑专属，常态弱化 hover 才清晰) */}
        <div
          {...attributes}
          {...listeners}
          className="w-7 h-7 rounded-lg flex items-center justify-center cursor-grab hover:bg-white/80 text-slate-300 group-hover:text-slate-500 transition shrink-0 opacity-40 group-hover:opacity-100"
          title="拖拽整个模块"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <span className="inline-block w-1.5 h-6 rounded-sm bg-indigo-500 shrink-0"></span>

        <div className="text-base font-semibold text-slate-800 truncate min-w-0">
          {section.sectionTitle || section.label || '未命名模块'}
        </div>

        <span className="text-[10px] text-slate-400 shrink-0 px-1.5 py-0.5 rounded bg-white/70 border border-slate-200/70">
          {children.length} 项
        </span>

        <div className="flex-1" />

        {/* Toolbar (编辑专属，常态全隐 hover 才出现) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onAddFieldInside()
            }}
            className="p-1.5 rounded-lg bg-white text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 shadow-sm"
            title="在模块内添加字段"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate()
            }}
            className="p-1.5 rounded-lg bg-white text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 shadow-sm"
            title="复制整个模块"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1.5 rounded-lg bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 shadow-sm"
            title="删除整个模块（含内部字段）"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleCollapse()
          }}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/80 text-slate-400 group-hover:text-slate-600 transition shrink-0 opacity-60 group-hover:opacity-100"
          title={collapsed ? '展开' : '收起'}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Children */}
      {!collapsed && (
        <div className="p-4 space-y-3 bg-white rounded-b-[0.85rem]">
          {children.length === 0 ? (
            <div className="py-8 border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-400 text-center bg-slate-50/50">
              模块内暂无字段，可从左侧组件库拖拽或点右上角「+」添加
            </div>
          ) : (
            children.map((field) => (
              <BuilderCanvasField
                key={field.id}
                field={field}
                active={false}
                onSelect={() => onSelectChild(field.id)}
                onDuplicate={() => onDuplicateChild(field.id)}
                onDelete={() => onDeleteChild(field.id)}
                compact
              />
            ))
          )}
        </div>
      )}

      {/* Overlay to catch clicks instead of inputs */}
      <div className="absolute inset-0 z-0 pointer-events-none" />
    </div>
  )
}
