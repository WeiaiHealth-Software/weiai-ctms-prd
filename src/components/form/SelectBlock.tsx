type SelectBlockProps = {
  label: string
  required?: boolean
  value?: string
  onChange?: (value: string) => void
  options: string[]
}

export default function SelectBlock({
  label,
  required,
  value,
  onChange,
  options,
}: SelectBlockProps) {
  return (
    <div>
      <label className="block text-sm text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 bg-white"
      >
        <option value="">请选择</option>
        {options.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </div>
  )
}
