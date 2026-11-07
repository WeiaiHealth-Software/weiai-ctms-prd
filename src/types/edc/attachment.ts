export type AttachmentFileKind = 'image' | 'pdf' | 'other'

export type VisitAttachment = {
  id: string
  subjectId: string
  visitId: string
  fileName: string
  fileKind: AttachmentFileKind
  fileSize: string
  checkType: string
  uploadedBy: string
  uploadedAt: string
  note?: string
  objectUrl?: string
}
