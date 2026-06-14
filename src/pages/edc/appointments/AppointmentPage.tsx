import { CalendarPlus, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useHeaderStore } from '../../../store/useHeaderStore'
import SectionCard from '../../../components/common/SectionCard'
import StatCard from '../../../modules/edc/dashboard/StatCard'
import AppointmentTable from '../../../modules/edc/appointments/components/AppointmentTable'
import AppointmentDrawer from '../../../modules/edc/appointments/drawers/AppointmentDrawer'
import { appointments } from '../../../data/edc/appointments'
import Select from '../../../components/form/Select'

const PAGE_SIZE = 8

const visitOptions = [
  { value: '基线', label: '基线' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '9M', label: '9M' },
  { value: '12M', label: '12M' }
]

export function AppointmentPage() {
  const setTitle = useHeaderStore(state => state.setTitle)
  const [open, setOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [visit, setVisit] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filters, setFilters] = useState({ keyword: '', visit: '', startDate: '', endDate: '' })
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setTitle('EDC 预约复查', '管理受试者的复查预约及随访进度', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' }
    ])
  }, [setTitle])

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const matchesKeyword =
        !filters.keyword.trim() ||
        item.subject.toLowerCase().includes(filters.keyword.trim().toLowerCase())

      const matchesVisit = !filters.visit || item.visit === filters.visit

      const dueDate = item.dueDate
      const matchesStartDate = !filters.startDate || dueDate >= filters.startDate
      const matchesEndDate = !filters.endDate || dueDate <= filters.endDate

      return matchesKeyword && matchesVisit && matchesStartDate && matchesEndDate
    })
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedAppointments = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
    return filteredAppointments.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filteredAppointments, safeCurrentPage])

  const stats = useMemo(() => {
    const today = new Date()
    const todayText = today.toISOString().slice(0, 10)
    const weekEnd = new Date(today)
    weekEnd.setDate(weekEnd.getDate() + 7)
    const weekEndText = weekEnd.toISOString().slice(0, 10)

    return {
      todayPending: appointments.filter((item) => item.dueDate === todayText && item.status !== '已到访').length,
      weekPending: appointments.filter(
        (item) => item.dueDate >= todayText && item.dueDate <= weekEndText && item.status !== '已到访'
      ).length,
      scheduled: appointments.filter((item) => item.status === '已预约').length,
      overdue: appointments.filter((item) => item.dueDate < todayText && item.status !== '已到访').length
    }
  }, [])

  const handleSearch = () => {
    setFilters({ keyword, visit, startDate, endDate })
    setCurrentPage(1)
  }

  const handleReset = () => {
    setKeyword('')
    setVisit('')
    setStartDate('')
    setEndDate('')
    setFilters({ keyword: '', visit: '', startDate: '', endDate: '' })
    setCurrentPage(1)
  }

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard title="今日待复查" value={String(stats.todayPending)} hint="建议优先联系和确认到访" />
          <StatCard title="本周待复查" value={String(stats.weekPending)} hint="按应访日期自动汇总" />
          <StatCard title="已预约" value={String(stats.scheduled)} hint="已确认具体到访时间" />
          <StatCard title="已逾期" value={String(stats.overdue)} hint="需跟进失访或补录处理" />
        </div>

        <SectionCard
          title="复查任务列表"
          contentClassName="p-0"
          extra={
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="请输入受试者姓名、编号"
                    className="h-10 w-64 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <Select
                  value={visit}
                  onChange={setVisit}
                  options={visitOptions}
                  placeholder="访视阶段"
                  className="w-32"
                  triggerClassName="h-10"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  重置
                </button>
                <button
                  type="button"
                  onClick={handleSearch}
                  className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
                >
                  搜索
                </button>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <button
                onClick={() => setOpen(true)}
                className="flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
              >
                <CalendarPlus className="h-4 w-4" />
                新建预约
              </button>
            </div>
          }
        >
          <AppointmentTable
            data={paginatedAppointments}
            onCreate={() => setOpen(true)}
            currentPage={safeCurrentPage}
            pageSize={PAGE_SIZE}
            total={filteredAppointments.length}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </SectionCard>
      </div>

      <AppointmentDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
