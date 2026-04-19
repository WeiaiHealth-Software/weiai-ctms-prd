export type Template = {
  id: string
  name: string
  description: string
  type: string
  version: string
  fields: number
  createdBy: string
  createdAt: string
  updatedAt: string
  status: string
  sections: { title: string; items: string[] }[]
}
