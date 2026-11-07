import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  Download,
  Eye,
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  Paperclip,
  Trash2,
  Upload,
} from 'lucide-react'
import { classNames } from '../../../../lib/classNames'
import {
  addVisitAttachment,
  getVisitAttachments,
  removeVisitAttachment,
} from '../../../../data/edc/visitAttachments'
import type { AttachmentFileKind, VisitAttachment } from '../../../../types/edc/attachment'
import AttachmentDetailDrawer from './AttachmentDetailDrawer'

const CURRENT_USER = '徐蔚'

type VisitAttachmentSectionProps = {
  subjectId: string
  visitId: string
  visitName: string
  readOnly: boolean
}

const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tif', 'tiff']

function resolveFileKind(fileName: string): AttachmentFileKind {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  if (IMAGE_EXTS.includes(ext)) return 'image'
  if (ext === 'pdf') return 'pdf'
  return 'other'
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function formatUploadedAt(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const kindStyleMap: Record<AttachmentFileKind, { box: string; icon: string }> = {
  image: { box: 'bg-emerald-50 text-emerald-600', icon: 'image' },
  pdf: { box: 'bg-red-50 text-red-600', icon: 'pdf' },
  other: { box: 'bg-slate-100 text-slate-500', icon: 'other' },
}

function AttachmentKindIcon({ kind }: { kind: AttachmentFileKind }) {
  if (kind === 'image') return <ImageIcon className="w-4 h-4" />
  if (kind === 'pdf') return <FileText className="w-4 h-4" />
  return <FileIcon className="w-4 h-4" />
}

export default function VisitAttachmentSection({
  subjectId,
  visitId,
  visitName,
  readOnly,
}: VisitAttachmentSectionProps) {
  const [attachments, setAttachments] = useState<VisitAttachment[]>([])
  const [activeAttachment, setActiveAttachment] = useState<VisitAttachment | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setAttachments(getVisitAttachments(subjectId, visitId))
    setActiveAttachment(null)
  }, [subjectId, visitId])

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const created: VisitAttachment[] = Array.from(files).map((file, index) => ({
      id: `att-local-${Date.now()}-${index}`,
      subjectId,
      visitId,
      fileName: file.name,
      fileKind: resolveFileKind(file.name),
      fileSize: formatFileSize(file.size),
      checkType: '其他',
      uploadedBy: CURRENT_USER,
      uploadedAt: formatUploadedAt(new Date()),
    }))
    created.forEach((item) => addVisitAttachment(item))
    setAttachments(getVisitAttachments(subjectId, visitId))
  }

  const handleDelete = (attachmentId: string) => {
    removeVisitAttachment(subjectId, visitId, attachmentId)
    setAttachments(getVisitAttachments(subjectId, visitId))
    setActiveAttachment(null)
  }

  const openDetail = (attachment: VisitAttachment) => setActiveAttachment(attachment)

  return (
    <div id="field-attachment" className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <Paperclip className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-semibold text-slate-800">检查单留存</h3>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
          {attachments.length} 份
        </span>
        <div className="flex-1" />
        {!readOnly && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-blue-600 px-3.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Upload className="w-4 h-4" />
            上传检查单
          </button>
        )}
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <AlertCircle className="mt-0.5 w-3.5 h-3.5 shrink-0" />
          <span>建议上传本次访视的检查单（纸质报告、影像、PDF 等）以便留痕，未上传不影响访视提交。</span>
        </div>

        {attachments.length > 0 && (
          <div className="space-y-2">
            {attachments.map((attachment) => {
              const style = kindStyleMap[attachment.fileKind]
              return (
                <div
                  key={attachment.id}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 transition-colors hover:border-blue-200 hover:bg-blue-50/40"
                >
                  <div
                    className={classNames(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                      style.box
                    )}
                  >
                    <AttachmentKindIcon kind={attachment.fileKind} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDetail(attachment)}
                        className="truncate text-sm font-medium text-slate-800 hover:text-blue-700"
                      >
                        {attachment.fileName}
                      </button>
                      <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">
                        {attachment.checkType}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                      <span>{attachment.uploadedBy}</span>
                      <span>·</span>
                      <span>{attachment.uploadedAt}</span>
                      <span>·</span>
                      <span>{attachment.fileSize}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      title="查看"
                      onClick={() => openDetail(attachment)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      title="下载"
                      className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {!readOnly && (
                      <button
                        title="删除"
                        onClick={() => handleDelete(attachment.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!readOnly && (
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
              'flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-6 text-center transition-colors',
              dragActive ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:border-blue-300'
            )}
          >
            <Upload className={classNames('w-5 h-5', dragActive ? 'text-blue-600' : 'text-slate-400')} />
            <div className="mt-2 text-xs text-slate-500">点击选择文件，或将检查单拖拽到此处上传</div>
            <div className="mt-1 text-[11px] text-slate-400">支持 JPG / PNG / PDF 等格式，可一次选择多份</div>
          </div>
        )}

        {readOnly && attachments.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
            <Paperclip className="w-5 h-5 text-slate-300" />
            <div className="mt-2 text-xs text-slate-400">本次访视暂未上传检查单</div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files)
          event.target.value = ''
        }}
      />

      <AttachmentDetailDrawer
        open={!!activeAttachment}
        attachment={activeAttachment}
        visitName={visitName}
        readOnly={readOnly}
        onClose={() => setActiveAttachment(null)}
        onDelete={handleDelete}
      />
    </div>
  )
}
