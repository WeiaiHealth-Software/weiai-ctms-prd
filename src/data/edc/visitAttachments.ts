import type { VisitAttachment } from '../../types/edc/attachment'

export const CHECK_TYPES = ['视力检查', '屈光检查', '眼轴检查', '眼压检查', '眼底照相', '角膜地形图', '其他']

const attachmentMap: Record<string, VisitAttachment[]> = {
  'P001-S001:v0': [
    {
      id: 'att-v0-1',
      subjectId: 'P001-S001',
      visitId: 'v0',
      fileName: 'WXY_V0_眼底照相_OD_OS.jpg',
      fileKind: 'image',
      fileSize: '2.4 MB',
      checkType: '眼底照相',
      uploadedBy: '徐蔚',
      uploadedAt: '2026-03-01 14:20',
      note: '双眼眼底照相，视盘边界清晰，未见明显异常。',
    },
    {
      id: 'att-v0-2',
      subjectId: 'P001-S001',
      visitId: 'v0',
      fileName: 'WXY_V0_眼轴测量报告.pdf',
      fileKind: 'pdf',
      fileSize: '486 KB',
      checkType: '眼轴检查',
      uploadedBy: '徐蔚',
      uploadedAt: '2026-03-01 14:25',
      note: 'IOL Master 测量，双眼各测 5 次取均值。',
    },
    {
      id: 'att-v0-3',
      subjectId: 'P001-S001',
      visitId: 'v0',
      fileName: 'WXY_V0_角膜地形图.jpg',
      fileKind: 'image',
      fileSize: '1.8 MB',
      checkType: '角膜地形图',
      uploadedBy: '徐蔚',
      uploadedAt: '2026-03-01 14:32',
    },
  ],
  'P001-S001:v1': [
    {
      id: 'att-v1-1',
      subjectId: 'P001-S001',
      visitId: 'v1',
      fileName: 'WXY_V1_眼轴复测报告.pdf',
      fileKind: 'pdf',
      fileSize: '512 KB',
      checkType: '眼轴检查',
      uploadedBy: '徐蔚',
      uploadedAt: '2026-06-03 10:10',
      note: '与基线对比，双眼眼轴增长约 0.18mm。',
    },
    {
      id: 'att-v1-2',
      subjectId: 'P001-S001',
      visitId: 'v1',
      fileName: 'WXY_V1_眼底照相.jpg',
      fileKind: 'image',
      fileSize: '2.1 MB',
      checkType: '眼底照相',
      uploadedBy: '徐蔚',
      uploadedAt: '2026-06-03 10:18',
    },
  ],
}

export function getAttachmentKey(subjectId: string, visitId: string): string {
  return `${subjectId}:${visitId}`
}

export function getVisitAttachments(subjectId: string, visitId: string): VisitAttachment[] {
  return attachmentMap[getAttachmentKey(subjectId, visitId)] ?? []
}

export function addVisitAttachment(attachment: VisitAttachment): void {
  const key = getAttachmentKey(attachment.subjectId, attachment.visitId)
  const list = attachmentMap[key] ?? []
  attachmentMap[key] = [attachment, ...list]
}

export function removeVisitAttachment(subjectId: string, visitId: string, attachmentId: string): void {
  const key = getAttachmentKey(subjectId, visitId)
  const list = attachmentMap[key] ?? []
  attachmentMap[key] = list.filter((item) => item.id !== attachmentId)
}
