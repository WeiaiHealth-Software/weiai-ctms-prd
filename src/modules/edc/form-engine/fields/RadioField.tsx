import { classNames } from '../../../../lib/classNames'

type RadioFieldProps = {
  label: string
  value: string
  required?: boolean
  options: string[]
  readOnly?: boolean
  onChange: (value: string) => void
}

export default function RadioField({
  label,
  value,
  required,
  options,
  readOnly,
  onChange,
}: RadioFieldProps) {
  return (
    <div>
      <div className="block text-sm text-slate-700 mb-2">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </div>
      <div className="flex flex-wrap gap-3">
        {options.map((op) => {
          const active = value === op
          return (
            <button
              key={op}
              type="button"
              disabled={readOnly}
              onClick={() => onChange(op)}
              className={classNames(
                'px-3 py-2 rounded-xl border text-sm transition',
                active
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-600',
                readOnly && 'opacity-70 cursor-not-allowed'
              )}
            >
              {op}
            </button>
          )
        })}
      </div>
    </div>
  )
}
