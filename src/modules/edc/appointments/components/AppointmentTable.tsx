import type { Appointment } from '../../../../types/appointment'
import { classNames } from '../../../../lib/classNames'
import { statusClassMap } from '../../../../lib/statusMap'

type AppointmentTableProps = {
  data: Appointment[]
  onCreate?: () => void
}

export default function AppointmentTable({ data, onCreate }: AppointmentTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="text-left px-4 py-3 font-medium">受试者</th>
            <th className="text-left px-4 py-3 font-medium">项目</th>
            <th className="text-left px-4 py-3 font-medium">访视</th>
            <th className="text-left px-4 py-3 font-medium">应访日期</th>
            <th className="text-left px-4 py-3 font-medium">预约日期</th>
            <th className="text-left px-4 py-3 font-medium">中心</th>
            <th className="text-left px-4 py-3 font-medium">联系状态</th>
            <th className="text-left px-4 py-3 font-medium">复查状态</th>
            <th className="text-right px-4 py-3 font-medium">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/80">
              <td className="px-4 py-4 font-medium text-slate-800">{item.subject}</td>
              <td className="px-4 py-4 text-slate-600">{item.project}</td>
              <td className="px-4 py-4 text-slate-600">{item.visit}</td>
              <td className="px-4 py-4 text-slate-600">{item.dueDate}</td>
              <td className="px-4 py-4 text-slate-600">{item.appointmentDate || '--'}</td>
              <td className="px-4 py-4 text-slate-600">{item.center}</td>
              <td className="px-4 py-4 text-slate-600">{item.contactStatus}</td>
              <td className="px-4 py-4">
                <span className={classNames('px-2.5 py-1 rounded-full text-xs font-medium', statusClassMap[item.status])}>
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <button onClick={onCreate} className="text-blue-600 hover:text-blue-800">
                  预约登记
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
