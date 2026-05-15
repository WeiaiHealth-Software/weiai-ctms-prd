import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Eye, EyeOff, KeyRound, Mail, UserRound, X } from 'lucide-react';
import { useHeaderStore } from '@/store/useHeaderStore';
import { useUsersStore } from '@/store/useUsersStore';
import { useEdcProjectStore } from '@/store/useEdcProjectStore';

export const Profile: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const users = useUsersStore(state => state.users);
  const projects = useEdcProjectStore(state => state.projects);

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });

  useEffect(() => {
    setTitle('个人中心', '查看与维护个人信息与账号安全', []);
  }, [setTitle]);

  const me = useMemo(() => {
    const u = users[0];
    if (u) return u;
    return {
      id: 0,
      name: 'Admin',
      account: 'admin',
      phone: '',
      org: 'WeiaiHealthcare',
      orgClass: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      role: '超级管理员',
      roleClass: 'bg-purple-50 text-purple-600 border-purple-100',
      avatarText: 'A',
      avatarBgClass: 'bg-indigo-50',
      avatarTextClass: 'text-indigo-700',
      createdAt: ''
    };
  }, [users]);

  const email = useMemo(() => `${me.account}@weiai.com`, [me.account]);

  const totalEnrolled = useMemo(() => projects.reduce((sum, p) => sum + (p.enrolled ?? 0), 0), [projects]);

  const stats = useMemo(() => {
    return [
      { label: '参与项目', value: String(projects.length), helper: '后续可按角色/中心过滤', tone: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
      { label: '入组人数', value: String(totalEnrolled), helper: '基于项目入组数汇总', tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
      { label: '同组织用户', value: String(users.filter(u => u.org === me.org).length), helper: '便于后续扩展组织视图', tone: 'bg-sky-50 text-sky-700 border-sky-100' },
      { label: '账号权限', value: me.role.split('、')[0] ?? me.role, helper: '后续可展示更多权限点', tone: 'bg-amber-50 text-amber-700 border-amber-100' }
    ];
  }, [me.org, me.role, projects.length, totalEnrolled, users]);

  const closePassword = () => {
    setPasswordOpen(false);
    setPasswordVisible(false);
    setPasswordForm({ current: '', next: '', confirm: '' });
  };

  const submitPassword = () => {
    const next = passwordForm.next.trim();
    const confirm = passwordForm.confirm.trim();

    if (!next || !confirm) {
      window.alert('请填写新密码与确认密码');
      return;
    }
    if (next.length < 8) {
      window.alert('新密码至少 8 位');
      return;
    }
    if (next !== confirm) {
      window.alert('两次输入的新密码不一致');
      return;
    }

    closePassword();
    window.alert('密码已更新');
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 p-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-7 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className={[
                  'w-14 h-14 rounded-3xl border border-slate-200 flex items-center justify-center font-black shrink-0',
                  me.avatarBgClass ?? 'bg-slate-50',
                  me.avatarTextClass ?? 'text-slate-400'
                ].join(' ')}
              >
                <span className="text-lg">{me.avatarText || 'A'}</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-xl font-black text-slate-900 truncate">{me.name}</div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${me.roleClass}`}>
                    {me.role}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <UserRound className="w-4 h-4 text-slate-400" />
                    {me.account}
                  </span>
                </div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span className="font-bold">{me.org}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center md:justify-end gap-3">
              <button
                type="button"
                onClick={() => setPasswordOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <KeyRound className="w-4 h-4 text-slate-500" />
                修改密码
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-7 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-black text-slate-900">统计信息</div>
              <div className="text-xs text-slate-500 mt-1">可扩展为我的项目、待办、操作日志与权限概览</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(s => (
              <div key={s.label} className={`rounded-2xl border p-4 ${s.tone}`}>
                <div className="text-xs font-bold opacity-80">{s.label}</div>
                <div className="mt-2 text-3xl font-black">{s.value}</div>
                <div className="mt-2 text-[11px] opacity-70 leading-relaxed">{s.helper}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {passwordOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
              <div>
                <div className="text-base font-black text-slate-900">修改密码</div>
                <div className="text-xs text-slate-500 mt-1">建议使用 8 位以上包含数字与符号的强密码</div>
              </div>
              <button
                type="button"
                onClick={closePassword}
                className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">当前密码</label>
                <div className="relative">
                  <input
                    value={passwordForm.current}
                    onChange={e => setPasswordForm(s => ({ ...s, current: e.target.value }))}
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="请输入当前密码"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-11 text-sm focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(v => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center"
                    aria-label={passwordVisible ? '隐藏密码' : '显示密码'}
                  >
                    {passwordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">新密码</label>
                  <input
                    value={passwordForm.next}
                    onChange={e => setPasswordForm(s => ({ ...s, next: e.target.value }))}
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="至少 8 位"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">确认新密码</label>
                  <input
                    value={passwordForm.confirm}
                    onChange={e => setPasswordForm(s => ({ ...s, confirm: e.target.value }))}
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="再次输入新密码"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closePassword}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={submitPassword}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-sm font-black text-white shadow-lg shadow-brand-500/30 transition-all"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
