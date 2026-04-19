type MatrixValue = Record<string, Record<string, string>>

type MatrixFieldProps = {
  label: string
  rows: string[]
  cols: string[]
  value: MatrixValue
  readOnly?: boolean
  onChange: (value: MatrixValue) => void
}

export default function MatrixField({
  label,
  rows,
  cols,
  value,
  readOnly,
  onChange,
}: MatrixFieldProps) {
  const safeValue = value || {}

  return (
    <div>
      <div className="text-sm text-slate-700 mb-2">{label}</div>

      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div
          className="grid bg-slate-50 text-xs text-slate-500"
          style={{ gridTemplateColumns: `120px repeat(${cols.length}, minmax(0, 1fr))` }}
        >
          <div className="px-3 py-2 border-r border-slate-200">维度</div>
          {cols.map((col) => (
            <div key={col} className="px-3 py-2 border-r last:border-r-0 border-slate-200">
              {col}
            </div>
          ))}
        </div>

        {rows.map((row) => (
          <div
            key={row}
            className="grid border-t border-slate-200"
            style={{ gridTemplateColumns: `120px repeat(${cols.length}, minmax(0, 1fr))` }}
          >
            <div className="px-3 py-2 text-sm text-slate-600 border-r border-slate-200 bg-slate-50/50">
              {row}
            </div>

            {cols.map((col) => (
              <div key={`${row}-${col}`} className="px-2 py-2 border-r last:border-r-0 border-slate-200">
                <input
                  value={safeValue[row]?.[col] || ''}
                  readOnly={readOnly}
                  onChange={(e) =>
                    onChange({
                      ...safeValue,
                      [row]: {
                        ...(safeValue[row] || {}),
                        [col]: e.target.value,
                      },
                    })
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 px-2 text-sm outline-none focus:border-blue-500 bg-white read-only:bg-slate-50 read-only:text-slate-500"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
