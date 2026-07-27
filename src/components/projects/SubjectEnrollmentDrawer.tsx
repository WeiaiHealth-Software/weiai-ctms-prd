import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, BadgeCheck, CircleHelp, Dices, LoaderCircle, RefreshCw, ShieldCheck, UserRoundPlus } from 'lucide-react';
import Drawer from '../overlay/Drawer';
import SectionCard from '../common/SectionCard';
import InputBlock from '../form/InputBlock';
import Select from '../form/Select';
import type { EnrollmentRow, ProjectSummary } from '../../mock/projects';

type BinaryChoice = 'no' | 'yes';
type FamilyMyopia = 'none' | 'father' | 'mother' | 'both';

type EnrollmentFormState = {
  name: string;
  gender: 'male' | 'female';
  phone: string;
  birthDate: string;
  height: string;
  weight: string;
  source: string;
  sourceRemark: string;
  center: string;
  doctor: string;
  excludeRisk: boolean;
  history: BinaryChoice;
  allergy: BinaryChoice;
  medication: BinaryChoice;
  familyMyopia: FamilyMyopia;
  diopter: string;
  consented: boolean;
};

type EnrollmentOutcome = {
  status: 'success' | 'failure';
  title: string;
  summary: string;
  reasons: string[];
  row: EnrollmentRow;
  matchNotes: string[];
};

type DrawerPhase = 'form' | 'matching' | 'result';

type SubjectEnrollmentDrawerProps = {
  open: boolean;
  project: ProjectSummary;
  existingRows: EnrollmentRow[];
  onClose: () => void;
  onComplete: (outcome: EnrollmentOutcome) => void;
};

const CENTER_DOCTOR_MAP: Record<string, string[]> = {
  徐州眼视光中心: ['王医生', '李医生', '赵医生'],
  上海市眼病防治中心: ['李医生', '张主任', '王医生'],
  上海眼科中心: ['李医生', '张主任', '王医生'],
  北京同仁医院: ['张医生', '李主任', '赵医生'],
  广州中山医院: ['陈医生', '周医生', '刘主任']
};

const INITIAL_FORM: EnrollmentFormState = {
  name: '',
  gender: 'male',
  phone: '',
  birthDate: '',
  height: '',
  weight: '',
  source: '',
  sourceRemark: '',
  center: '',
  doctor: '',
  excludeRisk: false,
  history: 'no',
  allergy: 'no',
  medication: 'no',
  familyMyopia: 'none',
  diopter: '',
  consented: false
};

const FAMILY_NAMES = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王'];
const GIVEN_NAMES = ['沐阳', '书言', '知远', '可心', '雨桐', '嘉宁', '星禾', '子安', '语彤', '乐然'];
const SOURCES: EnrollmentFormState['source'][] = ['门诊', '招募', '其他'];

const pickOne = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const pad = (value: number) => String(value).padStart(2, '0');

const createRandomBirthDate = (age: number) => {
  const today = new Date();
  const year = today.getFullYear() - age;
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  return `${year}-${pad(month)}-${pad(day)}`;
};

const createRandomPhone = () => `1${randomInt(30, 99)}${randomInt(1000, 9999)}${randomInt(1000, 9999)}`;

const createRandomName = () => `${pickOne(FAMILY_NAMES)}${pickOne(GIVEN_NAMES)}`;

const createRandomForm = (project: ProjectSummary, shouldFail: boolean): EnrollmentFormState => {
  const center = pickOne((project.centers || []).length ? project.centers : Object.keys(CENTER_DOCTOR_MAP));
  const doctors = CENTER_DOCTOR_MAP[center] || ['王医生'];
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const age = shouldFail ? randomInt(7, 10) : randomInt(6, 13);
  const source = pickOne(SOURCES);
  const validDiopter = `-${randomInt(1, 3)}.${randomInt(0, 9)}0`;

  return {
    name: createRandomName(),
    gender,
    phone: createRandomPhone(),
    birthDate: createRandomBirthDate(age),
    height: String(randomInt(122, 156)),
    weight: String(randomInt(24, 48)),
    source,
    sourceRemark: source === '其他' ? '院内宣教转介绍' : '',
    center,
    doctor: pickOne(doctors),
    excludeRisk: false,
    history: 'no',
    allergy: 'no',
    medication: 'no',
    familyMyopia: pickOne(['none', 'father', 'mother', 'both'] as FamilyMyopia[]),
    diopter: shouldFail ? '-0.20' : validDiopter,
    consented: true
  };
};

const getAgeFromBirthDate = (birthDate: string) => {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
};

const getGenderLabel = (gender: EnrollmentFormState['gender']) => (gender === 'male' ? '男' : '女');

const getAgeTag = (age: number | null) => {
  if (age === null) return '--';
  if (age <= 7) return '4-7岁';
  if (age <= 10) return '8-10岁';
  return '11-14岁';
};

const getNextSequence = (rows: EnrollmentRow[]) => {
  const numbers = rows
    .map((row) => {
      const match = row.screenId?.match(/\d+/);
      return match ? Number(match[0]) : 0;
    })
    .filter((value) => Number.isFinite(value));

  return (numbers.length ? Math.max(...numbers) : 0) + 1;
};

const getNextDrugId = (group: string, sequence: number) => {
  const prefix = group === '实验组' ? 'A' : 'B';
  return `D-${prefix}${String(sequence).padStart(3, '0')}`;
};

const getHash = (value: string) =>
  Array.from(value).reduce((sum, char) => {
    return sum + char.charCodeAt(0);
  }, 0);

const buildResult = (
  project: ProjectSummary,
  existingRows: EnrollmentRow[],
  form: EnrollmentFormState
): EnrollmentOutcome => {
  const age = getAgeFromBirthDate(form.birthDate);
  const diopter = Number(form.diopter);
  const normalizedPhone = form.phone.trim();
  const sequence = getNextSequence(existingRows);
  const screenId = String(sequence).padStart(4, '0');
  const ageLabel = age === null ? '--' : `${age}岁`;
  const ageTag = getAgeTag(age);
  const genderLabel = getGenderLabel(form.gender);
  const duplicatePhone = existingRows.find((row) => row.status === 'enrolled' && row.name === form.name.trim());

  const reasons: string[] = [];
  if (!form.consented) reasons.push('未完成知情同意签署，不能进入随机分组。');
  if (age === null) reasons.push('出生日期无效，无法计算年龄。');
  if (age !== null && (age < 6 || age > 14)) reasons.push(`当前年龄为 ${age} 岁，不满足项目 6-14 岁的纳入范围。`);
  if (Number.isNaN(diopter)) reasons.push('屈光度未填写完整，无法进行维度匹配。');
  if (!Number.isNaN(diopter) && (diopter > -0.5 || diopter < -4)) {
    reasons.push(`当前屈光度为 ${form.diopter}D，不在项目要求的 -4.00D 到 -0.50D 区间内。`);
  }
  if (form.excludeRisk) reasons.push('标记了排除标准风险，需先人工复核，暂不允许入组。');
  if (duplicatePhone) reasons.push(`系统中已存在同名已入组受试者“${duplicatePhone.name}”，请先核对是否重复录入。`);

  const commonTags = [genderLabel, ageTag].filter((tag) => tag !== '--');
  const baseRow: EnrollmentRow = {
    id: '--',
    screenId,
    randomId: '--',
    drugId: '--',
    name: form.name.trim(),
    age: ageLabel,
    indicator: `${form.diopter}D`,
    group: '未入组',
    groupClass: 'text-rose-600 bg-rose-50 border border-rose-200',
    tags: commonTags,
    status: 'failed',
    doctor: form.doctor
  };

  if (reasons.length > 0) {
    return {
      status: 'failure',
      title: '匹配失败',
      summary: '系统已完成纳入条件校验，但当前受试者暂不满足入组条件。',
      reasons,
      row: baseRow,
      matchNotes: [
        `基础信息已保存为筛查记录，筛选号 ${screenId}`,
        `当前维度标签：${commonTags.join(' / ') || '未命中'}`,
        '建议先处理失败原因，再重新发起匹配。'
      ]
    };
  }

  const enrolledRows = existingRows.filter((row) => row.status === 'enrolled');
  const groupCount = enrolledRows.reduce<Record<string, number>>(
    (acc, row) => {
      if (row.group === '实验组' || row.group === '对照组') {
        acc[row.group] = (acc[row.group] || 0) + 1;
      }
      return acc;
    },
    { 实验组: 0, 对照组: 0 }
  );

  let group = groupCount['实验组'] <= groupCount['对照组'] ? '实验组' : '对照组';
  if (groupCount['实验组'] === groupCount['对照组']) {
    group = getHash(`${form.name}-${normalizedPhone}`) % 2 === 0 ? '实验组' : '对照组';
  }

  const row: EnrollmentRow = {
    id: `${project.code}_${screenId}`,
    screenId,
    randomId: `R-${String(1000 + sequence)}`,
    drugId: getNextDrugId(group, sequence),
    name: form.name.trim(),
    age: ageLabel,
    indicator: `${form.diopter}D`,
    group,
    groupClass:
      group === '实验组'
        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
        : 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    tags: commonTags,
    status: 'enrolled',
    doctor: form.doctor
  };

  return {
    status: 'success',
    title: '匹配成功',
    summary: '系统已完成纳入校验与分组匹配，可以确认入组并写入受试者列表。',
    reasons: [
      `命中纳入年龄范围：${ageLabel}`,
      `屈光度校验通过：${form.diopter}D`,
      `知情同意状态：已完成`
    ],
    row,
    matchNotes: [
      `分组结果：${group}`,
      `随机号：${row.randomId}`,
      `产品号：${row.drugId}`
    ]
  };
};

const FieldLabel: React.FC<{ label: string; required?: boolean; hint?: string }> = ({ label, required, hint }) => (
  <label className="block text-sm text-slate-700 mb-1.5">
    {label}
    {required && <span className="text-rose-500 ml-1">*</span>}
    {hint && <span className="ml-2 text-xs text-slate-400">{hint}</span>}
  </label>
);

const SegmentedChoice: React.FC<{
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}> = ({ value, options, onChange }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
    {options.map((option) => {
      const active = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
            active
              ? 'border-brand-300 bg-brand-50 text-brand-700'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);

export default function SubjectEnrollmentDrawer({
  open,
  project,
  existingRows,
  onClose,
  onComplete
}: SubjectEnrollmentDrawerProps) {
  const [form, setForm] = useState<EnrollmentFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<EnrollmentOutcome | null>(null);
  const [phase, setPhase] = useState<DrawerPhase>('form');
  const [matchingStep, setMatchingStep] = useState(0);
  const matchTimerRef = useRef<number | null>(null);
  const stepTimerRef = useRef<number | null>(null);

  const age = useMemo(() => getAgeFromBirthDate(form.birthDate), [form.birthDate]);
  const doctorOptions = useMemo(() => {
    const doctors = CENTER_DOCTOR_MAP[form.center] || [];
    return doctors.map((doctor) => ({ label: doctor, value: doctor }));
  }, [form.center]);

  useEffect(() => {
    return () => {
      if (matchTimerRef.current) window.clearTimeout(matchTimerRef.current);
      if (stepTimerRef.current) window.clearInterval(stepTimerRef.current);
    };
  }, []);

  const resetMatchFlow = () => {
    if (matchTimerRef.current) {
      window.clearTimeout(matchTimerRef.current);
      matchTimerRef.current = null;
    }
    if (stepTimerRef.current) {
      window.clearInterval(stepTimerRef.current);
      stepTimerRef.current = null;
    }
    setMatchingStep(0);
  };

  const updateField = <K extends keyof EnrollmentFormState>(key: K, value: EnrollmentFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = '请输入受试者姓名';
    if (!/^\d{11}$/.test(form.phone.trim())) nextErrors.phone = '请输入 11 位手机号';
    if (!form.birthDate) nextErrors.birthDate = '请选择出生日期';
    if (!form.height) nextErrors.height = '请输入身高';
    if (!form.weight) nextErrors.weight = '请输入体重';
    if (!form.source) nextErrors.source = '请选择入组来源';
    if (form.source === '其他' && !form.sourceRemark.trim()) nextErrors.sourceRemark = '请补充来源说明';
    if (!form.center) nextErrors.center = '请选择录入中心';
    if (!form.doctor) nextErrors.doctor = '请选择所属医生';
    if (!form.diopter.trim()) nextErrors.diopter = '请输入屈光度';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleMatch = () => {
    if (!validate()) return;
    resetMatchFlow();
    setPhase('matching');
    setResult(null);
    setMatchingStep(0);
    stepTimerRef.current = window.setInterval(() => {
      setMatchingStep((prev) => (prev + 1) % 3);
    }, 900);
    matchTimerRef.current = window.setTimeout(() => {
      resetMatchFlow();
      setResult(buildResult(project, existingRows, form));
      setPhase('result');
    }, 3000);
  };

  const applyDemoForm = (shouldFail: boolean) => {
    resetMatchFlow();
    setForm(createRandomForm(project, shouldFail));
    setErrors({});
    setResult(null);
    setPhase('form');
  };

  const footer = phase === 'matching' ? (
    <div className="flex items-center justify-between gap-3">
      <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
        <LoaderCircle className="h-4 w-4 animate-spin text-brand-600" />
        正在执行匹配筛选，请稍候...
      </div>
      <button
        type="button"
        onClick={() => {
          resetMatchFlow();
          setPhase('form');
        }}
        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
      >
        取消匹配
      </button>
    </div>
  ) : result ? (
    <div className="flex items-center justify-between gap-3">
      {result.status === 'failure' ? (
        <button
          type="button"
          onClick={() => {
            setResult(null);
            setPhase('form');
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw className="w-4 h-4" />
          返回修改
        </button>
      ) : (
        <div className="text-sm text-slate-400">匹配完成，可以直接确认入组</div>
      )}
      <button
        type="button"
        onClick={() => onComplete(result)}
        className={`rounded-xl px-4 py-2 text-sm font-bold text-white shadow-lg ${
          result.status === 'success' ? 'bg-emerald-600 shadow-emerald-500/20 hover:bg-emerald-700' : 'bg-rose-600 shadow-rose-500/20 hover:bg-rose-700'
        }`}
      >
        {result.status === 'success' ? '确认入组' : '记录失败结果'}
      </button>
    </div>
  ) : (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={() => {
          resetMatchFlow();
          onClose();
        }}
        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
      >
        取消
      </button>
      <button
        type="button"
        onClick={handleMatch}
        className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-700"
      >
        <ShieldCheck className="w-4 h-4" />
        匹配筛选
      </button>
    </div>
  );

  const matchingSteps = [
    '正在核验基础信息与年龄范围',
    '正在比对中心、医生与纳排条件',
    '正在执行维度筛选并计算随机分组'
  ];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="受试者入组筛选"
      subtitle={`项目：${project.title}`}
      width={860}
      bodyClassName="p-0 bg-slate-50"
      footer={footer}
    >
      <div className="space-y-5 p-6">
        <div className="rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-50 via-white to-indigo-50 px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm">
                <UserRoundPlus className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-black text-slate-900">沿用原中央随机化页面的录入逻辑，并补了结果反馈层</div>
                <div className="mt-1 text-xs leading-5 text-slate-500">
                  先完成基础信息和纳排条件校验，再进行随机分组。你也可以用演示按钮随机生成一份数据，然后手动点“匹配筛选”进入成功或失败结果。
                </div>
              </div>
            </div>
            {phase === 'form' && !result && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => applyDemoForm(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                >
                  <Dices className="h-4 w-4" />
                  一键模拟入组
                </button>
                <button
                  type="button"
                  onClick={() => applyDemoForm(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50"
                >
                  <Dices className="h-4 w-4" />
                  一键模拟失败
                </button>
              </div>
            )}
          </div>
        </div>

        {phase === 'matching' && (
          <div className="rounded-3xl border border-brand-200 bg-white px-6 py-7">
            <div className="mx-auto max-w-lg text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <LoaderCircle className="h-8 w-8 animate-spin" />
              </div>
              <div className="mt-4 text-lg font-black text-slate-900">正在进行筛选匹配</div>
              <div className="mt-2 text-sm leading-6 text-slate-500">
                系统会依次校验纳入条件、维度指标和分组平衡，请稍候 3 秒左右。
              </div>
              <div className="mt-6 space-y-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-left">
                {matchingSteps.map((step, index) => {
                  const active = index === matchingStep;
                  const done = index < matchingStep;
                  return (
                    <div key={step} className="flex items-center gap-3">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                          active
                            ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                            : done
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className={`text-sm ${active ? 'font-bold text-slate-900' : 'text-slate-500'}`}>{step}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {result && (
          <div
            className={`rounded-3xl border px-5 py-4 ${
              result.status === 'success'
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-rose-200 bg-rose-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                  result.status === 'success' ? 'bg-white text-emerald-600' : 'bg-white text-rose-600'
                }`}
              >
                {result.status === 'success' ? <BadgeCheck className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-base font-black text-slate-900">{result.title}</div>
                <div className="mt-1 text-sm text-slate-600">{result.summary}</div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl bg-white/80 px-4 py-3">
                    <div className="text-xs font-bold text-slate-500">系统判断</div>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700">
                      {result.reasons.map((reason) => (
                        <li key={reason} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-white/80 px-4 py-3">
                    <div className="text-xs font-bold text-slate-500">生成结果</div>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700">
                      {result.matchNotes.map((note) => (
                        <li key={note} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === 'form' && (
          <>
            <SectionCard
              title="个人基本信息"
              extra={<span className="text-xs font-medium text-slate-400">录入后自动计算年龄</span>}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <InputBlock
                    label="真实姓名"
                    required
                    value={form.name}
                    onChange={(value) => updateField('name', value)}
                    placeholder="请输入姓名（最多 5 位）"
                  />
                  {errors.name && <div className="mt-1 text-xs text-rose-500">{errors.name}</div>}
                </div>
                <div>
                  <FieldLabel label="性别" required />
                  <Select
                    value={form.gender}
                    onChange={(value) => updateField('gender', value as EnrollmentFormState['gender'])}
                    options={[
                      { label: '男', value: 'male' },
                      { label: '女', value: 'female' }
                    ]}
                  />
                </div>
                <div>
                  <InputBlock
                    label="手机号"
                    required
                    value={form.phone}
                    onChange={(value) => updateField('phone', value)}
                    placeholder="请输入 11 位手机号"
                  />
                  {errors.phone && <div className="mt-1 text-xs text-rose-500">{errors.phone}</div>}
                </div>
                <div>
                  <InputBlock
                    label="出生日期"
                    required
                    type="date"
                    value={form.birthDate}
                    onChange={(value) => updateField('birthDate', value)}
                  />
                  {errors.birthDate && <div className="mt-1 text-xs text-rose-500">{errors.birthDate}</div>}
                </div>
                <div>
                  <FieldLabel label="年龄（周岁）" hint="自动生成" />
                  <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600">
                    {age === null ? '待计算' : `${age} 岁`}
                  </div>
                </div>
                <div>
                  <InputBlock
                    label="身高（cm）"
                    required
                    type="number"
                    value={form.height}
                    onChange={(value) => updateField('height', value)}
                    placeholder="例如 132"
                  />
                  {errors.height && <div className="mt-1 text-xs text-rose-500">{errors.height}</div>}
                </div>
                <div>
                  <InputBlock
                    label="体重（kg）"
                    required
                    type="number"
                    value={form.weight}
                    onChange={(value) => updateField('weight', value)}
                    placeholder="例如 31"
                  />
                  {errors.weight && <div className="mt-1 text-xs text-rose-500">{errors.weight}</div>}
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="入组与录入信息"
              extra={<span className="text-xs font-medium text-slate-400">中心与医生联动</span>}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <FieldLabel label="入组来源" required />
                  <Select
                    value={form.source}
                    onChange={(value) => updateField('source', value)}
                    options={[
                      { label: '门诊', value: '门诊' },
                      { label: '招募', value: '招募' },
                      { label: '其他', value: '其他' }
                    ]}
                    placeholder="请选择来源"
                  />
                  {errors.source && <div className="mt-1 text-xs text-rose-500">{errors.source}</div>}
                </div>
                {form.source === '其他' && (
                  <div>
                    <InputBlock
                      label="来源说明"
                      required
                      value={form.sourceRemark}
                      onChange={(value) => updateField('sourceRemark', value)}
                      placeholder="请补充来源说明"
                    />
                    {errors.sourceRemark && <div className="mt-1 text-xs text-rose-500">{errors.sourceRemark}</div>}
                  </div>
                )}
                <div>
                  <FieldLabel label="录入中心" required />
                  <Select
                    value={form.center}
                    onChange={(value) => {
                      setForm((prev) => ({ ...prev, center: value, doctor: '' }));
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.center;
                        delete next.doctor;
                        return next;
                      });
                    }}
                    options={(project.centers || []).map((center) => ({ label: center, value: center }))}
                    placeholder="请选择中心"
                  />
                  {errors.center && <div className="mt-1 text-xs text-rose-500">{errors.center}</div>}
                </div>
                <div>
                  <FieldLabel label="所属医生" required />
                  <Select
                    value={form.doctor}
                    onChange={(value) => updateField('doctor', value)}
                    options={doctorOptions}
                    placeholder={form.center ? '请选择医生' : '请先选择录入中心'}
                    disabled={!form.center}
                  />
                  {errors.doctor && <div className="mt-1 text-xs text-rose-500">{errors.doctor}</div>}
                </div>
                <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-slate-800">是否触发排除标准风险</div>
                      <div className="mt-1 text-xs leading-5 text-slate-500">
                        勾选后会直接阻断自动入组，并在结果页提示人工复核。
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateField('excludeRisk', !form.excludeRisk)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                        form.excludeRisk ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {form.excludeRisk ? '存在风险' : '默认不符合'}
                    </button>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="病史与健康信息"
              extra={
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                  <CircleHelp className="h-3.5 w-3.5" />
                  用于保留原页面的筛查语义
                </span>
              }
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <FieldLabel label="既往病史" />
                  <SegmentedChoice
                    value={form.history}
                    onChange={(value) => updateField('history', value as BinaryChoice)}
                    options={[
                      { label: '无', value: 'no' },
                      { label: '有', value: 'yes' }
                    ]}
                  />
                </div>
                <div>
                  <FieldLabel label="过敏史" />
                  <SegmentedChoice
                    value={form.allergy}
                    onChange={(value) => updateField('allergy', value as BinaryChoice)}
                    options={[
                      { label: '无', value: 'no' },
                      { label: '有', value: 'yes' }
                    ]}
                  />
                </div>
                <div>
                  <FieldLabel label="既往用药史" />
                  <SegmentedChoice
                    value={form.medication}
                    onChange={(value) => updateField('medication', value as BinaryChoice)}
                    options={[
                      { label: '无', value: 'no' },
                      { label: '有', value: 'yes' }
                    ]}
                  />
                </div>
                <div>
                  <FieldLabel label="家族史近视情况" />
                  <SegmentedChoice
                    value={form.familyMyopia}
                    onChange={(value) => updateField('familyMyopia', value as FamilyMyopia)}
                    options={[
                      { label: '无', value: 'none' },
                      { label: '父亲近视', value: 'father' },
                      { label: '母亲近视', value: 'mother' },
                      { label: '双亲均近视', value: 'both' }
                    ]}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="维度指标"
              extra={<span className="text-xs font-medium text-slate-400">筛选匹配前的最后校验</span>}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <InputBlock
                    label="屈光度（D）"
                    value={form.diopter}
                    required
                    onChange={(value) => updateField('diopter', value)}
                    placeholder="例如 -1.50"
                    type="number"
                  />
                  {errors.diopter && <div className="mt-1 text-xs text-rose-500">{errors.diopter}</div>}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-slate-800">已完成签署知情同意书</div>
                      <div className="mt-1 text-xs leading-5 text-slate-500">
                        未签署时系统只保留筛查记录，不执行分组。
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateField('consented', !form.consented)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                        form.consented ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {form.consented ? '已签署' : '未签署'}
                    </button>
                  </div>
                </div>
              </div>
            </SectionCard>
          </>
        )}
      </div>
    </Drawer>
  );
}
