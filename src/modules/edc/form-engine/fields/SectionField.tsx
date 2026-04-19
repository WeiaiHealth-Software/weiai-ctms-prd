type SectionFieldProps = {
  title: string
}

export default function SectionField({ title }: SectionFieldProps) {
  return (
    <div className="pt-2">
      <div className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-200">
        {title}
      </div>
    </div>
  )
}
