import { ArrowLeft, Building, Check, ChevronDown, ChevronRight, Copy, Eye, FileSpreadsheet, FileText, GripVertical, Hash, Hospital, LayoutGrid, ListChecks, PanelTop, Plus, Rows3, Save, Settings2, Sparkles, Stethoscope, Table, Trash2, Type, User, Activity, Calendar } from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEdcProjectStore } from '../../../store/useEdcProjectStore'
import { useHeaderStore } from '../../../store/useHeaderStore'
import type { BuilderField, BuilderFieldType } from '../../../types/form-field'
import type { FormConfig } from '../../../types/project'
import { classNames } from '../../../lib/classNames'
import Drawer from '../../../components/overlay/Drawer'

type ConfigureStep = 'baseline' | 'visit'

const basicFieldPalette: { type: BuilderFieldType; label: string; icon: React.ReactNode }[] = [
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
  borderColor: string
  fields: Omit<BuilderField, 'id'>[]
}

const customBlocks: CustomBlock[] = [
  {
    id: 'subject-demographic',
    name: '受试者基本信息',
    description: '人口学信息：姓名缩写、性别、出生日期、年龄等',
    icon: <User className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'hover:border-blue-400',
    fields: [
      { type: 'section', key: 'sec_demographic', label: '', sectionTitle: '一、人口学信息' },
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
    borderColor: 'hover:border-violet-400',
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
    borderColor: 'hover:border-emerald-400',
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
    borderColor: 'hover:border-amber-400',
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
    borderColor: 'hover:border-rose-400',
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
    borderColor: 'hover:border-slate-400',
    fields: [
      { type: 'section', key: 'sec_conclusion', label: '', sectionTitle: '结论与备注' },
      { type: 'textarea', key: 'visit_conclusion', label: '访视结论', placeholder: '本次访视的主要结论和评估…', sectionId: 'sec_conclusion' },
      { type: 'text', key: 'researcher_name', label: '研究者签名', sectionId: 'sec_conclusion' },
      { type: 'date', key: 'researcher_sign_date', label: '签名日期', sectionId: 'sec_conclusion' },
      { type: 'textarea', key: 'visit_note', label: '备注', placeholder: '其他需要记录的信息…', sectionId: 'sec_conclusion' },
    ],
  },
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
  { id: 'f-name', type: 'text', key: 'name', label: '受试者姓名缩写', required: true, placeholder: '请输入姓名缩写，如 Z-San', sectionId: 'sec-demographic' },
  { id: 'f-gender', type: 'radio', key: 'gender', label: '性别', required: true, options: ['男', '女'], sectionId: 'sec-demographic' },
  { id: 'f-birth', type: 'date', key: 'birthDate', label: '出生日期', required: true, sectionId: 'sec-demographic' },
  { id: 'f-age', type: 'number', key: 'age', label: '入组年龄（岁）', required: true, placeholder: '如 10', sectionId: 'sec-demographic' },
  { id: 'sec-medical', type: 'section', key: 'sec_medical', label: '', sectionTitle: '二、眼科基础检查' },
  { id: 'f-eyes', type: 'eyeGrid', key: 'eyeExam', label: '屈光/视功能检查', required: true, options: ['SE', 'BCVA（LogMAR）', '眼轴 AL(mm)', '角膜K1', '角膜K2', '瞳孔直径'], sectionId: 'sec-medical' },
  { id: 'f-diagnosis', type: 'select', key: 'diagnosis', label: '近视类型', options: ['单纯性近视', '高度近视', '病理性近视', '其他'], sectionId: 'sec-medical' },
  { id: 'f-note', type: 'textarea', key: 'baselineNote', label: '基线备注', placeholder: '其他需要记录的基线信息…' },
]

const defaultVisitFields: BuilderField[] = [
  { id: 'sec-visit-basic', type: 'section', key: 'sec_visit_basic', label: '', sectionTitle: '一、访视基础' },
  { id: 'f-visit-date', type: 'date', key: 'visitDate', label: '本次访视日期', required: true, sectionId: 'sec-visit-basic' },
  { id: 'f-visit-type', type: 'radio', key: 'visitType', label: '访视性质', required: true, options: ['按计划随访', '提前返院', '逾期随访', '临时就诊'], sectionId: 'sec-visit-basic' },
  { id: 'f-compliance', type: 'radio', key: 'compliance', label: '依从性', required: true, options: ['优（≥90%）', '良（70%-90%）', '一般（50%-70%）', '差（<50%）'], sectionId: 'sec-visit-basic' },
  { id: 'sec-visit-eye', type: 'section', key: 'sec_visit_eye', label: '', sectionTitle: '二、眼科复查' },
  { id: 'f-visit-eyes', type: 'eyeGrid', key: 'visitEyeExam', label: '视力/屈光/眼轴复查', required: true, options: ['UCVA', 'BCVA（LogMAR）', 'SE（等效球镜）', '眼轴 AL(mm)'], sectionId: 'sec-visit-eye' },
  { id: 'f-adverse', type: 'radio', key: 'adverseEvent', label: '不良事件', required: true, options: ['无', '有（需在下方记录）'], sectionId: 'sec-visit-eye' },
  { id: 'f-adverse-detail', type: 'textarea', key: 'adverseDetail', label: '不良事件描述', placeholder: '若有不良事件，请详细描述：症状、发生时间、处理措施、转归…', sectionId: 'sec-visit-eye' },
  { id: 'f-next-date', type: 'date', key: 'nextVisitDate', label: '下次访视日期', sectionId: 'sec-visit-eye' },
  { id: 'f-visit-note', type: 'textarea', key: 'visitNote', label: '本次访视备注', placeholder: '其他需要记录的信息…' },
]

function createField(type: BuilderFieldType, index: number, lastSectionId?: string | null): BuilderField {
  const id = `f_${Date.now()}_${index}`
  const base: BuilderField = {
    id,
    type,
    key: `${type}_${Date.now().toString(36)}`,
    label: '',
    required: false,
    sectionId: type !== 'section' ? (lastSectionId ?? null) : undefined,
  }
  switch (type) {
    case 'section':
      return { ...base, label: '', sectionTitle: '新模块容器' }
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
  const [baselineSaved, setBaselineSaved] = useState(false)
  const [visitSaved, setVisitSaved] = useState(false)

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
      const hasBaseline = !!project.baselineForm?.fields?.length
      const hasVisit = !!project.visitForm?.fields?.length
      setBaselineFields(hasBaseline ? project.baselineForm.fields : defaultBaselineFields)
      setVisitFields(hasVisit ? project.visitForm.fields : defaultVisitFields)
      setBaselineSaved(hasBaseline)
      setVisitSaved(hasVisit)
    }
  }, [project, setTitle])

  const currentFields = step === 'baseline' ? baselineFields : visitFields
  const setCurrentFields = step === 'baseline' ? setBaselineFields : setVisitFields

  const addField = (type: BuilderFieldType) => {
    const lastSectionId = currentFields.filter((f) => f.type === 'section').at(-1)?.id ?? null
    const field = createField(type, currentFields.length, lastSectionId)
    setCurrentFields((prev) => [...prev, field])
    setSelectedFieldId(field.id)
  }

  const addFields = (newFields: BuilderField[]) => {
    if (!newFields.length) return
    setCurrentFields((prev) => [...prev, ...newFields])
    setSelectedFieldId(newFields[0].id)
  }

  const handleAddBlock = (block: CustomBlock) => {
    const now = Date.now()
    const blockFields: BuilderField[] = block.fields.map((f, idx) => ({
      ...f,
      id: `cfg_blk_${now}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
    }))
    // 重新串联 sectionId：把老 key 形式的 sectionId 映射为新 id
    const oldKeyToNewId: Record<string, string> = {}
    block.fields.forEach((orig, i) => {
      if (orig.type === 'section') oldKeyToNewId[orig.key] = blockFields[i].id
    })
    blockFields.forEach((f, i) => {
      const orig = block.fields[i]
      if (f.type !== 'section' && orig.sectionId && oldKeyToNewId[orig.sectionId]) {
        f.sectionId = oldKeyToNewId[orig.sectionId]
      } else if (f.type !== 'section' && !f.sectionId && blockFields[0].type === 'section') {
        f.sectionId = blockFields[0].id
      }
    })
    addFields(blockFields)
  }

  const duplicateField = (fieldId: string) => {
    const idx = currentFields.findIndex((f) => f.id === fieldId)
    if (idx === -1) return
    const origin = currentFields[idx]
    const ts = Date.now()
    if (origin.type === 'section') {
      const children = currentFields.filter((f) => f.sectionId === origin.id)
      const sectionCopy: BuilderField = {
        ...origin,
        id: `dup_sec_${ts}`,
        key: `${origin.key}_copy`,
        sectionTitle: origin.sectionTitle ? `${origin.sectionTitle}（副本）` : undefined,
      }
      const childCopies = children.map((c, i) => ({
        ...c,
        id: `dup_f_${ts}_${i}`,
        key: `${c.key}_copy_${i}`,
        sectionId: sectionCopy.id,
      }))
      setCurrentFields((prev) => {
        // 找到该 section 的所有子字段结尾，作为插入点
        const block = [origin, ...children]
        const lastOfBlock = block[block.length - 1]
        const lastIdx = prev.findIndex((f) => f.id === lastOfBlock.id)
        const next = [...prev]
        next.splice(lastIdx + 1, 0, sectionCopy, ...childCopies)
        return next
      })
      setSelectedFieldId(sectionCopy.id)
    } else {
      const copy: BuilderField = {
        ...origin,
        id: `dup_${ts}`,
        key: `${origin.key}_copy_${ts.toString(36)}`,
      }
      setCurrentFields((prev) => {
        const next = [...prev]
        next.splice(idx + 1, 0, copy)
        return next
      })
      setSelectedFieldId(copy.id)
    }
  }

  const deleteField = (fieldId: string) => {
    setCurrentFields((prev) => {
      const target = prev.find((f) => f.id === fieldId)
      if (!target) return prev
      if (target.type === 'section') {
        return prev.filter((f) => f.id !== fieldId && f.sectionId !== fieldId)
      }
      return prev.filter((f) => f.id !== fieldId)
    })
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

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    setCurrentFields((prev) => {
      const index = prev.findIndex((f) => f.id === sectionId)
      if (index < 0 || prev[index].type !== 'section') return prev
      const children = prev.filter((f) => f.sectionId === sectionId)
      const blockLen = 1 + children.length
      let nextIndex: number
      if (direction === 'up') {
        nextIndex = index - 1
        if (nextIndex < 0) return prev
        const cursor = prev[nextIndex]
        if (cursor.type === 'section') {
          const cursorChildren = prev.filter((f) => f.sectionId === cursor.id)
          nextIndex = nextIndex - cursorChildren.length
        }
      } else {
        nextIndex = index + blockLen
        if (nextIndex >= prev.length) return prev
      }
      const block: BuilderField[] = [prev[index], ...children]
      const others = prev.filter((f) => f.id !== sectionId && f.sectionId !== sectionId)
      const next = [...others]
      next.splice(nextIndex, 0, ...block)
      return next
    })
  }

  const addFieldToSection = (type: BuilderFieldType, sectionId: string) => {
    const field = createField(type, currentFields.length, null)
    field.sectionId = sectionId
    setCurrentFields((prev) => [...prev, field])
    setSelectedFieldId(field.id)
  }

  const toggleSectionCollapse = (sectionId: string) => {
    setCurrentFields((prev) =>
      prev.map((f) => (f.id === sectionId ? { ...f, collapsed: !f.collapsed } : f))
    )
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
      setBaselineSaved(true)
      setStep('visit')
      setSelectedFieldId(null)
    } else {
      if (project && projectId) {
        const baselineCfg: FormConfig = { fields: baselineFields }
        const visitCfg: FormConfig = { fields: visitFields }
        markProjectConfigured(projectId, baselineCfg, visitCfg)
      }
      setVisitSaved(true)
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

  const { sections, orphanFields, globalIdxByFieldId } = useMemo(() => {
    const sections: BuilderField[] = []
    const orphans: BuilderField[] = []
    const idxMap = new Map<string, number>()
    currentFields.forEach((f, i) => {
      idxMap.set(f.id, i)
      if (f.type === 'section') sections.push(f)
      else if (!f.sectionId) orphans.push(f)
    })
    return { sections, orphanFields: orphans, globalIdxByFieldId: idxMap }
  }, [currentFields])

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
                baselineSaved && step !== 'baseline'
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : step === 'baseline'
                  ? 'border-blue-500 bg-blue-50/60 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={classNames(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold',
                  baselineSaved
                    ? 'bg-emerald-600 text-white'
                    : step === 'baseline'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-500'
                )}>
                  {baselineSaved ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <div>
                  <div className={classNames(
                    'text-sm font-bold',
                    baselineSaved
                      ? 'text-emerald-800'
                      : step === 'baseline'
                      ? 'text-blue-800'
                      : 'text-slate-700'
                  )}>
                    第一步 · 基线表单
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {baselineSaved ? '已保存配置' : `入组基线采集（${baselineFields.length} 项）`}
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setStep('visit')}
              className={classNames(
                'text-left rounded-2xl border p-4 transition-all group',
                visitSaved && step !== 'visit'
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : step === 'visit'
                  ? 'border-blue-500 bg-blue-50/60 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={classNames(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold',
                  visitSaved
                    ? 'bg-emerald-600 text-white'
                    : step === 'visit'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-500'
                )}>
                  {visitSaved ? <Check className="w-4 h-4" /> : '2'}
                </div>
                <div>
                  <div className={classNames(
                    'text-sm font-bold',
                    visitSaved
                      ? 'text-emerald-800'
                      : step === 'visit'
                      ? 'text-blue-800'
                      : 'text-slate-700'
                  )}>
                    第二步 · 访视表单
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {visitSaved ? '已保存配置' : `${visitLabels.join(' / ')} 共用（${visitFields.length} 项）`}
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
          <PaletteSection
            step={step}
            onAdd={addField}
            onAddBlock={handleAddBlock}
          />
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
                <div className="space-y-4">
                  {sections.map((section, sIdx) => {
                    const childFields = currentFields.filter((f) => f.sectionId === section.id)
                    const anyChildActive = selectedFieldId === section.id ||
                      childFields.some((c) => c.id === selectedFieldId)
                    const canMoveSecUp = sIdx > 0
                    const canMoveSecDown = sIdx < sections.length - 1
                    return (
                      <div
                        key={section.id}
                        className={classNames(
                          'rounded-2xl border transition-all bg-white overflow-hidden group',
                          anyChildActive
                            ? 'border-blue-300 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
                            : 'border-slate-200 hover:border-slate-300'
                        )}
                      >
                        {/* Section Header */}
                        <div
                          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-50/70 to-slate-50 border-b border-slate-100 cursor-pointer"
                          onClick={() => setSelectedFieldId(section.id)}
                        >
                          {/* 编辑专属：装饰拖拽手柄 (非真拖拽, 仅视觉暗示) */}
                          <div className="shrink-0 text-slate-300 group-hover:text-slate-400 transition-all opacity-40 group-hover:opacity-100">
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <span className="inline-block w-1.5 h-6 rounded-sm bg-indigo-500 shrink-0" />
                          <div className="font-semibold text-slate-800 truncate min-w-0">
                            {section.sectionTitle || '未命名模块容器'}
                          </div>
                          <span className={classNames(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold',
                            'bg-indigo-100/70 text-indigo-700 border border-indigo-200/60 shrink-0'
                          )}>
                            {childFields.length} 项
                          </span>
                          <div className="flex-1" />
                          {/* 编辑专属工具栏：整体全隐 hover 才出现 */}
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (canMoveSecUp) moveSection(section.id, 'up')
                              }}
                              disabled={!canMoveSecUp}
                              className={classNames(
                                'w-7 h-7 rounded-lg flex items-center justify-center transition',
                                canMoveSecUp
                                  ? 'text-slate-500 hover:text-blue-600 hover:bg-white'
                                  : 'text-slate-300 cursor-not-allowed'
                              )}
                              title="上移整个模块"
                            >
                              <ChevronRight className="w-4 h-4 -rotate-90" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (canMoveSecDown) moveSection(section.id, 'down')
                              }}
                              disabled={!canMoveSecDown}
                              className={classNames(
                                'w-7 h-7 rounded-lg flex items-center justify-center transition',
                                canMoveSecDown
                                  ? 'text-slate-500 hover:text-blue-600 hover:bg-white'
                                  : 'text-slate-300 cursor-not-allowed'
                              )}
                              title="下移整个模块"
                            >
                              <ChevronRight className="w-4 h-4 rotate-90" />
                            </button>
                            <div className="w-px h-5 bg-slate-200 mx-0.5" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                addFieldToSection('text', section.id)
                              }}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-white transition"
                              title="模块内新增文本字段"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                duplicateField(section.id)
                              }}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:bg-white transition"
                              title="复制整个模块（含内部字段）"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteField(section.id)
                              }}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="删除整个模块（含内部字段）"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleSectionCollapse(section.id)
                            }}
                            className={classNames(
                              'shrink-0 w-6 h-6 rounded-md flex items-center justify-center hover:bg-white transition-all',
                              'text-slate-400 group-hover:text-slate-600 opacity-60 group-hover:opacity-100'
                            )}
                          >
                            <ChevronDown className={classNames(
                              'w-4 h-4 transition-transform',
                              section.collapsed && '-rotate-90'
                            )} />
                          </button>
                        </div>
                        {/* Section Body */}
                        {!section.collapsed && childFields.length > 0 && (
                          <div className="p-4 space-y-3 bg-slate-50/40">
                            {childFields.map((child, i) => {
                              const globalIdx = globalIdxByFieldId.get(child.id) ?? -1
                              const canMoveUp = i > 0
                              const canMoveDown = i < childFields.length - 1
                              return (
                                <FieldRow
                                  key={child.id}
                                  field={child}
                                  index={i}
                                  total={childFields.length}
                                  selected={child.id === selectedFieldId}
                                  onSelect={() => setSelectedFieldId(child.id)}
                                  onMoveUp={() => canMoveUp && moveField(globalIdx, -1)}
                                  onMoveDown={() => canMoveDown && moveField(globalIdx, 1)}
                                  onDuplicate={() => duplicateField(child.id)}
                                  onDelete={() => deleteField(child.id)}
                                />
                              )
                            })}
                          </div>
                        )}
                        {!section.collapsed && childFields.length === 0 && (
                          <div className="px-4 py-6 text-center text-xs text-slate-400 bg-slate-50/40">
                            模块内暂无字段 · 点击右上角 <Plus className="w-3 h-3 inline" /> 新增
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Orphan Fields */}
                  {orphanFields.length > 0 && (
                    <>
                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase shrink-0 px-2">
                          未归属模块字段 · {orphanFields.length} 项
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                      </div>
                      <div className="space-y-3">
                        {orphanFields.map((field) => {
                          const globalIdx = globalIdxByFieldId.get(field.id) ?? -1
                          return (
                            <FieldRow
                              key={field.id}
                              field={field}
                              index={globalIdx}
                              total={currentFields.length}
                              selected={field.id === selectedFieldId}
                              onSelect={() => setSelectedFieldId(field.id)}
                              onMoveUp={() => moveField(globalIdx, -1)}
                              onMoveDown={() => moveField(globalIdx, 1)}
                              onDuplicate={() => duplicateField(field.id)}
                              onDelete={() => deleteField(field.id)}
                            />
                          )
                        })}
                      </div>
                    </>
                  )}
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
  return basicFieldPalette.find((p) => p.type === type)?.label ?? type
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

/* ================= PaletteSectionPreviewContent (预览专用 ================= */
function PalettePreviewContent({ block }: { block: CustomBlock }) {
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

/* ================= PaletteSection ================= */
function PaletteSection({
  step,
  onAdd,
  onAddBlock,
}: {
  step: ConfigureStep
  onAdd: (type: BuilderFieldType) => void
  onAddBlock: (block: CustomBlock) => void
}) {
  const [activeTab, setActiveTab] = useState<'basic' | 'custom'>('basic')
  const [previewBlock, setPreviewBlock] = useState<CustomBlock | null>(null)

  const recommendedBlocks = step === 'baseline'
    ? customBlocks.filter(b => ['subject-demographic', 'eye-basic-exam', 'medical-history', 'conclusion-section'].includes(b.id))
    : customBlocks.filter(b => ['visit-basic', 'visit-eye-followup', 'conclusion-section'].includes(b.id))

  const previewFooter = previewBlock ? (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <div className={classNames('w-8 h-8 rounded-lg flex items-center justify-center', previewBlock.bgColor, previewBlock.color)}>
          {previewBlock.icon}
        </div>
        <div>
          <div className="font-medium text-slate-700">{previewBlock.name}</div>
          <div>共 {previewBlock.fields.length} 个字段将插入当前表单末尾</div>
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
          onClick={() => { onAddBlock(previewBlock); setPreviewBlock(null); }}
          className="h-10 px-6 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          插入此区块
        </button>
      </div>
    </div>
  ) : undefined

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden sticky top-4">
        <div className="px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Type className="w-4 h-4 text-slate-500" />
            组件库
            {step === 'baseline' && (
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 font-medium">基线专用</span>
            )}
            {step === 'visit' && (
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-medium">访视专用</span>
            )}
          </div>
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

        <div className="flex-1 overflow-y-auto max-h-[640px]">
          {activeTab === 'basic' ? (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2.5">
                {basicFieldPalette.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => onAdd(item.type)}
                    className="rounded-xl border border-slate-200 p-2.5 text-left hover:border-blue-300 hover:bg-blue-50 transition bg-white group"
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div className="text-xs font-medium text-slate-700 text-center leading-tight">
                        {item.label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <div className="text-[10px] text-slate-400 font-medium px-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                为当前阶段推荐 {recommendedBlocks.length} 个常用区块
              </div>
              {recommendedBlocks.map((block) => {
                const fieldCount = block.fields.length
                const sectionField = block.fields.find(f => f.type === 'section')
                const sectionTitle = sectionField?.sectionTitle || ''
                const requiredCount = block.fields.filter(f => f.required).length
                const handlePreviewClick = (e: React.MouseEvent) => {
                  e.stopPropagation()
                  setPreviewBlock(block)
                }

                return (
                  <div
                    key={block.id}
                    className="w-full relative rounded-xl border border-slate-200 bg-white p-3 text-left hover:shadow-md hover:border-slate-300 transition-all group"
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
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
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
              })}
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
      </div>

      <Drawer
        open={!!previewBlock}
        title={previewBlock ? `预览：${previewBlock.name}` : ''}
        subtitle={previewBlock ? `${previewBlock.fields.length} 个字段 · 点击下方按钮确认插入到当前表单末尾` : ''}
        onClose={() => setPreviewBlock(null)}
        footer={previewFooter}
        width={560}
        bodyClassName="p-5 bg-slate-50/30"
      >
        {previewBlock && <PalettePreviewContent block={previewBlock} />}
      </Drawer>
    </>
  )
}
