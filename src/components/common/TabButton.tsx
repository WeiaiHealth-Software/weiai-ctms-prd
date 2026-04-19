import React from 'react'
import { classNames } from '../../lib/classNames'

type TabButtonProps = {
  active?: boolean
  children: React.ReactNode
  onClick: () => void
}

export default function TabButton({ active, children, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        'px-4 py-2 rounded-xl text-sm font-medium transition',
        active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      )}
    >
      {children}
    </button>
  )
}
