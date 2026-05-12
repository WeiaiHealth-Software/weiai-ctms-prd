import Select from './Select';

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
      <Select
        value={value || ''}
        onChange={(v) => onChange?.(v)}
        placeholder="请选择"
        options={options.map(op => ({ value: op, label: op }))}
      />
    </div>
  )
}
