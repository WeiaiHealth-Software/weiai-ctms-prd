import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeaderStore } from '../../store/useHeaderStore';
import { Bell, LogOut, Settings, User, Hospital } from 'lucide-react';

export const Header: React.FC = () => {
  const { title, description, permissions } = useHeaderStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const permissionColorClass = useMemo(() => {
    const map: Record<string, string> = {
      slate: 'bg-slate-100 text-slate-700',
      indigo: 'bg-indigo-100 text-indigo-700',
      purple: 'bg-purple-100 text-purple-700',
      emerald: 'bg-emerald-100 text-emerald-700',
      amber: 'bg-amber-100 text-amber-700',
      red: 'bg-red-100 text-red-700',
      brand: 'bg-brand-100 text-brand-700'
    };
    return (color: string) => map[color] ?? map.slate;
  }, []);

  const isPrivilegedUser = useMemo(() => {
    return permissions.some(p => p.text === '超级管理员' || p.text === '开发者账户');
  }, [permissions]);

  const user = useMemo(() => {
    const roleTag: '管理员' | '医生' | 'CRC' = '管理员';
    const nickname = 'Admin';
    const orgName = isPrivilegedUser ? 'WeiaiHealthcare' : '上海眼病防治中心';
    const avatarName = encodeURIComponent(nickname);
    const avatarUrl = `https://ui-avatars.com/api/?name=${avatarName}&background=6366f1&color=fff`;
    return { roleTag, nickname, orgName, avatarUrl };
  }, [isPrivilegedUser]);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      const el = menuRef.current;
      if (!el) return;
      if (el.contains(e.target as Node)) return;
      setMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="z-40 bg-white/80 backdrop-blur-md sticky top-0 border-b border-slate-200 px-8 h-20 flex items-center justify-between">
      <div className="flex flex-col justify-center h-full">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <div className="flex items-center gap-2">
            {permissions.map((perm, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 text-xs font-normal rounded ${permissionColorClass(perm.color)}`}
              >
                {perm.text}
              </span>
            ))}
          </div>
        </div>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
          <Settings className="w-5 h-5" />
        </button>
        <div className="h-6 w-px bg-slate-200 mx-2"></div>
        <div className="relative" ref={menuRef}>
          <div className="flex items-center gap-3 p-1.5 rounded-lg transition-colors select-none">
            <div className="text-right hidden md:block">
              <div className="flex items-center justify-end gap-2">
                <span className="text-sm font-bold text-slate-700">{user.nickname}</span>
              </div>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                <Hospital className="w-4 h-4 text-slate-500" />
                {user.orgName}
              </p>
            </div>
            <img
              onClick={() => setMenuOpen(v => !v)}
              src={user.avatarUrl}
              alt="Avatar"
              className="w-9 h-9 cursor-pointer rounded-lg shadow-sm border border-slate-200"
            />
          </div>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/index/profile');
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>个人中心</span>
              </button>
              <div className="h-px bg-slate-100"></div>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/', { replace: true });
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span>退出登录</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
