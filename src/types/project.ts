import type { BuilderField } from './form-field'

export type ProjectStatus = '未配置' | '筹备中' | '进行中' | '已结束'

export type VisitInterval = '1M' | '3M' | '6M' | '12M'

export type FormConfig = {
  fields: BuilderField[]
}

export type Project = {
  id: string
  code: string
  name: string
  pi: string
  collabs?: string[]
  crcs?: string[]
  sponsor: string
  centers: string[]
  status: ProjectStatus
  enrolled: number
  targetEnrollment: number
  visitStages: number
  visitInterval: VisitInterval
  desc: string
  isConfigForm: boolean
  baselineForm?: FormConfig
  visitForm?: FormConfig
}
