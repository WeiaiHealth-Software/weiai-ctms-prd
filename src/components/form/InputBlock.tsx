type InputBlockProps = {
  label: string
  placeholder?: string
  required?: boolean
  value?: string
  onChange?: (value: string) => void
  type?: string
}

export default function InputBlock({
  label,
  placeholder,
  required,
  value,
  onChange,
  type = 'text',
}: InputBlockProps) {
  return (
    <div>
      <label className="block text-sm text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 bg-white"
      />
    </div>
  )
}
