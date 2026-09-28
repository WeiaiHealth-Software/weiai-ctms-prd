import React, { useState } from 'react';
import { Plus, Trash2, Save, Layers } from 'lucide-react';
import Drawer from '../../components/overlay/Drawer';
import SectionCard from '../../components/common/SectionCard';
import InputBlock from '../../components/form/InputBlock';
import Select from '../../components/form/Select';
import { classNames } from '../../lib/classNames';

export type DimensionType = 'enum' | 'number' | 'string' | 'boolean';

export type NewDimensionData = {
  title: string;
  description: string;
  type: DimensionType;
  options?: string[];
  numberMin?: string;
  numberMax?: string;
  numberStep?: string;
  stringMaxLength?: string;
  icon?: string;
};

type DimensionCreateDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewDimensionData) => void;
};

const DIMENSION_TYPE_OPTIONS = [
  { label: '枚举类型', value: 'enum', desc: '自定义离散选项，如性别：男、女' },
  { label: '数字类型', value: 'number', desc: '连续数值范围，如 10-21 mmHg' },
  { label: '字符串类型', value: 'string', desc: '自由文本输入，如病历号' },
  { label: '布尔类型', value: 'boolean', desc: '是/否 二元选项，如是否用药' }
];

const ICON_OPTIONS = [
  { value: 'ri-flask-line', label: '实验瓶' },
  { value: 'ri-capsule-line', label: '胶囊' },
  { value: 'ri-eye-line', label: '眼睛' },
  { value: 'ri-calendar-2-line', label: '日历' },
  { value: 'ri-book-line', label: '书本' },
  { value: 'ri-heart-pulse-line', label: '心跳' },
  { value: 'ri-thermometer-line', label: '温度计' },
  { value: 'ri-ruler-2-line', label: '尺子' }
];

const INITIAL_FORM: NewDimensionData = {
  title: '',
  description: '',
  type: 'enum',
  options: ['', ''],
  numberMin: '',
  numberMax: '',
  numberStep: '1',
  stringMaxLength: '',
  icon: 'ri-flask-line'
};

const FieldLabel: React.FC<{ label: string; required?: boolean; hint?: string }> = ({ label, required, hint }) => (
  <label className="block text-sm text-slate-700 mb-1.5">
    {label}
    {required && <span className="text-rose-500 ml-1">*</span>}
    {hint && <span className="ml-2 text-xs text-slate-400">{hint}</span>}
  </label>
);

export default function DimensionCreateDrawer({ open, onClose, onSubmit }: DimensionCreateDrawerProps) {
  const [form, setForm] = useState<NewDimensionData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = <K extends keyof NewDimensionData>(key: K, value: NewDimensionData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const addOption = () => {
    const options = [...(form.options || []), ''];
    updateField('options', options);
  };

  const removeOption = (index: number) => {
    if ((form.options?.length || 0) <= 2) return;
    const options = (form.options || []).filter((_, i) => i !== index);
    updateField('options', options);
  };

  const updateOption = (index: number, value: string) => {
    const options = [...(form.options || [])];
    options[index] = value;
    updateField('options', options);
    setErrors((prev) => {
      if (!prev.options) return prev;
      const next = { ...prev };
      delete next.options;
      return next;
    });
  };

  const handleTypeChange = (value: string) => {
    const type = value as DimensionType;
    const next: NewDimensionData = {
      ...form,
      type
    };
    if (type === 'enum') {
      next.options = ['', ''];
    }
    if (type === 'number') {
      next.numberMin = '';
      next.numberMax = '';
      next.numberStep = '1';
    }
    if (type === 'string') {
      next.stringMaxLength = '';
    }
    setForm(next);
    setErrors({});
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.title.trim()) nextErrors.title = '请输入维度标题';
    if (!form.type) nextErrors.type = '请选择维度类型';

    if (form.type === 'enum') {
      const validOptions = (form.options || []).filter(op => op.trim());
      if (validOptions.length < 2) {
        nextErrors.options = '枚举类型至少需要 2 个有效选项';
      }
      const uniqueOptions = new Set(validOptions.map(o => o.trim()));
      if (uniqueOptions.size !== validOptions.length) {
        nextErrors.options = '选项不能重复';
      }
    }

    if (form.type === 'number') {
      if (form.numberMin !== '' && form.numberMax !== '') {
        if (Number(form.numberMin) >= Number(form.numberMax)) {
          nextErrors.numberRange = '最小值必须小于最大值';
        }
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const submitData: NewDimensionData = { ...form };
    if (submitData.type === 'enum') {
      submitData.options = (submitData.options || []).filter(op => op.trim());
    }

    onSubmit(submitData);
    setForm(INITIAL_FORM);
    setErrors({});
  };

  const handleCancel = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    onClose();
  };

  const footer = (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={handleCancel}
        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
      >
        取消
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-700 active:scale-95 transition-all"
      >
        <Save className="w-4 h-4" />
        创建维度
      </button>
    </div>
  );

  return (
    <Drawer
      open={open}
      onClose={handleCancel}
      title="新增维度"
      subtitle="定义全局可用的随机化分层因素"
      width={720}
      footer={footer}
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-brand-50 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm">
              <Layers className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900">维度定义说明</div>
              <div className="mt-1 text-xs leading-5 text-slate-500">
                维度是临床试验中用于受试者分层随机化的关键因素。创建后可在项目配置中选择启用，系统会根据维度值自动完成分层均衡。
              </div>
            </div>
          </div>
        </div>

        <SectionCard title="基础信息" extra={<span className="text-xs font-medium text-slate-400">维度的展示与识别</span>}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <InputBlock
                label="维度标题"
                required
                value={form.title}
                onChange={(v) => updateField('title', v)}
                placeholder="请输入维度名称，如：性别维度、年龄分层"
              />
              {errors.title && <div className="mt-1 text-xs text-rose-500">{errors.title}</div>}
            </div>

            <div className="md:col-span-2">
              <FieldLabel label="维度描述" />
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={2}
                placeholder="简要描述该维度的用途与分层逻辑（选填）"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 bg-white resize-none"
              />
            </div>

            <div>
              <FieldLabel label="维度图标" />
              <div className="grid grid-cols-4 gap-2">
                {ICON_OPTIONS.map(icon => {
                  const active = form.icon === icon.value;
                  return (
                    <button
                      key={icon.value}
                      type="button"
                      onClick={() => updateField('icon', icon.value)}
                      title={icon.label}
                      className={classNames(
                        'h-11 rounded-xl border flex items-center justify-center transition-all',
                        active
                          ? 'border-brand-400 bg-brand-50 text-brand-600 ring-2 ring-brand-500/20'
                          : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                      )}
                    >
                      <i className={`${icon.value} text-xl`}></i>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="维度类型" extra={<span className="text-xs font-medium text-slate-400">决定数据录入与校验方式</span>}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {DIMENSION_TYPE_OPTIONS.map(opt => {
                const active = form.type === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleTypeChange(opt.value)}
                    className={classNames(
                      'rounded-2xl border p-4 text-left transition-all',
                      active
                        ? 'border-brand-400 bg-brand-50/50 ring-2 ring-brand-500/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    )}
                  >
                    <div className={classNames('text-sm font-bold', active ? 'text-brand-700' : 'text-slate-800')}>
                      {opt.label}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 leading-5">{opt.desc}</div>
                  </button>
                );
              })}
            </div>

            {form.type === 'enum' && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <FieldLabel label="枚举选项" required hint="至少 2 项，不能重复" />
                  <button
                    type="button"
                    onClick={addOption}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    <Plus className="w-3.5 h-3.5" /> 添加选项
                  </button>
                </div>
                <div className="space-y-2">
                  {(form.options || []).map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500">
                        {i + 1}
                      </div>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(i, e.target.value)}
                        placeholder={`选项 ${i + 1}`}
                        className="flex-1 h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        disabled={(form.options?.length || 0) <= 2}
                        className={classNames(
                          'p-2 rounded-lg transition-colors',
                          (form.options?.length || 0) <= 2
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                        )}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.options && <div className="mt-2 text-xs text-rose-500">{errors.options}</div>}
              </div>
            )}

            {form.type === 'number' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <InputBlock
                    label="最小值"
                    type="number"
                    value={form.numberMin}
                    onChange={(v) => updateField('numberMin', v)}
                    placeholder="如 10"
                  />
                </div>
                <div>
                  <InputBlock
                    label="最大值"
                    type="number"
                    value={form.numberMax}
                    onChange={(v) => updateField('numberMax', v)}
                    placeholder="如 21"
                  />
                </div>
                <div>
                  <InputBlock
                    label="步长"
                    type="number"
                    value={form.numberStep}
                    onChange={(v) => updateField('numberStep', v)}
                    placeholder="如 1"
                  />
                </div>
              </div>
            )}
            {form.type === 'number' && errors.numberRange && (
              <div className="text-xs text-rose-500">{errors.numberRange}</div>
            )}
            {form.type === 'number' && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 leading-5">
                系统会根据范围自动生成选项区间，如最小值 10、最大值 21、步长 1，会生成 [10-15, 15-21, {'>'}21] 三个分层区间。
              </div>
            )}

            {form.type === 'string' && (
              <div>
                <InputBlock
                  label="最大长度限制"
                  type="number"
                  value={form.stringMaxLength}
                  onChange={(v) => updateField('stringMaxLength', v)}
                  placeholder="选填，如 50"
                />
              </div>
            )}
            {form.type === 'string' && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 leading-5">
                字符串类型维度通常用于辅助标识，不直接参与分层随机化。如需分层，请使用枚举或数字类型。
              </div>
            )}

            {form.type === 'boolean' && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 text-sm font-bold rounded-lg shadow-sm">是</span>
                    <span className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-lg shadow-sm">否</span>
                  </div>
                  <span className="text-xs text-slate-500">布尔类型固定为这两个选项，无需额外配置</span>
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        {form.type === 'enum' && (form.options || []).filter(o => o.trim()).length >= 2 && (
          <SectionCard title="预览效果">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex flex-wrap gap-2">
                {(form.options || []).filter(o => o.trim()).map((opt, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg shadow-sm">
                    {opt.trim()}
                  </span>
                ))}
              </div>
            </div>
          </SectionCard>
        )}
      </div>
    </Drawer>
  );
}
