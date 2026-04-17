import React, { useState, useEffect } from 'react';
import { useHeaderStore } from '../../store/useHeaderStore';
import { Search, ShieldAlert, UserPlus, Edit2, Trash2, X, Check } from 'lucide-react';

export const Users: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const [orgFilter, setOrgFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    account: '',
    phone: '',
    org: '',
    role: '',
    password: ''
  });

  useEffect(() => {
    setTitle('用户管理', '维护系统用户、组织归属与角色权限', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' }
    ]);
  }, [setTitle]);

  type UserRow = {
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

  const ORG_OPTIONS: Array<{ value: string; label: string; className: string }> = [
    { value: '协和', label: '北京协和医院', className: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { value: '五官科', label: '上海复旦大学附属五官科医院', className: 'bg-sky-50 text-sky-600 border-sky-100' },
    { value: '眼病防治', label: '上海眼病防治中心', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
  ];

  const ROLE_OPTIONS: Array<{ value: string; label: string; className: string }> = [
    { value: '系统管理员', label: '系统管理员', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { value: '中心管理员', label: '中心管理员', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { value: 'CRC协调员', label: 'CRC协调员', className: 'bg-amber-50 text-amber-600 border-amber-100' },
    { value: '主要研究者', label: '主要研究者', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { value: '主研医生', label: '主研医生', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { value: '研究护士', label: '研究护士', className: 'bg-slate-50 text-slate-600 border-slate-100' }
  ];

  const pad2 = (n: number) => String(n).padStart(2, '0');
  const formatDate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()_+-={}[]:;,.?';
    const len = 12;
    let out = '';
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  };

  const [users, setUsers] = useState<UserRow[]>([
    { id: 1, name: '王伟', account: 'wangwei_admin', phone: '13800138000', org: '北京协和医院', orgClass: 'bg-indigo-50 text-indigo-600 border-indigo-100', role: '系统管理员', roleClass: 'bg-emerald-50 text-emerald-600 border-emerald-100', createdAt: '2023-01-10' },
    { id: 2, name: '李静', account: 'lijing_crc', phone: '13800138001', org: '北京协和医院', orgClass: 'bg-indigo-50 text-indigo-600 border-indigo-100', role: 'CRC协调员', roleClass: 'bg-amber-50 text-amber-600 border-amber-100', createdAt: '2023-01-12' },
    { id: 3, name: '张强', account: 'zhangqiang_doc', phone: '13900139000', org: '上海五官科医院', orgClass: 'bg-sky-50 text-sky-600 border-sky-100', role: '主研医生', roleClass: 'bg-emerald-50 text-emerald-600 border-emerald-100', createdAt: '2023-02-01' },
    { id: 4, name: '周敏', account: 'zhoumin_nurse', phone: '13900139001', org: '上海五官科医院', orgClass: 'bg-sky-50 text-sky-600 border-sky-100', role: '研究护士', roleClass: 'bg-slate-50 text-slate-600 border-slate-100', createdAt: '2023-02-03' },
    { id: 5, name: '刘洋', account: 'liuyang_admin', phone: '13700137000', org: '上海眼病防治中心', orgClass: 'bg-emerald-50 text-emerald-600 border-emerald-100', role: '中心管理员', roleClass: 'bg-emerald-50 text-emerald-600 border-emerald-100', createdAt: '2023-03-01' },
    { id: 6, name: '赵磊', account: 'zhaolei_doc', phone: '13700137001', org: '上海眼病防治中心', orgClass: 'bg-emerald-50 text-emerald-600 border-emerald-100', role: '主要研究者', roleClass: 'bg-emerald-50 text-emerald-600 border-emerald-100', createdAt: '2023-03-05' }
  ]);

  useEffect(() => {
    if (!addOpen) return;
    setForm({
      name: '',
      account: '',
      phone: '',
      org: ORG_OPTIONS[0]?.label || '',
      role: ROLE_OPTIONS[0]?.label || '',
      password: generatePassword()
    });
  }, [addOpen]);

  useEffect(() => {
    if (!addOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAddOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [addOpen]);

  const filteredUsers = users.filter(user => {
    return (
      (orgFilter === '' || user.org.includes(orgFilter)) &&
      (nameFilter === '' || user.name.includes(nameFilter)) &&
      (phoneFilter === '' || user.phone.includes(phoneFilter))
    );
  });

  const handleCreateUser = () => {
    const name = form.name.trim();
    const account = form.account.trim();
    const phone = form.phone.trim();
    if (!name || !account || !phone) {
      window.alert('请填写姓名、账号与手机号');
      return;
    }

    const orgOpt = ORG_OPTIONS.find(o => o.label === form.org) || ORG_OPTIONS[0];
    const roleOpt = ROLE_OPTIONS.find(r => r.label === form.role) || ROLE_OPTIONS[0];
    const maxId = users.reduce((m, u) => Math.max(m, u.id), 0);
    const now = new Date();

    setUsers(prev => [
      {
        id: maxId + 1,
        name,
        account,
        phone,
        org: orgOpt?.label || form.org,
        orgClass: orgOpt?.className || 'bg-slate-50 text-slate-600 border-slate-100',
        role: roleOpt?.label || form.role,
        roleClass: roleOpt?.className || 'bg-slate-50 text-slate-600 border-slate-100',
        createdAt: formatDate(now)
      },
      ...prev
    ]);
    setAddOpen(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* 搜索与筛选区域 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">所属组织</label>
              <select 
                value={orgFilter}
                onChange={(e) => setOrgFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">全部组织</option>
                {ORG_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">姓名</label>
              <input 
                type="text" 
                placeholder="输入姓名关键字"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">手机号</label>
              <input 
                type="text" 
                placeholder="输入手机号"
                value={phoneFilter}
                onChange={(e) => setPhoneFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500" 
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setOrgFilter(''); setNameFilter(''); setPhoneFilter(''); }} 
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
            >
              重置
            </button>
            <button className="px-5 py-2 rounded-xl bg-brand-600 text-sm font-bold text-white hover:bg-brand-700 shadow-sm flex items-center gap-2">
              <Search className="w-4 h-4" /> 筛选
            </button>
          </div>
        </div>
      </div>

      {/* 快捷操作区域 */}
      <div className="flex justify-end">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all bg-white">
            <ShieldAlert className="w-4 h-4" /> 密码规则配置
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition-all"
            onClick={() => setAddOpen(true)}
          >
            <UserPlus className="w-4 h-4" /> 新增用户
          </button>
        </div>
      </div>

      {/* 数据表格区域 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">姓名</th>
                <th className="px-6 py-4 font-semibold">账号</th>
                <th className="px-6 py-4 font-semibold">手机号</th>
                <th className="px-6 py-4 font-semibold">所属组织</th>
                <th className="px-6 py-4 font-semibold">角色</th>
                <th className="px-6 py-4 font-semibold">创建时间</th>
                <th className="px-6 py-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{user.name}</td>
                  <td className="px-6 py-4 text-slate-600">{user.account}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono">{user.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${user.orgClass}`}>
                      {user.org}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${user.roleClass}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono">{user.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-brand-600 hover:text-brand-700 transition-colors p-1" title="编辑">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-slate-400 hover:text-red-600 transition-colors p-1" title="删除">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    没有找到符合条件的用户
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {addOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm" onClick={() => setAddOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 w-full sm:w-[420px] bg-white border-l border-slate-200 shadow-2xl animate-fade-in-right flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
              <div>
                <div className="text-lg font-black text-slate-900">新增用户</div>
                <div className="text-xs text-slate-500 mt-1">填写用户基本信息并创建初始密码</div>
              </div>
              <button className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500" onClick={() => setAddOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">姓名</label>
                <input
                  value={form.name}
                  onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
                  type="text"
                  placeholder="请输入姓名"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">账号</label>
                <input
                  value={form.account}
                  onChange={e => setForm(s => ({ ...s, account: e.target.value }))}
                  type="text"
                  placeholder="用于登录的账号名"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">手机号</label>
                <input
                  value={form.phone}
                  onChange={e => setForm(s => ({ ...s, phone: e.target.value }))}
                  type="tel"
                  placeholder="11位手机号"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">所属组织</label>
                <select
                  value={form.org}
                  onChange={e => setForm(s => ({ ...s, org: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500"
                >
                  {ORG_OPTIONS.map(o => (
                    <option key={o.label} value={o.label}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">角色</label>
                <select
                  value={form.role}
                  onChange={e => setForm(s => ({ ...s, role: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500"
                >
                  {ROLE_OPTIONS.map(r => (
                    <option key={r.label} value={r.label}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">初始密码</label>
                <input
                  value={form.password}
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-mono text-slate-700 focus:outline-none"
                />
                <div className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  系统将自动生成初始密码并自动同步给用户主体，不需要手动输入。
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
              <button className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50" onClick={() => setAddOpen(false)}>
                取消
              </button>
              <button
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCreateUser}
                disabled={!form.name.trim() || !form.account.trim() || !form.phone.trim()}
              >
                <Check className="w-4 h-4" /> 创建用户
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
