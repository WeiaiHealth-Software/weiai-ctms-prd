import {
  Calendar,
  Eye,
  FileText,
  Hash,
  LayoutGrid,
  ListChecks,
  PanelTop,
  Rows3,
  Table,
  Type,
  User,
  Stethoscope,
  Activity,
  FileSpreadsheet,
  Plus,
} from 'lucide-react'
import type { BuilderField, BuilderFieldType } from '../../form-engine/types'
import { useDraggable } from '@dnd-kit/core'
import { useState } from 'react'
import Drawer from '../../../../components/overlay/Drawer'
import { classNames } from '../../../../lib/classNames'

const basicFieldItems: { type: BuilderFieldType; label: string; icon: React.ReactNode }[] = [
  { type: 'section', label: '模块容器', icon: <PanelTop className="w-4 h-4" /> },
  { type: 'text', label: '单行文本', icon: <Type className="w-4 h-4" /> },
  { type: 'number', label: '数字输入', icon: <Hash className="w-4 h-4" /> },
  { type: 'date', label: '日期', icon: <Calendar className="w-4 h-4" /> },
  { type: 'select', label: '下拉选择', icon: <ListChecks className="w-4 h-4" /> },
  { type: 'radio', label: '单选', icon: <Rows3 className="w-4 h-4" /> },
  { type: 'textarea', label: '多行文本', icon: <FileText className="w-4 h-4" /> },
  { type: 'eyeGrid', label: '左右眼表格', icon: <Eye className="w-4 h-4" /> },
  { type: 'matrix', label: '矩阵表格', icon: <Table className="w-4 h-4" /> },
  { type: 'dynamicList', label: '动态列表', icon: <LayoutGrid className="w-4 h-4" /> },
]

type CustomBlock = {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
  tagColor: string
  fields: Omit<BuilderField, 'id'>[]
}

const customBlocks: CustomBlock[] = [
  {
    id: 'subject-demographic',
    name: '受试者基本信息',
    description: '受试者基本信息：姓名缩写、性别、出生日期、年龄等',
    icon: <User className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    tagColor: 'bg-blue-100 text-blue-700',
    fields: [
      { type: 'section', key: 'sec_demographic', label: '', sectionTitle: '一、受试者基本信息' },
      { type: 'text', key: 'name_abbr', label: '姓名缩写', required: true, placeholder: '如：ZSM', sectionId: 'sec_demographic' },
      { type: 'radio', key: 'gender', label: '性别', required: true, options: ['男', '女'], sectionId: 'sec_demographic' },
      { type: 'date', key: 'birth_date', label: '出生日期', required: true, sectionId: 'sec_demographic' },
      { type: 'number', key: 'age', label: '入组年龄（岁）', required: true, placeholder: '如：10', sectionId: 'sec_demographic' },
    ],
  },
  {
    id: 'eye-basic-exam',
    name: '眼科基础检查',
    description: '屈光/视功能：SE、BCVA、眼轴、角膜曲率等',
    icon: <Eye className="w-5 h-5" />,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    tagColor: 'bg-violet-100 text-violet-700',
    fields: [
      { type: 'section', key: 'sec_eye_basic', label: '', sectionTitle: '二、眼科基础检查' },
      { type: 'eyeGrid', key: 'eye_exam_basic', label: '屈光/视功能检查', required: true, options: ['SE', 'BCVA（LogMAR）', '眼轴 AL(mm)', '角膜K1', '角膜K2', '瞳孔直径'], sectionId: 'sec_eye_basic' },
      { type: 'select', key: 'myopia_type', label: '近视类型', options: ['单纯性近视', '高度近视', '病理性近视', '其他'], sectionId: 'sec_eye_basic' },
    ],
  },
  {
    id: 'visit-basic',
    name: '访视基础信息',
    description: '访视日期、访视性质、依从性等通用访视字段',
    icon: <Stethoscope className="w-5 h-5" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    tagColor: 'bg-emerald-100 text-emerald-700',
    fields: [
      { type: 'section', key: 'sec_visit_basic', label: '', sectionTitle: '一、访视基础' },
      { type: 'date', key: 'visit_date', label: '本次访视日期', required: true, sectionId: 'sec_visit_basic' },
      { type: 'radio', key: 'visit_type', label: '访视性质', required: true, options: ['按计划随访', '提前返院', '逾期随访', '临时就诊'], sectionId: 'sec_visit_basic' },
      { type: 'radio', key: 'compliance', label: '依从性', required: true, options: ['优（≥90%）', '良（70%-90%）', '一般（50%-70%）', '差（<50%）'], sectionId: 'sec_visit_basic' },
    ],
  },
  {
    id: 'visit-eye-followup',
    name: '眼科复查区块',
    description: '访视复查：视力/屈光/眼轴复查、不良事件等',
    icon: <Activity className="w-5 h-5" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    tagColor: 'bg-amber-100 text-amber-700',
    fields: [
      { type: 'section', key: 'sec_visit_eye', label: '', sectionTitle: '二、眼科复查' },
      { type: 'eyeGrid', key: 'visit_eye_exam', label: '视力/屈光/眼轴复查', required: true, options: ['UCVA', 'BCVA（LogMAR）', 'SE（等效球镜）', '眼轴 AL(mm)'], sectionId: 'sec_visit_eye' },
      { type: 'radio', key: 'adverse_event', label: '不良事件', required: true, options: ['无', '有（需在下方记录）'], sectionId: 'sec_visit_eye' },
      { type: 'textarea', key: 'adverse_detail', label: '不良事件描述', placeholder: '若有不良事件，请详细描述：症状、发生时间、处理措施、转归…', sectionId: 'sec_visit_eye' },
      { type: 'date', key: 'next_visit_date', label: '下次访视日期', sectionId: 'sec_visit_eye' },
    ],
  },
  {
    id: 'medical-history',
    name: '既往病史',
    description: '既往病史、用药史、家族史、过敏史等',
    icon: <FileSpreadsheet className="w-5 h-5" />,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    tagColor: 'bg-rose-100 text-rose-700',
    fields: [
      { type: 'section', key: 'sec_medical_history', label: '', sectionTitle: '三、既往病史' },
      { type: 'radio', key: 'past_medical_history', label: '既往病史', options: ['无', '有（请描述）'], sectionId: 'sec_medical_history' },
      { type: 'textarea', key: 'past_medical_detail', label: '既往病史描述', placeholder: '请详细描述既往病史…', sectionId: 'sec_medical_history' },
      { type: 'radio', key: 'medication_history', label: '用药史', options: ['无', '有（请描述）'], sectionId: 'sec_medical_history' },
      { type: 'textarea', key: 'medication_detail', label: '用药史描述', placeholder: '请详细描述用药情况…', sectionId: 'sec_medical_history' },
      { type: 'radio', key: 'family_history', label: '家族史', options: ['无', '有（请描述）'], sectionId: 'sec_medical_history' },
      { type: 'radio', key: 'allergy_history', label: '过敏史', options: ['无', '有（请描述）'], sectionId: 'sec_medical_history' },
    ],
  },
  {
    id: 'conclusion-section',
    name: '结论与备注',
    description: '访视总结、研究者签名、备注信息区',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    tagColor: 'bg-slate-100 text-slate-700',
    fields: [
      { type: 'section', key: 'sec_conclusion', label: '', sectionTitle: '结论与备注' },
      { type: 'textarea', key: 'visit_conclusion', label: '访视结论', placeholder: '本次访视的主要结论和评估…', sectionId: 'sec_conclusion' },
      { type: 'text', key: 'researcher_name', label: '研究者签名', sectionId: 'sec_conclusion' },
      { type: 'date', key: 'researcher_sign_date', label: '签名日期', sectionId: 'sec_conclusion' },
      { type: 'textarea', key: 'visit_note', label: '备注', placeholder: '其他需要记录的信息…', sectionId: 'sec_conclusion' },
    ],
  },
]

type BuilderPaletteProps = {
  onAdd: (type: BuilderFieldType) => void
  onAddBlock?: (fields: BuilderField[]) => void
}

function DraggableBasicItem({ item, onAdd }: { item: typeof basicFieldItems[0]; onAdd: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${item.type}`,
    data: {
      type: 'palette',
      fieldType: item.type,
      item,
    },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onAdd}
      className={classNames('rounded-xl border border-slate-200 p-2.5 text-left hover:border-blue-300 hover:bg-blue-50 transition cursor-grab',
        isDragging && 'opacity-50 border-blue-500 bg-blue-50',
        !isDragging && 'bg-white')}
    >
      <div className="flex flex-col items-center gap-1.5 pointer-events-none">
        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
          {item.icon}
        </div>
        <div className="text-xs font-medium text-slate-700 text-center leading-tight">
          {item.label}
        </div>
      </div>
    </div>
  )
}

function DraggableCustomBlock({ block, onPreview }: { block: CustomBlock; onPreview: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-block-${block.id}`,
    data: {
      type: 'palette-block',
      block,
    },
  })
  const fieldCount = block.fields.length
  const sectionField = block.fields.find(f => f.type === 'section')
  const sectionTitle = sectionField?.sectionTitle || ''
  const requiredCount = block.fields.filter(f => f.required).length

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onPreview()
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={classNames(
        'w-full relative rounded-xl border border-slate-200 bg-white p-3 text-left transition-all group cursor-grab',
        !isDragging && 'hover:shadow-md hover:border-slate-300',
        isDragging && 'opacity-50 border-blue-500 bg-blue-50'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={classNames('w-16 h-20 rounded-lg flex items-center justify-center shrink-0 border border-slate-200/60 overflow-hidden relative', block.bgColor, block.color)}>
          <div className="absolute inset-0 p-1.5 opacity-70">
            <div className="h-1.5 w-8 bg-white/80 rounded mb-1.5"></div>
            <div className="space-y-1">
              <div className="h-1 w-full bg-white/50 rounded"></div>
              <div className="h-1 w-3/4 bg-white/40 rounded"></div>
              <div className="h-1 w-full bg-white/50 rounded mt-1.5"></div>
              <div className="h-1 w-5/6 bg-white/40 rounded"></div>
            </div>
          </div>
          <div className="relative z-10 opacity-95 group-hover:scale-110 transition-transform duration-200">
            {block.icon}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-sm font-semibold text-slate-800 truncate">
              {block.name}
            </div>
            <span className={classNames('text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0', block.tagColor)}>
              {fieldCount}项
            </span>
            {requiredCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 bg-rose-50 text-rose-600 border border-rose-100">
                必填{requiredCount}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {block.description}
          </div>
          {sectionTitle && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="inline-block w-1 h-2.5 rounded-sm bg-indigo-400"></span>
              <span className="truncate">{sectionTitle}</span>
            </div>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={handlePreviewClick}
        className="absolute bottom-1.5 right-3 text-xs font-medium text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline opacity-0 group-hover:opacity-100 transition-opacity select-none bg-transparent border-0 p-0 outline-none appearance-none"
      >
        预览
      </button>
    </div>
  )
}

function BlockPreviewContent({ block }: { block: CustomBlock }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50/80 to-white p-6 shadow-sm">
        <div className="space-y-5">
          {block.fields.map((field, idx) => {
            if (field.type === 'section') {
              return (
                <div key={idx} className="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50/40 rounded-r-lg -mx-2">
                  {field.sectionTitle || '未命名分区'}
                </div>
              )
            }
            const labelText = (
              <div className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
                {field.required && <span className="text-rose-500 font-bold">*</span>}
                <span>{field.label}</span>
              </div>
            )
            switch (field.type) {
              case 'text':
              case 'number':
                return (
                  <div key={idx}>
                    {labelText}
                    <div className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-400 flex items-center">
                      {field.placeholder || '输入…'}
                    </div>
                  </div>
                )
              case 'date':
                return (
                  <div key={idx}>
                    {labelText}
                    <div className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-400 flex items-center">
                      年 / 月 / 日
                    </div>
                  </div>
                )
              case 'textarea':
                return (
                  <div key={idx}>
                    {labelText}
                    <div className="h-24 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-400 leading-relaxed">
                      {field.placeholder || '多行输入…'}
                    </div>
                  </div>
                )
              case 'select':
                return (
                  <div key={idx}>
                    {labelText}
                    <div className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-400 flex items-center justify-between">
                      <span>{(field.options?.[0] || '选择项')}</span>
                      <span className="text-slate-300">▾</span>
                    </div>
                  </div>
                )
              case 'radio':
                return (
                  <div key={idx}>
                    {labelText}
                    <div className="flex flex-wrap gap-5">
                      {(field.options || []).map((opt, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="w-4 h-4 rounded-full border-2 border-slate-300 inline-block"></span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              case 'eyeGrid':
                return (
                  <div key={idx}>
                    {labelText}
                    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-4 py-2.5 text-left font-medium w-40 border-b border-slate-100">检查项</th>
                            <th className="px-4 py-2.5 font-medium border-b border-slate-100">右眼 OD</th>
                            <th className="px-4 py-2.5 font-medium border-b border-slate-100">左眼 OS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-400 bg-white">
                          {(field.options || []).map((opt, i) => (
                            <tr key={i}>
                              <td className="px-4 py-2.5 text-slate-600 font-medium">{opt}</td>
                              <td className="px-4 py-2.5"><span className="inline-block w-full h-7 rounded bg-slate-50 border border-dashed border-slate-200"></span></td>
                              <td className="px-4 py-2.5"><span className="inline-block w-full h-7 rounded bg-slate-50 border border-dashed border-slate-200"></span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              case 'matrix':
                return (
                  <div key={idx}>
                    {labelText}
                    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-4 py-2.5 text-left font-medium w-28 border-b border-slate-100"></th>
                            {(field.cols || []).map((c, i) => (
                              <th key={i} className="px-4 py-2.5 font-medium border-b border-slate-100">{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-400 bg-white">
                          {(field.rows || []).map((r, i) => (
                            <tr key={i}>
                              <td className="px-4 py-2.5 text-slate-600 font-medium">{r}</td>
                              {(field.cols || []).map((_, j) => (
                                <td key={j} className="px-4 py-2.5"><span className="inline-block w-full h-7 rounded bg-slate-50 border border-dashed border-slate-200"></span></td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              case 'dynamicList':
                return (
                  <div key={idx}>
                    {labelText}
                    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            {(field.columns || []).map((c, i) => (
                              <th key={i} className="px-4 py-2.5 font-medium text-left border-b border-slate-100">{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-400 bg-white">
                          <tr>
                            {(field.columns || []).map((_, j) => (
                              <td key={j} className="px-4 py-2.5"><span className="inline-block w-full h-7 rounded bg-slate-50 border border-dashed border-slate-200"></span></td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                      <div className="px-4 py-2.5 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50/50">
                        <Plus className="w-3.5 h-3.5" /> 点击添加一行
                      </div>
                    </div>
                  </div>
                )
              default:
                return null
            }
          })}
        </div>
      </div>
    </div>
  )
}

export default function BuilderPalette({ onAdd, onAddBlock }: BuilderPaletteProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'custom'>('basic')
  const [previewBlock, setPreviewBlock] = useState<CustomBlock | null>(null)

  const handleAddBlock = (block: CustomBlock) => {
    if (!onAddBlock) return
    const now = Date.now()
    const fields: BuilderField[] = block.fields.map((f, idx) => ({
      ...f,
      id: `block_${now}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
    }))
    onAddBlock(fields)
    setPreviewBlock(null)
  }

  const previewFooter = previewBlock ? (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <div className={classNames('w-8 h-8 rounded-lg flex items-center justify-center', previewBlock.bgColor, previewBlock.color)}>
          {previewBlock.icon}
        </div>
        <div>
          <div className="font-medium text-slate-700">{previewBlock.name}</div>
          <div>共 {previewBlock.fields.length} 个字段将插入画布末尾</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPreviewBlock(null)}
          className="h-10 px-5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          取消
        </button>
        <button
          onClick={() => handleAddBlock(previewBlock)}
          className="h-10 px-6 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          插入此区块
        </button>
      </div>
    </div>
  ) : undefined

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 shrink-0">
        <div className="font-semibold text-slate-800 mb-3">组件库</div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('basic')}
            className={classNames('flex-1 h-8 rounded-lg text-xs font-medium transition-all',
              activeTab === 'basic' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}
          >
            基础组件
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={classNames('flex-1 h-8 rounded-lg text-xs font-medium transition-all',
              activeTab === 'custom' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}
          >
            自定义区块
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'basic' ? (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2.5">
              {basicFieldItems.map((item) => (
                <DraggableBasicItem key={item.type} item={item} onAdd={() => onAdd(item.type)} />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {customBlocks.map((block) => (
              <DraggableCustomBlock
                key={block.id}
                block={block}
                onPreview={() => setPreviewBlock(block)}
              />
            ))}
            <button
              type="button"
              className="w-full h-11 rounded-xl border border-dashed border-slate-300 text-xs text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition flex items-center justify-center gap-1.5"
            >
              <span className="text-base">+</span>
              创建我的自定义区块
            </button>
          </div>
        )}
      </div>

      <Drawer
        open={!!previewBlock}
        title={previewBlock ? `预览：${previewBlock.name}` : ''}
        subtitle={previewBlock ? `${previewBlock.fields.length} 个字段 · 点击下方按钮确认插入到画布末尾` : ''}
        onClose={() => setPreviewBlock(null)}
        footer={previewFooter}
        width={560}
        bodyClassName="p-5 bg-slate-50/30"
      >
        {previewBlock && <BlockPreviewContent block={previewBlock} />}
      </Drawer>
    </div>
  )
}
