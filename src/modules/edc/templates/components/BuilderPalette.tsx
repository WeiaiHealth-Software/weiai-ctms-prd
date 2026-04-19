import {
  Calendar,
  FileText,
  Hash,
  ListChecks,
  PanelTop,
  Rows3,
  Table,
  Type,
} from 'lucide-react'
import type { BuilderFieldType } from '../../form-engine/types'
import { useDraggable } from '@dnd-kit/core'

const fieldItems: { type: BuilderFieldType; label: string; icon: React.ReactNode }[] = [
  { type: 'section', label: '区块标题', icon: <PanelTop className="w-4 h-4" /> },
  { type: 'text', label: '单行文本', icon: <Type className="w-4 h-4" /> },
  { type: 'number', label: '数字输入', icon: <Hash className="w-4 h-4" /> },
  { type: 'date', label: '日期', icon: <Calendar className="w-4 h-4" /> },
  { type: 'select', label: '下拉选择', icon: <ListChecks className="w-4 h-4" /> },
  { type: 'radio', label: '单选', icon: <Rows3 className="w-4 h-4" /> },
  { type: 'textarea', label: '多行文本', icon: <FileText className="w-4 h-4" /> },
  { type: 'eyeGrid', label: '左右眼表格', icon: <Table className="w-4 h-4" /> },
  { type: 'matrix', label: '矩阵表格', icon: <Table className="w-4 h-4" /> },
  { type: 'dynamicList', label: '动态列表', icon: <FileText className="w-4 h-4" /> },
]

type BuilderPaletteProps = {
  onAdd: (type: BuilderFieldType) => void
}

function DraggablePaletteItem({ item, onAdd }: { item: typeof fieldItems[0]; onAdd: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${item.type}`,
    data: {
      type: 'palette',
      fieldType: item.type,
      item,
    },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onAdd}
      className={`w-full rounded-xl border border-slate-200 p-3 text-left hover:border-blue-300 hover:bg-blue-50 transition cursor-grab ${
        isDragging ? 'opacity-50 border-blue-500 bg-blue-50' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-3 pointer-events-none">
        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
          {item.icon}
        </div>
        <div>
          <div className="text-sm font-medium text-slate-800">{item.label}</div>
          <div className="text-xs text-slate-400 mt-1">拖拽或点击加入画布</div>
        </div>
      </div>
    </div>
  )
}

export default function BuilderPalette({ onAdd }: BuilderPaletteProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-800 shrink-0">
        组件库
      </div>
      <div className="p-4 space-y-3 overflow-y-auto">
        {fieldItems.map((item) => (
          <DraggablePaletteItem key={item.type} item={item} onAdd={() => onAdd(item.type)} />
        ))}
      </div>
    </div>
  )
}
