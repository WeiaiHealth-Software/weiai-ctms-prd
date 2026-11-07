import { Download, FileText, Image as ImageIcon, Trash2 } from 'lucide-react'
import Drawer from '../../../../components/overlay/Drawer'
import type { VisitAttachment } from '../../../../types/edc/attachment'

type AttachmentDetailDrawerProps = {
  open: boolean
  attachment: VisitAttachment | null
  visitName: string
  readOnly: boolean
  onClose: () => void
  onDelete: (attachmentId: string) => void
}

export default function AttachmentDetailDrawer({
  open,
  attachment,
  visitName,
  readOnly,
  onClose,
  onDelete,
}: AttachmentDetailDrawerProps) {
  if (!attachment) return null

  const isImage = attachment.fileKind === 'image'
  const canPreview = attachment.fileKind === 'image' || attachment.fileKind === 'pdf'

  const metaRows: Array<{ label: string; value: string }> = [
    { label: '所属访视', value: visitName },
    { label: '检查类型', value: attachment.checkType },
    { label: '上传人', value: attachment.uploadedBy },
    { label: '上传时间', value: attachment.uploadedAt },
    { label: '文件大小', value: attachment.fileSize },
  ]

  return (
    <Drawer
      open={open}
      title={attachment.fileName}
      subtitle={`${visitName} · ${attachment.uploadedAt} · ${attachment.uploadedBy}`}
      onClose={onClose}
      width={760}
      footer={
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400">检查单为原始数据留痕，删除后不可恢复</div>
          <div className="flex items-center gap-3">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Download className="w-4 h-4" />
              下载
            </button>
            {!readOnly && (
              <button
                onClick={() => onDelete(attachment.id)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                删除
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {canPreview ? (
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
                  <div className="mt-0.5 font-medium text-slate-700">WXY</div>
                </div>
                <div>
                  <span className="text-slate-400">检查类型</span>
                  <div className="mt-0.5 font-medium text-slate-700">{attachment.checkType}</div>
                </div>
                <div>
                  <span className="text-slate-400">检查日期</span>
                  <div className="mt-0.5 font-medium text-slate-700">{attachment.uploadedAt.slice(0, 10)}</div>
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
                  <div className="mt-0.5 font-medium text-slate-700">{attachment.uploadedBy}</div>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-600">
                  {isImage ? <ImageIcon className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                  {isImage ? '影像原件预览' : 'PDF 原件预览'}
                </div>
              </div>
            </div>
          </div>
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
            {metaRows.map((row) => (
              <div key={row.label}>
                <div className="text-xs text-slate-400">{row.label}</div>
                <div className="mt-1 text-sm font-medium text-slate-700">{row.value}</div>
              </div>
            ))}
            <div className="col-span-2">
              <div className="text-xs text-slate-400">备注</div>
              <div className="mt-1 text-sm text-slate-700">{attachment.note || '——'}</div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  )
}
