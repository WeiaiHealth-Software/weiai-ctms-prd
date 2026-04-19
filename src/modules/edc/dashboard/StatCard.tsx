import { classNames } from '../../../lib/classNames'

type StatCardProps = {
  title: string
  value: string
  hint: string
  className?: string
  titleClassName?: string
  valueClassName?: string
  hintClassName?: string
}

export default function StatCard({
  title,
  value,
  hint,
  className,
  titleClassName,
  valueClassName,
  hintClassName,
}: StatCardProps) {
  return (
    <div className={classNames('rounded-2xl border border-slate-200 bg-white p-5 shadow-sm', className)}>
      <div className={classNames('mb-2 text-sm text-slate-500', titleClassName)}>{title}</div>
      <div className={classNames('text-2xl font-bold text-slate-900', valueClassName)}>{value}</div>
      <div className={classNames('mt-2 text-xs text-slate-400', hintClassName)}>{hint}</div>
    </div>
  )
}
