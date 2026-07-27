export type ProjectStatus = '未配置' | '筹备中' | '进行中' | '已结束'

export type VisitInterval = '1M' | '3M' | '6M' | '12M'

export type Project = {
  id: string
  code: string
  name: string
  pi: string
  sponsor: string
  centers: string[]
  status: ProjectStatus
  enrolled: number
  targetEnrollment: number
  visitStages: number
  visitInterval: VisitInterval
  desc: string
}
