import { useState } from 'react'
import Drawer from '../../../../components/overlay/Drawer'
import SectionCard from '../../../../components/common/SectionCard'
import InputBlock from '../../../../components/form/InputBlock'
import SelectBlock from '../../../../components/form/SelectBlock'
import type { Project } from '../../../../types/project'

type SubjectDrawerProps = {
  open: boolean
  onClose: () => void
  project: Project | null
}

export default function SubjectDrawer({ open, onClose, project }: SubjectDrawerProps) {
  const [form, setForm] = useState({
    source: '门诊',
    center: project?.centers[0] || '上海市眼病防治中心',
    initials: '',
    screeningNo: '',
    randomNo: '',
    group: '',
    startDate: '',
    endDate: '',
    recorder: '',
  })

  return (
    <Drawer
      open={open}
      title="新增受试者"
      subtitle={project ? `当前项目：${project.name}` : '请填写受试者信息'}
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
            保存受试者
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <SectionCard title="受试者基础信息">
          <div className="grid grid-cols-2 gap-4">
            <SelectBlock
              label="受试者来源"
              required
              value={form.source}
              onChange={(value) => setForm((prev) => ({ ...prev, source: value }))}
              options={['门诊', '招募']}
            />
            <SelectBlock
              label="所属中心"
              required
              value={form.center}
              onChange={(value) => setForm((prev) => ({ ...prev, center: value }))}
              options={project?.centers || ['上海市眼病防治中心']}
            />
            <InputBlock
              label="姓名缩写"
              required
              value={form.initials}
              onChange={(value) => setForm((prev) => ({ ...prev, initials: value }))}
            />
            <InputBlock
              label="筛选号"
              required
              value={form.screeningNo}
              onChange={(value) => setForm((prev) => ({ ...prev, screeningNo: value }))}
            />
            <InputBlock
              label="随机号"
              required
              value={form.randomNo}
              onChange={(value) => setForm((prev) => ({ ...prev, randomNo: value }))}
            />
            <SelectBlock
              label="研究组别"
              value={form.group}
              onChange={(value) => setForm((prev) => ({ ...prev, group: value }))}
              options={['试验组1', '试验组2', '对照组']}
            />
            <InputBlock
              label="研究开始日期"
              type="date"
              value={form.startDate}
              onChange={(value) => setForm((prev) => ({ ...prev, startDate: value }))}
            />
            <InputBlock
              label="随访结束日期"
              type="date"
              value={form.endDate}
              onChange={(value) => setForm((prev) => ({ ...prev, endDate: value }))}
            />
            <div className="col-span-2">
              <InputBlock
                label="记录者"
                required
                value={form.recorder}
                onChange={(value) => setForm((prev) => ({ ...prev, recorder: value }))}
              />
            </div>
          </div>
        </SectionCard>
      </div>
    </Drawer>
  )
}
