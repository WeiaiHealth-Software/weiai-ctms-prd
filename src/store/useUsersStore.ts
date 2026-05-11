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
  createdAt: string;
};

type CreateUserPayload = {
  name: string;
  account: string;
  phone: string;
  org: string;
  role: string;
  createdAt?: string;
};

type UsersState = {
  users: UserRow[];
  createUser: (payload: CreateUserPayload) => void;
};

const pad2 = (n: number) => String(n).padStart(2, '0');
const formatDate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const getOrgClass = (orgLabel: string) =>
  ORG_OPTIONS.find(o => o.label === orgLabel)?.className ?? 'bg-slate-50 text-slate-600 border-slate-100';

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
      createdAt: '2023-03-05'
    }
  ],
  createUser: (payload) => {
    const maxId = get().users.reduce((m, u) => Math.max(m, u.id), 0);
    const now = new Date();
    const createdAt = payload.createdAt ?? formatDate(now);
    const roleClass = getRoleBadgeClass(payload.role);

    set(state => ({
      users: [
        {
          id: maxId + 1,
          name: payload.name,
          account: payload.account,
          phone: payload.phone,
          org: payload.org,
          orgClass: getOrgClass(payload.org),
          role: payload.role,
          roleClass,
          createdAt
        },
        ...state.users
      ]
    }));
  }
}));

