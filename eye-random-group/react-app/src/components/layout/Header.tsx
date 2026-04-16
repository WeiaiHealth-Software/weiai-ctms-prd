import React from 'react';
import { useHeaderStore } from '../../store/useHeaderStore';
import { Bell, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const { title, description, permissions } = useHeaderStore();

  return (
    <header className="z-40 bg-white/80 backdrop-blur-md sticky top-0 border-b border-slate-200 px-8 h-20 flex items-center justify-between">
      <div className="flex flex-col justify-center h-full">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <div className="flex items-center gap-2">
            {permissions.map((perm, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 text-xs font-normal rounded bg-${perm.color}-100 text-${perm.color}-700`}
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
        <div className="relative group cursor-pointer">
          <div className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition-colors select-none">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-700">管理员</p>
              <p className="text-xs text-slate-500">admin@crs.com</p>
            </div>
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff"
              alt="Avatar"
              className="w-9 h-9 rounded-lg shadow-sm border border-slate-200"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
