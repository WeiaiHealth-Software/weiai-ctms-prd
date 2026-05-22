import { create } from 'zustand';
import { ORG_OPTIONS, getRoleBadgeClass } from '@/pages/users/constants';

export type UserRow = {
  id: number;
  name: string;
  account: string;
  phone: string;
  org: string;
  orgClass: string;
  role: string;
  roleClass: string;
  avatarText?: string;
  avatarBgClass?: string;
  avatarTextClass?: string;
  createdAt: string;
};

type CreateUserPayload = {
  name: string;
  account: string;
  phone: string;
  org: string;
  role?: string;
  avatarText?: string;
  avatarBgClass?: string;
  avatarTextClass?: string;
  createdAt?: string;
};

type UsersState = {
  users: UserRow[];
  createUser: (payload: CreateUserPayload) => void;
  downgradeUsersByRole: (roleName: string) => void;
};

const pad2 = (n: number) => String(n).padStart(2, '0');
const formatDate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const getOrgClass = (orgLabel: string) =>
  ORG_OPTIONS.find(o => o.label === orgLabel)?.className ?? 'bg-slate-50 text-slate-600 border-slate-100';

const getAvatarText = (name: string) => {
  const v = name.trim();
  if (!v) return '';
  const first = v[0] ?? '';
  return /[a-zA-Z]/.test(first) ? first.toUpperCase() : first;
};

const AVATAR_TONES = [
  { bgClass: 'bg-indigo-50', textClass: 'text-indigo-700' },
  { bgClass: 'bg-sky-50', textClass: 'text-sky-700' },
  { bgClass: 'bg-emerald-50', textClass: 'text-emerald-700' },
  { bgClass: 'bg-amber-50', textClass: 'text-amber-700' },
  { bgClass: 'bg-violet-50', textClass: 'text-violet-700' },
  { bgClass: 'bg-rose-50', textClass: 'text-rose-700' }
] as const;

const hashString = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const getAvatarToneByKey = (key: string) => {
  const idx = hashString(key) % AVATAR_TONES.length;
  return AVATAR_TONES[idx]!;
};

const BASE_ROLE_NAME = '基础角色';

const normalizeRole = (s: string) => s.replace(/\s+/g, '').replace(/[()（）]/g, '');

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [
    {
      id: 1,
      name: '王伟',
      account: 'wangwei_admin',
      phone: '13800138000',
      org: '北京协和医院',
      orgClass: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      role: '系统管理员',
      roleClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      avatarText: getAvatarText('王伟'),
      avatarBgClass: getAvatarToneByKey('wangwei_admin').bgClass,
      avatarTextClass: getAvatarToneByKey('wangwei_admin').textClass,
      createdAt: '2023-01-10'
    },
    {
      id: 2,
      name: '李静',
      account: 'lijing_crc',
      phone: '13800138001',
      org: '北京协和医院',
      orgClass: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      role: 'CRC协调员',
      roleClass: 'bg-amber-50 text-amber-600 border-amber-100',
      avatarText: getAvatarText('李静'),
      avatarBgClass: getAvatarToneByKey('lijing_crc').bgClass,
      avatarTextClass: getAvatarToneByKey('lijing_crc').textClass,
      createdAt: '2023-01-12'
    },
    {
      id: 3,
      name: '张强',
      account: 'zhangqiang_doc',
      phone: '13900139000',
      org: '上海五官科医院',
      orgClass: 'bg-sky-50 text-sky-600 border-sky-100',
      role: '主研医生',
      roleClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      avatarText: getAvatarText('张强'),
      avatarBgClass: getAvatarToneByKey('zhangqiang_doc').bgClass,
      avatarTextClass: getAvatarToneByKey('zhangqiang_doc').textClass,
      createdAt: '2023-02-01'
    },
    {
      id: 4,
      name: '周敏',
      account: 'zhoumin_nurse',
      phone: '13900139001',
      org: '上海五官科医院',
      orgClass: 'bg-sky-50 text-sky-600 border-sky-100',
      role: '研究护士',
      roleClass: 'bg-slate-50 text-slate-600 border-slate-100',
      avatarText: getAvatarText('周敏'),
      avatarBgClass: getAvatarToneByKey('zhoumin_nurse').bgClass,
      avatarTextClass: getAvatarToneByKey('zhoumin_nurse').textClass,
      createdAt: '2023-02-03'
    },
    {
      id: 5,
      name: '刘洋',
      account: 'liuyang_admin',
      phone: '13700137000',
      org: '上海眼病防治中心',
      orgClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      role: '中心管理员',
      roleClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      avatarText: getAvatarText('刘洋'),
      avatarBgClass: getAvatarToneByKey('liuyang_admin').bgClass,
      avatarTextClass: getAvatarToneByKey('liuyang_admin').textClass,
      createdAt: '2023-03-01'
    },
    {
      id: 6,
      name: '赵磊',
      account: 'zhaolei_doc',
      phone: '13700137001',
      org: '上海眼病防治中心',
      orgClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      role: '主要研究者',
      roleClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      avatarText: getAvatarText('赵磊'),
      avatarBgClass: getAvatarToneByKey('zhaolei_doc').bgClass,
      avatarTextClass: getAvatarToneByKey('zhaolei_doc').textClass,
      createdAt: '2023-03-05'
    }
  ],
  createUser: (payload) => {
    const maxId = get().users.reduce((m, u) => Math.max(m, u.id), 0);
    const now = new Date();
    const createdAt = payload.createdAt ?? formatDate(now);
    const role = payload.role?.trim() || BASE_ROLE_NAME;
    const roleClass = getRoleBadgeClass(role);
    const avatarText = payload.avatarText ?? getAvatarText(payload.name);
    const avatarTone = getAvatarToneByKey(payload.account);

    set(state => ({
      users: [
        {
          id: maxId + 1,
          name: payload.name,
          account: payload.account,
          phone: payload.phone,
          org: payload.org,
          orgClass: getOrgClass(payload.org),
          role,
          roleClass,
          avatarText,
          avatarBgClass: payload.avatarBgClass ?? avatarTone.bgClass,
          avatarTextClass: payload.avatarTextClass ?? avatarTone.textClass,
          createdAt
        },
        ...state.users
      ]
    }));
  },
  downgradeUsersByRole: (roleName) => {
    const target = normalizeRole(roleName);
    if (!target) return;
    const nextRole = BASE_ROLE_NAME;
    const nextRoleClass = getRoleBadgeClass(nextRole);

    set(state => ({
      users: state.users.map(u => {
        const current = normalizeRole(u.role);
        if (!current.includes(target)) return u;
        return { ...u, role: nextRole, roleClass: nextRoleClass };
      })
    }));
  }
}));

