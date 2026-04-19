type EyeGridValue = Record<string, { od: string; os: string }>

type EyeGridFieldProps = {
  label: string
  rows: string[]
  value: EyeGridValue
  readOnly?: boolean
  onChange: (value: EyeGridValue) => void
}

export default function EyeGridField({
  label,
  rows,
  value,
  readOnly,
  onChange,
}: EyeGridFieldProps) {
  const safeValue = value || {}

  return (
    <div>
      <div className="text-sm text-slate-700 mb-2">{label}</div>
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-3 bg-slate-50 text-xs text-slate-500">
          <div className="px-3 py-2 border-r border-slate-200">检查项目</div>
          <div className="px-3 py-2 border-r border-slate-200">OD</div>
          <div className="px-3 py-2">OS</div>
        </div>

        {rows.map((row) => (
          <div key={row} className="grid grid-cols-3 border-t border-slate-200">
            <div className="px-3 py-2 text-sm text-slate-600 border-r border-slate-200 bg-slate-50/50">
              {row}
            </div>

            <div className="px-3 py-2 border-r border-slate-200">
              <input
                value={safeValue[row]?.od || ''}
                readOnly={readOnly}
                onChange={(e) =>
                  onChange({
                    ...safeValue,
                    [row]: {
                      ...(safeValue[row] || { od: '', os: '' }),
                      od: e.target.value,
                    },
                  })
                }
                className="w-full h-9 rounded-lg border border-slate-200 px-2 text-sm outline-none focus:border-blue-500 bg-white read-only:bg-slate-50 read-only:text-slate-500"
              />
            </div>

            <div className="px-3 py-2">
              <input
                value={safeValue[row]?.os || ''}
                readOnly={readOnly}
                onChange={(e) =>
                  onChange({
                    ...safeValue,
                    [row]: {
                      ...(safeValue[row] || { od: '', os: '' }),
                      os: e.target.value,
                    },
                  })
                }
                className="w-full h-9 rounded-lg border border-slate-200 px-2 text-sm outline-none focus:border-blue-500 bg-white read-only:bg-slate-50 read-only:text-slate-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
