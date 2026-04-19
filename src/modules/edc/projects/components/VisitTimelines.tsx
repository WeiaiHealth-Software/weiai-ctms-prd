import { classNames } from '../../../lib/classNames'

export type VisitItem = {
  id: string
  name: string
  planDate: string
  actualDate?: string
  status: string
}

type VisitTimelineProps = {
  visits: VisitItem[]
  selectedVisitId: string
  onSelect: (visitId: string) => void
}

const statusClassMap: Record<string, string> = {
  '已完成': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  '已预约': 'bg-blue-50 text-blue-600 border-blue-200',
  '未开始': 'bg-slate-50 text-slate-500 border-slate-200',
  '逾期': 'bg-red-50 text-red-600 border-red-200',
}

export default function VisitTimeline({
  visits,
  selectedVisitId,
  onSelect,
}: VisitTimelineProps) {
  return (
    <div className="relative pb-4">
      {/* 垂直参考线 */}
      <div className="absolute top-4 bottom-4 left-[1.375rem] w-[2px] bg-slate-200"></div>

      <div className="space-y-3 relative">
        {visits.map((visit) => {
            const active = selectedVisitId === visit.id
            const statusStyle = statusClassMap[visit.status] || 'bg-slate-50 text-slate-500 border-slate-200'

            return (
              <button
                key={visit.id}
                onClick={() => onSelect(visit.id)}
                className={classNames(
                  "flex items-start gap-4 w-full text-left group p-3 rounded-xl transition-all",
                  active ? "bg-blue-50/50" : "hover:bg-slate-50"
                )}
              >
                <div className="relative flex items-center justify-center w-4 h-4 z-10 bg-white mt-1 shrink-0">
                  {active ? (
                    <div className="w-4 h-4 rounded-full border-2 border-blue-600 bg-white flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 bg-white group-hover:border-blue-400"></div>
                  )}
                </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className={classNames(
                    'font-medium text-[15px] transition',
                    active ? 'text-blue-700' : 'text-slate-800 group-hover:text-blue-600'
                  )}>
                    {visit.name}
                  </div>
                  <span className={classNames('px-2 py-0.5 rounded-full text-[11px] border', statusStyle)}>
                    {visit.status}
                  </span>
                </div>
                
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center text-xs">
                    <span className="text-slate-400 w-[60px]">计划日期:</span>
                    <span className="text-slate-600 font-medium">{visit.planDate || '--'}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="text-slate-400 w-[60px]">实际日期:</span>
                    <span className="text-slate-600 font-medium">{visit.actualDate || '--'}</span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
