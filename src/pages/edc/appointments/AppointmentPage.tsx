import { CalendarPlus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useHeaderStore } from '../../../store/useHeaderStore'
import SectionCard from '../../../components/common/SectionCard'
import StatCard from '../../../modules/edc/dashboard/StatCard'
import AppointmentTable from '../../../modules/edc/appointments/components/AppointmentTable'
import AppointmentDrawer from '../../../modules/edc/appointments/drawers/AppointmentDrawer'
import { appointments } from '../../../data/edc/appointments'

export function AppointmentPage() {
  const setTitle = useHeaderStore(state => state.setTitle)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setTitle('EDC 预约复查', '管理受试者的复查预约及随访进度', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' }
    ])
  }, [setTitle])

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard title="今日待复查" value="3" hint="建议优先联系和确认到访" />
          <StatCard title="本周待复查" value="8" hint="按应访日期自动汇总" />
          <StatCard title="已预约" value="5" hint="已确认具体到访时间" />
          <StatCard title="已逾期" value="1" hint="需跟进失访或补录处理" />
        </div>

        <SectionCard
          title="复查任务列表"
          extra={
            <button
              onClick={() => setOpen(true)}
              className="h-10 px-4 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <CalendarPlus className="w-4 h-4" />
              新建预约
            </button>
          }
        >
          <AppointmentTable data={appointments} onCreate={() => setOpen(true)} />
        </SectionCard>
      </div>

      <AppointmentDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
