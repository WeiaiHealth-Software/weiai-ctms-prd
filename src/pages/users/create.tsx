import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, HelpCircle, RefreshCw, Upload } from 'lucide-react';
import { useHeaderStore } from '@/store/useHeaderStore';
import { ORG_OPTIONS, USER_ROLE_OPTIONS, type UserRole, generatePassword } from '@/pages/users/constants';
import { useUsersStore } from '@/store/useUsersStore';
import Select from '@/components/form/Select';

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

const pickRandomAvatarTone = () => AVATAR_TONES[Math.floor(Math.random() * AVATAR_TONES.length)]!;

export const UserCreate: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const createUser = useUsersStore(state => state.createUser);
  const navigate = useNavigate();

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(true);
  const [avatarTone, setAvatarTone] = useState<{ bgClass: string; textClass: string } | null>(null);

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

  const avatarText = useMemo(() => getAvatarText(form.name), [form.name]);

  useEffect(() => {
    if (avatarFile) return;
    if (!avatarText) {
      setAvatarTone(null);
      return;
    }
    setAvatarTone(prev => prev ?? pickRandomAvatarTone());
  }, [avatarFile, avatarText]);

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
    const password = form.password.trim();
    const rolesText = form.roles.join('、') || '基础角色';

    if (!account || !password || !phone || !name || !org) {
      window.alert('请填写账号、密码、手机号、姓名与所属组织');
      return;
    }

    createUser({
      name,
      account,
      phone,
      org,
      role: rolesText,
      avatarText: avatarFile ? undefined : avatarText,
      avatarBgClass: avatarFile ? undefined : avatarTone?.bgClass,
      avatarTextClass: avatarFile ? undefined : avatarTone?.textClass
    });
    navigate('/index/users');
  };

  return (
    <div className="p-6">
      <div className="mb-6 rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
        <h3 className="text-sm font-bold text-brand-700">创建用户规范</h3>
        <ul className="mt-2 list-disc pl-5 text-sm text-brand-700/90 space-y-1">
          <li>人员可以归属多组织，但是不能一个账号登录多个组织，需要重新创建账号，例如：weiai-shanghai 和
                      weiai-jiangsu，同一个人两个账户，可以配置相同密码，完全隔离。</li>
          <li>头像有两种形态：上传图片或使用默认字母头像，可以把对应颜色的字母显示在头像上</li>
        </ul>
      </div>
      <div className="max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200">
          <div className="p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-xl font-black text-slate-900">新增用户</div>
                <div className="text-xs text-slate-500 mt-1">创建用户账号、登录密码与角色权限</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-2">用户头像</label>
                <div className="flex items-center gap-4">
                  <div
                    className={[
                      'w-12 h-12 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center font-black',
                      avatarPreviewUrl ? 'bg-slate-50' : avatarText ? avatarTone?.bgClass ?? 'bg-slate-50' : 'bg-slate-50',
                      avatarPreviewUrl ? '' : avatarText ? avatarTone?.textClass ?? 'text-slate-400' : 'text-slate-400'
                    ].join(' ')}
                  >
                    {avatarPreviewUrl ? (
                      <img src={avatarPreviewUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-md">{avatarText || 'A'}</div>
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

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>账号
                </label>
                <input
                  value={form.account}
                  onChange={e => setForm(s => ({ ...s, account: e.target.value }))}
                  type="text"
                  placeholder="用于登录的账号名"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-600">
                    <span className="text-red-500 mr-1">*</span>登录密码
                  </label>
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

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>手机号
                </label>
                <input
                  value={form.phone}
                  onChange={e => setForm(s => ({ ...s, phone: e.target.value }))}
                  type="tel"
                  placeholder="请输入手机号"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>姓名
                </label>
                <input
                  value={form.name}
                  onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
                  type="text"
                  placeholder="请输入姓名"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-slate-600 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>所属组织
                  <span className="relative z-[60] inline-flex items-center group">
                    <button
                      type="button"
                      aria-label="所属组织说明"
                      className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full text-slate-400 hover:text-brand-600 hover:bg-slate-100"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                    <div className="pointer-events-none absolute left-1/2 top-full z-[60] mt-2 w-[360px] -translate-x-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] leading-relaxed text-slate-600 shadow-lg opacity-0 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0">
                      人员可以归属多组织，但是不能一个账号登录多个组织，需要重新创建账号，例如：weiai-shanghai 和
                      weiai-jiangsu，同一个人两个账户，可以配置相同密码，完全隔离。
                    </div>
                  </span>
                </label>
                <Select
                  value={form.org}
                  onChange={(v) => setForm(s => ({ ...s, org: v }))}
                  options={ORG_OPTIONS.map(o => ({ value: o.label, label: o.label }))}
                />
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

          <div className="bg-white rounded-bl-3xl rounded-br-3xl border-t border-slate-200 p-5 px-8 flex items-center justify-end gap-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
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
              disabled={
                !form.account.trim() ||
                !form.password.trim() ||
                !form.phone.trim() ||
                !form.name.trim() ||
                !form.org
              }
            >
              创建用户
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
