import type { Appointment } from '../../../../types/appointment'
import { classNames } from '../../../../lib/classNames'

type AppointmentTableProps = {
  data: Appointment[]
  onCreate?: () => void
  currentPage: number
  pageSize: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
}

const reviewStatusClassMap: Record<string, string> = {
  待预约: 'bg-amber-50 text-amber-700',
  已预约: 'bg-blue-50 text-blue-700',
  已到访: 'bg-green-50 text-green-700'
}

export default function AppointmentTable({
  data,
  onCreate,
  currentPage,
  pageSize,
  total,
  totalPages,
  onPageChange
}: AppointmentTableProps) {
  return (
    <div className="overflow-hidden rounded-b-2xl">
      <div className="overflow-x-auto">
        <table className="min-w-[1240px] w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 text-left font-medium whitespace-nowrap">受试者</th>
              <th className="px-6 py-4 text-left font-medium whitespace-nowrap">项目</th>
              <th className="px-6 py-4 text-left font-medium whitespace-nowrap">访视</th>
              <th className="px-6 py-4 text-left font-medium whitespace-nowrap">应访日期</th>
              <th className="px-6 py-4 text-left font-medium whitespace-nowrap">预约日期</th>
              <th className="px-6 py-4 text-left font-medium whitespace-nowrap">中心</th>
              <th className="px-6 py-4 text-left font-medium whitespace-nowrap">联系状态</th>
              <th className="px-6 py-4 text-left font-medium whitespace-nowrap">复查状态</th>
              <th className="px-6 py-4 text-right font-medium whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50/80">
                  <td className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap">{item.subject}</td>
                  <td className="px-6 py-4 text-slate-600">{item.project}</td>
                  <td className="px-6 py-4 text-slate-600">{item.visit}</td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{item.dueDate}</td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{item.appointmentDate || '--'}</td>
                  <td className="px-6 py-4 text-slate-600">{item.center}</td>
                  <td className="px-6 py-4 text-slate-600">{item.contactStatus}</td>
                  <td className="px-6 py-4">
                    <span
                      className={classNames(
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                        reviewStatusClassMap[item.status] ?? 'bg-slate-50 text-slate-600'
                      )}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={onCreate} className="text-blue-600 hover:text-blue-800">
                      预约登记
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                  暂无匹配的复查任务
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {total > 0 && (
        <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
          <div className="text-sm text-slate-500">
            显示第 {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, total)} 条，共 {total} 条
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              上一页
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => onPageChange(pageNumber)}
                  className={classNames(
                    'h-9 min-w-9 rounded-lg border px-3 text-sm',
                    currentPage === pageNumber
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {pageNumber}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
