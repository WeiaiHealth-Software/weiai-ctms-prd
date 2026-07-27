import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import Select, { type SelectOption } from '../../../../components/form/Select'
import MultiSelect from '../../../../components/form/MultiSelect'
import type { VisitInterval } from '../../../../types/project'
import { classNames } from '../../../../lib/classNames'

export type CreateProjectFormValue = {
  name: string
  code: string
  pi: string
  centers: string[]
  targetEnrollment: number
  visitStages: number
  visitInterval: VisitInterval
}

type CreateProjectModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (value: CreateProjectFormValue) => void
  piOptions: SelectOption[]
  centerOptions: SelectOption[]
  existingCodes: string[]
}

type FormState = {
  name: string
  code: string
  pi: string
  centers: string[]
  targetEnrollment: string
  visitStages: string
  visitInterval: VisitInterval
}

const initialFormState: FormState = {
  name: '',
  code: '',
  pi: '',
  centers: [],
  targetEnrollment: '',
  visitStages: '',
  visitInterval: '3M'
}

const visitIntervalOptions: VisitInterval[] = ['1M', '3M', '6M', '12M']

export default function CreateProjectModal({
  open,
  onClose,
  onSubmit,
  piOptions,
  centerOptions,
  existingCodes
}: CreateProjectModalProps) {
  const [form, setForm] = useState<FormState>(initialFormState)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setForm(initialFormState)
        setError('')
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose, open])

  const normalizedExistingCodes = useMemo(
    () => existingCodes.map(code => code.trim().toUpperCase()),
    [existingCodes]
  )

  if (!open) return null

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setError('')
  }

  const resetAndClose = () => {
    setForm(initialFormState)
    setError('')
    onClose()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const name = form.name.trim()
    const code = form.code.trim().toUpperCase()
    const pi = form.pi.trim()
    const targetEnrollment = Number(form.targetEnrollment)
    const visitStages = Number(form.visitStages)

    if (!name || !code || !pi) {
      setError('请填写完整的项目名称、编号和项目负责人。')
      return
    }

    if (normalizedExistingCodes.includes(code)) {
      setError('项目编号已存在，请使用新的编号。')
      return
    }

    if (form.centers.length === 0) {
      setError('请至少选择一个参与中心。')
      return
    }

    if (!Number.isFinite(targetEnrollment) || targetEnrollment <= 0) {
      setError('参与人数需填写大于 0 的整数。')
      return
    }

    if (!Number.isFinite(visitStages) || visitStages <= 0) {
      setError('访视阶段需填写大于 0 的整数。')
      return
    }

    onSubmit({
      name,
      code,
      pi,
      centers: form.centers,
      targetEnrollment,
      visitStages,
      visitInterval: form.visitInterval
    })

    setForm(initialFormState)
    setError('')
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={resetAndClose} />
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <div className="text-lg font-bold text-slate-900">新建 EDC 项目</div>
            <div className="mt-1 text-sm text-slate-500">
              创建完成后项目状态自动标记为未配置，后续完成表单配置后再进入筹备或启动流程。
            </div>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 bg-slate-50 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">项目名称</span>
                  <input
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    placeholder="请输入项目名称"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">编号</span>
                  <input
                    value={form.code}
                    onChange={(event) => updateField('code', event.target.value)}
                    placeholder="例如 XW10 / EDC001"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm uppercase text-slate-700 outline-none transition focus:border-blue-500"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">项目负责人 PI</span>
                  <Select
                    value={form.pi}
                    onChange={(value) => updateField('pi', value)}
                    options={piOptions}
                    placeholder="请选择项目负责人"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">参与人数</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={form.targetEnrollment}
                    onChange={(event) => updateField('targetEnrollment', event.target.value)}
                    placeholder="请输入计划参与人数"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                  />
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">参与中心</span>
                <MultiSelect
                  value={form.centers}
                  onChange={(value) => updateField('centers', value)}
                  options={centerOptions}
                  placeholder="请选择参与中心"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">访视阶段</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={form.visitStages}
                    onChange={(event) => updateField('visitStages', event.target.value)}
                    placeholder="请输入阶段数量"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                  />
                </label>

                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">访视间隔</span>
                  <div className="flex rounded-2xl border border-slate-200 bg-white p-1">
                    {visitIntervalOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('visitInterval', option)}
                        className={classNames(
                          'flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-colors',
                          form.visitInterval === option
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">创建预览</div>
              <div className="mt-4 space-y-4">
                <div>
                  <div className="text-xs text-slate-400">项目状态</div>
                  <div className="mt-1 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    未配置
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">项目编号</div>
                  <div className="mt-1 font-mono text-sm font-semibold text-slate-700">
                    {form.code.trim().toUpperCase() || '--'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">参与中心</div>
                  <div className="mt-1 text-sm leading-6 text-slate-700">
                    {form.centers.length > 0 ? form.centers.join('、') : '--'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">访视规划</div>
                  <div className="mt-1 space-y-1 text-sm text-slate-700">
                    <div>访视阶段：{form.visitStages || '--'}</div>
                    <div>访视周期：{form.visitInterval}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">参与人数</div>
                  <div className="mt-1 text-sm font-semibold text-slate-700">
                    0/{form.targetEnrollment || '--'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-white px-6 py-4">
            <div className="min-h-6 text-sm text-rose-600">{error}</div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={resetAndClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700"
              >
                创建项目
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
