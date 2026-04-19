type DynamicListRow = Record<string, string>

type DynamicListFieldProps = {
  label: string
  columns: string[]
  value: DynamicListRow[]
  readOnly?: boolean
  onChange: (value: DynamicListRow[]) => void
}

export default function DynamicListField({
  label,
  columns,
  value,
  readOnly,
  onChange,
}: DynamicListFieldProps) {
  const rows = Array.isArray(value) ? value : []

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="text-sm text-slate-700">{label}</div>
        {!readOnly && (
          <button
            type="button"
            onClick={() => onChange([...rows, Object.fromEntries(columns.map((col) => [col, '']))])}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + 新增一行
          </button>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div
          className="grid bg-slate-50 text-xs text-slate-500"
          style={{ gridTemplateColumns: `repeat(${columns.length + 1}, minmax(0, 1fr))` }}
        >
          {columns.map((col) => (
            <div key={col} className="px-3 py-2 border-r border-slate-200">
              {col}
            </div>
          ))}
          <div className="px-3 py-2">操作</div>
        </div>

        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid border-t border-slate-200"
            style={{ gridTemplateColumns: `repeat(${columns.length + 1}, minmax(0, 1fr))` }}
          >
            {columns.map((col) => (
              <div key={col} className="px-2 py-2 border-r border-slate-200">
                <input
                  value={row[col] || ''}
                  readOnly={readOnly}
                  onChange={(e) => {
                    const next = [...rows]
                    next[rowIndex] = { ...next[rowIndex], [col]: e.target.value }
                    onChange(next)
                  }}
                  className="w-full h-9 rounded-lg border border-slate-200 px-2 text-sm outline-none focus:border-blue-500 bg-white read-only:bg-slate-50 read-only:text-slate-500"
                />
              </div>
            ))}

            <div className="px-3 py-2">
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => onChange(rows.filter((_, idx) => idx !== rowIndex))}
                  className="text-rose-500 hover:text-rose-700 text-sm"
                >
                  删除
                </button>
              )}
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-slate-400">暂无列表数据</div>
        )}
      </div>
    </div>
  )
}
