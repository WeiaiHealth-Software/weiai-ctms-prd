/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArrowLeft, Monitor, Smartphone, Code } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useHeaderStore } from '../../../store/useHeaderStore'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import EmptyState from '../../../components/common/EmptyState'
import { useBuilderFields } from '../../../modules/edc/form-engine/hooks/useBuilderFields'
import { useDynamicForm } from '../../../modules/edc/form-engine/hooks/useDynamicForm'
import { createFieldByType } from '../../../modules/edc/form-engine/utils/createFieldByType'
import BuilderPropertyPanel from '../../../modules/edc/templates/components/BuilderPropertyPanel'
import BuilderPalette from '../../../modules/edc/templates/components/BuilderPalette'
import BuilderCanvas from '../../../modules/edc/templates/components/BuilderCanvas'
import { defaultTemplateFields } from '../../../data/edc/mockTemplateSchema'

export function TemplateBuilderPage() {
  const setTitle = useHeaderStore(state => state.setTitle)
  const [readOnly, setReadOnly] = useState(false)

  useEffect(() => {
    setTitle('编辑表单样板', '通过拖拽组件快速构建 eCRF 表单模板', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' }
    ])
  }, [setTitle])
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'code'>('desktop')
  const [meta] = useState({
    name: '新建基线表',
    type: '基线访视',
    visit: 'V0 基线期',
    version: 'v0.1.0',
    status: '草稿',
  })

  const {
    fields,
    setFields,
    selectedField,
    selectedFieldId,
    setSelectedFieldId,
    addField,
    updateField,
    deleteField,
    duplicateField,
  } = useBuilderFields(defaultTemplateFields)

  const { syncWithFields } = useDynamicForm(fields)

  useEffect(() => {
    syncWithFields()
  }, [fields])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeType = active.data.current?.type

    if (activeType === 'palette') {
      const fieldType = active.data.current?.fieldType
      const newField = createFieldByType(fieldType)

      if (over.id === 'canvas') {
        setFields((prev) => [...prev, newField])
      } else {
        const overIndex = fields.findIndex((f) => f.id === over.id)
        if (overIndex >= 0) {
          setFields((prev) => {
            const next = [...prev]
            next.splice(overIndex + 1, 0, newField)
            return next
          })
        } else {
          setFields((prev) => [...prev, newField])
        }
      }
      setSelectedFieldId(newField.id)
    } else if (activeType === 'canvas-item') {
      if (active.id !== over.id) {
        setFields((prev) => {
          const oldIndex = prev.findIndex((f) => f.id === active.id)
          const newIndex = prev.findIndex((f) => f.id === over.id)
          return arrayMove(prev, oldIndex, newIndex)
        })
      }
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-[calc(100vh-80px)] space-y-4 p-6">
        <div className="flex items-center justify-between shrink-0">
          <Link
            to="/index/edc/templates"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            返回模板中心
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setReadOnly((prev) => !prev)}
              className="h-9 px-4 rounded-xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 bg-white"
            >
              {readOnly ? '切换编辑' : '切换只读'}
            </button>
            <button className="h-9 px-4 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200">
              保存草稿
            </button>
          </div>
        </div>

        <div className="flex gap-6 flex-1 min-h-0 overflow-hidden">
          {/* 左侧区域：只放组件库 */}
          <div className="w-[320px] shrink-0 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              <BuilderPalette onAdd={addField} />
            </div>
          </div>

          {/* 中间画布区域 */}
          <div className="flex-1 flex flex-col gap-4 min-h-0">
            {/* 中间基础信息 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-slate-400 mb-1">模板名称</div>
                  <div className="font-semibold text-slate-800">{meta.name}</div>
                </div>
                <div className="w-px h-8 bg-slate-100"></div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">版本号</div>
                  <div className="font-semibold text-slate-800">{meta.version}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                  {meta.type}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-medium">
                  {meta.status}
                </span>
              </div>
            </div>

            {/* 动态画布 */}
            <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner flex flex-col overflow-hidden relative">
              <div className="h-12 border-b border-slate-200 bg-white flex items-center justify-between px-5 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-slate-800">动态画布</div>
                  <div className="text-xs text-slate-500">
                    （画布里显示的内容就是实际页面呈现的内容）
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200/60">
                  <button
                    onClick={() => setViewMode('desktop')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
                    }`}
                    title="PC 视图"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('mobile')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
                    }`}
                    title="移动端视图"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('code')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'code' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
                    }`}
                    title="查看 Schema"
                  >
                    <Code className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-6 relative flex justify-center">
                {viewMode === 'code' ? (
                  <div className="w-full h-full max-w-4xl bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 text-xs font-mono text-slate-500">
                      schema.json
                    </div>
                    <textarea
                      value={JSON.stringify(fields, null, 2)}
                      onChange={(e) => {
                        try {
                          const newFields = JSON.parse(e.target.value)
                          if (Array.isArray(newFields)) {
                            setFields(newFields)
                          }
                        } catch (err) {
                          // Ignore parsing errors while typing
                        }
                      }}
                      className="flex-1 w-full p-4 font-mono text-sm outline-none resize-none bg-slate-800 text-slate-100"
                      spellCheck={false}
                    />
                  </div>
                ) : viewMode === 'mobile' ? (
                  <div className="w-[375px] h-[812px] bg-white rounded-[40px] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col shrink-0">
                    <div className="h-6 bg-slate-800 shrink-0 relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-800 rounded-b-2xl"></div>
                    </div>
                    <div className="flex-1 overflow-auto bg-slate-50 p-4">
                      <BuilderCanvas
                        fields={fields}
                        selectedFieldId={selectedFieldId}
                        onSelect={setSelectedFieldId}
                        onDuplicateField={duplicateField}
                        onDeleteField={deleteField}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-3xl">
                    <BuilderCanvas
                      fields={fields}
                      selectedFieldId={selectedFieldId}
                      onSelect={setSelectedFieldId}
                      onDuplicateField={duplicateField}
                      onDeleteField={deleteField}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧属性区域（上下两个卡片） */}
          <div className="w-[360px] shrink-0 flex flex-col gap-4 min-h-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[50%] max-h-[60%] overflow-hidden">
              <div className="h-12 border-b border-slate-100 bg-slate-50/50 flex items-center px-5 shrink-0 font-semibold text-slate-800">
                属性配置
              </div>
              <div className="flex-1 overflow-auto p-5">
                {selectedField ? (
                  <BuilderPropertyPanel field={selectedField} onChange={updateField} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <EmptyState title="未选择组件" description="请在中间画布选择一个组件以配置其属性" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
              <div className="h-12 border-b border-slate-100 bg-slate-50/50 flex items-center px-5 shrink-0 font-semibold text-slate-800">
                节点 JSON
              </div>
              <div className="flex-1 overflow-hidden flex flex-col">
                {selectedField ? (
                  <textarea
                    value={JSON.stringify(selectedField, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value)
                        if (parsed && typeof parsed === 'object') {
                          // Update all fields of the selected item
                          updateField(selectedField.id, parsed)
                        }
                      } catch (err) {
                        // Ignore parse errors during typing
                      }
                    }}
                    className="w-full h-full p-4 font-mono text-sm outline-none resize-none bg-slate-800 text-slate-100"
                    spellCheck={false}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center p-5 bg-slate-50">
                    <EmptyState title="无节点数据" description="选择组件后可在此直接编辑 JSON" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  )
}
