export type SubjectStatus = '筛选中' | '已入组' | '随访中' | '已完成' | '提前退出'

export type Subject = {
  id: string
  screeningNo: string
  randomNo: string
  initials: string
  source: string
  center: string
  status: SubjectStatus
  currentVisit: string
  nextVisitDate: string
  enrollDate: string
}
