import React from 'react'

type SectionCardProps = {
  title: string
  extra?: React.ReactNode
  children: React.ReactNode
}

export default function SectionCard({ title, extra, children }: SectionCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {extra}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}
