export type ProjectStatus = '筹备中' | '进行中' | '已结束'

export type Project = {
  id: string
  code: string
  name: string
  pi: string
  sponsor: string
  centers: string[]
  status: ProjectStatus
  enrolled: number
  desc: string
}
