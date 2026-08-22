type SectionFieldProps = {
  title: string
  itemCount?: number
  collapsible?: boolean
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export default function SectionField({
  title,
  itemCount,
  collapsible = false,
  collapsed = false,
  onToggleCollapse,
}: SectionFieldProps) {
  return (
    <div
      className="flex items-center gap-2.5 py-2 select-none"
      onClick={collapsible ? onToggleCollapse : undefined}
    >
      <span className="inline-block w-1.5 h-7 rounded-sm bg-indigo-500 shrink-0" />
      <div className="text-base font-bold text-slate-800 flex-1 truncate tracking-tight">
        {title || '未命名模块'}
      </div>
      {typeof itemCount === 'number' && itemCount > 0 && (
        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold shrink-0 bg-indigo-50 text-indigo-600 border border-indigo-100">
          {itemCount} 项
        </span>
      )}
    </div>
  )
}
