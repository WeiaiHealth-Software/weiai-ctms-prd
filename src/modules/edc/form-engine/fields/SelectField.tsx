import { classNames } from '../../../../lib/classNames'

type SelectFieldProps = {
  label: string
  value: string
  required?: boolean
  options: string[]
  readOnly?: boolean
  error?: string
  onChange: (value: string) => void
}

export default function SelectField({
  label,
  value,
  required,
  options,
  readOnly,
  error,
  onChange,
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <select
        value={value || ''}
        disabled={readOnly}
        onChange={(e) => onChange(e.target.value)}
        className={classNames(
          'w-full h-11 rounded-xl border px-3 text-sm outline-none bg-white disabled:bg-slate-50 disabled:text-slate-500',
          error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
        )}
      >
        <option value="">请选择</option>
        {options.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
      {error && <div className="mt-1 text-xs text-rose-500">{error}</div>}
    </div>
  )
}
