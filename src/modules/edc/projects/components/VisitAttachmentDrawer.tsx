import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  BadgeAlert,
  CheckCircle2,
  Download,
  Eye,
  File as FileIcon,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Lightbulb,
  ScanLine,
  Paperclip,
  Trash2,
  Upload,
} from 'lucide-react'
import Drawer from '../../../../components/overlay/Drawer'
import { classNames } from '../../../../lib/classNames'
import {
  addVisitAttachment,
  getVisitAttachments,
  removeVisitAttachment,
} from '../../../../data/edc/visitAttachments'
import type { AttachmentFileKind, VisitAttachment } from '../../../../types/edc/attachment'

const CURRENT_USER = '徐蔚'
const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tif', 'tiff']
const ACCEPT_ATTR = '.png,.jpg,.jpeg,.gif,.bmp,.webp,.tif,.tiff,.pdf,application/pdf,image/*'

type VisitAttachmentDrawerProps = {
  open: boolean
  subjectId: string
  subjectInitials: string
  visitId: string
  visitName: string
  onClose: () => void
  onCountChange?: (count: number) => void
}

function resolveFileKind(fileName: string): AttachmentFileKind | null {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  if (IMAGE_EXTS.includes(ext)) return 'image'
  if (ext === 'pdf') return 'pdf'
  return null
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function formatUploadedAt(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function AttachmentKindIcon({ kind }: { kind: AttachmentFileKind }) {
  if (kind === 'image') return <ImageIcon className="w-4 h-4" />
  if (kind === 'pdf') return <FileText className="w-4 h-4" />
  return <FileIcon className="w-4 h-4" />
}

const kindStyleMap: Record<AttachmentFileKind, string> = {
  image: 'bg-emerald-50 text-emerald-600',
  pdf: 'bg-red-50 text-red-600',
  other: 'bg-slate-100 text-slate-500',
}

const guideNamingRows = [
  { label: '命名格式', value: '姓名_访视阶段_原文件名', sample: 'WXY_V1_眼科检查报告.pdf' },
  { label: '影像示例', value: '姓名_访视阶段_检查项目', sample: 'WXY_V0_眼底照相.jpg' },
]

const guideImageRules = [
  '照片请保持清晰、完整，避免反光、阴影或倾斜拍摄',
  '确保检查单四角完整入镜，关键数值区域可辨识',
  '建议使用原始影像或扫描件，避免二次压缩导致模糊',
  '多页报告请合并为一份 PDF，或按页命名后一并上传',
]

export default function VisitAttachmentDrawer({
  open,
  subjectId,
  subjectInitials,
  visitId,
  visitName,
  onClose,
  onCountChange,
}: VisitAttachmentDrawerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [attachments, setAttachments] = useState<VisitAttachment[]>([])
  const [activeAttachment, setActiveAttachment] = useState<VisitAttachment | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<VisitAttachment | null>(null)
  const [showGuide, setShowGuide] = useState(false)
  const [rejectedNames, setRejectedNames] = useState<string[]>([])

  const visitStageCode = useMemo(() => {
    const matched = visitName.match(/^V\d+/i)
    return matched?.[0]?.toUpperCase() || visitId.toUpperCase()
  }, [visitId, visitName])

  const refreshAttachments = () => {
    const next = getVisitAttachments(subjectId, visitId)
    setAttachments(next)
    onCountChange?.(next.length)
  }

  useEffect(() => {
    refreshAttachments()
    setActiveAttachment(null)
    setRejectedNames([])
    setPendingDelete(null)
  }, [subjectId, visitId])

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const rejected: string[] = []

    Array.from(files).forEach((file, index) => {
      const kind = resolveFileKind(file.name)
      if (!kind) {
        rejected.push(file.name)
        return
      }
      const renamedFileName = `${subjectInitials}_${visitStageCode}_${file.name}`
      addVisitAttachment({
        id: `att-local-${Date.now()}-${index}`,
        subjectId,
        visitId,
        fileName: renamedFileName,
        fileKind: kind,
        fileSize: formatFileSize(file.size),
        checkType: '其他',
        uploadedBy: CURRENT_USER,
        uploadedAt: formatUploadedAt(new Date()),
        objectUrl: URL.createObjectURL(file),
      })
    })

    setRejectedNames(rejected)
    refreshAttachments()
  }

  const confirmDelete = () => {
    if (!pendingDelete) return
    if (pendingDelete.objectUrl) {
      URL.revokeObjectURL(pendingDelete.objectUrl)
    }
    removeVisitAttachment(subjectId, visitId, pendingDelete.id)
    refreshAttachments()
    setActiveAttachment((prev) => (prev && prev.id === pendingDelete.id ? null : prev))
    setPendingDelete(null)
  }

  const handleDownload = (attachment: VisitAttachment) => {
    const href = attachment.objectUrl || URL.createObjectURL(
      new Blob(
        [
          `文件名: ${attachment.fileName}\n`,
          `受试者: ${subjectInitials}\n`,
          `访视: ${visitName}\n`,
          `检查类型: ${attachment.checkType}\n`,
          `上传人: ${attachment.uploadedBy}\n`,
          `上传时间: ${attachment.uploadedAt}\n`,
        ],
        { type: 'application/octet-stream' }
      )
    )
    const link = document.createElement('a')
    link.href = href
    link.download = attachment.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    if (!attachment.objectUrl) {
      URL.revokeObjectURL(href)
    }
  }

  const canPreview = useMemo(() => {
    if (!activeAttachment) return false
    return activeAttachment.fileKind === 'image' || activeAttachment.fileKind === 'pdf'
  }, [activeAttachment])

  const drawerTitle = activeAttachment ? activeAttachment.fileName : `${visitName} 检查单`
  const drawerSubtitle = activeAttachment
    ? `${visitName} · ${activeAttachment.uploadedAt} · ${activeAttachment.uploadedBy}`
    : attachments.length > 0
      ? `当前访视已留存 ${attachments.length} 份检查单`
      : '当前访视暂未上传检查单'

  return (
    <>
      <Drawer
        open={open}
        title={drawerTitle}
        subtitle={drawerSubtitle}
        onClose={onClose}
        width={760}
        footer={
          activeAttachment ? (
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-400">检查单为原始数据留痕，删除后不可恢复</div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownload(activeAttachment)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Download className="w-4 h-4" />
                  下载
                </button>
                <button
                  onClick={() => setPendingDelete(activeAttachment)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  删除
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-amber-200 bg-amber-50 px-3 text-sm font-medium text-amber-700">
                  <BadgeAlert className="w-4 h-4" />
                  仅支持图片（JPG / PNG / TIFF 等）与 PDF
                </div>
                <button
                  onClick={() => setShowGuide(true)}
                  className="inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <HelpCircle className="w-4 h-4" />
                  查看上传示例
                </button>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Upload className="w-4 h-4" />
                上传检查单
              </button>
            </div>
          )
        }
      >
        {activeAttachment ? (
          <div className="space-y-5">
            <button
              onClick={() => setActiveAttachment(null)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              返回检查单列表
            </button>

            {canPreview ? (
              activeAttachment.objectUrl ? (
                <div className="flex justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {activeAttachment.fileKind === 'image' ? (
                    <img
                      src={activeAttachment.objectUrl}
                      alt={activeAttachment.fileName}
                      className="max-h-[520px] w-auto rounded-lg border border-slate-200 bg-white object-contain"
                    />
                  ) : (
                    <iframe
                      src={activeAttachment.objectUrl}
                      title={activeAttachment.fileName}
                      className="h-[520px] w-full rounded-lg border border-slate-200 bg-white"
                    />
                  )}
                </div>
              ) : (
                <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <div className="w-full max-w-[560px] rounded-lg border border-slate-200 bg-white px-8 py-7 shadow-sm">
                    <div className="border-b border-slate-200 pb-3 text-center">
                      <div className="text-[15px] font-semibold tracking-wide text-slate-800">
                        上海市眼病防治中心 · 眼科检查报告
                      </div>
                      <div className="mt-1 text-[11px] text-slate-400">Ophthalmic Examination Report</div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-y-2 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400">受试者</span>
                        <div className="mt-0.5 font-medium text-slate-700">{subjectInitials}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">检查类型</span>
                        <div className="mt-0.5 font-medium text-slate-700">{activeAttachment.checkType}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">检查日期</span>
                        <div className="mt-0.5 font-medium text-slate-700">{activeAttachment.uploadedAt.slice(0, 10)}</div>
                      </div>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium">检查项目</th>
                            <th className="px-3 py-2 text-left font-medium">OD（右眼）</th>
                            <th className="px-3 py-2 text-left font-medium">OS（左眼）</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-600">
                          <tr className="border-t border-slate-100">
                            <td className="px-3 py-2">裸眼视力 UCVA</td>
                            <td className="px-3 py-2 font-medium text-slate-700">4.6</td>
                            <td className="px-3 py-2 font-medium text-slate-700">4.7</td>
                          </tr>
                          <tr className="border-t border-slate-100">
                            <td className="px-3 py-2">最佳矫正视力 BCVA</td>
                            <td className="px-3 py-2 font-medium text-slate-700">5.0</td>
                            <td className="px-3 py-2 font-medium text-slate-700">5.0</td>
                          </tr>
                          <tr className="border-t border-slate-100">
                            <td className="px-3 py-2">等效球镜 SE(D)</td>
                            <td className="px-3 py-2 font-medium text-slate-700">-1.25</td>
                            <td className="px-3 py-2 font-medium text-slate-700">-1.50</td>
                          </tr>
                          <tr className="border-t border-slate-100">
                            <td className="px-3 py-2">眼轴 AL(mm)</td>
                            <td className="px-3 py-2 font-medium text-slate-700">24.12</td>
                            <td className="px-3 py-2 font-medium text-slate-700">24.05</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-5 flex items-end justify-between text-xs text-slate-500">
                      <div>
                        <span className="text-slate-400">检查者</span>
                        <div className="mt-0.5 font-medium text-slate-700">{activeAttachment.uploadedBy}</div>
                      </div>
                      <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-600">
                        {activeAttachment.fileKind === 'image' ? <ImageIcon className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                        {activeAttachment.fileKind === 'image' ? '影像原件预览' : 'PDF 原件预览'}
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="mt-4 text-sm font-medium text-slate-700">该文件类型暂不支持在线预览</div>
                <div className="mt-1 text-xs text-slate-400">请下载后使用本地工具查看</div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-800">文件信息</div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 px-5 py-4">
                <div>
                  <div className="text-xs text-slate-400">所属访视</div>
                  <div className="mt-1 text-sm font-medium text-slate-700">{visitName}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">检查类型</div>
                  <div className="mt-1 text-sm font-medium text-slate-700">{activeAttachment.checkType}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">上传人</div>
                  <div className="mt-1 text-sm font-medium text-slate-700">{activeAttachment.uploadedBy}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">上传时间</div>
                  <div className="mt-1 text-sm font-medium text-slate-700">{activeAttachment.uploadedAt}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">文件大小</div>
                  <div className="mt-1 text-sm font-medium text-slate-700">{activeAttachment.fileSize}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-slate-400">备注</div>
                  <div className="mt-1 text-sm text-slate-700">{activeAttachment.note || '——'}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              <AlertCircle className="mt-0.5 w-3.5 h-3.5 shrink-0" />
              <span>建议上传本次访视的检查单以便留痕，仅支持图片与 PDF，未上传不影响访视提交。</span>
            </div>

            {rejectedNames.length > 0 && (
              <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
                <AlertTriangle className="mt-0.5 w-3.5 h-3.5 shrink-0" />
                <span>
                  以下文件格式不支持，已跳过：{rejectedNames.join('、')}。当前仅支持图片与 PDF。
                </span>
              </div>
            )}

            {attachments.length > 0 ? (
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="group flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 transition-colors hover:border-blue-200 hover:bg-blue-50/40"
                  >
                    <div
                      className={classNames(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                        kindStyleMap[attachment.fileKind]
                      )}
                    >
                      <AttachmentKindIcon kind={attachment.fileKind} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <button
                        onClick={() => setActiveAttachment(attachment)}
                        className="truncate text-left text-sm font-medium text-slate-800 hover:text-blue-700"
                      >
                        {attachment.fileName}
                      </button>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">
                          {attachment.checkType}
                        </span>
                        <span>{attachment.uploadedBy}</span>
                        <span>·</span>
                        <span>{attachment.uploadedAt}</span>
                        <span>·</span>
                        <span>{attachment.fileSize}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveAttachment(attachment)}
                      className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <Eye className="w-4 h-4" />
                      查看
                    </button>
                    <button
                      onClick={() => handleDownload(attachment)}
                      className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <Download className="w-4 h-4" />
                      下载
                    </button>
                    <button
                      onClick={() => setPendingDelete(attachment)}
                      className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      删除
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault()
                  setDragActive(true)
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(event) => {
                  event.preventDefault()
                  setDragActive(false)
                  handleFiles(event.dataTransfer.files)
                }}
                className={classNames(
                  'flex flex-col items-center justify-center rounded-2xl border px-6 py-10 text-center',
                  dragActive
                    ? 'cursor-pointer border-blue-400 bg-blue-50'
                    : 'cursor-pointer border-dashed border-slate-300 bg-slate-50 hover:border-blue-300'
                )}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                  <Paperclip className="w-6 h-6" />
                </div>
                <div className="mt-4 text-sm font-medium text-slate-700">上传本次访视检查单</div>
                <div className="mt-1 text-xs text-slate-400">点击选择文件，或将检查单拖拽到此处上传。</div>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700">
                  <BadgeAlert className="w-3.5 h-3.5" />
                  仅支持图片与 PDF 格式
                </div>
                <button
                  onClick={(event) => {
                    event.stopPropagation()
                    setShowGuide(true)
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  查看上传示例
                </button>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files)
          event.target.value = ''
        }}
      />

      {pendingDelete && typeof document !== 'undefined'
        ? createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
              <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
                <div className="p-6 sm:p-8">
                  <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="mb-2 text-center text-xl font-bold text-slate-800">确认删除该检查单？</h3>
                  <p className="mb-6 text-center text-sm leading-relaxed text-slate-500">
                    删除后该文件将从本次访视留痕中移除，
                    <span className="font-bold text-red-600">操作不可恢复</span>。
                  </p>

                  <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={classNames(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                          kindStyleMap[pendingDelete.fileKind]
                        )}
                      >
                        <AttachmentKindIcon kind={pendingDelete.fileKind} />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-slate-700">{pendingDelete.fileName}</div>
                        <div className="mt-0.5 text-xs text-slate-400">
                          {pendingDelete.checkType} · {pendingDelete.fileSize} · {pendingDelete.uploadedAt}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setPendingDelete(null)}
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      再想想
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 font-bold text-white shadow-lg shadow-red-500/30 transition-all hover:bg-red-700 active:scale-95"
                    >
                      确认删除
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      {showGuide && typeof document !== 'undefined'
        ? createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
              <div className="max-h-[86vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                  <div>
                    <div className="text-lg font-bold text-slate-900">检查单上传要求</div>
                    <div className="mt-1 text-sm text-slate-500">按规范上传，可保证留痕资料可追溯、可辨识</div>
                  </div>
                  <button
                    onClick={() => setShowGuide(false)}
                    className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
                  >
                    关闭
                  </button>
                </div>

                <div className="max-h-[62vh] space-y-5 overflow-auto px-6 py-5">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <FileText className="h-4 w-4 text-blue-600" />
                      一、文件命名
                    </div>
                    <div className="overflow-hidden rounded-xl border border-slate-200">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-xs text-slate-500">
                          <tr>
                            <th className="px-4 py-2.5 text-left font-medium">项目</th>
                            <th className="px-4 py-2.5 text-left font-medium">规则</th>
                            <th className="px-4 py-2.5 text-left font-medium">示例</th>
                          </tr>
                        </thead>
                        <tbody>
                          {guideNamingRows.map((row) => (
                            <tr key={row.label} className="border-t border-slate-100">
                              <td className="px-4 py-2.5 text-slate-500">{row.label}</td>
                              <td className="px-4 py-2.5 text-slate-600">{row.value}</td>
                              <td className="px-4 py-2.5">
                                <span className="rounded-md bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
                                  {row.sample}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2 flex items-start gap-2 text-xs text-slate-500">
                      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                      <span>上传时系统会自动加上「姓名_访视阶段_」前缀，你只需保留原始文件名即可。</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <ImageIcon className="h-4 w-4 text-emerald-600" />
                        二、图片拍摄要求
                      </div>
                      <ul className="space-y-2">
                        {guideImageRules.map((rule) => (
                          <li key={rule} className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <ScanLine className="h-4 w-4 text-blue-600" />
                        三、上传图片示例
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
                          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            推荐
                          </div>
                          <div className="overflow-hidden rounded-lg border border-emerald-200 bg-white p-2">
                            <div className="rounded-md border border-slate-200 bg-slate-50 p-2 shadow-sm">
                              <div className="mb-2 h-2.5 w-24 rounded bg-slate-300" />
                              <div className="space-y-1.5">
                                <div className="h-2 rounded bg-slate-200" />
                                <div className="h-2 rounded bg-slate-200" />
                                <div className="h-2 w-4/5 rounded bg-slate-200" />
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                <div className="h-14 rounded border border-emerald-200 bg-emerald-50" />
                                <div className="h-14 rounded border border-emerald-200 bg-emerald-50" />
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-xs leading-relaxed text-emerald-700">
                            画面端正、四角完整、内容清晰可辨识
                          </div>
                        </div>

                        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3">
                          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-rose-700">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            不推荐
                          </div>
                          <div className="overflow-hidden rounded-lg border border-rose-200 bg-white p-2">
                            <div className="rotate-[-8deg] rounded-md border border-slate-200 bg-slate-50 p-2 opacity-80 shadow-sm">
                              <div className="mb-2 h-2.5 w-20 rounded bg-slate-300" />
                              <div className="space-y-1.5">
                                <div className="h-2 rounded bg-slate-200" />
                                <div className="h-2 w-2/3 rounded bg-slate-200" />
                              </div>
                              <div className="mt-3 h-16 rounded bg-gradient-to-br from-slate-200 to-white" />
                            </div>
                          </div>
                          <div className="mt-2 text-xs leading-relaxed text-rose-700">
                            倾斜、反光、缺角或模糊，容易影响留痕质量
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
                        示例用于说明拍摄质量要求，实际上传时优先使用扫描件或原始导出的 PDF。
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-100 px-6 py-4">
                  <button
                    onClick={() => setShowGuide(false)}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    我知道了
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  )
}
