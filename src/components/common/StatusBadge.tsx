import { classNames } from '../../lib/classNames'
import { statusClassMap } from '../../lib/statusMap'

type StatusBadgeProps = {
  status: string
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={classNames(
        'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
        statusClassMap[status] || 'bg-slate-100 text-slate-600 border border-slate-200',
        className
      )}
    >
      {status}
    </span>
  )
}
