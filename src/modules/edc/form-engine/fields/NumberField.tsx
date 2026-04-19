import { classNames } from '../../../../lib/classNames'

type NumberFieldProps = {
  label: string
  value: string
  placeholder?: string
  required?: boolean
  readOnly?: boolean
  error?: string
  onChange: (value: string) => void
}

export default function NumberField({
  label,
  value,
  placeholder,
  required,
  readOnly,
  error,
  onChange,
}: NumberFieldProps) {
  return (
    <div>
      <label className="block text-sm text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <input
        type="number"
        value={value || ''}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={classNames(
          'w-full h-11 rounded-xl border px-3 text-sm outline-none bg-white',
          error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500',
          'read-only:bg-slate-50 read-only:text-slate-500'
        )}
      />
      {error && <div className="mt-1 text-xs text-rose-500">{error}</div>}
    </div>
  )
}
