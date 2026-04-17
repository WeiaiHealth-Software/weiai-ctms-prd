import React, { useState } from 'react';
import { User, Lock, Stethoscope, ClipboardCheck, Building2 } from 'lucide-react';

interface LoginViewProps {
  role: 'doc' | 'crc' | 'mfr';
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ role, onLogin }) => {
  const [username, setUsername] = useState(role === 'doc' ? 'doctor01' : role === 'crc' ? 'crc01' : 'mfr01');
  const [password, setPassword] = useState('123456');

  const roleConfig = {
    doc: { title: '医生端登录', color: 'bg-blue-600', icon: <Stethoscope size={32} /> },
    crc: { title: 'CRC端登录', color: 'bg-emerald-600', icon: <ClipboardCheck size={32} /> },
    mfr: { title: '厂家端登录', color: 'bg-purple-600', icon: <Building2 size={32} /> },
  };

  const config = roleConfig[role];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-6 justify-center animate-fade-in relative z-10">
      <div className="text-center mb-10">
        <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4 ${config.color} text-white`}>
          {config.icon}
        </div>
        <h2 className="text-2xl font-bold text-slate-800">{config.title}</h2>
        <p className="text-slate-500 text-sm mt-2">欢迎使用惟翎CTMS系统</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">账号</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all"
              placeholder="请输入账号"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">密码</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="password"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all"
              placeholder="请输入密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className={`w-full py-3 rounded-xl text-white font-bold shadow-md transition-all active:scale-95 mt-4 ${config.color} hover:brightness-110`}
        >
          登 录
        </button>
      </form>
    </div>
  );
};
