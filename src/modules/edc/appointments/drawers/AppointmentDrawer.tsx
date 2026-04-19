import { useState } from 'react'
import Drawer from '../../../../components/overlay/Drawer'
import SectionCard from '../../../../components/common/SectionCard'
import InputBlock from '../../../../components/form/InputBlock'
import SelectBlock from '../../../../components/form/SelectBlock'

type AppointmentDrawerProps = {
  open: boolean
  onClose: () => void
}

export default function AppointmentDrawer({ open, onClose }: AppointmentDrawerProps) {
  const [form, setForm] = useState({
    subject: '',
    project: 'XW09',
    visit: '',
    dueDate: '',
    appointmentDate: '',
    period: '',
    contactResult: '',
    note: '',
  })

  return (
    <Drawer
      open={open}
      title="预约复查登记"
      subtitle="用于管理受试者到访安排"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
          >
            取消
          </button>
          <button className="h-10 px-4 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
            保存预约
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <SectionCard title="预约基础信息">
          <div className="grid grid-cols-2 gap-4">
            <InputBlock
              label="受试者"
              required
              value={form.subject}
              onChange={(value) => setForm((prev) => ({ ...prev, subject: value }))}
            />
            <SelectBlock
              label="所属项目"
              required
              value={form.project}
              onChange={(value) => setForm((prev) => ({ ...prev, project: value }))}
              options={['XW09', 'XW07', 'XW06']}
            />
            <SelectBlock
              label="访视节点"
              required
              value={form.visit}
              onChange={(value) => setForm((prev) => ({ ...prev, visit: value }))}
              options={['V0 基线期', 'V1 3M', 'V2 6M', 'V3 9M', 'V4 12M', '筛选复核']}
            />
            <InputBlock
              label="应访日期"
              required
              type="date"
              value={form.dueDate}
              onChange={(value) => setForm((prev) => ({ ...prev, dueDate: value }))}
            />
            <InputBlock
              label="预约日期"
              required
              type="date"
              value={form.appointmentDate}
              onChange={(value) => setForm((prev) => ({ ...prev, appointmentDate: value }))}
            />
            <SelectBlock
              label="预约时段"
              required
              value={form.period}
              onChange={(value) => setForm((prev) => ({ ...prev, period: value }))}
              options={['上午', '下午', '全天']}
            />
            <SelectBlock
              label="联系结果"
              required
              value={form.contactResult}
              onChange={(value) => setForm((prev) => ({ ...prev, contactResult: value }))}
              options={['已通知', '已确认', '无法联系', '患者改期', '患者取消']}
            />
            <InputBlock
              label="备注"
              value={form.note}
              onChange={(value) => setForm((prev) => ({ ...prev, note: value }))}
            />
          </div>
        </SectionCard>
      </div>
    </Drawer>
  )
}
