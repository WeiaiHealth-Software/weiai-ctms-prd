export type OrgOption = { value: string; label: string; className: string };

export const ORG_OPTIONS: OrgOption[] = [
  { value: '协和', label: '北京协和医院', className: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { value: '五官科', label: '上海复旦大学附属五官科医院', className: 'bg-sky-50 text-sky-600 border-sky-100' },
  { value: '眼病防治', label: '上海眼病防治中心', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
];

export const USER_ROLE_OPTIONS = [
  '厂家人员',
  'CRC协调员',
  '主要研究者（PI）',
  '科室负责人',
  '组织管理员',
  '开发者',
  '超级管理员'
] as const;

export type UserRole = (typeof USER_ROLE_OPTIONS)[number];

export const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()_+-={}[]:;,.?';
  const len = 12;
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

export const getRoleBadgeClass = (rolesText: string) => {
  if (rolesText.includes('超级管理员')) return 'bg-purple-50 text-purple-600 border-purple-100';
  if (rolesText.includes('开发者')) return 'bg-indigo-50 text-indigo-600 border-indigo-100';
  if (rolesText.includes('CRC')) return 'bg-amber-50 text-amber-600 border-amber-100';
  if (rolesText.includes('管理员') || rolesText.includes('负责人')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  return 'bg-slate-50 text-slate-600 border-slate-100';
};

