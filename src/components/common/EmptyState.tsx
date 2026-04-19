import React from 'react'

type EmptyStateProps = {
  title: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
      <div className="text-base font-semibold text-slate-800">{title}</div>
      {description && <div className="text-sm text-slate-400 mt-2">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
