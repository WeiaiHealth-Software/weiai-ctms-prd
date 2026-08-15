import { ArrowLeft, Building, Check, ChevronRight, GripVertical, Hospital, Plus, Save, Settings2, Sparkles, Trash2, Type } from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEdcProjectStore } from '../../../store/useEdcProjectStore'
import { useHeaderStore } from '../../../store/useHeaderStore'
import type { BuilderField, BuilderFieldType } from '../../../types/form-field'
import type { FormConfig } from '../../../types/project'
import { classNames } from '../../../lib/classNames'

type ConfigureStep = 'baseline' | 'visit'

const fieldTypePalette: { type: BuilderFieldType; label: string; desc: string }[] = [
  { type: 'section', label: '区块标题', desc: '用于划分表单模块' },
  { type: 'text', label: '单行文本', desc: '短文本输入' },
  { type: 'number', label: '数字输入', desc: '数值类录入' },
  { type: 'date', label: '日期', desc: '日期选择' },
  { type: 'select', label: '下拉选择', desc: '下拉菜单选择' },
  { type: 'radio', label: '单选', desc: '单选项选择' },
  { type: 'textarea', label: '多行文本', desc: '长文本输入' },
  { type: 'eyeGrid', label: '左右眼表格', desc: '眼科专用双眼数据' },
  { type: 'matrix', label: '矩阵表格', desc: '多行多列表格' },
  { type: 'dynamicList', label: '动态列表', desc: '可重复录入的项' },
]

const defaultOptionsByType: Partial<Record<BuilderFieldType, string[]>> = {
  select: ['选项1', '选项2', '选项3'],
  radio: ['是', '否', '不确定'],
  eyeGrid: ['SE', 'BCVA', 'AL', 'K1', 'K2'],
  matrix: undefined,
  dynamicList: ['列1', '列2', '列3'],
}

const defaultBaselineFields: BuilderField[] = [
  { id: 'sec-demographic', type: 'section', key: 'sec_demographic', label: '', sectionTitle: '一、人口学信息' },
  { id: 'f-name', type: 'text', key: 'name', label: '受试者姓名缩写', required: true, placeholder: '请输入姓名缩写，如 Z-San' },
  { id: 'f-gender', type: 'radio', key: 'gender', label: '性别', required: true, options: ['男', '女'] },
  { id: 'f-birth', type: 'date', key: 'birthDate', label: '出生日期', required: true },
  { id: 'f-age', type: 'number', key: 'age', label: '入组年龄（岁）', required: true, placeholder: '如 10' },
  { id: 'sec-medical', type: 'section', key: 'sec_medical', label: '', sectionTitle: '二、眼科基础检查' },
  { id: 'f-eyes', type: 'eyeGrid', key: 'eyeExam', label: '屈光/视功能检查', required: true, options: ['SE', 'BCVA（LogMAR）', '眼轴 AL(mm)', '角膜K1', '角膜K2', '瞳孔直径'] },
  { id: 'f-diagnosis', type: 'select', key: 'diagnosis', label: '近视类型', options: ['单纯性近视', '高度近视', '病理性近视', '其他'] },
  { id: 'f-note', type: 'textarea', key: 'baselineNote', label: '基线备注', placeholder: '其他需要记录的基线信息…' },
]

const defaultVisitFields: BuilderField[] = [
  { id: 'sec-visit-basic', type: 'section', key: 'sec_visit_basic', label: '', sectionTitle: '一、访视基础' },
  { id: 'f-visit-date', type: 'date', key: 'visitDate', label: '本次访视日期', required: true },
  { id: 'f-visit-type', type: 'radio', key: 'visitType', label: '访视性质', required: true, options: ['按计划随访', '提前返院', '逾期随访', '临时就诊'] },
  { id: 'f-compliance', type: 'radio', key: 'compliance', label: '依从性', required: true, options: ['优（≥90%）', '良（70%-90%）', '一般（50%-70%）', '差（<50%）'] },
  { id: 'sec-visit-eye', type: 'section', key: 'sec_visit_eye', label: '', sectionTitle: '二、眼科复查' },
  { id: 'f-visit-eyes', type: 'eyeGrid', key: 'visitEyeExam', label: '视力/屈光/眼轴复查', required: true, options: ['UCVA', 'BCVA（LogMAR）', 'SE（等效球镜）', '眼轴 AL(mm)'] },
  { id: 'f-adverse', type: 'radio', key: 'adverseEvent', label: '不良事件', required: true, options: ['无', '有（需在下方记录）'] },
  { id: 'f-adverse-detail', type: 'textarea', key: 'adverseDetail', label: '不良事件描述', placeholder: '若有不良事件，请详细描述：症状、发生时间、处理措施、转归…' },
  { id: 'f-next-date', type: 'date', key: 'nextVisitDate', label: '下次访视日期' },
  { id: 'f-visit-note', type: 'textarea', key: 'visitNote', label: '本次访视备注', placeholder: '其他需要记录的信息…' },
]

function createField(type: BuilderFieldType, index: number): BuilderField {
  const id = `f_${Date.now()}_${index}`
  const base: BuilderField = {
    id,
    type,
    key: `${type}_${Date.now().toString(36)}`,
    label: '',
    required: false,
  }
  switch (type) {
    case 'section':
      return { ...base, label: '', sectionTitle: '新的分区' }
    case 'text':
      return { ...base, label: '单行文本字段', placeholder: '请输入…' }
    case 'number':
      return { ...base, label: '数字字段', placeholder: '请输入数值' }
    case 'date':
      return { ...base, label: '日期字段' }
    case 'select':
      return { ...base, label: '下拉选择字段', options: [...(defaultOptionsByType.select ?? [])] }
    case 'radio':
      return { ...base, label: '单选项字段', options: [...(defaultOptionsByType.radio ?? [])] }
    case 'textarea':
      return { ...base, label: '多行文本字段', placeholder: '请输入详细描述…' }
    case 'eyeGrid':
      return { ...base, label: '左右眼检查表', options: [...(defaultOptionsByType.eyeGrid ?? [])] }
    case 'matrix':
      return { ...base, label: '矩阵表格', rows: ['行1', '行2'], cols: ['列1', '列2', '列3'] }
    case 'dynamicList':
      return { ...base, label: '动态列表', columns: [...(defaultOptionsByType.dynamicList ?? [])] }
    default:
      return base
  }
}

export default function ConfigureProjectPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const setTitle = useHeaderStore(state => state.setTitle)
  const { projects, updateProjectBaselineForm, markProjectConfigured } = useEdcProjectStore()

  const [step, setStep] = useState<ConfigureStep>('baseline')
  const [baselineFields, setBaselineFields] = useState<BuilderField[]>([])
  const [visitFields, setVisitFields] = useState<BuilderField[]>([])
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)

  const project = useMemo(() => projects.find((p) => p.id === projectId) || null, [projects, projectId])
  const selectedField = useMemo(() => {
    const list = step === 'baseline' ? baselineFields : visitFields
    return list.find((f) => f.id === selectedFieldId) ?? null
  }, [step, baselineFields, visitFields, selectedFieldId])

  useEffect(() => {
    if (project) {
      setTitle('配置项目 EDC 表单', `项目代码：${project.code}`, [
        { text: '开发者账户', color: 'indigo' },
        { text: '超级管理员', color: 'purple' }
      ])
      setBaselineFields(project.baselineForm?.fields?.length ? project.baselineForm.fields : defaultBaselineFields)
      setVisitFields(project.visitForm?.fields?.length ? project.visitForm.fields : defaultVisitFields)
    }
  }, [project, setTitle])

  const currentFields = step === 'baseline' ? baselineFields : visitFields
  const setCurrentFields = step === 'baseline' ? setBaselineFields : setVisitFields

  const addField = (type: BuilderFieldType) => {
    const field = createField(type, currentFields.length)
    setCurrentFields((prev) => [...prev, field])
    setSelectedFieldId(field.id)
  }

  const duplicateField = (fieldId: string) => {
    const idx = currentFields.findIndex((f) => f.id === fieldId)
    if (idx === -1) return
    const origin = currentFields[idx]
    const copy: BuilderField = {
      ...origin,
      id: `dup_${Date.now()}`,
      key: `${origin.key}_copy_${Date.now().toString(36)}`,
    }
    setCurrentFields((prev) => {
      const next = [...prev]
      next.splice(idx + 1, 0, copy)
      return next
    })
    setSelectedFieldId(copy.id)
  }

  const deleteField = (fieldId: string) => {
    setCurrentFields((prev) => prev.filter((f) => f.id !== fieldId))
    if (selectedFieldId === fieldId) setSelectedFieldId(null)
  }

  const moveField = (fromIdx: number, direction: -1 | 1) => {
    const toIdx = fromIdx + direction
    if (toIdx < 0 || toIdx >= currentFields.length) return
    setCurrentFields((prev) => {
      const next = [...prev]
      const [item] = next.splice(fromIdx, 1)
      next.splice(toIdx, 0, item)
      return next
    })
  }

  const updateSelectedField = (patch: Partial<BuilderField>) => {
    if (!selectedFieldId) return
    setCurrentFields((prev) => prev.map((f) => (f.id === selectedFieldId ? { ...f, ...patch } : f)))
  }

  const saveAndNext = () => {
    if (step === 'baseline') {
      if (project) {
        const cfg: FormConfig = { fields: baselineFields }
        updateProjectBaselineForm(project.id, cfg)
      }
      setStep('visit')
      setSelectedFieldId(null)
    } else {
      if (project && projectId) {
        const baselineCfg: FormConfig = { fields: baselineFields }
        const visitCfg: FormConfig = { fields: visitFields }
        markProjectConfigured(projectId, baselineCfg, visitCfg)
      }
      navigate(`/index/edc/projects/${projectId}`)
    }
  }

  const goPrev = () => {
    if (step === 'visit') {
      setStep('baseline')
      setSelectedFieldId(null)
    } else {
      navigate('/index/edc/projects')
    }
  }

  if (!project) {
    return <div className="text-sm text-slate-500 p-6">未找到项目</div>
  }

  const visitLabels = Array.from({ length: project.visitStages }, (_, i) => {
    const month = (i + 1) * parseInt(project.visitInterval.replace('M', ''))
    return `${month}M`
  })

  return (
    <div className="space-y-6 p-6">
      <Link to="/index/edc/projects" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700">
        <ArrowLeft className="w-4 h-4" />
        返回项目列表
      </Link>

      {/* 项目信息头 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-slate-900">{project.name}</h2>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className="flex justify-center items-center gap-2 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-200">
                <Settings2 className="w-3.5 h-3.5" />
                配置中
              </span>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md border border-blue-100 tracking-wider">
                项目码: {project.code}
              </span>
              <span className="flex items-center px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md border border-slate-200 tracking-wider">
                <Building className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                申办方: {project.sponsor}
              </span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md border border-slate-200 tracking-wider">
                项目负责人: {project.pi}
              </span>
              <span className="flex items-center px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-bold rounded-md border border-violet-200">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                访视规划：基线 + {project.visitStages} 次随访（{visitLabels.join(' / ')}）
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">{project.desc}</p>
          </div>

          <div className="shrink-0 w-[260px] space-y-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">关联中心</h4>
              <div className="flex flex-col gap-1.5">
                {project.centers.map((c) => (
                  <div key={c} className="flex items-center text-sm font-medium text-slate-700">
                    <Hospital className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                    <span className="truncate">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 分步指示器 */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setStep('baseline')}
              className={classNames(
                'text-left rounded-2xl border p-4 transition-all group',
                step === 'baseline'
                  ? 'border-indigo-500 bg-indigo-50/60 shadow-[0_0_0_3px_rgba(99,102,241,0.12)]'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={classNames(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold',
                  step === 'baseline' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                )}>
                  {baselineFields.length > 0 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <div>
                  <div className={classNames(
                    'text-sm font-bold',
                    step === 'baseline' ? 'text-indigo-800' : 'text-slate-700'
                  )}>
                    第一步 · 基线表单
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    入组基线采集（{baselineFields.length} 项）
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setStep('visit')}
              className={classNames(
                'text-left rounded-2xl border p-4 transition-all group',
                step === 'visit'
                  ? 'border-emerald-500 bg-emerald-50/60 shadow-[0_0_0_3px_rgba(16,185,129,0.12)]'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={classNames(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold',
                  step === 'visit' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                )}>
                  {visitFields.length > 0 ? <Check className="w-4 h-4" /> : '2'}
                </div>
                <div>
                  <div className={classNames(
                    'text-sm font-bold',
                    step === 'visit' ? 'text-emerald-800' : 'text-slate-700'
                  )}>
                    第二步 · 访视表单
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {visitLabels.join(' / ')} 共用（{visitFields.length} 项）
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 主配置区 */}
      <div className="grid grid-cols-12 gap-6">
        {/* 左侧：组件库 */}
        <div className="col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden sticky top-4">
            <div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-800 shrink-0 flex items-center gap-2">
              <Type className="w-4 h-4 text-slate-500" />
              组件库
            </div>
            <div className="p-4 space-y-2.5 overflow-y-auto max-h-[640px]">
              {fieldTypePalette.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => addField(item.type)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-left hover:border-blue-300 hover:bg-blue-50 transition bg-white group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 flex items-center justify-center shrink-0">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-800">{item.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">{item.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 中间：表单画布 */}
        <div className="col-span-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[640px]">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  {step === 'baseline' ? '基线表单预览' : '访视表单预览'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {step === 'baseline'
                    ? `受试者入组时采集 · 共 ${currentFields.length} 项`
                    : `${visitLabels.join(' / ')} 等所有访视共用 · 共 ${currentFields.length} 项`}
                </div>
              </div>
              <span className={classNames(
                'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                step === 'baseline' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
              )}>
                {step === 'baseline' ? 'Step 1 / 2' : 'Step 2 / 2'}
              </span>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {currentFields.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Plus className="w-7 h-7" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-600">暂无字段</p>
                    <p className="mt-1 text-xs text-slate-400">请从左侧组件库点击添加字段</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentFields.map((field, idx) => (
                    <FieldRow
                      key={field.id}
                      field={field}
                      index={idx}
                      total={currentFields.length}
                      selected={field.id === selectedFieldId}
                      onSelect={() => setSelectedFieldId(field.id)}
                      onMoveUp={() => moveField(idx, -1)}
                      onMoveDown={() => moveField(idx, 1)}
                      onDuplicate={() => duplicateField(field.id)}
                      onDelete={() => deleteField(field.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：属性面板 */}
        <div className="col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden sticky top-4">
            <div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-800 shrink-0 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-slate-500" />
              字段属性
            </div>
            <div className="p-4 overflow-y-auto max-h-[640px]">
              {selectedField ? (
                <PropertyPanel field={selectedField} onChange={updateSelectedField} />
              ) : (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-600">请选择字段</p>
                  <p className="mt-1 text-xs text-slate-400">点击中间画布中的任一字段进行编辑</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-slate-500 leading-relaxed">
          💡 基线表单用于入组时的首测数据，访视表单在所有随访阶段（3M / 6M / 12M …）中通用。
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            className="h-10 px-5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            {step === 'baseline' ? '取消返回' : '上一步'}
          </button>
          <button
            type="button"
            onClick={saveAndNext}
            className="h-10 px-6 rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {step === 'baseline' ? (
              <>保存基线并继续 <ChevronRight className="w-4 h-4" /></>
            ) : (
              <><Save className="w-4 h-4" /> 保存完成配置</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ================= FieldRow ================= */
function FieldRow({
  field, index, total, selected, onSelect, onMoveUp, onMoveDown, onDuplicate, onDelete
}: {
  field: BuilderField
  index: number
  total: number
  selected: boolean
  onSelect: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const renderPreview = () => {
    if (field.type === 'section') {
      return (
        <div className="text-base font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 py-1 bg-indigo-50/50 rounded-r-lg">
          {field.sectionTitle || '未命名分区'}
        </div>
      )
    }
    const labelText = field.label || `未命名字段（${field.type}）`
    const commonLabel = (
      <div className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
        {field.required && <span className="text-rose-500 font-bold">*</span>}
        <span>{labelText}</span>
      </div>
    )
    switch (field.type) {
      case 'text':
        return <>{commonLabel}<div className="h-10 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 text-sm text-slate-400 flex items-center">{field.placeholder || '单行输入…'}</div></>
      case 'number':
        return <>{commonLabel}<div className="h-10 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 text-sm text-slate-400 flex items-center">{field.placeholder || '0'}</div></>
      case 'date':
        return <>{commonLabel}<div className="h-10 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 text-sm text-slate-400 flex items-center">YYYY-MM-DD</div></>
      case 'textarea':
        return <>{commonLabel}<div className="h-20 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-400">{field.placeholder || '多行输入…'}</div></>
      case 'select':
        return <>{commonLabel}<div className="h-10 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 text-sm text-slate-400 flex items-center justify-between">{(field.options?.[0] || '选择项')}<span className="text-slate-300">▾</span></div></>
      case 'radio':
        return (
          <div>
            {commonLabel}
            <div className="flex flex-wrap gap-4">
              {(field.options || []).map((opt, i) => (
                <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                  <span className="w-4 h-4 rounded-full border-2 border-slate-300 inline-block"></span>
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          </div>
        )
      case 'eyeGrid':
        return (
          <div>
            {commonLabel}
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-2 py-2 text-left font-medium w-28">检查项</th>
                    <th className="px-2 py-2 font-medium">右眼 OD</th>
                    <th className="px-2 py-2 font-medium">左眼 OS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-400">
                  {(field.options || []).map((opt, i) => (
                    <tr key={i}>
                      <td className="px-2 py-2 text-slate-600">{opt}</td>
                      <td className="px-2 py-2"><span className="inline-block w-full h-6 rounded bg-slate-50"></span></td>
                      <td className="px-2 py-2"><span className="inline-block w-full h-6 rounded bg-slate-50"></span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      case 'matrix':
        return (
          <div>
            {commonLabel}
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-2 py-2 text-left font-medium w-24"></th>
                    {(field.cols || []).map((c, i) => (
                      <th key={i} className="px-2 py-2 font-medium">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-400">
                  {(field.rows || []).map((r, i) => (
                    <tr key={i}>
                      <td className="px-2 py-2 text-slate-600">{r}</td>
                      {(field.cols || []).map((_, j) => (
                        <td key={j} className="px-2 py-2"><span className="inline-block w-full h-6 rounded bg-slate-50"></span></td>
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
          <div>
            {commonLabel}
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    {(field.columns || []).map((c, i) => (
                      <th key={i} className="px-2 py-2 font-medium">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-400">
                  <tr>
                    {(field.columns || []).map((_, j) => (
                      <td key={j} className="px-2 py-2"><span className="inline-block w-full h-6 rounded bg-slate-50"></span></td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <div className="px-2 py-1.5 border-t border-slate-100 flex items-center gap-1 text-xs text-slate-400">
                <Plus className="w-3 h-3" /> 点击添加一行
              </div>
            </div>
          </div>
        )
      default:
        return <>{commonLabel}</>
    }
  }

  return (
    <div
      onClick={onSelect}
      className={classNames(
        'relative rounded-xl border transition-all cursor-pointer group',
        selected
          ? 'border-blue-500 bg-blue-50/30 shadow-[0_0_0_3px_rgba(59,130,246,0.10)]'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
      )}
    >
      <div className="p-4">
        {renderPreview()}
      </div>

      {/* 工具栏 */}
      <div className={classNames(
        'absolute top-2 right-2 flex items-center gap-1 transition-opacity',
        selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      )}>
        <button type="button" onClick={(e) => { e.stopPropagation(); onMoveUp() }} disabled={index === 0}
          className="h-7 w-7 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-40 flex items-center justify-center"
          title="上移">
          <GripVertical className="w-3.5 h-3.5 -rotate-90" />
        </button>
        <button type="button" onClick={(e) => { e.stopPropagation(); onMoveDown() }} disabled={index === total - 1}
          className="h-7 w-7 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-40 flex items-center justify-center"
          title="下移">
          <GripVertical className="w-3.5 h-3.5 rotate-90" />
        </button>
        <button type="button" onClick={(e) => { e.stopPropagation(); onDuplicate() }}
          className="h-7 w-7 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-blue-600 flex items-center justify-center"
          title="复制">
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="h-7 w-7 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-rose-600 flex items-center justify-center"
          title="删除">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

/* ================= PropertyPanel ================= */
function PropertyPanel({ field, onChange }: { field: BuilderField; onChange: (patch: Partial<BuilderField>) => void }) {
  const isSection = field.type === 'section'
  const hasOptions = ['select', 'radio', 'eyeGrid'].includes(field.type)
  const hasRowsCols = field.type === 'matrix'
  const hasColumns = field.type === 'dynamicList'
  const hasPlaceholder = ['text', 'number', 'textarea'].includes(field.type)

  const updateOptions = (newOpts: string[]) => onChange({ options: newOpts })
  const updateRows = (newRows: string[]) => onChange({ rows: newRows })
  const updateCols = (newCols: string[]) => onChange({ cols: newCols })
  const updateColumns = (newCols: string[]) => onChange({ columns: newCols })

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs">
        <span className="text-slate-400 mr-1">字段类型:</span>
        <span className="font-semibold text-slate-700">{fieldTypeLabel(field.type)}</span>
        <span className="text-slate-300 mx-1.5">·</span>
        <span className="text-slate-400 mr-1">KEY:</span>
        <code className="font-mono text-slate-600 bg-white px-1 rounded">{field.key}</code>
      </div>

      {isSection ? (
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-slate-600">分区标题</span>
          <input
            value={field.sectionTitle || ''}
            onChange={(e) => onChange({ sectionTitle: e.target.value })}
            className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
            placeholder="例如：一、人口学信息"
          />
        </label>
      ) : (
        <>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-600">字段标签</span>
            <input
              value={field.label}
              onChange={(e) => onChange({ label: e.target.value })}
              className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
              placeholder="字段的展示名称"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-600">字段 Key（唯一标识）</span>
            <input
              value={field.key}
              onChange={(e) => onChange({ key: e.target.value })}
              className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 font-mono"
              placeholder="英文 + 下划线"
            />
          </label>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
            <div>
              <div className="text-xs font-semibold text-slate-600">必填字段</div>
              <div className="text-[11px] text-slate-400 mt-0.5">采集时必须填写</div>
            </div>
            <button
              type="button"
              onClick={() => onChange({ required: !field.required })}
              className={classNames(
                'w-11 h-6 rounded-full relative transition-colors',
                field.required ? 'bg-blue-600' : 'bg-slate-300'
              )}
            >
              <span className={classNames(
                'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                field.required ? 'translate-x-5' : 'translate-x-0.5'
              )} />
            </button>
          </div>

          {hasPlaceholder && (
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-600">占位提示</span>
              <input
                value={field.placeholder || ''}
                onChange={(e) => onChange({ placeholder: e.target.value })}
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                placeholder="输入框内的提示文本"
              />
            </label>
          )}

          {hasOptions && (
            <EditableListEditor
              title={field.type === 'eyeGrid' ? '检查项列表' : '选项列表'}
              items={field.options || []}
              onChange={updateOptions}
            />
          )}

          {hasRowsCols && (
            <>
              <EditableListEditor title="行项目" items={field.rows || []} onChange={updateRows} />
              <EditableListEditor title="列项目" items={field.cols || []} onChange={updateCols} />
            </>
          )}

          {hasColumns && (
            <EditableListEditor title="列表头列" items={field.columns || []} onChange={updateColumns} />
          )}
        </>
      )}
    </div>
  )
}

function fieldTypeLabel(type: BuilderFieldType): string {
  return fieldTypePalette.find((p) => p.type === type)?.label ?? type
}

function EditableListEditor({ title, items, onChange }: { title: string; items: string[]; onChange: (v: string[]) => void }) {
  const updateItem = (i: number, val: string) => {
    const next = [...items]
    next[i] = val
    onChange(next)
  }
  const removeItem = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const addItem = () => onChange([...items, `新项目${items.length + 1}`])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600">{title}</span>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium"
        >
          <Plus className="w-3 h-3" /> 新增
        </button>
      </div>
      <div className="space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-mono w-5 text-right shrink-0">{i + 1}</span>
            <input
              value={it}
              onChange={(e) => updateItem(i, e.target.value)}
              className="flex-1 h-8 rounded-md border border-slate-200 px-2 text-sm outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              disabled={items.length <= 1}
              className="h-8 w-8 rounded-md text-slate-400 hover:text-rose-600 disabled:opacity-30 flex items-center justify-center"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
