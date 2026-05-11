import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, RefreshCw, Upload } from 'lucide-react';
import { useHeaderStore } from '@/store/useHeaderStore';
import { ORG_OPTIONS, USER_ROLE_OPTIONS, type UserRole, generatePassword } from '@/pages/users/constants';
import { useUsersStore } from '@/store/useUsersStore';

export const UserCreate: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const createUser = useUsersStore(state => state.createUser);
  const navigate = useNavigate();

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<{
    name: string;
    account: string;
    phone: string;
    org: string;
    password: string;
    roles: UserRole[];
  }>(() => ({
    name: '',
    account: '',
    phone: '',
    org: ORG_OPTIONS[0]?.label ?? '',
    password: generatePassword(),
    roles: []
  }));

  const avatarPreviewUrl = useMemo(() => {
    if (!avatarFile) return '';
    return URL.createObjectURL(avatarFile);
  }, [avatarFile]);

  useEffect(() => {
    setTitle('新增用户', '填写用户信息并创建账号', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' }
    ]);
  }, [setTitle]);

  useEffect(() => {
    return () => {
      if (!avatarPreviewUrl) return;
      URL.revokeObjectURL(avatarPreviewUrl);
    };
  }, [avatarPreviewUrl]);

  const toggleRole = (role: UserRole) => {
    setForm(s => ({
      ...s,
      roles: s.roles.includes(role) ? s.roles.filter(r => r !== role) : [...s.roles, role]
    }));
  };

  const handleCancel = () => {
    navigate('/index/users');
  };

  const handleCreate = () => {
    const name = form.name.trim();
    const account = form.account.trim();
    const phone = form.phone.trim();
    const org = form.org;
    const rolesText = form.roles.join('、');

    if (!name || !account || !phone) {
      window.alert('请填写姓名、账号与手机号');
      return;
    }
    if (!rolesText) {
      window.alert('请选择至少一个角色');
      return;
    }

    createUser({ name, account, phone, org, role: rolesText });
    navigate('/index/users');
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-xl font-black text-slate-900">新增用户</div>
                <div className="text-xs text-slate-500 mt-1">创建用户账号、登录密码与角色权限</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="请输入手机号"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-600">登录密码</label>
                  <button
                    type="button"
                    onClick={() => setForm(s => ({ ...s, password: generatePassword() }))}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-600"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    生成
                  </button>
                </div>
                <div className="relative">
                  <input
                    value={form.password}
                    readOnly
                    type={showPassword ? 'text' : 'password'}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-11 text-sm font-mono text-slate-700 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center"
                    aria-label={showPassword ? '隐藏密码' : '显示密码'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  系统将生成初始密码，用户首次登录后建议修改。
                </div>
              </div>

              <div className="md:col-span-2">
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

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-2">用户头像</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                    {avatarPreviewUrl ? (
                      <img src={avatarPreviewUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-xs font-black text-slate-400">A</div>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => setAvatarFile(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Upload className="w-4 h-4" />
                    上传用户头像
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-2">角色</label>
                <div className="flex flex-wrap gap-4">
                  {USER_ROLE_OPTIONS.map(role => {
                    const checked = form.roles.includes(role);
                    return (
                      <label key={role} className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRole(role)}
                          className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm text-slate-700">{role}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-t border-slate-200 p-5 px-8 flex items-center justify-start gap-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-sm font-black text-white shadow-lg shadow-brand-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!form.name.trim() || !form.account.trim() || !form.phone.trim() || form.roles.length === 0}
            >
              创建用户
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
