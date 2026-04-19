import React from 'react'
import { X } from 'lucide-react'

type DrawerProps = {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  width?: number | string
}

export default function Drawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  width = 720
}: DrawerProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/35" onClick={onClose} />
      <div 
        className="relative h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col"
        style={{ width: typeof width === 'number' ? `${width}px` : width, maxWidth: '100vw' }}
      >
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-slate-900">{title}</div>
            {subtitle && <div className="text-sm text-slate-500 mt-1">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">{children}</div>

        {footer && <div className="px-6 py-4 border-t border-slate-200 bg-white">{footer}</div>}
      </div>
    </div>
  )
}
