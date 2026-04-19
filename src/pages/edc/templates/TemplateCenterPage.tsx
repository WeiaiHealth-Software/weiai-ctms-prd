import { Plus } from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHeaderStore } from '../../../store/useHeaderStore'
import SectionCard from '../../../components/common/SectionCard'
import Drawer from '../../../components/overlay/Drawer'
import StatCard from '../../../modules/edc/dashboard/StatCard'
import DynamicFormRenderer from '../../../modules/edc/form-engine/DynamicFormRenderer'
import { buildInitialFormData } from '../../../modules/edc/form-engine/utils/buildInitialFormData'
import { defaultTemplateFields } from '../../../data/edc/mockTemplateSchema'
import { templates as initialTemplates } from '../../../data/edc/templates'
import { classNames } from '../../../lib/classNames'
import { statusClassMap } from '../../../lib/statusMap'
import type { Template } from '../../../types/template'

const PAGE_SIZE = 10

export function TemplateCenterPage() {
  const setTitle = useHeaderStore(state => state.setTitle)
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<Template[]>(initialTemplates)
  const [currentPage, setCurrentPage] = useState(1)
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null)

  useEffect(() => {
    setTitle('EDC 表单样板间', '预设和管理系统级的标准 eCRF 表单模板', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' }
    ])
  }, [setTitle])

  const previewTemplate = useMemo(
    () => templates.find((item) => item.id === previewTemplateId) || null,
    [previewTemplateId, templates]
  )

  const stats = useMemo(() => {
    const enabledCount = templates.filter((tpl) => tpl.status === '启用中').length
    const draftCount = templates.filter((tpl) => tpl.status === '草稿').length

    return {
      totalCount: templates.length,
      enabledCount,
      draftCount,
    }
  }, [templates])

  const totalPages = Math.max(1, Math.ceil(templates.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedTemplates = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
    return templates.slice(startIndex, startIndex + PAGE_SIZE)
  }, [safeCurrentPage, templates])

  const previewFormData = useMemo(() => buildInitialFormData(defaultTemplateFields), [])

  const handleDelete = (templateId: string) => {
    const targetTemplate = templates.find((tpl) => tpl.id === templateId)
    if (!targetTemplate) return

    const shouldDelete = window.confirm(`确认删除模板「${targetTemplate.name}」吗？`)
    if (!shouldDelete) return

    setTemplates((prev) => prev.filter((tpl) => tpl.id !== templateId))
    setPreviewTemplateId((prev) => (prev === templateId ? null : prev))
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="总模板数"
          value={String(stats.totalCount)}
          hint="可复用配置"
          className="border-blue-200 bg-blue-50"
          titleClassName="text-blue-700"
          valueClassName="text-blue-800"
          hintClassName="text-blue-600"
        />
        <StatCard
          title="启用中模板数"
          value={String(stats.enabledCount)}
          hint="可绑定项目"
          className="border-emerald-200 bg-emerald-50"
          titleClassName="text-emerald-700"
          valueClassName="text-emerald-800"
          hintClassName="text-emerald-600"
        />
        <StatCard
          title="草稿模板数"
          value={String(stats.draftCount)}
          hint="待确认发布"
          className="border-slate-200 bg-slate-100"
          titleClassName="text-slate-600"
          valueClassName="text-slate-700"
          hintClassName="text-slate-500"
        />
      </div>

        <SectionCard
        title="模板列表"
        extra={
          <button
            onClick={() => navigate('/index/edc/templates/builder')}
            className="h-10 px-4 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新建模板
          </button>
        }
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-medium">模板名称</th>
                <th className="px-4 py-3 text-left font-medium">模板描述</th>
                <th className="px-4 py-3 text-left font-medium">模板状态</th>
                <th className="px-4 py-3 text-left font-medium">创建者</th>
                <th className="px-4 py-3 text-left font-medium">创建时间</th>
                <th className="px-4 py-3 text-left font-medium">更新时间</th>
                <th className="px-4 py-3 text-left font-medium">版本号</th>
                <th className="px-4 py-3 text-right font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {templates.length > 0 ? (
                paginatedTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-4 font-medium text-slate-800">{template.name}</td>
                    <td className="px-4 py-4 text-slate-600">{template.description}</td>
                    <td className="px-4 py-4">
                      <span
                        className={classNames(
                          'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                          statusClassMap[template.status]
                        )}
                      >
                        {template.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{template.createdBy}</td>
                    <td className="px-4 py-4 text-slate-600">{template.createdAt}</td>
                    <td className="px-4 py-4 text-slate-600">{template.updatedAt}</td>
                    <td className="px-4 py-4 text-slate-600 font-mono">{template.version}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex items-center gap-2 text-sm">
                        <button
                          type="button"
                          onClick={() => setPreviewTemplateId(template.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          预览
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => navigate(`/index/edc/templates/builder?templateId=${template.id}`)}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          编辑
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(template.id)}
                          className="text-rose-600 hover:text-rose-700"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    暂无模板
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {templates.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3">
              <div className="text-sm text-slate-500">
                显示第 {(safeCurrentPage - 1) * PAGE_SIZE + 1}-{Math.min(safeCurrentPage * PAGE_SIZE, templates.length)} 条，共{' '}
                {templates.length} 条
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={safeCurrentPage === 1}
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  上一页
                </button>
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={classNames(
                        'h-9 min-w-9 rounded-lg border px-3 text-sm',
                        safeCurrentPage === pageNumber
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      <Drawer
        open={Boolean(previewTemplate)}
        title={previewTemplate ? `预览：${previewTemplate.name}` : '预览'}
        subtitle={
          previewTemplate
            ? `${previewTemplate.type} · ${previewTemplate.version} · ${previewTemplate.status} · ${previewTemplate.createdBy}`
            : undefined
        }
        onClose={() => setPreviewTemplateId(null)}
      >
        {previewTemplate && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {previewTemplate.description}
            </div>
            <div className="pointer-events-none">
              <DynamicFormRenderer fields={defaultTemplateFields} formData={previewFormData} readOnly={true} onChange={() => {}} />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
