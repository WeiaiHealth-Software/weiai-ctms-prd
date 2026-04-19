import type { Appointment } from '../types/appointment'

export const appointments: Appointment[] = [
  {
    id: 'A001',
    subject: 'ZSM / S-P001-001',
    project: 'XW09',
    visit: 'V2 6M',
    dueDate: '2026-09-01',
    appointmentDate: '2026-08-30 09:00',
    center: '上海市眼病防治中心',
    contactStatus: '已通知',
    status: '已预约',
  },
  {
    id: 'A002',
    subject: 'LJH / S-P001-002',
    project: 'XW09',
    visit: 'V1 3M',
    dueDate: '2026-03-28',
    appointmentDate: '',
    center: '上海市眼病防治中心',
    contactStatus: '待联系',
    status: '待预约',
  },
  {
    id: 'A003',
    subject: 'CQ / S-P001-004',
    project: 'XW09',
    visit: '筛选复核',
    dueDate: '2026-03-24',
    appointmentDate: '2026-03-24 14:00',
    center: '上海市眼病防治中心',
    contactStatus: '已确认',
    status: '已到访',
  },
]
