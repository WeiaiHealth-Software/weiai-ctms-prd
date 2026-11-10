import React from 'react'

type SectionCardProps = {
  title: string
  extra?: React.ReactNode
  children: React.ReactNode
  contentClassName?: string
}

export default function SectionCard({ title, extra, children, contentClassName = 'p-4' }: SectionCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {extra}
      </div>
      <div className={contentClassName}>{children}</div>
    </div>
  )
}
