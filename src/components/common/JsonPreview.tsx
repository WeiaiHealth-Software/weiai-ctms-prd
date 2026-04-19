type JsonPreviewProps = {
  title?: string
  data: unknown
  className?: string
}

export default function JsonPreview({ title, data, className }: JsonPreviewProps) {
  return (
    <div className={className}>
      {title && <div className="text-sm font-semibold text-slate-800 mb-3">{title}</div>}
      <pre className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-auto max-h-96">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
